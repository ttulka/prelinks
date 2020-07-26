import PreLinks from './prelinks.js';
import PageCache from './cache.js';
import LinksHistory from './history.js';
import ShowPage from "./show.js";
import ProgressMethod from './progress.js';

(function () {
    const progressMethods = [
        new ProgressMethod('blur', 'filter', 'blur(.5rem)')
    ];

    const prelinks = new PreLinks(
        window.document,
        new PageCache(
            htmlPage,
            settingValue('cache-limit'),
            settingValue('cache-control') === 'no-cache'),
        new LinksHistory(
            window,
            window.history),
        new ShowPage(window.document),
        progressMethods.find(({ id }) => id === settingValue('progress', 'none'))
    );

    prelinks.start(window.location.href);

    window.addEventListener('unload', _ => prelinks.stop());

    function settingValue(name, def = null) {
        const meta = window.document.querySelector(`head meta[name="prelinks-${name}"]`);
        return meta && meta.getAttribute('content') || def;
    }

    function htmlPage(link) {
        return fetch(link)
            .then(r => r.text())
            .then(r => new DOMParser().parseFromString(r, 'text/html'))
    }
})();