// Variables globales
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

// Elementos de navegación
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const slideCounter = document.getElementById('slideCounter');

// Modal de imagen
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const closeModal = document.querySelector('.close');

// Funciones de navegación
function showSlide(n) {
    slides[currentSlide].classList.remove('active');
    currentSlide = (n + totalSlides) % totalSlides;
    slides[currentSlide].classList.add('active');
    
    // Actualizar contador
    slideCounter.textContent = `${currentSlide + 1} / ${totalSlides}`;
    
    // Actualizar botones
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === totalSlides - 1;
    
    // Resetear scroll en contenedores scrollables
    const scrollableContent = slides[currentSlide].querySelector('.scrollable-content');
    if (scrollableContent) {
        scrollableContent.scrollTop = 0;
        scrollableContent.scrollLeft = 0;
        scrollableContent.classList.remove('scrolled', 'scroll-end');
    }
}

function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        showSlide(currentSlide + 1);
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        showSlide(currentSlide - 1);
    }
}

// Event listeners para navegación con botones
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

// Navegación con teclado
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
    } else if (e.key === 'Escape') {
        if (modal.style.display === 'block') {
            closeModalFunction();
        }
    } else if (e.key === 'Home') {
        e.preventDefault();
        showSlide(0);
    } else if (e.key === 'End') {
        e.preventDefault();
        showSlide(totalSlides - 1);
    } else if (e.key === 'f' || e.key === 'F') {
        toggleFullScreen();
    }
});

// Funcionalidad de zoom para imágenes
document.querySelectorAll('.zoomable-image').forEach(img => {
    img.addEventListener('click', function() {
        modal.style.display = 'block';
        modalImg.src = this.src;
        modalImg.alt = this.alt;
        
        // Animación de entrada suave
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 50);
    });
});

// Cerrar modal al hacer clic en la X
closeModal.addEventListener('click', function(e) {
    e.stopPropagation();
    closeModalFunction();
});

// Cerrar modal al hacer clic fuera de la imagen
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModalFunction();
    }
});

// Función para cerrar el modal con animación
function closeModalFunction() {
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 200);
}

// Prevenir que la imagen dentro del modal cierre el modal
modalImg.addEventListener('click', function(e) {
    e.stopPropagation();
});

// Soporte para gestos táctiles (móvil)
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    const swipeThreshold = 50;
    
    if (touchEndX < touchStartX - swipeThreshold) {
        nextSlide();
    }
    
    if (touchEndX > touchStartX + swipeThreshold) {
        prevSlide();
    }
}

// Prevenir scroll accidental durante presentación
document.addEventListener('wheel', function(e) {
    if (!e.target.closest('.scrollable-content')) {
        e.preventDefault();
    }
}, { passive: false });

// Modo presentación (fullscreen)
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error al entrar en pantalla completa: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Indicadores de scroll para diagramas
function addScrollIndicators() {
    const scrollableContents = document.querySelectorAll('.scrollable-content');
    
    scrollableContents.forEach(container => {
        const hasHorizontalScroll = container.scrollWidth > container.clientWidth;
        const hasVerticalScroll = container.scrollHeight > container.clientHeight;
        
        if (hasHorizontalScroll || hasVerticalScroll) {
            container.classList.add('has-scroll');
            
            container.addEventListener('scroll', function() {
                const scrollLeft = this.scrollLeft;
                const scrollTop = this.scrollTop;
                const maxScrollLeft = this.scrollWidth - this.clientWidth;
                const maxScrollTop = this.scrollHeight - this.clientHeight;
                
                if (scrollLeft > 0 || scrollTop > 0) {
                    this.classList.add('scrolled');
                }
                
                if (scrollLeft >= maxScrollLeft - 10 && scrollTop >= maxScrollTop - 10) {
                    this.classList.add('scroll-end');
                }
            });
        }
    });
}

// Marcar slides 5 y 14 como compactas
function markCompactSlides(){
    const compactSlideTitles = [
        'Proceso de Cocreación',
        'Matriz de Trazabilidad (RTM)'
    ];

    document.querySelectorAll('.slide').forEach(slide => {
        const h2 = slide.querySelector('.slide-header h2');
        if (h2 && compactSlideTitles.some(t => h2.textContent.trim().includes(t))) {
            slide.classList.add('compact-slide');
        }
    });
}

// Inicializar presentación
showSlide(0);

// Agregar indicadores de scroll después de cargar
window.addEventListener('load', function() {
    addScrollIndicators();
    markCompactSlides();
});

// Log de información útil
console.log('🎯 Presentación Plataforma de Gestión de Cursos Online');
console.log(`📊 Total de slides: ${totalSlides}`);
console.log('⌨️  Atajos de teclado:');
console.log('   → o Espacio: Siguiente slide');
console.log('   ←: Slide anterior');
console.log('   Home: Primera slide');
console.log('   End: Última slide');
console.log('   F: Pantalla completa');
console.log('   ESC: Cerrar modal de imagen');
console.log('📱 Gestos táctiles: Swipe izquierda/derecha para navegar');
console.log('🖱️  Diagramas UML: Scroll horizontal/vertical disponible');