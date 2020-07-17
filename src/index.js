import PreLinks from './prelinks.js';
import PageLoader from './loader.js';
import LinksHistory from './history.js';
import ProgressMethod from './progress.js';

(function () {
    const prelinks = new PreLinks(
        window.document,
        new PageLoader(window.document),
        new LinksHistory(
            window,
            window.history),
        [new ProgressMethod('blur', 'filter', 'blur(1rem)')]);

    prelinks.start(window.location.href);

    window.addEventListener('unload', _ => prelinks.stop());
})();