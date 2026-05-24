// Journey Section - Sticky with SVG animation
const journeySection = document.getElementById('journey');
const stickyContainer = document.getElementById('sticky-container');
const educationCards = document.querySelectorAll('.education-card');
const ac1Svg = document.getElementById('ac1-svg');
const journeyProgress_container = document.querySelector('.journey-progress');

const totalEducationPoints = educationCards.length;
let currentCardIndex = 0;

function updateEducationCard(index) {
    educationCards.forEach(card => {
        card.classList.remove('active', 'prev');
    });

    if (index >= 0 && index < totalEducationPoints) {
        educationCards[index].classList.add('active');
        for (let i = 0; i < index; i++) {
            educationCards[i].classList.add('prev');
        }
    }

    currentCardIndex = index;
}

function updateSvgPosition(scrollAmount) {
    if (!ac1Svg) return;

    // Use scrollAmount directly with translateX (like rasataharisoa)
    ac1Svg.style.transform = `translateX(${scrollAmount}px)`;

    // Update education cards based on scroll
    const cardProgress = scrollAmount * 0.002; // Adjust for card changes
    const newCardIndex = Math.min(Math.floor(cardProgress), totalEducationPoints - 1);

    if (newCardIndex !== currentCardIndex) {
        updateEducationCard(newCardIndex);
    }
}

window.addEventListener('scroll', () => {
    if (!stickyContainer) return;

    const containerRect = stickyContainer.getBoundingClientRect();

    // Distance qu'on peut scroller à l'intérieur du conteneur
    const scrollableDistance = containerRect.height - window.innerHeight;

    // Pixels déjà scrollés
    const scrolledInContainer = -containerRect.top;

    // Ratio entre 0 et 1
    let scrollRatio = scrolledInContainer / scrollableDistance;
    scrollRatio = Math.max(0, Math.min(1, scrollRatio));

    // Animate SVG based on scroll progress through the sticky container
    const scrollAmount = scrollRatio * 1000; // Ajuste ce multiplicateur si besoin
    updateSvgPosition(scrollAmount);
}, { passive: true });

// Initialize
if (educationCards.length > 0) {
    updateEducationCard(0);
}
