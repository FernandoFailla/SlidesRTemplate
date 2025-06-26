// Initializes third-party libraries like highlight.js and mermaid.js

export function initLibs() {
    // Initialize Mermaid.js
    if (typeof mermaid !== 'undefined' && mermaid) {
        try {
            console.log("[LibsInit] Inicializando Mermaid.js...");
            mermaid.initialize({ 
                startOnLoad: false,
                theme: 'base',
                themeVariables: {
                    background: 'var(--sumi-ink)',
                    primaryColor: 'var(--wave-blue)',
                    primaryTextColor: 'var(--fuji-white)',
                    primaryBorderColor: 'var(--carp-yellow)',
                    lineColor: 'var(--fuji-gray)',
                    secondaryColor: 'var(--sakura-pink)',
                    tertiaryColor: 'var(--ronin-green)',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "14px",
                    textColor: 'var(--fuji-white)',
                    arrowheadColor: 'var(--carp-yellow)',
                    edgeLabelBackground:'var(--sumi-ink)',
                    clusterBkg: 'rgba(0,0,0,0.1)',
                    clusterBorder: 'var(--fuji-gray)'
                }
            });
            console.log("[LibsInit] Mermaid.js inicializado. Chamando mermaid.run() explicitamente.");
            mermaid.run();
        } catch (e) {
            console.error("[LibsInit] Erro ao inicializar ou executar Mermaid.js:", e);
        }
    } else {
        console.warn('[LibsInit] Mermaid library (mermaid) não encontrada. Diagramas não serão renderizados.');
    }

    // Initialize highlight.js
    if (typeof hljs !== 'undefined' && hljs) {
        try {
            console.log("[LibsInit] Aplicando highlight.js em todos os blocos de código...");
            hljs.highlightAll();
            console.log("[LibsInit] highlight.js aplicado.");
        } catch (e) {
            console.error("[LibsInit] Erro ao aplicar highlight.js:", e);
        }
    } else {
        console.warn('[LibsInit] highlight.js library (hljs) não encontrada. Blocos de código não serão destacados.');
    }
}
