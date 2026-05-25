// Journey Section - Parallax layer animation for images
class JourneyParallax {
    constructor() {
        this.currentIndex = -1;
        this.currentSVG = null;
        this.educationCount = 5; // Number of education levels
        this.imageContainer = document.getElementById('journey-images');
    }

    async loadSVG(index) {
        if (index < 0 || index >= this.educationCount) return;
        if (this.currentIndex === index) return;

        const imageName = `place${index + 1}`;
        const svgPath = `assets/image/${imageName}.svg`;

        try {
            const response = await fetch(svgPath);
            const svgText = await response.text();
            this.imageContainer.innerHTML = svgText;
            this.currentSVG = this.imageContainer.querySelector('svg');

            // Style the SVG to fill container (1:1, crop width from 16:9)
            if (this.currentSVG) {
                this.currentSVG.style.height = '100%';
                this.currentSVG.style.width = 'auto';
                this.currentSVG.style.minHeight = '100%';
                this.currentSVG.style.display = 'block';
                this.currentSVG.removeAttribute('preserveAspectRatio');
                this.currentSVG.setAttribute('preserveAspectRatio', 'xMidYMid slice');

                // Apply Fade + Slide transition
                this.currentSVG.style.opacity = '0';
                this.currentSVG.style.transform = 'translateX(30px)';
                this.currentSVG.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';

                // Trigger animation after a small delay
                setTimeout(() => {
                    this.currentSVG.style.opacity = '1';
                    this.currentSVG.style.transform = 'translateX(0)';
                }, 50);
            }

            this.currentIndex = index;
        } catch (error) {
            console.error(`Error loading ${svgPath}:`, error);
        }
    }

    updateParallax(scrollRatio) {
        if (!this.currentSVG) return;

        // Get all layers (groups) in the SVG
        // Searches for: data-layer attribute, or g IDs starting with 'layer' or '_x' (Adobe format)
        const layers = this.currentSVG.querySelectorAll('[data-layer], g[id^="layer"], g[id^="_x"]');

        if (layers.length === 0) {
            console.warn('No layers found in SVG. Expected elements with data-layer, g[id^="layer"], or g[id^="_x"]');
            return;
        }

        layers.forEach((layer, index) => {
            // Calculate sensitivity based on layer depth
            // Layer 0 (top/foreground) = most sensitive, Layer N (bottom/background) = least sensitive
            // Formula: sensitivity decreases as layer number increases
            const maxLayers = layers.length;
            const sensitivity = (maxLayers - index) / maxLayers;

            // Apply parallax transform from right to left
            // scrollRatio goes from 0 to 1
            const translateAmount = scrollRatio * 200 * sensitivity; // 200px max movement

            layer.style.transform = `translateX(${translateAmount}px)`;
            // Uncomment for debugging:
            // console.log(`Layer ${index}: sensitivity=${sensitivity.toFixed(2)}, translate=${translateAmount.toFixed(0)}px`);
        });
    }
}

// Initialize journey parallax
const journeyParallax = new JourneyParallax();

// Load initial image
journeyParallax.loadSVG(0);

// This will be called from journey.js in the scroll event
window.updateJourneyParallax = function(scrollRatio, educationIndex) {
    // Load the appropriate image based on education index
    journeyParallax.loadSVG(educationIndex);

    // Update parallax animation based on scroll ratio within this education section
    journeyParallax.updateParallax(scrollRatio);
};
