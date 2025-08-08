document.addEventListener('DOMContentLoaded', () => {
    
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