import PageLoader from "./loader";

export default class PreLinks {
    constructor(document, cache, history, progressMethod) {
        this.document = document;
        this.cache = cache;
        this.history = history;
        this.progressMethod = progressMethod;
        this.loader = new PageLoader(document);
        this.anchors = [];

        this._onClickEvent = this._onClickEvent.bind(this);
        this._onMouseenterEvent = this._onMouseenterEvent.bind(this);
        this._onHistoryPoppedEvent = this._onHistoryPoppedEvent.bind(this);

        console.debug('PreLinks constructed.');
    }
    start(currentUrl) {
        this.history.start(currentUrl);
        this._init(currentUrl);
    }
    stop() {
        this._destroy();
    }
    _init(link) {
        document.querySelectorAll('a').forEach(a => {
            this.anchors.push(a);
            a.addEventListener('click', this._onClickEvent);
            a.addEventListener('mouseenter', this._onMouseenterEvent)
        });

        this.history.addEventListener('popped', this._onHistoryPoppedEvent);

        this.cache.put(link, this.document);

        console.debug('Prelinks initialized.');
    }
    _destroy() {
        this.anchors.forEach(a => {
            a.removeEventListener('click', this._onClickEvent);
            a.removeEventListener('mouseenter', this._onMouseenterEvent)
        });

        this.history.removeEventListener('popped', this._onHistoryPoppedEvent);

        console.debug('Prelinks destroyed.');
    }
    showLink(link) {
        this.showProgress();
        this.cache.page(link)
            .then(p => this.loader.show(p))
            .then(_ => {
                this._destroy();
                this._init(link);
                this.hideProgress();
            })
            .catch(err => console.error('Cannot show the page.', link, err));
    }
    loadLink(link, force = false) {
        this.cache.load(link, force)
            .catch(err => console.error('Cannot load the page.', link, err));
    }
    showProgress() {
        if (this.progressMethod) {
            this.progressMethod.show(this.document);
        }
    }
    hideProgress() {
        if (this.progressMethod) {
            this.progressMethod.hide(this.document);
        }
    }
    _onClickEvent(e) {
        if (e.target.getAttribute('data-prelinks') !== 'false') {
            e.preventDefault();
            const link = e.target.href;
            if (link) {
                console.debug('Link clicked', link);
                this.history.push(link);
                this.showLink(link);
            }
        }
    }
    _onMouseenterEvent(e) {
        if (e.target.getAttribute('data-prelinks') !== 'false') {
            const link = e.target.href;
            if (link) {
                console.debug('Link entered', link);
                const force = e.target.getAttribute('data-prelinks-cache') === 'false';
                this.loadLink(link, force);
            }
        }
    }
    _onHistoryPoppedEvent(e) {
        const link = e.detail;
        if (link) {
            console.debug('Link popped', link);
            this.showLink(link);
        }
    }
}