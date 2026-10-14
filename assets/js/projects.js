// Projects Carousel (card fan) and Modal Management
let allProjects = [];
let fanIndex = -1; // -1 = not yet initialized; set to the middle project on first load
let fanOpenness = 0; // 0 = closed flat stack, 1 = fully fanned out (driven by scroll position)

const FAN_MAX_VISIBLE = 4;      // cards shown on each side of the active one
const DRAG_CLICK_THRESHOLD = 6; // px of movement before a press counts as a drag
const FAN_STEP_RATIO = 0.34;    // card-width fraction used as the spacing between two fan positions

// How many card-widths wide a step is, based on the currently rendered card size
function getFanStepPx() {
    const card = document.querySelector('#projects-gallery .project-card');
    const cardWidth = card ? card.getBoundingClientRect().width : 300;
    return cardWidth * FAN_STEP_RATIO;
}

// How "open" the fan should be, based on how close the Projects section is to the
// center of the viewport: cards fan out as it scrolls into focus, and collapse back
// into a flat stack as it scrolls away (entering from below or leaving above) — an
// appear/disappear animation shaped around the card stack itself rather than a plain
// fade or translation.
function updateFanOpenness() {
    const section = document.getElementById('projects');
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const viewportCenter = window.innerHeight / 2;
    const sectionCenter = rect.top + rect.height / 2;
    const maxDistance = (window.innerHeight + rect.height) / 2;

    let progress = maxDistance > 0 ? 1 - Math.abs(sectionCenter - viewportCenter) / maxDistance : 1;
    progress = Math.max(0, Math.min(1, progress));

    // Ease (smoothstep) for a more natural open/close feel than a linear ramp.
    fanOpenness = progress * progress * (3 - 2 * progress);
    layoutFanCards(0);
}

// Load and display projects
async function loadProjects() {
    // Wait for contentLoader
    if (!contentLoader.data) {
        await contentLoader.load();
    }

    // Get projects from content.json
    const projects = contentLoader.getContent('projects') || [];
    const projectsMore = contentLoader.getContent('projectsMore') || [];

    allProjects = [...projects, ...projectsMore];

    // Display all projects in the carousel
    displayProjectsGallery(allProjects);
}

// Display projects in the fan carousel
function displayProjectsGallery(projects) {
    const gallery = document.getElementById('projects-gallery');
    const dotsContainer = document.getElementById('projects-dots');
    if (!gallery) return;

    gallery.innerHTML = '';
    if (dotsContainer) dotsContainer.innerHTML = '';

    projects.forEach((project, i) => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.dataset.index = String(i);
        projectCard.innerHTML = `
            <div class="project-image-container">
                <img src="${project.image}" alt="${project.title}" class="project-image" draggable="false">
                <div class="project-overlay">
                    <span class="project-view-more">Voir plus</span>
                </div>
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p class="project-theme">${project.theme}</p>
            </div>
        `;
        gallery.appendChild(projectCard);

        if (dotsContainer) {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'projects-dot';
            dot.setAttribute('aria-label', `Aller au projet ${i + 1}`);
            dot.addEventListener('click', () => goToProject(i));
            dotsContainer.appendChild(dot);
        }
    });

    // Center on the middle project the first time the carousel loads; keep the
    // current position across later re-renders (e.g. a language change).
    fanIndex = fanIndex === -1
        ? Math.floor(projects.length / 2)
        : ((fanIndex % projects.length) + projects.length) % projects.length;

    layoutFanCards(0);
}

