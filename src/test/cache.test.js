const assert = chai.assert;

import PageCache from '../cache.js';

describe('PageCache', () => {

    const LINK1 = 'testpage1.html';
    const LINK2 = 'testpage2.html';
    const LINK3 = 'testpage3.html';
    const PAGE = document.createElement('body');
    
    describe('load', () => {
        
        it('loads the page', async () => {
            const mock = pageMock(PAGE);
            const cache = new PageCache(mock.load);

            await cache.load(LINK1);

            assert.equal(mock.attempts(), 1);
        });
        
        it('loads the page only once #1', async () => {
            const mock = pageMock(PAGE);
            const cache = new PageCache(mock.load);

            await cache.load(LINK1);
            await cache.load(LINK1);

            assert.equal(mock.attempts(), 1);
        });
        
        it('loads the page only once #2', async () => {
            const mock = pageMock(PAGE);
            const cache = new PageCache(mock.load);

            await cache.load(LINK1);
            await cache.load(LINK2);
            await cache.load(LINK1);

            assert.equal(mock.attempts(), 2);
        });

        it('publishes an event', async () => {
            const mock = pageMock(PAGE);
            const cache = new PageCache(mock.load);
            const onLoaded = eventListenerAsPromise(cache, 'loaded');

            await cache.load(LINK1);
            await onLoaded;

            assert.equal(mock.attempts(), 1);
        });

        it('does not load when cached', async () => {
            const mock = pageMock(PAGE);
            const cache = new PageCache(mock.load);
            cache.put(LINK1, PAGE);
            
            await cache.load(LINK1);

            assert.equal(mock.attempts(), 0);
        });

        it('loads when evicted from cache', async () => {
            const mock = pageMock(PAGE);
            const cache = new PageCache(mock.load, 2);
            
            await cache.load(LINK1);
            await cache.load(LINK2);
            await cache.load(LINK3);
            await cache.load(LINK1);

            assert.equal(mock.attempts(), 4);
        });

        it('cache limit is alyways greater than one', async () => {
            const mock = pageMock(PAGE);
            const cache = new PageCache(mock.load, 1);
            
            await cache.load(LINK1);
            await cache.load(LINK2);
            await cache.load(LINK1);

            assert.equal(mock.attempts(), 2);
        });

        it('always load when forced', async () => {
            const mock = pageMock(PAGE);
            const cache = new PageCache(mock.load);
            cache.put(LINK1, PAGE);
            
            await cache.load(LINK1, true);

            assert.equal(mock.attempts(), 1);
        });
    });

    describe('page', () => {
        
        it('is loaded', async () => {
            const mock = pageMock(PAGE);
            const cache = new PageCache(mock.load);

            const page = await cache.page(LINK1);

            assert.equal(page.toString(), PAGE.toString());
        });
        
        it('is cached', async () => {
            const mock = pageMock(PAGE);
            const cache = new PageCache(mock.load);

            await cache.page(LINK1);
            await cache.page(LINK1);

            assert.equal(mock.attempts(), 1);
        });
    });

    function pageMock(content) {
        let attempts = 0;
        return {
            load: link => {
                console.debug('Attempt to load page', link);
                attempts++;
                return content;
            },
            attempts: () => attempts
        };
    }

    function eventListenerAsPromise(elem, eventName, timeoutInMs = 1000) {
        return new Promise((resolve, reject) => {
            setTimeout(reject, timeoutInMs);
            elem.addEventListener(eventName, resolve);
        });
    }
});