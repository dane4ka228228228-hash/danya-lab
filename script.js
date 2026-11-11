
// ======================================
// DANYA LAB
// INTERACTIVE PARTICLE CIRCLE
// ======================================

const canvas = document.getElementById("particle-bg");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;

let particles = [];

let targetX = window.innerWidth / 2;
let targetY = window.innerHeight / 2;

let currentX = targetX;
let currentY = targetY;

let radius = 250;

// Обмежуємо навантаження на пристрій
const isMobile = () => window.innerWidth < 700;

// ======================================
// РОЗМІРИ CANVAS
// ======================================

function resizeCanvas() {

    const dpr = Math.min(
        window.devicePixelRatio || 1,
        1.5
    );

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    radius = Math.min(width, height) * 0.38;

    createParticles();
}

// ======================================
// СТВОРЕННЯ ТОЧОК
// ======================================

function createParticles() {

    particles = [];

    const count = isMobile() ? 85 : 150;

    for (let i = 0; i < count; i++) {

        const angle = Math.random() * Math.PI * 2;

        const distance =
            Math.sqrt(Math.random()) * radius;

        const offsetX = Math.cos(angle) * distance;
        const offsetY = Math.sin(angle) * distance;

        particles.push({

            offsetX: offsetX,
            offsetY: offsetY,

            x: currentX + offsetX,
            y: currentY + offsetY,

            size: Math.random() * 1.8 + 1

        });

    }

}

// ======================================
// РУХ ЗА МИШКОЮ ТА ДОТИКОМ
// ======================================

function moveTarget(event) {

    targetX = event.clientX;
    targetY = event.clientY;

}

window.addEventListener(
    "pointermove",
    moveTarget,
    { passive: true }
);

// Повернення до центру, коли курсор залишає вікно
window.addEventListener("pointerleave", () => {

    targetX = width / 2;
    targetY = height / 2;

});

// ======================================
// ГОЛОВНА АНІМАЦІЯ
// ======================================

function animateParticles() {

    ctx.clearRect(0, 0, width, height);

    // Плавний рух кола
    currentX += (targetX - currentX) * 0.045;
    currentY += (targetY - currentY) * 0.045;

    // Малюємо точки
    for (const particle of particles) {

        const destinationX =
            currentX + particle.offsetX;

        const destinationY =
            currentY + particle.offsetY;

        particle.x +=
            (destinationX - particle.x) * 0.08;

        particle.y +=
            (destinationY - particle.y) * 0.08;

        ctx.beginPath();

        ctx.arc(
            particle.x,
            particle.y,
            particle.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "rgba(45, 153, 255, 0.85)";

        ctx.shadowBlur = 9;
        ctx.shadowColor = "#1687ff";

        ctx.fill();

    }

    // З'єднуємо близькі точки лініями
    ctx.shadowBlur = 0;

    for (let i = 0; i < particles.length; i++) {

        for (let j = i + 1; j < particles.length; j++) {

            const dx =
                particles[i].x - particles[j].x;

            const dy =
                particles[i].y - particles[j].y;

            const distance =
                Math.sqrt(dx * dx + dy * dy);

            if (distance < 65) {

                const opacity = 1 - distance / 65;

                ctx.beginPath();

                ctx.moveTo(
                    particles[i].x,
                    particles[i].y
                );

                ctx.lineTo(
                    particles[j].x,
                    particles[j].y
                );

                ctx.strokeStyle =
                    `rgba(35, 130, 255, ${opacity * 0.25})`;

                ctx.lineWidth = 0.7;

                ctx.stroke();

            }

        }

    }

    requestAnimationFrame(animateParticles);

}

// ======================================
// ЗАПУСК
// ======================================

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

animateParticles();
