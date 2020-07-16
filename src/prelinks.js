export default class Prelinks {
    constructor(document, loader, history) {
        this.document = document;
        this.loader = loader;
        this.history = history;
        this.anchors = [];

        this.interceptClickEvent = this.interceptClickEvent.bind(this);
        this.interceptMouseenterEvent = this.interceptMouseenterEvent.bind(this);
    }
    start() {
        document.querySelectorAll('a').forEach(a => {
            this.anchors.push(a);
            a.addEventListener('click', this.interceptClickEvent);
            a.addEventListener('mouseenter', this.interceptMouseenterEvent)
        });
        // TODO watch document for dynamically added anchors
        console.debug('Prelinks initialized.')
    }
    stop() {        
        this.anchors.forEach(a => {
            a.removeEventListener('click', this.interceptClickEvent);
            a.removeEventListener('mouseenter', this.interceptMouseenterEvent)
        });
        console.debug('Prelinks destroyed.')
    }
    interceptClickEvent(e) {
        e.preventDefault();
        if (e.target.href) {
            console.log('Link clicked', e.target.href);
            this.loader.show(e.target.href);
        }
    }
    interceptMouseenterEvent(e) {
        if (e.target.href) {
            console.log('Link entered', e.target.href);
            this.loader.load(e.target.href);
        }
    }
}