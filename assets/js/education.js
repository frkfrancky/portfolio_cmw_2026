// Education Comic Board - single board, content swaps only on Prev/Next click
// (no scroll-driven interaction of any kind, so the page's vertical scroll is
// never intercepted).
document.addEventListener("DOMContentLoaded", () => {
    const prevBtn = document.getElementById("education-prev");
    const nextBtn = document.getElementById("education-next");
    const board = document.getElementById("comic-board");
    // Every text panel (school/degree, year, country) fades the same way on
    // Prev/Next. The title never animates, and the image panel has its own
    // dedicated layer-settle animation in education-parallax.js instead.
    const fadingPanels = board
        ? Array.from(board.querySelectorAll(".comic-panel")).filter(
            (panel) => !panel.classList.contains("comic-panel-title") &&
                       !panel.classList.contains("comic-panel-image")
        )
        : [];

    const schoolEl = document.getElementById("education-school");
    const degreeEl = document.getElementById("education-degree");
    const yearEl = document.getElementById("education-year");
    const countryEl = document.getElementById("education-country");
    const flagEl = document.getElementById("education-flag");

    if (!prevBtn || !nextBtn) return;

    let educationData = [];
    let currentIndex = 0;

    async function initializeEducationData() {
        const education = contentLoader.getEducation();
        if (education) {
            educationData = education;
        }
        return educationData;
    }

    async function initializeAndShow() {
        await initializeEducationData();
        showEducation(currentIndex, { instant: true });
    }

    if (contentLoader.data) {
        initializeAndShow();
    } else {
        setTimeout(initializeAndShow, 100);
    }

    function updateNavButtons() {
        prevBtn.disabled = currentIndex <= 0;
        nextBtn.disabled = currentIndex >= educationData.length - 1;
    }

    function fillPanels(entry) {
        schoolEl.textContent = entry.school;
        degreeEl.textContent = entry.degree;
        yearEl.textContent = entry.years;
        countryEl.textContent = entry.country || '';
        flagEl.textContent = entry.countryFlag || '';
    }

    function showEducation(index, { instant = false } = {}) {
        const entry = educationData[index];
        if (!entry) return;

        currentIndex = index;
        updateNavButtons();

        if (typeof updateEducationParallax === 'function') {
            updateEducationParallax(index);
        }

        if (instant || fadingPanels.length === 0) {
            fillPanels(entry);
            return;
        }

        // Every panel but the title crossfades together, no movement - the
        // image panel also plays its own layer settle animation in parallel
        // (see education-parallax.js).
        fadingPanels.forEach((panel) => {
            panel.style.transition = 'opacity 0.2s ease';
            panel.style.opacity = '0';
        });

        setTimeout(() => {
            fillPanels(entry);
            fadingPanels.forEach((panel) => {
                panel.style.opacity = '1';
            });
        }, 200);
    }

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) showEducation(currentIndex - 1);
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < educationData.length - 1) showEducation(currentIndex + 1);
    });

    // Entrance "fragmented assembly": same IntersectionObserver + continuous
    // scroll-progress technique as the hero text (scroll-animation.js), but
    // each panel converges from its own direction (--frag-x/--frag-y in CSS)
    // instead of a uniform translateY, so the shapes read as reassembling.
    const section = document.getElementById('education');
    if (section && board) {
        const fragPanels = Array.from(board.querySelectorAll('.comic-panel')).map((panel) => {
            const style = getComputedStyle(panel);
            return {
                panel,
                x: parseFloat(style.getPropertyValue('--frag-x')) || 0,
                y: parseFloat(style.getPropertyValue('--frag-y')) || 0,
            };
        });

        // A low threshold here matters: EARLY_FINISH below already shortens
        // how much scroll distance the animation gets to play out over, so
        // triggering late (e.g. the 0.3 threshold used elsewhere on the
        // site) would eat most of that distance before anything starts -
        // this needs to start almost as soon as the section is in view.
        const entranceObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                entry.target.classList.toggle('in-view', entry.isIntersecting);
            });
        }, { threshold: 0 });

        entranceObserver.observe(section);

        // How far down the viewport the section's top can still be when the
        // assembly is considered "done" (as a fraction of viewport height).
        // 0 would mean waiting for the top to reach the very top of the
        // screen (too late - scrolled well past comfortable viewing);
        // finishing once the top has reached 42% down feels right instead.
        const EARLY_FINISH = 0.42;

        window.addEventListener('scroll', () => {
            if (!section.classList.contains('in-view')) return;

            const rect = section.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const scrollProgress = Math.max(
                0,
                Math.min(1, (viewportHeight - rect.top) / (viewportHeight * (1 - EARLY_FINISH)))
            );

            // Desktop keeps a small permanent spread once settled; on mobile
            // the panels snap fully back to their exact original spot.
            const isMobile = window.innerWidth <= 768;
            const remainingFloor = isMobile ? 0 : 0.08;
            const remaining = Math.max(remainingFloor, 1 - scrollProgress);

            fragPanels.forEach(({ panel, x, y }) => {
                panel.style.opacity = String(Math.min(1, scrollProgress * 1.5));
                panel.style.transform = `translate(${x * remaining}px, ${y * remaining}px)`;
            });
        }, { passive: true });
    }
});
