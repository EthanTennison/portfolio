document.addEventListener("DOMContentLoaded", function () {
    function typeWriterEffect(element, text, speed = 50) {
        let i = 0;
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        element.innerHTML = "";
        type();
    }

    let typewriterElement = document.getElementById("typewriter");
    if (typewriterElement) {
        typeWriterEffect(typewriterElement, typewriterElement.getAttribute("data-text"));
    }

    document.querySelectorAll("a").forEach(link => {
        link.addEventListener("mouseenter", () => link.style.fontWeight = "bold");
        link.addEventListener("mouseleave", () => link.style.fontWeight = "normal");
    });

    let canvas = document.getElementById("particle-canvas");
    if (canvas) {
        let ctx = canvas.getContext("2d");
        let particles = [];

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.addEventListener("resize", function () {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 3 + 1;
                this.speedX = (Math.random() - 0.5) * 1.5;
                this.speedY = (Math.random() - 0.5) * 1.5;
                this.color = "#1A472A";
            }
            update() {
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
            for (let i = 0; i < 100; i++) {
                let x = Math.random() * canvas.width;
                let y = Math.random() * canvas.height;
                particles.push(new Particle(x, y));
            }
        }

        function connectParticles() {
            let maxDistance = 100;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    let dx = particles[i].x - particles[j].x;
                    let dy = particles[i].y - particles[j].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < maxDistance) {
                        let opacity = 1 - distance / maxDistance;
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

        initParticles();
        animateParticles();
    }

    function loadProjects() {
        fetch("projects.json")
            .then(response => response.json())
            .then(savedProjects => {
                let projectsGrid = document.querySelector(".projects-grid");
                if (!projectsGrid) return;
                projectsGrid.innerHTML = "";
                savedProjects.forEach(project => {
                    let newProject = document.createElement("div");
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
