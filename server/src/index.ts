import express from 'express';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const app = express();
const PORT = 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => {
  res.send('Backend działa poprawnie! Baza podłączona!');
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, nickname, dateOfBirth, avatarUrl } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: "Użytkownik o tym adresie email już istnieje." });

    const existingNickname = await prisma.user.findUnique({ where: { nickname } });
    if (existingNickname) return res.status(400).json({ error: "Ten nick jest już zajęty. Wybierz inny." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email, password: hashedPassword, nickname,
        dateOfBirth: new Date(dateOfBirth),
        avatarUrl: avatarUrl || null
      },
    });

    res.status(201).json({ id: newUser.id, email: newUser.email, nickname: newUser.nickname });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd serwera podczas rejestracji" });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Nieprawidłowy email lub hasło." });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: "Nieprawidłowy email lub hasło." });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd serwera podczas logowania" });
  }
});

const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: "Brak dostępu. Musisz być zalogowany!" });

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) return res.status(403).json({ error: "Token jest nieważny lub wygasł." });
    (req as any).user = user;
    next();
  });
};

app.get('/api/users/me', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, nickname: true, dateOfBirth: true, avatarUrl: true, createdAt: true, pace: true, interests: true, diet: true, transport: true }
    });

    if (!user) return res.status(404).json({ error: "Nie znaleziono użytkownika." });
    res.status(200).json({ message: "Autoryzacja pomyślna", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd serwera podczas pobierania danych użytkownika." });
  }
});

app.put('/api/users/avatar', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { avatarUrl } = req.body;
    await prisma.user.update({ where: { id: userId }, data: { avatarUrl } });
    res.status(200).json({ message: "Awatar zaktualizowany." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd aktualizacji awatara." });
  }
});

app.put('/api/users/preferences', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { pace, interests, diet, transport } = req.body;
    await prisma.user.update({
      where: { id: userId },
      data: { pace, interests, diet, transport }
    });
    res.status(200).json({ message: "Preferencje zaktualizowane." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd aktualizacji preferencji." });
  }
});

app.delete('/api/users/me', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    await prisma.user.delete({
      where: { id: userId }
    });

    res.status(200).json({ message: "Konto zostało usunięte." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd podczas usuwania konta." });
  }
});

const tripService = {
  async getUserTrips(userId: number) {
    return await prisma.trip.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  },

  async deleteTrip(tripId: number, userId: number) {
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.userId !== userId) throw new Error("Nie znaleziono wycieczki.");
    return await prisma.trip.delete({ where: { id: tripId } });
  }
};

app.get('/api/trips', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const trips = await tripService.getUserTrips(userId);
    res.status(200).json(trips);
  } catch (error: any) {
    res.status(500).json({ error: "Wystąpił błąd podczas pobierania wycieczek." });
  }
});

app.get('/api/trips/:id', authenticateToken, async (req, res) => {
  try {
    const tripId = parseInt(req.params.id as string);
    const userId = (req as any).user.userId;

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        days: {
          orderBy: { dayNumber: 'asc' },
          include: {
            activities: {
              orderBy: { startTime: 'asc' }
            }
          }
        }
      }
    });

    if (!trip || trip.userId !== userId) {
      return res.status(404).json({ error: "Nie znaleziono wycieczki." });
    }

    res.status(200).json(trip);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Błąd podczas pobierania wycieczki." });
  }
});

