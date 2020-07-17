export default class PageLoader {
    constructor(document) {
        this.document = document;
    }
    show(page) {
        const newBody = page.querySelector('body');
        const newHead = page.querySelector('head');

        this.document.querySelector('head').innerHTML = newHead.innerHTML;

        const body = this.document.querySelector('body');
        body.innerHTML = newBody.innerHTML;

        body.querySelectorAll('script')
            .forEach(s => s.parentNode.replaceChild(this._scriptElement(s), s));
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