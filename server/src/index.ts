import express from 'express';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

const app = express();
const PORT = 5000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend działa poprawnie! 🚀 Baza podłączona!');
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd serwera podczas pobierania" });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { email, password } = req.body;

    const newUser = await prisma.user.create({
      data: {
        email,
        password
      },
    });

    res.json(newUser);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Nie udało się stworzyć użytkownika" });
  }
});

app.listen(PORT, () => {
  console.log(`Serwer wystartował na http://localhost:${PORT}`);
});