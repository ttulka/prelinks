import Prelinks from './prelinks.js';
import Loader from './loader.js';
import History from './history.js';

(function () {    
    const prelinks = new Prelinks(window.document, new Loader(window.document), new History());
    prelinks.start();

    // TODO call prelinks.stop() when document unmounts
})();