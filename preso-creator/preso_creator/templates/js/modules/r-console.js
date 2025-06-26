// All logic for the floating WebR console.

let webRInstance;
let rConsoleContainer, newRConsoleOutput, newRConsoleInput, newRCloseButton, newRLoadingIndicator;

function newAppendOutput(text, type) {
    if (!text || text.toString().trim() === '') return;
    const line = document.createElement('div');
    line.classList.add('output-line', type);
    if (type === 'input') {
        line.textContent = `> ${text}`;
    } else {
        const pre = document.createElement('pre');
        pre.textContent = text;
        line.appendChild(pre);
    }
    newRConsoleOutput.appendChild(line);
    newRConsoleOutput.scrollTop = newRConsoleOutput.scrollHeight;
}

async function initializeNewWebR() {
    if (newRLoadingIndicator) newRLoadingIndicator.style.display = 'flex';
    newAppendOutput('Inicializando WebR...', 'info');
    try {
        const { WebR } = await import('https://webr.r-wasm.org/latest/webr.mjs');
        webRInstance = new WebR({
            WEBR_URL: "https://webr.r-wasm.org/latest/",
            SW_URL: "/webr-serviceworker.js",
            R_HOME: "/webr-r-home",
        });
        await webRInstance.init();
        console.log("New WebR Initialized Successfully");
        newAppendOutput("WebR carregado. Pronto para uso!", "info");
    } catch (error) {
        console.error("Falha ao inicializar novo WebR:", error);
        newAppendOutput(`Erro ao inicializar WebR: ${error.message || error}`, "error");
    } finally {
        if (newRLoadingIndicator) newRLoadingIndicator.style.display = 'none';
    }
}

async function handleInput(e) {
    if (e.key === 'Enter' && newRConsoleInput.value.trim() !== '') {
        const command = newRConsoleInput.value.trim();
        newAppendOutput(command, 'input');
        newRConsoleInput.value = '';
        newRConsoleInput.disabled = true;

        if (!webRInstance) {
            newAppendOutput("WebR não está pronto. Tentando inicializar...", "info");
            await initializeNewWebR();
            if (!webRInstance) {
                 newAppendOutput("Falha ao inicializar WebR. Verifique o console do navegador.", "error");
                 newRConsoleInput.disabled = false;
                 return;
            }
        }

        try {
            const shelter = await new webRInstance.Shelter();
            const result = await shelter.captureR(command, {
                withAutoprint: true,
                captureStreams: true,
                captureConditions: true
            });
            shelter.purge();

            console.log("New WebR Result:", JSON.stringify(result, null, 2));

            if (result.output) {
                result.output.forEach(out => {
                    if (out.type === 'stdout' || out.type === 'stderr') {
                       if (out.data) {
                            if (Array.isArray(out.data)) {
                                if (out.data.length > 0) {
                                    out.data.forEach(lineText => newAppendOutput(lineText, out.type === 'stderr' ? 'error' : 'result'));
                                }
                            } else if (typeof out.data === 'string') {
                                newAppendOutput(out.data, out.type === 'stderr' ? 'error' : 'result');
                            }
                       } else if (out.text && out.text.trim() !== '') {
                           newAppendOutput(out.text, out.type === 'stderr' ? 'error' : 'result');
                       }
                    } else if (out.text && out.text.trim() !== '') {
                         newAppendOutput(out.text, 'info');
                    }
                });
            }

            if (result.conditions) {
                result.conditions.forEach(cond => {
                    let type = 'info';
                    if (cond.type.includes('error')) type = 'error';
                    else if (cond.type.includes('warning')) type = 'warning';
                    newAppendOutput(`${cond.type}: ${cond.message}`, type);
                });
            }

        } catch (error) {
            console.error("Erro ao executar código R (novo console):", error);
            newAppendOutput(`Erro: ${error.message || error}`, 'error');
        } finally {
            newRConsoleInput.disabled = false;
            newRConsoleInput.focus();
        }
    }
}

export function initRConsole() {
    rConsoleContainer = document.createElement('div');
    rConsoleContainer.id = 'new-r-console';
    rConsoleContainer.innerHTML = `
        <div class="r-console-header">
            <span>R Console (Nova)</span>
            <button id="new-r-console-close-btn">&times;</button>
        </div>
        <div id="new-r-console-output" class="r-console-output">
             <div class="output-line info">Inicializando WebR...</div>
        </div>
        <div class="r-console-input-area">
            <span class="r-prompt">&gt;</span>
            <input type="text" id="new-r-console-input" class="r-console-input" placeholder="Digite R e pressione Enter...">
        </div>
        <div id="new-r-loading-indicator" class="r-loading-indicator" style="display: none;">
            <div class="spinner"></div>
            <p>Carregando R...</p>
        </div>
    `;
    document.body.appendChild(rConsoleContainer);

    const newToggleRConsoleBtn = document.createElement('button');
    newToggleRConsoleBtn.id = 'new-toggle-r-console-btn';
    newToggleRConsoleBtn.textContent = 'R';
    newToggleRConsoleBtn.className = 'r-console-toggle-fab';
    document.body.appendChild(newToggleRConsoleBtn);

    newRConsoleOutput = document.getElementById('new-r-console-output');
    newRConsoleInput = document.getElementById('new-r-console-input');
    newRCloseButton = document.getElementById('new-r-console-close-btn');
    newRLoadingIndicator = document.getElementById('new-r-loading-indicator');

    newToggleRConsoleBtn.addEventListener('click', () => {
        rConsoleContainer.classList.toggle('active');
        if (rConsoleContainer.classList.contains('active')) {
            newRConsoleInput.focus();
        }
    });

    newRCloseButton.addEventListener('click', () => {
        rConsoleContainer.classList.remove('active');
    });

    newRConsoleInput.addEventListener('keydown', handleInput);

    initializeNewWebR();
}