// Position every card in the fan based on its (possibly fractional) distance from the
// active index. `dragOffset` is a continuous number of fan-steps (not pixels): while
// dragging, each card keeps rotating/curving along its own fan path instead of the
// whole stack sliding sideways as a block. The carousel loops: a card's distance from
// the center always takes the shortest path around the loop, so there is no first or
// last card to get stuck against.
function layoutFanCards(dragOffset = 0) {
    const gallery = document.getElementById('projects-gallery');
    if (!gallery) return;

    const cards = gallery.querySelectorAll('.project-card');
    const total = cards.length;
    if (total === 0) return;

    const cardWidth = cards[0].getBoundingClientRect().width || 300;
    const xStep = cardWidth * FAN_STEP_RATIO;
    const angleStep = 9; // degrees per fan-step away from center
    const yCurve = cardWidth * 0.05;
    const scaleStep = 0.07;

    cards.forEach((card, i) => {
        let offset = (i - fanIndex) - dragOffset;
        // Wrap to the shortest signed distance around the loop (e.g. with 12 cards,
        // an offset of 7 becomes -5: it's closer going the other way around).
        offset -= total * Math.round(offset / total);
        const abs = Math.abs(offset);
        const rotate = offset * angleStep * fanOpenness;
        const translateX = offset * xStep * fanOpenness;
        const focusLift = Math.max(0, 1 - abs) * cardWidth * 0.04 * fanOpenness; // smoothly pops up near center
        const translateY = (Math.pow(abs, 1.3) * yCurve * fanOpenness) - focusLift;
        const scale = Math.max(1 - abs * scaleStep * fanOpenness, 0.72);
        const visible = abs <= FAN_MAX_VISIBLE;
        const opacity = !visible ? 0 : (abs >= FAN_MAX_VISIBLE ? 0.25 : 1);

        card.style.transform =
            `translate(-50%, -50%) translate(${translateX}px, ${translateY}px) rotate(${rotate}deg) scale(${scale})`;
        card.style.zIndex = String(Math.round(200 - abs));
        card.style.opacity = String(opacity);
        card.style.pointerEvents = visible ? 'auto' : 'none';
        card.classList.toggle('is-active', abs < 0.5);
    });

    updateProjectsDotsAndNav();
}

// Sync dot indicators with the active index (no arrow disabled state: the carousel loops)
function updateProjectsDotsAndNav() {
    const dotsContainer = document.getElementById('projects-dots');

    if (dotsContainer) {
        dotsContainer.querySelectorAll('.projects-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === fanIndex);
        });
    }
}

// Move the active card to a given index, animated via the card's CSS transition.
// The index wraps around in both directions, so there is no first or last card.
function goToProject(index) {
    const gallery = document.getElementById('projects-gallery');
    const total = gallery ? gallery.querySelectorAll('.project-card').length : 0;
    if (total === 0) return;

    fanIndex = ((index % total) + total) % total;
    layoutFanCards(0);
}

