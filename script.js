document.addEventListener("DOMContentLoaded", function () {
    console.log("Portfolio Loaded!");

    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "-1";
    document.body.prepend(canvas);

    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const numParticles = 300;
    let mouseActivated = false;

    function getProfileCenter() {
        const profileImage = document.querySelector(".profile-img");
        if (profileImage) {
            const rect = profileImage.getBoundingClientRect();
            return {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
        }
        return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    }

    let mouseParticle = { 
        ...getProfileCenter(), 
        active: true, 
        size: Math.random() * 2 + 0.5 
    };

    const maxDistance = 250;
    const maxConnectionsPerParticle = 3;
    const particleSpeed = 0.25;

    function updateProfilePosition() {
        const center = getProfileCenter();
        mouseParticle.x = center.x;
        mouseParticle.y = center.y;
    }

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        updateProfilePosition();
        initParticles();
    });

    document.addEventListener("mousemove", (event) => {
        if (!mouseActivated) {
            mouseActivated = true;
        }
        mouseParticle.x = event.clientX;
        mouseParticle.y = event.clientY;
    });

    document.addEventListener("mouseleave", () => {
        mouseParticle.active = false;
    });

    document.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            setTimeout(updateProfilePosition, 100);
        });
    });

    function initParticles() {
        particles = [];
        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * particleSpeed,
                vy: (Math.random() - 0.5) * particleSpeed,
                size: Math.random() * 2 + 0.5,
                color: Math.random() < 0.2 ? "rgba(165, 165, 165, 0.7)" : "rgba(0, 128, 0, 0.7)"
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });

        if (mouseParticle.active) {
            ctx.fillStyle = "rgba(0, 128, 0, 0.7)";
            ctx.beginPath();
            ctx.arc(mouseParticle.x, mouseParticle.y, mouseParticle.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function updateParticles() {
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        });
    }

    function drawConnections() {
        let activeParticles = [...particles, mouseParticle].filter(p =>
            Math.hypot(mouseParticle.x - p.x, mouseParticle.y - p.y) < maxDistance
        );

        for (let i = 0; i < activeParticles.length; i++) {
            let connections = 0;

            for (let j = i + 1; j < activeParticles.length; j++) {
                if (connections >= maxConnectionsPerParticle) break;

                let a = activeParticles[i];
                let b = activeParticles[j];
                let dist = Math.hypot(a.x - b.x, a.y - b.y);

                let opacity = Math.max(0, 1 - dist / maxDistance);
                if (dist < maxDistance) {
                    ctx.strokeStyle = `rgba(0, 128, 0, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                    connections++;
                }
            }
        }
    }

    function animate() {
        drawParticles();
        updateParticles();
        drawConnections();
        requestAnimationFrame(animate);
    }

    initParticles();
    animate();

    function startTypewriter(elementId, speed = 100, callback = null) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const text = element.dataset.text || element.innerText || "";
        element.innerHTML = "";

        let index = 0;

        function type() {
            if (index < text.length) {
                element.innerHTML += text.charAt(index);
                index++;
                setTimeout(type, speed);
            } else if (callback) {
                callback();
            }
        }

        type();
    }

    document.querySelectorAll(".typewriter").forEach(element => {
        startTypewriter(element.id, parseInt(element.dataset.speed) || 75);
    });
});