app.delete('/api/trips/:id', authenticateToken, async (req, res) => {
  try {
    const tripId = parseInt(req.params.id as string);
    const userId = (req as any).user.userId;
    await tripService.deleteTrip(tripId, userId);
    res.status(200).json({ message: "Wycieczka została pomyślnie usunięta." });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

app.put('/api/trips/:id', authenticateToken, async (req, res) => {
  try {
    const tripId = parseInt(req.params.id as string);
    const userId = (req as any).user.userId;
    const tripData = req.body;

    const existingTrip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!existingTrip || existingTrip.userId !== userId) {
      return res.status(403).json({ error: "Brak dostępu lub wycieczka nie istnieje." });
    }

    await prisma.trip.update({
      where: { id: tripId },
      data: {
        destination: tripData.destination,
        countryCode: tripData.countryCode,
        latitude: tripData.latitude,
        longitude: tripData.longitude,
        startDate: new Date(tripData.startDate),
        endDate: new Date(tripData.endDate),
        budgetLevel: tripData.budgetLevel,
      }
    });

    await prisma.day.deleteMany({
      where: { tripId: tripId }
    });

    for (const day of tripData.days) {
      await prisma.day.create({
        data: {
          tripId: tripId,
          dayNumber: day.dayNumber,
          activities: {
            create: day.activities.map((act: any) => ({
              title: act.title,
              description: act.description,
              startTime: act.startTime,
              location: act.location
            }))
          }
        }
      });
    }

    res.status(200).json({ message: "Pomyślnie zaktualizowano podróż!" });
  } catch (error: any) {
    console.error("Błąd podczas aktualizacji wycieczki:", error);
    res.status(500).json({ error: "Nie udało się zaktualizować podróży." });
  }
});

app.put('/api/trips/:id/complete', authenticateToken, async (req, res) => {
  try {
    const tripId = parseInt(req.params.id as string);
    const userId = (req as any).user.userId;

    const existingTrip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!existingTrip || existingTrip.userId !== userId) {
      return res.status(403).json({ error: "Brak dostępu lub wycieczka nie istnieje." });
    }

    await prisma.trip.update({
      where: { id: tripId },
      data: { isCompleted: true }
    });

    res.status(200).json({ message: "Podróż oznaczona jako zrealizowana!" });
  } catch (error: any) {
    console.error("Błąd podczas aktualizacji statusu wycieczki:", error);
    res.status(500).json({ error: "Nie udało się zaktualizować statusu." });
  }
});

app.post('/api/trips/generate', authenticateToken, async (req, res) => {
  try {
    const { destination, startDate, endDate, budgetLevel, preferences, userPace, userInterests, userDiet, userTransport } = req.body;

    if (!destination || !startDate || !endDate) return res.status(400).json({ error: "Brakuje danych." });
    if (!process.env.GEMINI_API_KEY) return res.status(500).json({ error: "Błąd klucza AI." });

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const calculatedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
      Jesteś ekspertem ds. podróży. Stwórz szczegółowy plan wycieczki w formacie JSON.
      Oto szczegóły:
      - Cel podróży: ${destination}
      - Data rozpoczęcia: ${startDate}
      - Liczba dni do zaplanowania: ${calculatedDays}
      - Budżet: ${budgetLevel}
      - Zainteresowania (kliknięte teraz): ${preferences && preferences.length > 0 ? preferences.join(', ') : 'Brak specjalnych'}
      
      PREFERENCJE Z PROFILU UŻYTKOWNIKA (Musisz bezwzględnie dopasować do nich plan!):
      - Tempo zwiedzania: ${userPace && userPace !== '-' ? userPace : 'Zbalansowane'}
      - Ulubione pasje: ${userInterests && userInterests !== '-' ? userInterests : 'Najpopularniejsze atrakcje'}
      - Wymagania dietetyczne: ${userDiet && userDiet !== '-' ? userDiet : 'Brak ograniczeń'}
      - Preferowany środek transportu na miejscu: ${userTransport && userTransport !== '-' ? userTransport : 'Dowolny'}
      
      BARDZO WAŻNE:
      1. Weź pod uwagę datę rozpoczęcia (${startDate}) przy planowaniu (np. pora roku).
      2. Wygeneruj pełny harmonogram na DOKŁADNIE ${calculatedDays} dni. Musisz zwrócić dokładnie tyle elementów w tablicy "days".
      3. W każdym dniu (w tablicy "activities") umieść od 3 do 4 logicznych punktów (np. śniadanie, zwiedzanie, obiad, wieczorny relaks).
      4. Dodaj dokładne współrzędne geograficzne (latitude i longitude) dla tego miejsca docelowego (jako liczby).
      
      Zwróć TYLKO czysty obiekt JSON (bez znaczników markdown typu \`\`\`json, bez żadnego tekstu przed i po), który posiada dokładnie taką strukturę:
      {
        "destination": "Nazwa miejsca (najlepiej z dużej litery)",
        "countryCode": "dwuliterowy kod ISO kraju małą literą (np. jp, it, fr, pl, us)",
        "latitude": 41.9028,
        "longitude": 12.4964,
        "budgetLevel": "${budgetLevel}",
        "days": [
          {
            "dayNumber": 1,
            "activities": [
              {
                "title": "Tytuł atrakcji",
                "description": "Krótki i chwytliwy opis tej atrakcji i dlaczego warto",
                "startTime": "09:00",
                "location": "Adres lub ogólna lokalizacja w mieście"
              }
            ]
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    let aiResponseText = result.response.text().trim();

    if (aiResponseText.startsWith('```json')) aiResponseText = aiResponseText.slice(7);
    if (aiResponseText.endsWith('```')) aiResponseText = aiResponseText.slice(0, -3);

    const generatedData = JSON.parse(aiResponseText);

    res.status(200).json({
      destination: generatedData.destination,
      countryCode: generatedData.countryCode,
      latitude: generatedData.latitude,
      longitude: generatedData.longitude,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      budgetLevel: generatedData.budgetLevel,
      days: generatedData.days
    });

  } catch (error) {
    console.error("Błąd generatora AI:", error);
    res.status(500).json({ error: "Nie udało się wygenerować podróży." });
  }
});

app.post('/api/trips/save-generated', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const tripData = req.body;

    const savedTrip = await prisma.trip.create({
      data: {
        destination: tripData.destination,
        countryCode: tripData.countryCode,
        latitude: tripData.latitude,
        longitude: tripData.longitude,
        startDate: new Date(tripData.startDate),
        endDate: new Date(tripData.endDate),
        budgetLevel: tripData.budgetLevel,
        userId: userId,
        days: {
          create: tripData.days.map((day: any) => ({
            dayNumber: day.dayNumber,
            activities: {
              create: day.activities.map((act: any) => ({
                title: act.title,
                description: act.description,
                startTime: act.startTime,
                location: act.location
              }))
            }
          }))
        }
      },
      select: { id: true }
    });

    res.status(201).json({ id: savedTrip.id, message: "Pomyślnie zapisano podróż!" });
  } catch (error) {
    console.error("Błąd podczas zapisu podróży:", error);
    res.status(500).json({ error: "Nie udało się zapisać podróży w bazie." });
  }
});

app.listen(PORT, () => {
  console.log(`Serwer wystartował na http://localhost:${PORT}`);
});