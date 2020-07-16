export default class PreLinks {
    constructor(document, loader, history) {
        this.document = document;
        this.loader = loader;
        this.history = history;
        this.anchors = [];

        this._onClickEvent = this._onClickEvent.bind(this);
        this._onMouseenterEvent = this._onMouseenterEvent.bind(this);
        this._onHistoryPoppedEvent = this._onHistoryPoppedEvent.bind(this);
        
        console.log('PreLinks constructed.')
    }
    init(currentUrl) {
        document.querySelectorAll('a').forEach(a => {
            this.anchors.push(a);
            a.addEventListener('click', this._onClickEvent);
            a.addEventListener('mouseenter', this._onMouseenterEvent)
        });

        this.history.addEventListener('popped', this._onHistoryPoppedEvent);
        
        this.loader.add(currentUrl, this.document);
                
        // TODO watch document for dynamically added anchors
        
        console.debug('Prelinks initialized.')
    }
    destroy() {        
        this.anchors.forEach(a => {
            a.removeEventListener('click', this._onClickEvent);
            a.removeEventListener('mouseenter', this._onMouseenterEvent)
        });

        this.history.removeEventListener('popped', this._onHistoryPoppedEvent);

        console.debug('Prelinks destroyed.')
    }
    _showLink(link) {
        this.loader.show(link)
            .then(_ => {
                this.destroy();
                this.init(link);
            })
            .catch(err => console.error('Cannot show the page.', link, err));
    }
    _loadLink(link) {
        this.loader.load(link)
            .catch(err => console.error('Cannot load the page.', link, err));
    }
    _onClickEvent(e) {
        e.preventDefault();
        const link = e.target.href;
        if (link) {            
            console.log('Link clicked', link);
            this.history.push(link);
            this._showLink(link);
        }
    }
    _onMouseenterEvent(e) {
        const link = e.target.href;
        if (link) {
            console.log('Link entered', link);
            this._loadLink(link);
        }
    }
    _onHistoryPoppedEvent(e) {
        const link = e.detail;
        if (link) {
            console.log('Link popped', link);
            this._showLink(link);     
        }
    }
}