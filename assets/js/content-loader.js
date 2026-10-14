// Load and manage dynamic content from JSON
class ContentLoader {
    constructor(jsonPath = 'assets/data/content.json') {
        this.jsonPath = jsonPath;
        this.data = null;
        this.currentLanguage = 'fr';
    }

    async load() {
        try {
            const response = await fetch(this.jsonPath);
            this.data = await response.json();
            return this.data;
        } catch (error) {
            console.error('Error loading content.json:', error);
            return null;
        }
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
    }

    getContent(section) {
        if (!this.data) return null;
        return this.data[this.currentLanguage]?.[section] || null;
    }

    getEducation() {
        return this.getContent('education');
    }

    getSkills() {
        return this.getContent('skills');
    }

    getProjects() {
        return this.getContent('projects');
    }

    getHero() {
        return this.getContent('hero');
    }

    getContact() {
        return this.getContent('contact');
    }

    getAwards() {
        return this.getContent('awards') || [];
    }

    getLabels() {
        return this.getContent('labels') || {};
    }

    // Partners/logos are language-independent, stored at the root of content.json
    // (not under fr/en/kr), so this reads this.data directly instead of going
    // through getContent(), which is scoped to the current language.
    getPartners() {
        return this.data?.partners || [];
    }
}

// Initialize content loader
const contentLoader = new ContentLoader();
contentLoader.load();
