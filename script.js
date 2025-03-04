document.addEventListener("DOMContentLoaded", function () {
    function typeWriterEffect(element, text, speed = 50) {
        let i = 0;
        const originalText = text;

        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }

        function reset() {
            element.innerHTML = "";
            i = 0;
            type();
        }

        element.innerHTML = "";
        type();

        window.addEventListener('resize', function() {
            if (document.contains(element) && element.offsetWidth > 0 && element.offsetHeight > 0) {
                text = element.getAttribute('data-text') || originalText;
                reset();
            }
        });
    }

    document.querySelectorAll(".typewriter").forEach(element => {
        if (element) {
            typeWriterEffect(element, element.getAttribute("data-text"));
        }
    });

    const canvas = document.getElementById("particle-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let particles = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }

        window.addEventListener("resize", resizeCanvas);

        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 1.5 + 0.5;
                this.speedX = (Math.random() - 0.5) * 1.5;
                this.speedY = (Math.random() - 0.5) * 1.5;
                const colorOptions = ["#1A472A", "#A5A5A5", "#FF0000"];
                const randomIndex = Math.random();
                this.color = randomIndex < 0.75 ? colorOptions[0] : randomIndex < 0.875 ? colorOptions[1] : colorOptions[2];
            }
            update() {
                if (this.x + this.size >= canvas.width || this.x - this.size <= 0) {
                    this.speedX = -this.speedX;
                }
                if (this.y + this.size >= canvas.height || this.y - this.size <= 0) {
                    this.speedY = -this.speedY;
                }
                this.x += this.speedX;
                this.y += this.speedY;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const area = canvas.width * canvas.height;
            const numParticles = Math.max(Math.min(Math.floor(area / 10000), 250), 50);

            for (let i = 0; i < numParticles; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                particles.push(new Particle(x, y));
            }
        }

        function connectParticles() {
            const maxDistance = Math.max(canvas.width, canvas.height) * 0.10;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < maxDistance) {
                        const opacity = 1 - distance / maxDistance;
                        ctx.strokeStyle = `rgba(26, 71, 42, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            connectParticles();
            requestAnimationFrame(animateParticles);
        }

        resizeCanvas();
        animateParticles();
    }

    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('nav ul');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            navList.style.display = navList.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    function loadProjects() {
        fetch("projects.json")
            .then(response => response.json())
            .then(savedProjects => {
                const projectsGrid = document.querySelector(".projects-grid");
                if (!projectsGrid) return;
                projectsGrid.innerHTML = "";
                savedProjects.forEach(project => {
                    const newProject = document.createElement("div");
                    newProject.classList.add("project-card");
                    newProject.innerHTML = `
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                    `;
                    projectsGrid.appendChild(newProject);
                });
            })
            .catch(error => console.error("Error loading projects:", error));
    }

    loadProjects();
});