# Travel Planner - Inteligentny Planer Podróży

## Opis projektu
**Travel Planner** to aplikacja webowa wspomagana przez sztuczną inteligencję, która pomaga użytkownikom w błyskawicznym tworzeniu spersonalizowanych planów podróży. Na podstawie wprowadzonych danych (cel, czas trwania, budżet i zainteresowania), system generuje optymalną trasę zwiedzania wraz z opisem atrakcji.

**Autorzy:**
* Sebastian Iwanowski (37825)
* Norbert Jac (37689)

---

## Użyte technologie

### Frontend
* **React + Vite** (TypeScript)
* **Tailwind CSS** (stylizacja)

### Backend
* **Node.js + Express** (TypeScript)
* **PostgreSQL** (Baza danych na Supabase)
* **Prisma** (ORM)

### AI & API
* **OpenAI / Gemini API** (Generowanie planów)

---

## Instrukcja uruchomienia lokalnego

### 1. Klonowanie repozytorium

```bash
git clone https://github.com/TAW-26/TAW-Norbert_Jac-Sebastian_Iwanowski.git
cd Travel-Planner
```

2. Uruchomienie części klienckiej (Frontend)

```bash
cd client
npm install
npm run dev
```

Domyślny adres: http://localhost:5173

3. Uruchomienie serwera (Backend)

Otwórz drugi terminal (z głównego folderu):
```bash
cd server
npm install
npm run dev
```

---

## Dokumentacja projektu

Szczegółowy opis założeń oraz wybór tematu znajduje się tutaj:
[Dokumentacja - Wybór Tematu](./docs/topic-selection.md)