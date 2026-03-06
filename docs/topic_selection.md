# Inteligentny Planer Podróży z AI

**Przedmiot:** Technologie Aplikacji Webowych II  
**Autorzy:** Sebastian Iwanowski (37825), Norbert Jac (37689)

## 1. Opis projektu
Użytkownik planujący wyjazd turystyczny często spędza godziny na szukaniu atrakcji i układaniu planu dnia. System "AI Travel Planner" automatyzuje ten proces, generując spersonalizowany harmonogram podróży na podstawie kilku kliknięć, wykorzystując moc sztucznej inteligencji.

## 2. Cel projektu
Oszczędność czasu użytkownika poprzez natychmiastowe generowanie kompletnych tras zwiedzania, dopasowanych do konkretnego budżetu, lokalizacji oraz zainteresowań.

## 3. Cele szczegółowe
* **Personalizacja:** Dostarczenie planu podróży (np. wyjazd z dziećmi lub wyjazd nastawiony na architekturę).
* **Integracja AI:** Wykorzystanie nowoczesnych modeli językowych (LLM) do tworzenia opisów i rekomendacji miejsc w czasie rzeczywistym.
* **Centralizacja danych:** Możliwość przechowywania wszystkich swoich planów podróży w jednym miejscu z dostępem z każdego urządzenia.

## 4. Zakres funkcjonalny

### A. Moduł Użytkownika (Podróżnika)
* **Generator Podróży:** Interaktywny formularz (miejsce docelowe, liczba dni, budżet, preferencje typu: natura, muzea, jedzenie).
* **Interaktywny Plan:** Wyświetlanie wygenerowanego planu w formie osi czasu (dzień po dniu).
* **Zarządzanie Planami:** Możliwość zapisu wygenerowanej trasy, jej edycji (zmiana kolejności punktów) lub usunięcia.
* **Panel Profilu:** Historia wszystkich zaplanowanych wycieczek oraz statystyki odwiedzonych miejsc.

### B. Moduł Administratora
* **Zarządzanie Użytkownikami:** Podgląd zarejestrowanych osób oraz ich aktywności w systemie.
* **Monitoring API:** Kontrola limitów i poprawności połączeń z silnikiem AI (OpenAI/Gemini).
* **Baza Miejsc:** Możliwość ręcznego dodawania polecanych „perełek" turystycznych, które system może sugerować priorytetowo.

## 5. Proponowane technologie
* **Frontend:** React (Vite) + Tailwind CSS
* **Backend:** Node.js (Express) + TypeScript
* **Baza danych:** PostgreSQL
* **Integracje:** OpenAI API lub Google Gemini API

