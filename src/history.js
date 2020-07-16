export default class LinksHistory extends EventTarget {
    constructor(window, history) {
        super();
        this.window = window;
        this.history = history;

        this._onPopstateEvent = this._onPopstateEvent.bind(this);
    }
    start() {
        window.addEventListener('popstate', this._onPopstateEvent);
    }
    stop() {
        window.removeEventListener('popstate', this._onPopstateEvent);
    }
    _onPopstateEvent(e) {
        console.debug('popstate', this.history.state, e);
        if (e.state) {
            this.dispatchEvent(new CustomEvent('popped', { detail: e.state }));
        }
    }
    push(link) {
        this.history.pushState(link, link, link);
        console.debug('Link pushed to history', link, this.history.state);
    }
}