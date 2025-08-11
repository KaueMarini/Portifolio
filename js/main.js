document.addEventListener('DOMContentLoaded', () => {

    // Função original de animação de scroll
    const initScrollAnimation = () => {
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
    };

    // Função original de menu ativo
    const initActiveMenuOnScroll = () => {
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
    };

    /**
     * NOVA FUNÇÃO: Efeito de inclinação 3D nos cards
     * Adiciona um efeito de perspectiva que segue o mouse nos elementos com a classe '.tilt-card'
     */
    const initTiltEffect = () => {
        const tiltCards = document.querySelectorAll('.tilt-card');

        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; // Posição X do mouse dentro do card
                const y = e.clientY - rect.top;  // Posição Y do mouse dentro do card

                const centerX = card.offsetWidth / 2;
                const centerY = card.offsetHeight / 2;

                const rotateX = ((y - centerY) / centerY) * -10; // Rotação máxima de 10 graus
                const rotateY = ((x - centerX) / centerX) * 10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            card.addEventListener('mouseleave', () => {
                // Reseta a transformação quando o mouse sai do card
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        });
    };


    // Inicializa todas as funcionalidades
    initScrollAnimation();
    initActiveMenuOnScroll();
    initTiltEffect(); // Chama a nova função

});