// ======================================
// DANYA LAB
// INDEPENDENT INTERACTIVE PARTICLES
// ======================================

const canvas = document.getElementById("particle-bg");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;

let particles = [];

const PARTICLE_COLOR = "45, 153, 255";

const isMobile = () => window.innerWidth <= 800;

// ======================================
// КУРСОР І ДОТИК
// ======================================

const pointer = {
    x: -1000,
    y: -1000,
    active: false,
    type: "mouse"
};

// ======================================
// НАЛАШТУВАННЯ
// ======================================

const settings = {
    desktopCount: 155,
    mobileCount: 65,

    desktopRadius: 155,
    mobileRadius: 115,

    pushForce: 3.0,
    returnForce: 0.012,
    friction: 0.91
};

// ======================================
// РОЗМІР CANVAS
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

    createParticles();
}

// ======================================
// СТВОРЕННЯ ТОЧОК
// ======================================

function createParticles() {

    particles = [];

    const count = isMobile()
        ? settings.mobileCount
        : settings.desktopCount;

    for (let i = 0; i < count; i++) {

        const x = Math.random() * width;
        const y = Math.random() * height;

        particles.push({

            // Початкове положення

            homeX: x,
            homeY: y,

            // Поточне положення

            x: x,
            y: y,

            // Швидкість

            vx: 0,
            vy: 0,

            // Вигляд

            size: Math.random() * 1.7 + 1,
            opacity: Math.random() * 0.35 + 0.55

        });

    }

}

// ======================================
// РУХ МИШКИ ТА ПАЛЬЦЯ
// ======================================

function updatePointer(event) {

    pointer.x = event.clientX;
    pointer.y = event.clientY;

    pointer.active = true;
    pointer.type = event.pointerType;

}

window.addEventListener(
    "pointermove",
    updatePointer,
    { passive: true }
);

window.addEventListener(
    "pointerdown",
    updatePointer,
    { passive: true }
);

// Коли палець забирають з екрана

window.addEventListener("pointerup", (event) => {

    if (event.pointerType === "touch") {
        pointer.active = false;
    }

}, { passive: true });

window.addEventListener("pointercancel", () => {
    pointer.active = false;
});

// Коли курсор залишає вікно браузера

window.addEventListener("pointerleave", (event) => {

    if (event.pointerType !== "touch") {
        pointer.active = false;
    }

});

// ======================================
// ВІДШТОВХУВАННЯ ТОЧОК
// ======================================

function moveParticle(particle) {

    if (!pointer.active) {
        return;
    }

    const dx = particle.x - pointer.x;
    const dy = particle.y - pointer.y;

    const distance = Math.sqrt(
        dx * dx + dy * dy
    );

    const influenceRadius = isMobile()
        ? settings.mobileRadius
        : settings.desktopRadius;

    if (
        distance < influenceRadius &&
        distance > 0
    ) {

        const force =
            (influenceRadius - distance) /
            influenceRadius;

        const angle = Math.atan2(dy, dx);

        const push = force * settings.pushForce;

        particle.vx += Math.cos(angle) * push;
        particle.vy += Math.sin(angle) * push;

    }

}

// ======================================
// ПОВЕРНЕННЯ ТОЧОК
// ======================================

function returnParticle(particle) {

    const dx = particle.homeX - particle.x;
    const dy = particle.homeY - particle.y;

    particle.vx += dx * settings.returnForce;
    particle.vy += dy * settings.returnForce;

}

// ======================================
// МАЛЮВАННЯ ТОЧОК
// ======================================

function drawParticle(particle) {

    ctx.beginPath();

    ctx.arc(
        particle.x,
        particle.y,
        particle.size,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        `rgba(${PARTICLE_COLOR}, ${particle.opacity})`;

    ctx.fill();

}

// ======================================
// ГОЛОВНА АНІМАЦІЯ
// ======================================

function animateParticles() {

    ctx.clearRect(0, 0, width, height);

    for (const particle of particles) {

        // Кожна точка окремо реагує на курсор

        moveParticle(particle);

        // Повернення до свого початкового місця

        returnParticle(particle);

        // Плавність руху

        particle.vx *= settings.friction;
        particle.vy *= settings.friction;

        // Оновлення позиції

        particle.x += particle.vx;
        particle.y += particle.vy;

        // Малювання

        drawParticle(particle);

    }

    // Жодних ліній між точками!

    requestAnimationFrame(animateParticles);

}

// ======================================
// ЗАПУСК
// ======================================

window.addEventListener("resize", resizeCanvas);

resizeCanvas();

animateParticles();