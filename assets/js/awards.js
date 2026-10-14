// Awards & Distinctions - trophy wall and detail modal
let allAwards = [];

// Fraction of a viewport-height of scroll it takes for a plaque to go from just
// entering the screen to fully revealed. Each plaque tracks its own position, so
// the reveal naturally cascades row by row regardless of how many awards there are
// or how the grid wraps.
const AWARD_REVEAL_RANGE = 0.55;

async function loadAwards() {
    if (!contentLoader.data) {
        await contentLoader.load();
    }

    allAwards = contentLoader.getAwards();
    displayAwardsWall(allAwards);
}

function displayAwardsWall(awards) {
    const wall = document.getElementById('awards-wall');
    if (!wall) return;

    wall.innerHTML = '';

    awards.forEach((award, index) => {
        const photo = award.photos && award.photos[0] ? award.photos[0] : '';

        const plaque = document.createElement('div');
        plaque.className = 'award-plaque';
        plaque.innerHTML = `
            <div class="award-plaque-photo">
                <img src="${photo}" alt="${award.name}">
                <span class="award-plaque-year">${award.year}</span>
            </div>
            <div class="award-plaque-name">${award.name}</div>
        `;

        plaque.addEventListener('click', () => openAwardModal(index));
        wall.appendChild(plaque);
    });

    // Set the correct initial state right away, without waiting for a scroll event
    updateAwardsReveal();
}

// Continuously reveal each plaque based on its own position in the viewport
function updateAwardsReveal() {
    const wall = document.getElementById('awards-wall');
    if (!wall) return;

    const viewportHeight = window.innerHeight;

    wall.querySelectorAll('.award-plaque').forEach((plaque) => {
        const rect = plaque.getBoundingClientRect();

        let progress = (viewportHeight - rect.top) / (viewportHeight * AWARD_REVEAL_RANGE);
        progress = Math.max(0, Math.min(1, progress));

        const translateY = (1 - progress) * 40;
        const scale = 0.9 + progress * 0.1;

        plaque.style.opacity = String(progress);
        plaque.style.transform = `translateY(${translateY}px) scale(${scale})`;
    });
}

// Wire the scroll/resize listeners once (persistent, unlike the wall's content
// which gets rebuilt on every language change)
function initAwardsScrollReveal() {
    window.addEventListener('scroll', updateAwardsReveal, { passive: true });
    window.addEventListener('resize', updateAwardsReveal);
}

function openAwardModal(index) {
    const modal = document.getElementById('award-modal');
    const modalContent = document.getElementById('award-modal-content');
    const award = allAwards[index];

    if (!modal || !modalContent || !award) return;

    const photos = award.photos && award.photos.length > 0 ? award.photos : [''];

    const thumbsHTML = photos.length > 1
        ? `
            <div class="award-modal-thumbs">
                ${photos.map((photo, i) => `
                    <div class="award-modal-thumb${i === 0 ? ' active' : ''}" data-photo="${photo}">
                        <img src="${photo}" alt="${award.name} - photo ${i + 1}">
                    </div>
                `).join('')}
            </div>
        `
        : '';

    const linkHTML = award.link
        ? `
            <div class="modal-project-link">
                <a href="${award.link}" target="_blank" rel="noopener noreferrer" class="btn-project-link">
                    Voir la publication →
                </a>
            </div>
        `
        : '';

    modalContent.innerHTML = `
        <div class="award-modal-close" onclick="closeAwardModal()">×</div>
        <div class="award-modal-photo">
            <img src="${photos[0]}" alt="${award.name}">
        </div>
        ${thumbsHTML}
        <span class="award-modal-year">${award.year}</span>
        <h2 class="award-modal-name">${award.name}</h2>
        ${award.organizer ? `<p class="modal-theme">${award.organizer}</p>` : ''}
        <p class="award-modal-description">${award.description}</p>
        ${linkHTML}
    `;

    // Swap the main photo when a thumbnail is clicked
    modalContent.querySelectorAll('.award-modal-thumb').forEach((thumb) => {
        thumb.addEventListener('click', () => {
            modalContent.querySelector('.award-modal-photo img').src = thumb.dataset.photo;
            modalContent.querySelectorAll('.award-modal-thumb').forEach((t) => t.classList.remove('active'));
            thumb.classList.add('active');
        });
    });

    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
}

function closeAwardModal() {
    const modal = document.getElementById('award-modal');
    if (modal) {
        modal.classList.remove('is-open');
        document.body.style.overflow = 'auto';
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAwardModal();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    initAwardsScrollReveal();
    loadAwards();

    const originalSetLanguage = window.setLanguage;
    window.setLanguage = function (lang) {
        originalSetLanguage.call(this, lang);
        contentLoader.setLanguage(lang);
        loadAwards();
    };
});

if (document.readyState !== 'loading') {
    initAwardsScrollReveal();
    loadAwards();
}
