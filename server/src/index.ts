import express from 'express';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const app = express();
const PORT = 5000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend działa poprawnie! Baza podłączona!');
});


app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Użytkownik o tym adresie email już istnieje." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword
      },
    });

    res.status(201).json({ id: newUser.id, email: newUser.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd serwera podczas rejestracji" });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Nieprawidłowy email lub hasło." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Nieprawidłowy email lub hasło." });
    }

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

  if (!token) {
    return res.status(401).json({ error: "Brak dostępu. Musisz być zalogowany!" });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token jest nieważny lub wygasł." });
    }

    (req as any).user = user;
    next();
  });
};

app.get('/api/users/me', authenticateToken, (req, res) => {
  res.status(200).json({
    message: "Autoryzacja pomyślna",
    user: (req as any).user
  });
});

app.post('/api/trips', authenticateToken, async (req, res) => {
  try {
    const { destination, startDate, endDate } = req.body;
    const userId = (req as any).user.userId;

    if (!destination || !startDate || !endDate) {
      return res.status(400).json({ error: "Brak wymaganych danych (destination, startDate, endDate)." });
    }

    const newTrip = await prisma.trip.create({
      data: {
        destination,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        userId
      }
    });

    res.status(201).json(newTrip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Wystąpił błąd podczas dodawania wycieczki." });
  }
});

app.get('/api/trips', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const trips = await prisma.trip.findMany({
      where: { userId },
      orderBy: { startDate: 'asc' }
    });

    res.status(200).json(trips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Wystąpił błąd podczas pobierania wycieczek." });
  }
});

app.put('/api/trips/:id', authenticateToken, async (req, res) => {
  try {
    const tripId = parseInt(req.params.id as string);
    const userId = (req as any).user.userId;
    const { destination, startDate, endDate } = req.body;

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.userId !== userId) {
      return res.status(404).json({ error: "Nie znaleziono wycieczki lub brak uprawnień." });
    }

    const updatedTrip = await prisma.trip.update({
      where: { id: tripId },
      data: {
        destination: destination || trip.destination,
        startDate: startDate ? new Date(startDate) : trip.startDate,
        endDate: endDate ? new Date(endDate) : trip.endDate
      }
    });

    res.status(200).json(updatedTrip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Wystąpił błąd podczas aktualizacji wycieczki." });
  }
});

app.delete('/api/trips/:id', authenticateToken, async (req, res) => {
  try {
    const tripId = parseInt(req.params.id as string);
    const userId = (req as any).user.userId;

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.userId !== userId) {
      return res.status(404).json({ error: "Nie znaleziono wycieczki lub brak uprawnień." });
    }

    await prisma.trip.delete({ where: { id: tripId } });
    res.status(200).json({ message: "Wycieczka została pomyślnie usunięta." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Wystąpił błąd podczas usuwania wycieczki." });
  }
});

app.listen(PORT, () => {
  console.log(`Serwer wystartował na http://localhost:${PORT}`);
});