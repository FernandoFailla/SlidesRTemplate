// Main application entry point.
// Orchestrates the initialization of all modules.

import { SLIDE_COUNT } from './config.js';
import { initPresentation } from './core/presentation.js';
import { initLibs } from './core/lib-init.js';
import { initRConsole } from './modules/r-console.js';
import { initQuiz } from './modules/quiz.js';
import { initPrintMagic } from './slides/slide-4-print-magic.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initialize core presentation (loads slides, sets up nav)
    await initPresentation(SLIDE_COUNT);

    // 2. Initialize third-party libraries (highlighting, diagrams)
    initLibs();

    // 3. Initialize interactive modules
    initRConsole();
    initQuiz();

    // 4. Initialize slide-specific scripts
    initPrintMagic();

    console.log("[App] Aplicação inicializada com sucesso.");
});
