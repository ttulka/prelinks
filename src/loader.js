export default class PageLoader {
    constructor(document, history) {
        this.document = document;
        this.pages = new Map();
        this.loading = new Set();
        console.debug('PageLoader constructed.');
    }
    async load(link) {
        if (!this.loading.has(link) && !this.pages.has(link)) {
            this.loading.add(link);

            const html = await fetch(link)
                .then(r => r.text())
                .then(r => new DOMParser().parseFromString(r, 'text/html'));
            this.pages.set(link, html);

            this.loading.delete(link);

            console.debug('Loaded', link);
        }
    }
    async show(link) {
        if (!this.pages.has(link)) {
            await this.load(link);
        }
        const page = this.pages.get(link).cloneNode(true);
        const body = page.querySelector('body');
        const head = page.querySelector('head');

        this.document.querySelector('head').innerHTML = head.innerHTML;
            
        const pageBody = this.document.querySelector('body');
        pageBody.innerHTML = body.innerHTML;

        pageBody.querySelectorAll('script').forEach(s => s.parentNode.replaceChild(this._scriptElement(s), s));

        console.debug('Shown', link);
    }
    add(link, document) {
        if (!this.pages.has(link)) {
            this.pages.set(link, document.cloneNode(true));
            console.debug('Loaded', link);
        }
    }
    _scriptElement(element) {
        if (element.id === 'prelinks') {
            return element;
        }
        const scriptEl = document.createElement("script");
        scriptEl.textContent = element.textContent;
        scriptEl.async = false;
        this._copyElementAttributes(scriptEl, element);
        return scriptEl;
    }
    _copyElementAttributes(dest, src) {
        for (const { name, value } of src.attributes) {
            dest.setAttribute(name, value)
        }
    }
}