// Skills data by category
const skillsData = {
    "Développement": ["JavaScript", "TypeScript", "React", "Node.js", "Python", "Django", "PHP", "Laravel"],
    "Design": ["UI/UX", "Photoshop", "Illustrator"],
    "Intelligence Artificielle": ["Machine Learning", "Deep Learning", "TensorFlow"],
    "Géomatique": ["SIG", "QGIS", "Cartographie", "Web Mapping"],
    "Base de données": ["SQL", "PostgreSQL", "MySql", "Microsoft Access"],
    "Game Development": ["Game Maker Studio", "Unity", "C#", "Blender"]
};

// Flatten all skills into a single array
const allSkills = Object.values(skillsData).flat();

// Initialize skill cards
function initSkillsCards() {
    const cards = document.querySelectorAll(".skill-card-grid");

    // Display random skills on page load
    cards.forEach(card => {
        const randomSkill = allSkills[Math.floor(Math.random() * allSkills.length)];

        // Set text in base and overlay
        const textBase = card.querySelector('.skill-text-base');
        const textOverlay = card.querySelector('.skill-text-overlay');
        if (textBase) textBase.textContent = randomSkill;
        if (textOverlay) textOverlay.textContent = randomSkill;
    });

    // Change one random card every 0.5 seconds
    setInterval(() => {
        const randomCard = cards[Math.floor(Math.random() * cards.length)];
        const randomSkill = allSkills[Math.floor(Math.random() * allSkills.length)];

        // Update text in base and overlay
        const textBase = randomCard.querySelector('.skill-text-base');
        const textOverlay = randomCard.querySelector('.skill-text-overlay');
        if (textBase) textBase.textContent = randomSkill;
        if (textOverlay) textOverlay.textContent = randomSkill;

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
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSkillsCards);
} else {
    initSkillsCards();
}
