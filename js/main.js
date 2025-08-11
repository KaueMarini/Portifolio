document.addEventListener('DOMContentLoaded', () => {
    
<<<<<<< HEAD
    /**
     * Animação de Fade-in para seções ao rolar a página.
     * Utiliza IntersectionObserver para performance.
     */
    const initScrollAnimation = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-show');
                    observer.unobserve(entry.target); // Para a observação após a animação
                }
            });
        }, { threshold: 0.1 });

        const hiddenElements = document.querySelectorAll('.section-hidden');
        hiddenElements.forEach((el) => observer.observe(el));
    };

    /**
     * Atualiza o link de navegação ativo com base na seção visível.
     */
    const initActiveMenuOnScroll = () => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        const headerHeight = document.querySelector('.header').offsetHeight;

        const activateMenu = () => {
            let currentSectionId = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                // O headerHeight ajusta o ponto de ativação para compensar a altura do cabeçalho fixo.
                if (window.scrollY >= sectionTop - headerHeight) {
                    currentSectionId = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', activateMenu);
        activateMenu(); // Executa uma vez no carregamento
    };

    // Inicializa todas as funcionalidades
    initScrollAnimation();
    initActiveMenuOnScroll();

});

//teste122
=======
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            
            if (entry.isIntersecting) {
                
                entry.target.classList.add('show');
            } 
            
        });
    }, {
        threshold: 0.1 
    });
    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a');

    const activateMenuAtCurrentSection = () => {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 60) { 
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active'); 
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', activateMenuAtCurrentSection);

});
>>>>>>> 83829d006c6a2f7e51af8a61d0ba6ac0f8f47623
