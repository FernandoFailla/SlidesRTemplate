// Core presentation logic: slide loading, navigation, and state management.

// Module-level state
let slides = [];
let currentSlide = 0;
let totalSlides = 0;

// UI Elements
let mainContainer, prevBtn, nextBtn, slideCounter;

/**
 * Displays a specific slide by its index and updates the presentation state.
 * @param {number} index - The zero-based index of the slide to show.
 */
export function showSlide(index) {
    if (index < 0 || index >= totalSlides) {
        console.error(`[ShowSlide] Invalid slide index requested: ${index}. Total slides: ${totalSlides}`);
        return;
    }

    console.log(`[ShowSlide] Chamada para index: ${index}`);

    slides.forEach((slide, i) => {
        if (i === index) {
            slide.style.display = 'flex'; // Make the active slide visible. All slides use flexbox.
            slide.classList.add('active');
        } else {
            slide.style.display = 'none'; // Hide inactive slides.
            slide.classList.remove('active');
        }
    });

    window.scrollTo(0, 0);
    
    currentSlide = index; // Update current slide index
    slideCounter.textContent = `${index + 1} / ${totalSlides}`;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === totalSlides - 1;
    console.log(`[ShowSlide] Slide ${index + 1} ativado. prevBtn.disabled: ${prevBtn.disabled}, nextBtn.disabled: ${nextBtn.disabled}`);
}

/**
 * Initializes the presentation by loading slides and setting up navigation.
 * @param {number} slideCount - The total number of slides to load.
 * @returns {Promise<void>} A promise that resolves when initialization is complete.
 */
export async function initPresentation(slideCount) {
    mainContainer = document.querySelector('main');
    prevBtn = document.getElementById('prevBtn');
    nextBtn = document.getElementById('nextBtn');
    slideCounter = document.getElementById('slide-counter');

    if (!mainContainer || !prevBtn || !nextBtn || !slideCounter) {
        console.error("Elementos essenciais (main, prevBtn, nextBtn, slideCounter) não encontrados. A apresentação não pode iniciar.");
        if (mainContainer) {
            mainContainer.innerHTML = `<div class="slide active" style="text-align: center; padding-top: 50px;"><h1 style="color: var(--autumn-red); font-size: 2em; margin-bottom: 20px;">Erro Crítico de Configuração</h1><p style="color: var(--fuji-white); font-size: 1.2em;">Um ou mais elementos HTML essenciais para a navegação não foram encontrados. Verifique o console.</p></div>`;
        }
        if(prevBtn) prevBtn.style.display = 'none';
        if(nextBtn) nextBtn.style.display = 'none';
        if(slideCounter) slideCounter.style.display = 'none';
        return;
    }

    try {
        let allSlidesHTML = '';
        console.log(`[SlideInit] Tentando carregar ${slideCount} slides.`);
        // To use the tutorial slides (21-25) as the main 5 slides without renaming files,
        // we'll fetch them directly by adjusting the index.
        for (let i = 1; i <= slideCount; i++) {
            const slideNum = i + 20 ; // Load slides 21, 22, 23, 24, 25
            try {
                const response = await fetch(`slides/slide_${slideNum}.html`);
                if (!response.ok) {
                    console.error(`[SlideLoad] Erro ao carregar slide ${slideNum}: ${response.status}`);
                    allSlidesHTML += `<div id="slide-${i}" class="slide slide-error-placeholder" style="padding: 20px; text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh;"><h2 style="color: var(--autumn-red); font-size: 1.5em;">Erro ao carregar slide ${slideNum}</h2><p style="color: var(--fuji-white);">Status: ${response.status}. O arquivo slide_${slideNum}.html não pôde ser carregado.</p></div>`;
                    continue;
                }
                const slideHTML = await response.text();
                allSlidesHTML += slideHTML;
            } catch (slideError) {
                console.error(`[SlideLoad] Exceção ao processar slide ${slideNum}:`, slideError);
                allSlidesHTML += `<div id="slide-${i}" class="slide slide-error-placeholder" style="padding: 20px; text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh;"><h2 style="color: var(--autumn-red); font-size: 1.5em;">Exceção ao carregar slide ${slideNum}</h2><p style="color: var(--fuji-white);">${slideError.message}</p></div>`;
            }
        }
        mainContainer.innerHTML = allSlidesHTML;
        console.log("[SlideInit] Todos os slides foram processados e inseridos no DOM.");
    } catch (error) {
        console.error('[SlideInit] Erro GERAL e CRÍTICO durante o carregamento dos slides:', error);
        mainContainer.innerHTML = `<div class="slide active" style="text-align: center; padding-top: 50px; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh;"><h1 style="color: var(--autumn-red); font-size: 2em; margin-bottom: 20px;">Erro Crítico ao Carregar Slides</h1><p style="color: var(--fuji-white); font-size: 1.2em;">Ocorreu um erro inesperado. Verifique o console do navegador para detalhes.</p><p style="color: var(--fuji-white); font-size: 1.0em; margin-top: 10px;">Detalhe: ${error.message}</p></div>`;
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        slideCounter.style.display = 'none';
        return; 
    }

    slides = document.querySelectorAll('.slide');
    console.log(`[NavSetup] Número de elementos .slide encontrados: ${slides.length}`);
    if (slides.length === 0) {
        console.error("[NavSetup] Nenhum slide com a classe '.slide' foi encontrado após o carregamento. A apresentação não pode continuar.");
        mainContainer.innerHTML = `<div class="slide active" style="text-align: center; padding-top: 50px; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh;"><h1 style="color: var(--autumn-red); font-size: 2em; margin-bottom: 20px;">Erro na Apresentação</h1><p style="color: var(--fuji-white); font-size: 1.2em;">Nenhum slide foi carregado corretamente. Verifique o console para detalhes sobre erros de carregamento de arquivos de slide.</p></div>`;
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        slideCounter.style.display = 'none';
        return;
    }
    
    totalSlides = slides.length;
    console.log(`[NavSetup] Total de slides para navegação: ${totalSlides}`);

    nextBtn.addEventListener('click', () => {
        if (currentSlide < totalSlides - 1) {
            showSlide(currentSlide + 1);
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentSlide > 0) {
            showSlide(currentSlide - 1);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            nextBtn.click();
        } else if (e.key === 'ArrowLeft') {
            prevBtn.click();
        }
    });

    showSlide(0);
}
