# Dokumentacja Monitoringu

## Z czego składa się nasz monitoring?
Do śledzenia tego, co dzieje się z aplikacją, połączyliśmy trzy narzędzia:
* **Node.js:** Aplikacja sama zbiera informacje o tym, jak bardzo jest obciążona (zużycie procesora, RAM) i liczy błędy (np. 400 i 404). Wszystkie te statystyki wystawia pod adresem `/metrics`.
* **Prometheus:** Co 15 sekund automatycznie puka do serwera, pobiera te wszystkie liczby i zapisuje je w swojej bazie.
* **Grafana:** Podpięliśmy ją do Prometheusa, żeby zamieniała te suche dane na ładne, czytelne wykresy na żywo na dashboardzie.

## Błędy i testy wydajności
* Mierzymy, jak szybko serwer odpowiada na zapytania (używamy do tego metryki `http_request_duration_ms`).
* Zrobiliśmy własny licznik (`api_errors_total`), który wyłapuje błędy 400 i 404. Dzięki temu, jak ktoś wpisze złe dane do logowania albo próbuje wejść tam, gdzie nie ma uprawnień, od razu widzimy to na wykresach.
* Zrobiliśmy też test obciążeniowy serwera. Napisaliśmy prosty skrypt (`stress-test.js`), który uderzył w nasz endpoint logowania 10 000 razy z rzędu w bardzo krótkim czasie. Aplikacja to bez problemu wytrzymała i się nie zawiesiła.