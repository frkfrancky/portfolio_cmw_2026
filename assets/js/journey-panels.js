// Journey Panels - Display education with polygon panels
let educationData = [];

async function initJourneyPanels() {
    // Wait for contentLoader
    if (!contentLoader.data) {
        await contentLoader.load();
    }

    // Get education data
    educationData = contentLoader.getEducation() || [];

    // Update panel texts with education data
    const panels = document.querySelectorAll('.journey-panel');
    panels.forEach((panel, index) => {
        if (educationData[index]) {
            const edu = educationData[index];
            const textEl = panel.querySelector('.panel-text');
            if (textEl) {
                textEl.textContent = edu.degree || `Education ${index + 1}`;
            }
        }

        // Add click handler
        panel.addEventListener('click', () => selectPanel(index));
    });

    // Set first panel as active
    selectPanel(0);
}

function selectPanel(index) {
    // Remove active class from all panels
    document.querySelectorAll('.journey-panel').forEach(p => {
        p.classList.remove('active');
    });

    // Add active class to selected panel
    const panels = document.querySelectorAll('.journey-panel');
    if (panels[index]) {
        panels[index].classList.add('active');
    }

    // Update info display
    if (educationData[index]) {
        updateInfoDisplay(educationData[index]);
    }
}

function updateInfoDisplay(edu) {
    const titleEl = document.getElementById('info-title');
    const textEl = document.getElementById('info-text');

    if (titleEl) titleEl.textContent = edu.school || '';
    if (textEl) textEl.textContent = `${edu.degree} • ${edu.years}` || '';
}

// Update panels when language changes
document.addEventListener('DOMContentLoaded', () => {
    initJourneyPanels();

    // Hook into language change
    const originalSetLanguage = window.setLanguage;
    if (originalSetLanguage) {
        window.setLanguage = function(lang) {
            originalSetLanguage.call(this, lang);
            contentLoader.setLanguage(lang);
            initJourneyPanels();
        };
    }
});

// Fallback initialization
if (document.readyState !== "loading") {
    initJourneyPanels();
}
