export default class PageCache extends EventTarget {
    constructor(limit, alwaysForce = false) {
        super();
        this.cache = new LmitedPageCache(limit && limit > 1 ? limit : 10);
        this.alwaysForce = !!alwaysForce;
        this.loading = new Set();

        console.debug('PageCache constructed.');
    }
    async load(link, force = false) {
        let cache = this.cache;
        if (this.loading.has(link)) {
            return cache;
        }
        if (force || this.alwaysForce || !cache.has(link)) {
            this.loading.add(link);

            const page = await htmlPage(link);

            cache = cache.put(link, page);
            this.cache = cache;

            this.loading.delete(link);
            this.dispatchEvent(new CustomEvent('loaded', { detail: { link, page } }));

            console.debug('Loaded', link);

        } else {
            cache.hit(link);
        }
        return cache;
    }
    async page(link) {
        const onPageLoaded = new Promise(resolve => {
            const listener = ({ detail }) => {
                if (detail.link === link) {
                    this.removeEventListener('loaded', listener);
                    resolve(detail.page);
                }
            }
            this.addEventListener('loaded', listener, false);
        });

        if (this.loading.has(link)) {
            return onPageLoaded;
        }
        const cache = this.cache;
        if (!cache.has(link)) {
            this.load(link);
            return onPageLoaded;
        }
        return cache.get(link).cloneNode(true);
    }
    put(link, document) {
        const cache = this.cache;
        if (!cache.has(link)) {
            this.cache = cache.put(link, document.cloneNode(true));
            console.debug('Loaded', link);
        }
    }
}

class LmitedPageCache {
    constructor(limit, initCache = new Map()) {
        this.limit = limit;
        this.pages = initCache;
    }
    get(link) {
        if (this.pages.has(link)) {
            return this.pages.get(link).document;
        }
    }
    put(link, document) {
        const newCache = new LmitedPageCache(this.limit, this.pages);

        const hits = newCache.pages.has(link) ? newCache.pages.get(link).hits + 1 : 1;
        newCache.pages.set(link, { document, hits });

        newCache._cleanup(link);
        return newCache;
    }
    has(link) {
        return this.pages.has(link);
    }
    hit(link) {
        const page = this.pages.get(link);
        if (page) {
            page.hits++;
        }
    }
    _cleanup(currentLink) {
        if (this.pages.size > this.limit) {
            const entries = this.pages.entries();
            let toRemove;
            let min = Number.MAX_VALUE;
            for (let [link, page] of entries) {
                if (page.hits < min && link !== currentLink) {
                    toRemove = link;
                    min = page.hits;
                }
            }
            if (toRemove) {
                this.pages.delete(toRemove);

                console.debug('Removed from cache', toRemove);
            }
        }
    }
}

function htmlPage(link) {
    return fetch(link)
        .then(r => r.text())
        .then(r => new DOMParser().parseFromString(r, 'text/html'))
}