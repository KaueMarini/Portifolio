document.addEventListener('DOMContentLoaded', () => {

    const isDesktop = window.matchMedia("(min-width: 768px)").matches;

    
    const initLanguageSwitcher = () => {
        const langBtn = document.getElementById('lang-btn');
        if (!langBtn) return;
        
        const translatableElements = document.querySelectorAll('[data-pt]');
        
        const switchLanguage = (lang) => {
            document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';

            translatableElements.forEach(el => {
                
                if (el.dataset[lang]) {
                    
                    if (el.querySelector('span') && el.dataset[lang].includes('<span>')) {
                         el.innerHTML = el.dataset[lang];
                    } else {
                        el.innerHTML = el.dataset[lang];
                    }
                }

                
                const placeholderKey = `ptPlaceholder`;
                const newPlaceholderKey = `${lang}Placeholder`;
                 if (el.dataset[placeholderKey]) {
                    el.placeholder = el.dataset[newPlaceholderKey];
                }
            });
            localStorage.setItem('preferredLanguage', lang);
            updateTerminalLanguage(lang);
        };

        langBtn.addEventListener('click', () => {
            const currentLang = localStorage.getItem('preferredLanguage') || 'pt';
            const newLang = currentLang === 'pt' ? 'en' : 'pt';
            switchLanguage(newLang);
        });

        const preferredLanguage = localStorage.getItem('preferredLanguage');
        switchLanguage(preferredLanguage || 'pt');
    };

    const initMagneticCursor = () => {
        if (!isDesktop) return;
        const cursor = document.querySelector('.custom-cursor');
        const magneticElements = document.querySelectorAll('.magnetic');
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        magneticElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
        });
    };

    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }
        update() {
            let output = '';
            let complete = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.chars[Math.floor(Math.random() * this.chars.length)];
                        this.queue[i].char = char;
                    }
                    output += `<span class="scramble-char">${char}</span>`;
                } else {
                    output += from;
                }
            }
            this.el.innerHTML = output;
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
    }

    const initTextScramble = () => {
        const scrambleElements = document.querySelectorAll('[data-scramble]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lang = localStorage.getItem('preferredLanguage') || 'pt';
                    const fx = new TextScramble(entry.target);
                    const textToScramble = entry.target.dataset[lang] || entry.target.innerHTML;
                    fx.setText(textToScramble.replace(/<\/?span[^>]*>/g, ''));
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        scrambleElements.forEach(el => observer.observe(el));
    };
    
    const initParticleBg = () => {
        const canvas = document.getElementById('particles-bg');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        let particlesArray;
        const mouse = { x: null, y: null, radius: (canvas.height/100) * (canvas.width/100) };
        window.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        });
        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x; this.y = y; this.directionX = directionX; this.directionY = directionY; this.size = size; this.color = color;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = 'rgba(138, 43, 226, 0.5)';
                ctx.fill();
            }
            update() {
                if (this.x > canvas.width || this.x < 0) { this.directionX = -this.directionX; }
                if (this.y > canvas.height || this.y < 0) { this.directionY = -this.directionY; }
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx*dx + dy*dy);
                if (isDesktop && distance < mouse.radius + this.size){
                    if(mouse.x < this.x && this.x < canvas.width - this.size * 10) { this.x += 3; }
                    if(mouse.x > this.x && this.x > this.size * 10) { this.x -= 3; }
                    if(mouse.y < this.y && this.y < canvas.height - this.size * 10) { this.y += 3; }
                    if(mouse.y > this.y && this.y > this.size * 10) { this.y -= 3; }
                }
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }
        function initParticles() {
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i=0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * 0.4) - 0.2;
                let directionY = (Math.random() * 0.4) - 0.2;
                particlesArray.push(new Particle(x,y,directionX,directionY,size));
            }
        }
        function animateParticles() {
            requestAnimationFrame(animateParticles);
            ctx.clearRect(0,0,innerWidth, innerHeight);
            for (let i=0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
        }
        initParticles();
        animateParticles();
        window.addEventListener('resize', () => {
            canvas.width = innerWidth;
            canvas.height = innerHeight;
            mouse.radius = (canvas.height/100) * (canvas.width/100);
            initParticles();
        });
    };
    
    let terminalCommands = {};
    let terminalWelcomeMessage = '';
    const terminalContent = document.getElementById('terminal-content');

    const updateTerminalLanguage = (lang) => {
        const socialLinks = {
            github: 'https://github.com/kauemarini',
            linkedin: 'https://linkedin.com/in/kauêmarini'
        };
        const translations = {
            pt: {
                welcome: 'Bem-vindo ao meu portfólio interativo! Digite <span class="command">help</span> para começar.',
                help: `Comandos disponíveis:<div class="help-grid"><span class="help-command">sobre</span><span class="help-description">- Navega para a seção Sobre Mim</span><span class="help-command">projetos</span><span class="help-description">- Navega para a seção de Projetos</span><span class="help-command">habilidades</span><span class="help-description">- Navega para a seção de Habilidades</span><span class="help-command">contato</span><span class="help-description">- Navega para a seção de Contato</span><span class="help-command">social</span><span class="help-description">- Exibe os links das redes sociais</span><span class="help-command">clear</span><span class="help-description">- Limpa a tela do terminal</span></div>`,
                commands: { 'sobre': 'Navegando para a seção Sobre...','projetos': 'Navegando para a seção Projetos...','habilidades': 'Navegando para a seção Habilidades...','contato': 'Navegando para a seção Contato...','social': `Abrindo redes sociais...<br>GitHub: <a href="${socialLinks.github}" target="_blank">${socialLinks.github}</a><br>LinkedIn: <a href="${socialLinks.linkedin}" target="_blank">${socialLinks.linkedin}</a>`,'clear': ''},
                notFound: (cmd) => `Comando não encontrado: ${cmd}. Digite 'help' para ver a lista de comandos.`
            },
            en: {
                welcome: 'Welcome to my interactive portfolio! Type <span class="command">help</span> to get started.',
                help: `Available commands:<div class="help-grid"><span class="help-command">about</span><span class="help-description">- Navigates to the About Me section</span><span class="help-command">projects</span><span class="help-description">- Navigates to the Projects section</span><span class="help-command">skills</span><span class="help-description">- Navigates to the Skills section</span><span class="help-command">contact</span><span class="help-description">- Navigates to the Contact section</span><span class="help-command">social</span><span class="help-description">- Displays social media links</span><span class="help-command">clear</span><span class="help-description">- Clears the terminal screen</span></div>`,
                commands: { 'about': 'Navigating to About section...','projects': 'Navigating to Projects section...','skills': 'Navigating to Skills section...','contact': 'Navigating to Contact section...','social': `Opening social media...<br>GitHub: <a href="${socialLinks.github}" target="_blank">${socialLinks.github}</a><br>LinkedIn: <a href="${socialLinks.linkedin}" target="_blank">${socialLinks.linkedin}</a>`,'clear': ''},
                notFound: (cmd) => `Command not found: ${cmd}. Type 'help' to see the list of commands.`
            }
        };
        const currentTranslation = translations[lang];
        terminalWelcomeMessage = currentTranslation.welcome;
        terminalCommands = { help: currentTranslation.help, ...currentTranslation.commands };
        terminalCommands.notFound = currentTranslation.notFound;
        if (terminalContent) {
            terminalContent.innerHTML = '';
            printToTerminal(terminalWelcomeMessage);
        }
    };
    
    const printToTerminal = (text) => {
        if (!terminalContent) return;
        const outputElement = document.createElement('div');
        outputElement.classList.add('terminal-output');
        outputElement.innerHTML = text;
        terminalContent.appendChild(outputElement);
        const terminalBody = document.getElementById('terminal-body');
        terminalBody.scrollTop = terminalBody.scrollHeight;
    };
    
    const initInteractiveTerminal = () => {
        const terminalWindow = document.getElementById('terminal-window');
        const terminalInput = document.getElementById('terminal-input');
        if (!terminalInput) return;
        terminalWindow.addEventListener('click', (e) => {
            if (e.target !== terminalInput) terminalInput.focus();
        });
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = terminalInput.value.trim().toLowerCase();
                const commandMap = { 'sobre': 'about', 'about': 'about', 'projetos': 'projects', 'projects': 'projects', 'habilidades': 'skills', 'skills': 'skills', 'contato': 'contact', 'contact': 'contact', 'social': 'social', 'help': 'help', 'clear': 'clear' };
                const mappedCommand = commandMap[command];
                if (command === '') return;
                printToTerminal(`<span class="prompt-user">kauemarini@portfolio:~$</span> ${command}`);
                if (mappedCommand && terminalCommands[mappedCommand] !== undefined) {
                    if (mappedCommand === 'clear') {
                        terminalContent.innerHTML = '';
                    } else {
                        printToTerminal(terminalCommands[mappedCommand]);
                        const sectionMapPT = { 'about': 'sobre', 'projects': 'projetos', 'skills': 'habilidades', 'contact': 'contato' };
                        const sectionId = sectionMapPT[mappedCommand];
                        if (sectionId) document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
                    }
                } else {
                    printToTerminal(terminalCommands.notFound(command));
                }
                terminalInput.value = '';
            }
        });
    };
    
    const initMobileMenu = () => {
        const menuIcon = document.querySelector('.menu-mobile-icon');
        const mobileNav = document.querySelector('.nav-mobile-overlay');
        const navLinks = mobileNav.querySelectorAll('a');
        menuIcon.addEventListener('click', () => {
            menuIcon.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuIcon.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    };

    const showTerminal = () => {
        const terminalSection = document.getElementById('terminal');
        const terminalInput = document.getElementById('terminal-input');
        if (terminalSection && terminalInput) {
            setTimeout(() => {
                terminalSection.classList.add('visible');
                terminalInput.focus();
            }, 100);
        }
    };

    const initProjectSlideshow = () => {
        const projectCards = document.querySelectorAll('.projeto-card');
        projectCards.forEach(card => {
            const images = card.querySelectorAll('.projeto-imagem');
            const prevBtn = card.querySelector('.prev-btn');
            const nextBtn = card.querySelector('.next-btn');
            let currentImageIndex = 0;
            if (images.length <= 1) {
                if(prevBtn) prevBtn.style.display = 'none';
                if(nextBtn) nextBtn.style.display = 'none';
                return;
            }
            function showImage(index) {
                images.forEach((img, i) => {
                    img.classList.remove('active');
                    if (i === index) {
                        img.classList.add('active');
                    }
                });
            }
            if(prevBtn) {
                prevBtn.addEventListener('click', () => {
                    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
                    showImage(currentImageIndex);
                });
            }
            if(nextBtn) {
                nextBtn.addEventListener('click', () => {
                    currentImageIndex = (currentImageIndex + 1) % images.length;
                    showImage(currentImageIndex);
                });
            }
        });
    };

  
    initLanguageSwitcher();
    initMagneticCursor();
    initTextScramble();
    initParticleBg();
    initInteractiveTerminal();
    initMobileMenu();
    showTerminal();
    initProjectSlideshow(); 
});