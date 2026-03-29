# Dokumentacja API - Travel Planner

Niniejsza dokumentacja zawiera opis wszystkich dostępnych endpointów REST API w aplikacji Travel Planner. 
Większość endpointów jest chroniona i wymaga autoryzacji przy pomocy tokena JWT.

**Bazowy URL:** `http://localhost:5000/api`

---

## Autoryzacja (Auth)

### 1. Rejestracja nowego użytkownika
Tworzy nowe konto w systemie.

* **URL:** `/auth/register`
* **Metoda:** `POST`
* **Wymaga autoryzacji:** NIE
* **Body (JSON):**
  ```json
  {
    	"email": "jan.kowalski@example.com",
    	"password": "mojetajnehaslo123"
  }
```

### Odpowiedzi:

* 201 Created - Rejestracja pomyślna (zwraca id i email).
* 400 Bad Request - Użytkownik o podanym adresie email już istnieje.
* 500 Internal Server Error - Błąd serwera.

---

### 2. Logowanie użytkownika
Służy do pobrania tokena JWT (ważnego 24h), wymaganego do obsługi chronionych zasobów.

* **URL:** `/auth/login`
* **Metoda:** `POST`
* **Wymaga autoryzacji:** NIE
* **Body (JSON):**
  ```json
  {
    	"email": "jan.kowalski@example.com",
    	"password": "mojetajnehaslo123"
  }
```

### Odpowiedzi:

* 200 OK - Zwraca obiekt z tokenem: {"token": "eyJhbGciOiJIUzI1NiIsInR5c..."}
* 401 Unauthorized - Nieprawidłowy email lub hasło.

---

## Wycieczki (Trips)
Wszystkie poniższe endpointy wymagają nagłówka HTTP:
Authorization: Bearer <twój_token_jwt>

### 1. Pobieranie listy wycieczek
Pobiera wszystkie wycieczki przypisane do aktualnie zalogowanego użytkownika (posortowane chronologicznie).

* **URL:** `/trips`
* **Metoda:** `GET`
* **Wymaga autoryzacji:** TAK

### Odpowiedzi:

* 200 OK - Zwraca tablicę (listę) wycieczek w formacie JSON.
* 401 Unauthorized - Brak tokena.
* 403 Forbidden - Nieważny token.

---

### 2. Dodawanie nowej wycieczki
Tworzy nowy plan podróży dla zalogowanego użytkownika.

* **URL:** `/trips`
* **Metoda:** `POST`
* **Wymaga autoryzacji:** TAK
* **Body (JSON):**
  ```json
  {
  	"destination": "Paryż, Francja",
  	"startDate": "2026-05-10T10:00:00Z",
   	"endDate": "2026-05-15T18:00:00Z"
  }
```

### Odpowiedzi:

* 201 Created - Zwraca utworzony obiekt wycieczki z przypisanym ID.
* 400 Bad Request - Brak wymaganych danych lub data zakończenia jest przed datą startu.

---

### 3. Edycja wycieczki
Aktualizuje wybrane dane istniejącej wycieczki. Użytkownik może edytować tylko własne plany.

* **URL:** `/trips/:id` (gdzie :id to numer wycieczki)
* **Metoda:** `PUT`
* **Wymaga autoryzacji:** TAK
* **Body (JSON):** (podajesz tylko te pola, które chcesz zmienić)
  ```json
  {
    	"destination": "Neapol, Włochy"
  }
```

### Odpowiedzi:

* 200 OK - Zwraca zaktualizowany obiekt wycieczki.
* 404 Not Found - Nie znaleziono wycieczki lub użytkownik nie ma do niej praw.

---

### 4. Usuwanie wycieczki
Kasuje wycieczkę z bazy danych.

* **URL:** `/trips/:id` (gdzie :id to numer wycieczki)
* **Metoda:** `DELETE`
* **Wymaga autoryzacji:** TAK

### Odpowiedzi:

* 200 OK - Zwraca komunikat: {"message": "Wycieczka została pomyślnie usunięta."}
* 404 Not Found - Nie znaleziono wycieczki lub użytkownik nie ma do niej praw.