// Wire up drag-to-slide and the prev/next arrows (persistent elements, set up once)
function initProjectsCarousel() {
    const gallery = document.getElementById('projects-gallery');
    const prevBtn = document.getElementById('projects-prev');
    const nextBtn = document.getElementById('projects-next');
    if (!gallery) return;

    let pointerId = null;
    let startX = 0;
    let lastDeltaX = 0;
    let isDragging = false;
    let pressedCard = null;

    function onPointerMove(e) {
        if (e.pointerId !== pointerId) return;
        const deltaX = e.clientX - startX;

        if (!isDragging && Math.abs(deltaX) > DRAG_CLICK_THRESHOLD) {
            isDragging = true;
            gallery.classList.add('is-dragging');
        }

        if (isDragging) {
            lastDeltaX = deltaX;
            // Dragging left (negative delta) rotates the fan towards the next cards,
            // so the whole fan turns continuously instead of sliding as a flat block.
            layoutFanCards(-deltaX / getFanStepPx());
        }
    }

    function onPointerUp(e) {
        if (e.pointerId !== pointerId) return;

        gallery.removeEventListener('pointermove', onPointerMove);
        gallery.removeEventListener('pointerup', onPointerUp);
        gallery.removeEventListener('pointercancel', onPointerUp);
        try { gallery.releasePointerCapture(pointerId); } catch (err) { /* noop */ }
        gallery.classList.remove('is-dragging');

        if (isDragging) {
            const stepPx = getFanStepPx();

            // Snap to the nearest card: round the fan rotation to the closest whole step.
            let steps = Math.round(-lastDeltaX / stepPx);
            if (steps === 0 && Math.abs(lastDeltaX) > DRAG_CLICK_THRESHOLD) {
                steps = lastDeltaX < 0 ? 1 : -1;
            }

            goToProject(fanIndex + steps);
        } else if (pressedCard) {
            const index = Number(pressedCard.dataset.index);
            if (index === fanIndex) {
                openProjectModal(allProjects[index]);
            } else {
                goToProject(index);
            }
        }

        pointerId = null;
        isDragging = false;
        lastDeltaX = 0;
        pressedCard = null;
    }

    gallery.addEventListener('pointerdown', (e) => {
        pressedCard = e.target.closest('.project-card');
        if (!pressedCard) return;

        pointerId = e.pointerId;
        startX = e.clientX;
        lastDeltaX = 0;
        isDragging = false;

        try { gallery.setPointerCapture(pointerId); } catch (err) { /* noop */ }
        gallery.addEventListener('pointermove', onPointerMove);
        gallery.addEventListener('pointerup', onPointerUp);
        gallery.addEventListener('pointercancel', onPointerUp);
    });

    if (prevBtn) prevBtn.addEventListener('click', () => goToProject(fanIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToProject(fanIndex + 1));

    window.addEventListener('scroll', updateFanOpenness, { passive: true });
    window.addEventListener('resize', updateFanOpenness);
    updateFanOpenness();
}

// Open project modal (fullscreen)
function openProjectModal(project) {
    const modal = document.getElementById('project-modal');
    const modalContent = document.getElementById('project-modal-content');

    if (!modal || !modalContent) return;

    // Build modal content
    let mediaHTML = '';
    if (project.video) {
        mediaHTML = `<video controls class="project-video" src="${project.video}"></video>`;
    } else {
        mediaHTML = `<img src="${project.image}" alt="${project.title}" class="project-modal-image">`;
    }

    let projectUrlHTML = '';
    if (project.projectUrl) {
        projectUrlHTML = `
            <div class="modal-project-link">
                <a href="${project.projectUrl}" target="_blank" class="btn-project-link">
                    Visiter le projet →
                </a>
            </div>
        `;
    }

    modalContent.innerHTML = `
        <div class="modal-close" onclick="closeProjectModal()">×</div>
        <div class="modal-media">
            ${mediaHTML}
        </div>
        <div class="modal-details">
            <h2>${project.title}</h2>
            <p class="modal-theme"><strong>Thématique:</strong> ${project.theme}</p>
            <p class="modal-description">${project.description}</p>
            <div class="modal-info-grid">
                <div class="modal-info-item">
                    <strong>Mon rôle:</strong>
                    <p>${project.role}</p>
                </div>
                <div class="modal-info-item">
                    <strong>Durée:</strong>
                    <p>${project.duration}</p>
                </div>
            </div>
            ${project.skills && project.skills.length > 0 ? `
                <div class="modal-skills">
                    <strong>Compétences:</strong>
                    <div class="skill-tags">
                        ${project.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
            ` : ''}
            ${projectUrlHTML}
        </div>
    `;

    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

// Close project modal
function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    if (modal) {
        modal.classList.remove('is-open');
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }
}

// Close modal when pressing Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProjectModal();
    }
});

// Update projects when language changes
document.addEventListener('DOMContentLoaded', () => {
    initProjectsCarousel();
    loadProjects();

    // Update projects when language changes
    const originalSetLanguage = window.setLanguage;
    window.setLanguage = function(lang) {
        originalSetLanguage.call(this, lang);
        contentLoader.setLanguage(lang);
        loadProjects();
    };
});

// Fallback initialization
if (document.readyState !== "loading") {
    initProjectsCarousel();
    loadProjects();
}
