import PreLinks from './prelinks.js';
import PageLoader from './loader.js';
import LinksHistory from './history.js';

(function () {
    const history = new LinksHistory(
        window, 
        window.history);
    const prelinks = new PreLinks(
        window.document, 
        new PageLoader(window.document),
        history);
    
    prelinks.init(window.location.href);
    history.start();

    // TODO call prelinks.destroy() and history.stop() when document unmounts
})();