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

            console.debug('Loaded', link, html.querySelector('head title'));
        }
    }
    async show(link) {
        if (!this.pages.has(link)) {
            await this.load(link);
        }
        const html = this.pages.get(link);
        const body = html.querySelector('body');
        const title = html.querySelector('head title');
        
        this.document.querySelector('head title').innerText = (title && title.innerText) || '';
        this.document.querySelector('body').innerHTML = body.innerHTML;
                
        console.debug('Shown', link, title);
    }
    add(link, document) {
        if (!this.pages.has(link)) {
            this.pages.set(link, document);
            console.debug('Loaded', link, document.querySelector('head title'));
        }
    }
}