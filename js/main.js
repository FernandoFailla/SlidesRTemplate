// Main application entry point.
// Orchestrates the initialization of all modules.

import { SLIDE_COUNT } from './config.js';
import { initPresentation } from './core/presentation.js';
import { initLibs } from './core/lib-init.js';
import { initRConsole } from './modules/r-console.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initialize core presentation (loads slides, sets up nav)
    await initPresentation(SLIDE_COUNT);

    // 2. Initialize third-party libraries (highlighting, diagrams)
    initLibs();

    // 3. Initialize interactive modules
    initRConsole();

    // 4. Initialize slide-specific scripts
    // Scripts for slides that are no longer present have been removed.

    console.log("[App] Aplicação inicializada com sucesso.");
});
