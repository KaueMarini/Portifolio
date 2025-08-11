document.addEventListener('DOMContentLoaded', () => {

    const initMagneticCursor = () => {
        const cursor = document.querySelector('.custom-cursor');
        if (!cursor) return;

        const magneticElements = document.querySelectorAll('.magnetic');

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        magneticElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('grow');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('grow');
            });
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
                    const fx = new TextScramble(entry.target);
                    fx.setText(entry.target.textContent);
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
                if (distance < mouse.radius + this.size){
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

    
    const initTerminal = () => {
        const terminalInput = document.getElementById('terminal-input');
        if (!terminalInput) return;
        const terminalContent = document.getElementById('terminal-content');
        const terminalBody = document.getElementById('terminal-body');

        
        const socialLinks = {
            github: 'https://github.com/kauemarini',
            linkedin: 'https://linkedin.com/in/seu-usuario'
        };

        const commands = {
            'help': `Comandos disponíveis: <br>
                     <span class="command">sobre</span> - Rola para a seção Sobre Mim<br>
                     <span class="command">projetos</span> - Rola para a seção Meus Projetos<br>
                     <span class="command">habilidades</span> - Rola para a seção Habilidades<br>
                     <span class="command">contato</span> - Rola para a seção Contato<br>
                     <span class="command">social</span> - Exibe meus links de redes sociais<br>
                     <span class="command">clear</span> - Limpa o terminal`,
            'sobre': 'Navegando para a seção Sobre...',
            'projetos': 'Navegando para a seção Projetos...',
            'habilidades': 'Navegando para a seção Habilidades...',
            'contato': 'Navegando para a seção Contato...',
            'social': `Abrindo redes sociais...<br>
                       GitHub: <a href="${socialLinks.github}" target="_blank">${socialLinks.github}</a><br>
                       LinkedIn: <a href="${socialLinks.linkedin}" target="_blank">${socialLinks.linkedin}</a>`,
            'clear': ''
        };

        const printToTerminal = (text) => {
            terminalContent.innerHTML += `<div class="terminal-output">${text}</div>`;
            terminalBody.scrollTop = terminalBody.scrollHeight;
        };

        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = terminalInput.value.trim().toLowerCase();
                if (command === '') return;

                printToTerminal(`<span class="prompt-user">kauemarini@portfolio:~$</span> ${command}`);

                if (command in commands) {
                    if (command === 'clear') {
                        terminalContent.innerHTML = '';
                    } else {
                        printToTerminal(commands[command]);
                        if (['sobre', 'projetos', 'habilidades', 'contato'].includes(command)) {
                            const section = document.getElementById(command);
                            if(section) section.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                } else {
                    printToTerminal(`Comando não encontrado: ${command}. Digite 'help' para ver a lista de comandos.`);
                }
                
                terminalInput.value = '';
            }
        });

        printToTerminal('Bem-vindo ao meu portfólio interativo! Digite <span class="command">help</span> para começar.');
    };

    initMagneticCursor();
    initTextScramble();
    initParticleBg();
    initTerminal();
});
//teste commit 1