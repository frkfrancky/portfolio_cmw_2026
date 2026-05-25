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

    // Silhouette image - less sensitive to scroll
    const silhouetteWrap = document.getElementById('silhouette-wrap');
    if (silhouetteWrap) {
        silhouetteWrap.style.transform = `translateY(${scrollPercentage * 10 * intensity * sensitivityMultiplier}px)`;
    }
});
