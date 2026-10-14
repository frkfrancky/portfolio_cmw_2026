// Hero Section Parallax Animation
let scrollPercentage = 0;
let intensity = 1;
let sensitivityMultiplier = 1; // Dynamic multiplier based on document height

// Reference height for baseline sensitivity (adjust if needed)
const REFERENCE_DOC_HEIGHT = 5000;

function calculateSensitivityMultiplier() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    // As document height increases, increase sensitivity proportionally
    sensitivityMultiplier = Math.max(1, docHeight / REFERENCE_DOC_HEIGHT);
}

// Calculate on load and on resize
calculateSensitivityMultiplier();
window.addEventListener('resize', calculateSensitivityMultiplier);

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollPercentage = (scrollTop / docHeight) * 100;

    // Image
    const imgWrap = document.getElementById('imgWrap');
    if (imgWrap) {
        imgWrap.style.transform = `translateY(${scrollPercentage * 18 * intensity * sensitivityMultiplier}px)`;
    }

    // Nom avant-plan
    const name1 = document.getElementById('name1');
    if (name1) {
        name1.style.transform = `translateY(${scrollPercentage * 14 * intensity * sensitivityMultiplier}px)`;
    }

    // Nom arrière-plan
    const name2 = document.getElementById('name2');
    if (name2) {
        name2.style.transform = `translateY(${scrollPercentage * 14 * intensity * sensitivityMultiplier}px)`;
    }

    // Prénom
    const surname2 = document.getElementById('surname2');
    if (surname2) {
        surname2.style.transform = `translateX(${scrollPercentage * 12 * intensity * sensitivityMultiplier}px)`;
    }

    // Silhouette image - driven by its own section's position in the viewport,
    // not the whole-page scroll percentage, so it never drifts out of sync
    // depending on how long the rest of the page is (e.g. journey hidden or not).
    // Progress goes from 0 (section just entering the bottom of the screen - neutral
    // position, not pre-shifted) to 1 (section has fully scrolled past, i.e. its
    // bottom edge has reached the top of the screen). The wrap spans the section's
    // full height, so using the section's whole pass-through here (rather than just
    // one viewport height) keeps the image moving for as long as it stays on screen,
    // instead of freezing partway through a tall section.
    const silhouetteWrap = document.getElementById('silhouette-wrap');
    const skillsSection = document.getElementById('skills');
    if (silhouetteWrap && skillsSection) {
        const rect = skillsSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const total = rect.height + viewportHeight;
        let sectionProgress = total > 0 ? (viewportHeight - rect.top) / total : 0;
        sectionProgress = Math.max(0, Math.min(1, sectionProgress));

        const SILHOUETTE_RANGE_PX = 200; // total travel distance across the section's full pass through view
        silhouetteWrap.style.transform = `translateY(${sectionProgress * SILHOUETTE_RANGE_PX}px)`;
    }
});
