export class PageCache {
    constructor(limit) {
        this.cache = new LmitedPageCache(limit && limit > 1 ? limit : 10);
        this.loading = new Set();

        console.debug('PageCache constructed.');
    }
    async load(link, force = false) {
        let cache = this.cache;
        if (force || !this.loading.has(link) && !cache.has(link)) {
            this.loading.add(link);

            const html = await htmlPage(link);
            
            cache = cache.put(link, html);
            this.cache = cache;

            this.loading.delete(link);

            console.debug('Loaded', link);

        } else {
            cache.hit(link);
        }
        return cache;
    }
    async page(link) {
        let cache = this.cache;
        if (!this.cache.has(link)) {
            cache = await this.load(link);
        
        } else if (this._forceLoad(this.cache.get(link))) {
            cache = await this.load(link, true);
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
    _forceLoad(page) {
        const meta = page.querySelector('head meta[name="prelinks-cache-control"]');
        return meta && meta.getAttribute('content') === 'no-cache';
    }
}

export class NoCache {
    async page(link) {
        const page = await htmlPage(link);
        console.debug('Loaded', link);
        return page;
    }
    async load(link, force) {
        console.debug('No cache.');
    }
    put(link, document) {
        console.debug('No cache.');
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