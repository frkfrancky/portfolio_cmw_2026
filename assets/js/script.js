// Theme management
function initTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.classList.remove("dark", "light");
    document.body.classList.add(savedTheme);
    updateThemeToggleButton(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.body.classList.contains("dark") ? "dark" : "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.body.classList.remove("dark", "light");
    document.body.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeToggleButton(newTheme);
}

function updateThemeToggleButton(theme) {
    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
        themeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
        themeBtn.title = theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode";
    }
}

// Initialize theme on page load
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTheme);
} else {
    initTheme();
}

// Hello SVG Animation - Fixed Position and Rotation
function initHelloSvg() {
    const wrapper = document.getElementById("hello-svg-wrapper");
    if (!wrapper) return;

    // Small random rotation + 8deg counter-clockwise
    const randomRotation = (Math.random() * 8 - 4) - 8; // Between -12deg and -4deg

    wrapper.style.transform = `rotate(${randomRotation}deg)`;
}

// Initialize hello SVG on page load
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHelloSvg);
    document.addEventListener("DOMContentLoaded", setupHelloSvgAnimationLoop);
} else {
    initHelloSvg();
    setupHelloSvgAnimationLoop();
}

// Setup animation loop for hello SVG - no longer needed with infinite animation
function setupHelloSvgAnimationLoop() {
    // Animation is now handled by CSS with infinite loop
}

// Legal Modal Management
function openLegalModal() {
    const modal = document.getElementById('legal-modal');
    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeLegalModal() {
    const modal = document.getElementById('legal-modal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('legal-modal');
    if (modal && e.target === modal) {
        closeLegalModal();
    }
});

// Close modal when pressing Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLegalModal();
    }
});
