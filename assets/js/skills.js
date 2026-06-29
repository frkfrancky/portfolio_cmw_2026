// Load skills from content.json and update on language change
let allSkills = [];
let skillsInterval = null;
let displayedSkills = new Set();

async function loadSkills() {
    // Wait for contentLoader to have data
    if (!contentLoader.data) {
        await contentLoader.load();
    }

    // Get skills from content.json based on current language
    allSkills = contentLoader.getSkills() || [];

    // Reset displayed skills when language changes
    displayedSkills.clear();

    // Reinitialize skill cards with new language
    initSkillsCards();
}

// Initialize skill cards
function initSkillsCards() {
    const cards = document.querySelectorAll(".skill-card-grid:not(.skill-card-extra)");

    if (allSkills.length === 0) return;

    // Function to get a random skill not currently displayed
    function getRandomUniqueSkill() {
        const availableSkills = allSkills.filter(skill => !displayedSkills.has(skill));
        if (availableSkills.length === 0) {
            displayedSkills.clear();
            return allSkills[Math.floor(Math.random() * allSkills.length)];
        }
        return availableSkills[Math.floor(Math.random() * availableSkills.length)];
    }

    // Display random skills on page load
    cards.forEach(card => {
        const randomSkill = getRandomUniqueSkill();
        displayedSkills.add(randomSkill);

        // Set text in base and overlay
        const textBase = card.querySelector('.skill-text-base');
        const textOverlay = card.querySelector('.skill-text-overlay');
        if (textBase) textBase.textContent = randomSkill;
        if (textOverlay) {
            textOverlay.textContent = randomSkill;
            // Randomly add glitch effect to about 40% of cards
            if (Math.random() < 0.4) {
                textOverlay.classList.add('has-glitch');
            }
        }
    });

    // Clear previous interval if it exists
    if (skillsInterval) clearInterval(skillsInterval);

    // Change one random card every 0.5 seconds
    skillsInterval = setInterval(() => {
        const randomCard = cards[Math.floor(Math.random() * cards.length)];

        // Remove old skill from displayed set
        const textBase = randomCard.querySelector('.skill-text-base');
        if (textBase) {
            displayedSkills.delete(textBase.textContent);
        }

        // Get new unique skill
        const randomSkill = getRandomUniqueSkill();
        displayedSkills.add(randomSkill);

        // Update text in base and overlay
        if (textBase) textBase.textContent = randomSkill;
        const textOverlay = randomCard.querySelector('.skill-text-overlay');
        if (textOverlay) {
            textOverlay.textContent = randomSkill;
            // Randomly add or remove glitch effect
            if (Math.random() < 0.4) {
                textOverlay.classList.add('has-glitch');
            } else {
                textOverlay.classList.remove('has-glitch');
            }
        }

        // Add active class (turns green)
        randomCard.classList.remove("active");
        void randomCard.offsetWidth; // Trigger reflow
        randomCard.classList.add("active");

        // Remove active class after 0.5s (transitions back to violet)
        setTimeout(() => {
            randomCard.classList.remove("active");
        }, 500);
    }, 500);
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
    loadSkills();

    // Update skills when language changes
    // Listen for language change by watching for changes in contentLoader
    const originalSetLanguage = window.setLanguage;
    window.setLanguage = function(lang) {
        originalSetLanguage.call(this, lang);
        contentLoader.setLanguage(lang);
        loadSkills();
    };
});

// Fallback initialization if DOM is already loaded
if (document.readyState !== "loading") {
    loadSkills();
}
