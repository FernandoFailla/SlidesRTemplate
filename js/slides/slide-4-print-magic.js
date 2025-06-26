// Slide-specific logic for the "Print Magic" interactive element on slide 4.

export function initPrintMagic() {
    const slide4 = document.getElementById('slide-4');
    if (!slide4) return; // Don't run if the slide isn't in the DOM

    const printCenter = document.getElementById('print-center');
    const sectors = slide4.querySelectorAll('.print-sector');
    const outputArea = slide4.querySelector('.print-output-area');
    const outputContent = slide4.querySelector('.output-content');
    
    if (!printCenter || sectors.length === 0 || !outputArea || !outputContent) {
        console.warn("[PrintMagic] Elementos para a animação do slide 4 não encontrados.");
        return;
    }
    
    const outputData = {
        vector: `<p><span style="color:var(--fuji-gray)">[1]</span> 10.5 20.1 30.9</p>`,
        dataframe: `<p>  A B<br><span style="color:var(--fuji-gray)">1</span> 1 x<br><span style="color:var(--fuji-gray)">2</span> 2 y</p>`,
        model: `<p>Call:<br>lm(formula = dist ~ speed, data = cars)<br><br>Coefficients:<br><span style="color:var(--fuji-gray)">(Intercept)</span>       speed<br>     -17.579        3.932</p>`,
        list: `<p>$a<br><span style="color:var(--fuji-gray)">[1]</span> 1<br><br>$b<br><span style="color:var(--fuji-gray)">[1]</span> "texto"<br><br>$c<br><span style="color:var(--fuji-gray)">[1]</span> TRUE</p>`
    };
    
    printCenter.addEventListener('click', () => {
        outputArea.classList.add('active');
        outputArea.style.opacity = '1';
        outputContent.innerHTML = `<p class="text-center" style="color: var(--carp-yellow);">✨ Clique em um dos tipos de objetos!</p>`;
    });
    
    sectors.forEach(sector => {
        sector.addEventListener('click', () => {
            const type = sector.dataset.type;
            
            sectors.forEach(s => {
                s.style.transform = '';
                s.style.zIndex = '';
                s.style.boxShadow = '';
            });
            
            sector.style.transform = 'scale(1.05)';
            sector.style.zIndex = '20';
            sector.style.boxShadow = `0 0 20px var(--${getColorVariable(type)})`;
            
            outputArea.style.opacity = '1';
            outputArea.style.borderColor = `var(--${getColorVariable(type)})`;
            outputContent.innerHTML = outputData[type];
            
            const outputTitle = outputArea.querySelector('h3');
            if (outputTitle) {
                outputTitle.innerHTML = `Resultado de <code class="code-font">print(${getObjectExample(type)})</code>:`;
                outputTitle.style.color = `var(--${getColorVariable(type)})`;
            }
        });
        
        sector.addEventListener('mouseenter', () => {
            sector.style.boxShadow = `0 0 15px var(--${getColorVariable(sector.dataset.type)})`;
        });
        
        sector.addEventListener('mouseleave', () => {
            if (sector.style.zIndex !== '20') {
                sector.style.boxShadow = '';
            }
        });
    });
    
    function getColorVariable(type) {
        switch (type) {
            case 'vector': return 'ronin-green';
            case 'dataframe': return 'wave-blue';
            case 'model': return 'sakura-pink';
            case 'list': return 'carp-yellow';
            default: return 'fuji-white';
        }
    }
    
    function getObjectExample(type) {
        switch (type) {
            case 'vector': return 'c(10.5, 20.1, 30.9)';
            case 'dataframe': return 'data.frame(A=1:2, B=c("x","y"))';
            case 'model': return 'lm(dist ~ speed, data = cars)';
            case 'list': return 'list(a=1, b="texto", c=TRUE)';
            default: return 'objeto';
        }
    }
}
