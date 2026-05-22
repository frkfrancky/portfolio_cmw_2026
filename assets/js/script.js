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

// Hello SVG Animation - Random Position and Rotation
function initHelloSvg() {
    const wrapper = document.getElementById("hello-svg-wrapper");
    if (!wrapper) return;

    // Random position within top-left corner area of hero section
    const randomTop = Math.random() * 60 - 20; // Between -20px and 40px
    const randomLeft = Math.random() * 60 - 20; // Between -20px and 40px

    // Small random rotation + 8deg counter-clockwise
    const randomRotation = (Math.random() * 8 - 4) - 8; // Between -12deg and -4deg

    wrapper.style.top = (50 + randomTop) + "px";
    wrapper.style.left = (40 + randomLeft) + "px";
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
