// Journey Section - Simple Sticky like the example
const journeySection = document.getElementById('journey');
const educationCards = document.querySelectorAll('.education-card');
const ac1Svg = document.getElementById('ac1-svg');
const journeyProgress_container = document.querySelector('.journey-progress');

const totalEducationPoints = educationCards.length;
let currentCardIndex = 0;
let stickyTop = journeySection.offsetTop;
let stickyStartScroll = 0;

// Recalculate stickyTop on window resize to handle responsive layout changes
window.addEventListener('resize', () => {
    stickyTop = journeySection.offsetTop;
});

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
    if (!journeySection) return;

    // Simple sticky logic like the example
    if (window.pageYOffset > stickyTop) {
        if (!journeySection.classList.contains('sticky')) {
            journeySection.classList.add('sticky');
        }

        // Animate SVG based on scroll within the sticky section (like rasataharisoa)
        const scrollDelta = window.pageYOffset - stickyTop;
        updateSvgPosition(scrollDelta);
    } else {
        if (journeySection.classList.contains('sticky')) {
            journeySection.classList.remove('sticky');
        }
        updateSvgPosition(0);
    }
}, { passive: true });

// Initialize
if (educationCards.length > 0) {
    updateEducationCard(0);
}
