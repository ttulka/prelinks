export default class Loader {
    constructor(document, loader, history) {
        this.document = document;
        this.pages = new Map();
        this.loading = new Set();
    }
    async load(href) {
        if (!this.loading.has(href) && !this.pages.has(href)) {
            this.loading.add(href);
            
            const html = await fetch(href)
                .then(r => r.text())
                .then(r => new DOMParser().parseFromString(r, 'text/html'));
            this.pages.set(href, html);            
            
            this.loading.delete(href);
            console.debug('Loaded', href);
        }
    }
    async show(href) {
        if (!this.pages.has(href)) {
            await this.load(href);
        }
        const body = this.pages.get(href).querySelector('body');
        this.document.body.innerHTML = body.innerHTML;
        console.debug('Showing', href)
    }
}