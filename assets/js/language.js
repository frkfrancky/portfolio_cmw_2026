// Language system using content.json
let currentLanguage = "fr";

// Initialize language based on navigator or default to 'fr'
async function initializeLanguage() {
    // Check for saved language preference first
    const savedLanguage = localStorage.getItem("preferredLanguage");
    if (savedLanguage) {
        currentLanguage = savedLanguage;
    } else {
        // Then check navigator language
        const navigatorLang = navigator.language || navigator.userLanguage;
        if (navigatorLang.startsWith("en")) {
            currentLanguage = "en";
        } else if (navigatorLang.startsWith("ko")) {
            currentLanguage = "kr";
        } else {
            currentLanguage = "fr";
        }
    }

    // Wait for content loader to have data
    if (!contentLoader.data) {
        await contentLoader.load();
    }

    setLanguage(currentLanguage);
}

// Change language and update all elements from content.json
function setLanguage(lang) {
    currentLanguage = lang;

    // Update contentLoader language
    contentLoader.setLanguage(lang);

    // Get labels from content.json
    const labels = contentLoader.getLabels();

    // Update elements with data-label attributes from content.json
    document.querySelectorAll("[data-label]").forEach((el) => {
        const labelKey = el.getAttribute("data-label");
        if (labels[labelKey]) {
            el.textContent = labels[labelKey];
        }
    });

    // Update active button
    document.querySelectorAll(".lang-btn").forEach((btn) => {
        btn.classList.remove("active");
    });
    document.querySelector(`#langue-${lang}`).classList.add("active");

    // Update hello SVG language
    updateHelloSvgLanguage(lang);

    // Store preference
    localStorage.setItem("preferredLanguage", lang);
}

// Update hello SVG based on language
function updateHelloSvgLanguage(lang) {
    const langMap = {
        "fr": "hello-fr",
        "en": "hello-en",
        "kr": "hello-kr"
    };

    const targetId = langMap[lang] || "hello-en";

    // Hide all language groups
    document.querySelectorAll("#hello-en, #hello-fr, #hello-kr").forEach((group) => {
        group.classList.add("hello-hidden");
    });

    // Show the target language group
    const targetGroup = document.getElementById(targetId);
    if (targetGroup) {
        targetGroup.classList.remove("hello-hidden");
    }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", async () => {
    await initializeLanguage();

    // Event listeners for language buttons (attached after DOM is ready)
    document.querySelector("#langue-fr").addEventListener("click", () => {
        setLanguage("fr");
    });

    document.querySelector("#langue-en").addEventListener("click", () => {
        setLanguage("en");
    });

    document.querySelector("#langue-kr").addEventListener("click", () => {
        setLanguage("kr");
    });

    // Theme toggle button
    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
        themeBtn.addEventListener("click", toggleTheme);
    }
});

// Fallback initialization if DOM is already loaded
if (document.readyState !== "loading") {
    initializeLanguage();
}
