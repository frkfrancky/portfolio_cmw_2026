// Language system with data attributes
let currentLanguage = "fr";

// Initialize language based on navigator or default to 'fr'
function initializeLanguage() {
    const navigatorLang = navigator.language || navigator.userLanguage;
    if (navigatorLang.startsWith("en")) {
        currentLanguage = "en";
    } else if (navigatorLang.startsWith("ko")) {
        currentLanguage = "kr";
    } else {
        currentLanguage = "fr";
    }

    setLanguage(currentLanguage);
}

// Change language and update all elements with data attributes
function setLanguage(lang) {
    currentLanguage = lang;

    // Update all elements with data-* attributes
    document.querySelectorAll("[data-fr][data-en][data-kr]").forEach((el) => {
        el.textContent = el.getAttribute(`data-${lang}`);
    });

    // Update active button
    document.querySelectorAll(".lang-btn").forEach((btn) => {
        btn.classList.remove("active");
    });
    document.querySelector(`#langue-${lang}`).classList.add("active");

    // Store preference
    localStorage.setItem("preferredLanguage", lang);
}

// Event listeners for language buttons
document.querySelector("#langue-fr").addEventListener("click", () => {
    setLanguage("fr");
});

document.querySelector("#langue-en").addEventListener("click", () => {
    setLanguage("en");
});

document.querySelector("#langue-kr").addEventListener("click", () => {
    setLanguage("kr");
});

// Check for saved language preference
const savedLanguage = localStorage.getItem("preferredLanguage");
if (savedLanguage) {
    currentLanguage = savedLanguage;
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
    initializeLanguage();
});

// Theme toggle button
document.addEventListener("DOMContentLoaded", () => {
    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
        themeBtn.addEventListener("click", toggleTheme);
    }
});

// Fallback initialization if DOM is already loaded
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeLanguage);
} else {
    initializeLanguage();
}
