// Education Comic Board - parallax layer animation for the image panel.
//
// Two things drive the layers' offset, never at the same time:
// 1. On image change (Prev/Next click): a settle-in animation - every layer
//    starts offset by a different amount (deeper layers move less) and
//    settles to rest at a slightly different pace, so the staggered arrival
//    between layers reads as depth.
// 2. At rest: a light mouse-parallax - layers drift a few pixels based on
//    cursor position over the board, deeper layers moving less, for a subtle
//    interactive depth effect. This stays off while a settle animation is
//    still playing so the two never fight over the same transform.
class EducationParallax {
    constructor() {
        this.currentIndex = -1;
        this.currentSVG = null;
        this.layers = [];
        this.educationCount = 6;
        this.imageContainer = document.getElementById('education-images');
        this.isSettling = false;
        this.mouseX = 0; // -1 .. 1
        this.mouseY = 0; // -1 .. 1
    }

    async loadSVG(index) {
        if (index < 0 || index >= this.educationCount) return;
        if (this.currentIndex === index) return;
        if (!this.imageContainer) return;

        const imageName = `place${index + 1}`;
        const svgPath = `assets/image/${imageName}.svg`;

        try {
            const response = await fetch(svgPath);
            let svgText = await response.text();

            svgText = svgText.replace(/xlink:href="([^"]+)"/g, (match, href) => {
                if (!href.startsWith('./') && !href.startsWith('/') && !href.startsWith('data:')) {
                    return `xlink:href="assets/image/${href}"`;
                }
                return match;
            });

            this.imageContainer.innerHTML = svgText;
            this.currentSVG = this.imageContainer.querySelector('svg');
            this.layers = [];

            if (this.currentSVG) {
                this.currentSVG.style.height = '100%';
                this.currentSVG.style.width = 'auto';
                this.currentSVG.style.minHeight = '100%';
                this.currentSVG.style.display = 'block';
                this.currentSVG.removeAttribute('preserveAspectRatio');
                this.currentSVG.setAttribute('preserveAspectRatio', 'xMidYMid slice');

                this.currentSVG.style.opacity = '0';
                this.currentSVG.style.transition = 'opacity 0.4s ease-out';

                this.layers = Array.from(
                    this.currentSVG.querySelectorAll('[data-layer], g[id^="layer"], g[id^="_x"]')
                );
                const maxLayers = this.layers.length;

                this.isSettling = true;

                this.layers.forEach((layer, i) => {
                    const sensitivity = maxLayers > 0 ? (maxLayers - i) / maxLayers : 0;
                    layer.style.transition = 'none';
                    layer.style.transform = `translate(${60 * sensitivity}px, 0px)`;
                });

                // Longest per-layer transition is 0.5 + 1 * 0.35 = 0.85s (sensitivity maxes at 1)
                const settleDuration = maxLayers > 0 ? 0.85 : 0.4;

                requestAnimationFrame(() => {
                    this.currentSVG.style.opacity = '1';

                    this.layers.forEach((layer, i) => {
                        const sensitivity = maxLayers > 0 ? (maxLayers - i) / maxLayers : 0;
                        layer.style.transition = `transform ${0.5 + sensitivity * 0.35}s cubic-bezier(0.22, 0.85, 0.3, 1)`;
                        layer.style.transform = 'translate(0px, 0px)';
                    });
                });

                setTimeout(() => {
                    this.isSettling = false;
                    this.layers.forEach((layer) => {
                        layer.style.transition = 'transform 0.2s ease-out';
                    });
                    this.applyMouseParallax();
                }, settleDuration * 1000 + 50);
            }

            this.currentIndex = index;
        } catch (error) {
            console.error(`Error loading ${svgPath}:`, error);
        }
    }

    setMousePosition(x, y) {
        this.mouseX = x;
        this.mouseY = y;
        this.applyMouseParallax();
    }

    applyMouseParallax() {
        if (this.isSettling || this.layers.length === 0) return;

        const maxLayers = this.layers.length;
        this.layers.forEach((layer, i) => {
            const sensitivity = (maxLayers - i) / maxLayers;
            const x = this.mouseX * 34 * sensitivity;
            const y = this.mouseY * 22 * sensitivity;
            layer.style.transform = `translate(${x}px, ${y}px)`;
        });
    }
}

const educationParallax = new EducationParallax();
educationParallax.loadSVG(0);

window.updateEducationParallax = function (index) {
    educationParallax.loadSVG(index);
};

// Light mouse-parallax over the image layers: tracked across the whole
// window (not just while hovering the board itself), normalized against the
// viewport, so the effect keeps reacting even with the cursor well outside
// the board's own shapes.
document.addEventListener('DOMContentLoaded', () => {
    let ticking = false;
    let pendingX = 0;
    let pendingY = 0;

    window.addEventListener('mousemove', (e) => {
        pendingX = (e.clientX / window.innerWidth - 0.5) * 2;
        pendingY = (e.clientY / window.innerHeight - 0.5) * 2;

        if (!ticking) {
            window.requestAnimationFrame(() => {
                educationParallax.setMousePosition(pendingX, pendingY);
                ticking = false;
            });
            ticking = true;
        }
    });
});
