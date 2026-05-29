const URL = "http://localhost:5000/api/auth/login";
const TOTAL_REQUESTS = 10000;
const BATCH_SIZE = 100;

async function sendBatch() {
    const promises = [];
    for (let i = 0; i < BATCH_SIZE; i++) {
        promises.push(
            fetch(URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
            }).catch(() => { })
        );
    }
    await Promise.all(promises);
}

async function runStressTest() {
    console.log(`Test obciążeniowy: ${TOTAL_REQUESTS} zapytań`);
    console.log(`Wybrany adres: ${URL}\n`);

    const startTime = Date.now();
    let completed = 0;

    while (completed < TOTAL_REQUESTS) {
        await sendBatch();
        completed += BATCH_SIZE;
        process.stdout.write(`\rWysłano: ${completed} / ${TOTAL_REQUESTS}`);
    }

    const duration = (Date.now() - startTime) / 1000;
    console.log(`\nTest zakończony pomyślnie w ${duration} sekund`);
    console.log(`Średnia przepustowość serwera: ${(TOTAL_REQUESTS / duration).toFixed(2)} zapytań/sekundę`);
}

runStressTest();