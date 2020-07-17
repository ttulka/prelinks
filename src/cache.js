export default class PageCache {
    constructor(document) {
        this.document = document;
        this.pages = new Map();
        this.loading = new Set();
        
        console.debug('PageCache constructed.');
    }
    async load(link, force = false) {
        if (force || !this.loading.has(link) && !this.pages.has(link)) {
            this.loading.add(link);

            const html = await fetch(link)
                .then(r => r.text())
                .then(r => new DOMParser().parseFromString(r, 'text/html'));
            this.pages.set(link, html);

            this.loading.delete(link);

            console.debug('Loaded', link);
        }
    }
    async page(link) {
        if (!this.pages.has(link)) {
            await this.load(link);
        }
        if (this._forceLoad(this.pages.get(link))) {
            await this.load(link, true);
        }
        return this.pages.get(link).cloneNode(true);
    }
    put(link, document) {
        if (!this.pages.has(link)) {
            this.pages.set(link, document.cloneNode(true));
            console.debug('Loaded', link);
        }
    }
    _forceLoad(page) {
        const meta = page.querySelector('head meta[name="prelinks-cache-control"]');
        return meta && meta.getAttribute('content') === 'no-cache';
    }
}