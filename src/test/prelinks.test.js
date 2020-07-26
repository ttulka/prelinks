const assert = chai.assert;

import PreLinks from '../prelinks.js';
import PageCache from '../cache.js';
import LinkHistory from '../history.js';
import ShowPage from '../show.js';

describe('PreLinks', () => {

    const LINK1 = 'page1.html';
    const LINK2 = 'page2.html';
    const PAGE1 = `
        <html>
            <head>
                <title>TestPage1</title>
                <meta charset="utf-8">
                <meta name="page1" content="page1">
            </head>
            <body>
                <h1>Page1</h1>
                <a href="page2.html" id="a-page2">page2</a>
                <a href="page1.html" id="a-page1">page1</a>
            </body>
        </html>`;
    const PAGE2 = `
        <html>
            <head>
                <title>TestPage2</title>
                <meta charset="utf-8">
                <meta name="page2" content="page2">
            </head>
            <body>
                <h1>Page2</h1>
                <a href="page1.html" id="a-page1">page1</a>
            </body>
        </html>`;
    
    it('current page is cached immediatelly', async () => { 
        const doc = toDocument(PAGE1);
        const mock = pageLoaderMock();
        const prelinks = new PreLinks(doc, 
            new PageCache(mock.load),
            new LinkHistory(windowMock(), historyMock()),
            new ShowPage(doc));
        prelinks.start('/');
        await wait(100);
        
        assert.equal(mock.attempts(), 0);  // put, not loaded
    });
    
    it('page is loaded after mouse entered', async () => { 
        const doc = toDocument(PAGE1);
        const mock = pageLoaderMock();
        const prelinks = new PreLinks(doc, 
            new PageCache(mock.load), 
            new LinkHistory(windowMock(), historyMock()),
            new ShowPage(doc));
        prelinks.start('/');
        
        doc.querySelector('#a-page2').dispatchEvent(new Event('mouseenter'));
        await wait(100);

        assert.equal(mock.attempts('page2.html'), 1);
        assert.equal(mock.attempts(), 1);
    });
    
    it('page is loaded after anchor clicked', async () => { 
        const doc = toDocument(PAGE1);
        const mock = pageLoaderMock();
        const prelinks = new PreLinks(doc, 
            new PageCache(mock.load), 
            new LinkHistory(windowMock(), historyMock()),
            new ShowPage(doc));
        prelinks.start('/');
        
        doc.querySelector('#a-page2').dispatchEvent(new Event('click'));
        await wait(100);

        assert.equal(mock.attempts('page2.html'), 1);
        assert.equal(mock.attempts(), 1);
    });
    
    it('page is loaded after history popped', async () => { 
        const doc = toDocument(PAGE1);
        const mock = pageLoaderMock();
        const history = new LinkHistory(windowMock(), historyMock());
        const prelinks = new PreLinks(doc, 
            new PageCache(mock.load), 
            history,
            new ShowPage(doc));
        prelinks.start('/');
        
        history.dispatchEvent(new CustomEvent('popped', { detail: '/page2.html' }));
        await wait(100);

        assert.equal(mock.attempts('page2.html'), 1);
        assert.equal(mock.attempts(), 1);
    });
    
    it('page is loaded after history popped', async () => { 
        const doc = toDocument(PAGE1);
        const mock = pageLoaderMock();
        const history = new LinkHistory(windowMock(), historyMock());
        const prelinks = new PreLinks(doc, 
            new PageCache(mock.load), 
            history,
            new ShowPage(doc));
        prelinks.start('/');
        
        history.dispatchEvent(new CustomEvent('popped', { detail: '/page2.html' }));
        await wait(100);

        assert.equal(mock.attempts('page2.html'), 1);
        assert.equal(mock.attempts(), 1);
    });
    
    it('progress is shown and hidden', async () => { 
        const doc = toDocument(PAGE1);
        const progress = progressMock();
        const prelinks = new PreLinks(doc, 
            new PageCache(pageLoaderMock().load), 
            new LinkHistory(windowMock(), historyMock()),
            new ShowPage(doc),
            progress);
        prelinks.start('/');
        
        doc.querySelector('#a-page2').dispatchEvent(new Event('click'));
        await wait(100);

        assert.isTrue(progress.shown(), 'progress shown');
        assert.isTrue(progress.hidden(), 'progress hidden');
    });
    
    it('page is shown', async () => { 
        const doc = toDocument(PAGE1);
        const prelinks = new PreLinks(doc, 
            new PageCache(pageLoaderMock().load), 
            new LinkHistory(windowMock(), historyMock()),
            new ShowPage(doc));
        prelinks.start('/');
        
        doc.querySelector('#a-page2').dispatchEvent(new Event('click'));
        await wait(100);

        assert.equal(doc.querySelector('head title').innerText, 'TestPage2');
        assert.equal(doc.querySelector('body h1').innerText, 'Page2');
    });
    
    it('page is not loaded when prelinks disabled', async () => {
        const doc = toDocument(`
            <html>
                <body>
                    <a href="page1.html" data-prelinks="false">page1</a>
                </body>
            </html>`);
        const mock = pageLoaderMock();
        const prelinks = new PreLinks(doc, 
            new PageCache(mock.load), 
            new LinkHistory(windowMock(), historyMock()),
            new ShowPage(doc));
        prelinks.start('/');
        
        doc.querySelector('a').dispatchEvent(new Event('mouseenter'));
        await wait(100);
        doc.querySelector('a').dispatchEvent(new Event('click'));
        await wait(100);

        assert.equal(mock.attempts(), 0);
    });
    
    it('page is not cached when caching disabled', async () => {
        const doc = toDocument(`
            <html>
                <body>
                    <a href="page1.html" data-prelinks-cache="false">page1</a>
                </body>
            </html>`);
        const loaderMock = pageLoaderMock();
        const prelinks = new PreLinks(doc, 
            new PageCache(loaderMock.load), 
            new LinkHistory(windowMock(), historyMock()),
            new ShowPage(doc));
        prelinks.start('/');
        
        doc.querySelector('a').dispatchEvent(new Event('mouseenter'));
        await wait(100);
        doc.querySelector('a').dispatchEvent(new Event('mouseenter'));
        await wait(100);

        assert.equal(loaderMock.attempts('page1.html'), 2);
    });

    function windowMock() {
        return document.createElement('div');
    }

    function historyMock() {
        return {
            pushState: () => {},
            replaceState: () => {}
        }
    }

    function pageLoaderMock() {
        const attempts = new Map();
        return {
            load: link => {
                link = link.substring(link.lastIndexOf('/') + 1);
                console.debug('Attempt to load page', link);
                attempts.set(link, (attempts.get(link) || 0) + 1);
                // if (attempts.has(link)) {
                //     attempts.set(link, attempts.get(link) + 1);
                // } else {
                //     attempts.set(link, 1);
                // }
                switch (link) {
                    case LINK1: return toDocument(PAGE1);
                    case LINK2: return toDocument(PAGE2);
                }
            },
            attempts: link => link 
                ? attempts.get(link) || 0
                : Array.from(attempts.values()).reduce((a, c) => a + c, 0)
        };
    }

    function progressMock() {
        let shown = false;
        let hidden = false;
        return {
            show: () => { shown = true; },
            hide: () => { hidden = true; },
            shown: () => shown,
            hidden: () => hidden
        }
    }

    function toDocument(html) {
        return new DOMParser().parseFromString(html, 'text/html');
    }

    function wait(ms) {
        return new Promise(function (resolve, reject) {
          setTimeout(resolve, ms)
        })
    }
});