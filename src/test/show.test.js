const assert = chai.assert;

import ShowPage from '../show.js';

describe('ShowPage', () => {

    const PAGE1 = `
        <html>
            <head>
                <title>TestPage1</title>
                <meta charset="utf-8">
                <meta name="page1" content="page1">
            </head>
            <body>Page1</body>
        </html>`;
    const PAGE2 = `
        <html>
            <head>
                <title>TestPage2</title>
                <meta charset="utf-8">
                <meta name="page2" content="page2">
            </head>
            <body>Page2</body>
        </html>`;
    
    describe('show', () => {
        
        it('body is showned', () => { 
            const page1 = toDocument(PAGE1);
            const page2 = toDocument(PAGE2);
            const showPage = new ShowPage(page1);

            showPage.show(page2);

            assert.equal(page1.body.innerHTML, page2.body.innerHTML);
        });

        it('headers are merged', () => {
            const page1 = toDocument(PAGE1);
            const page2 = toDocument(PAGE2);
            const showPage = new ShowPage(page1);

            showPage.show(page2);

            const headers = Array.from(page1.head.children); 

            assert.equal(page1.head.childElementCount, 3);
            assert.equal(page1.head.querySelector('title').innerText, 'TestPage2');
            assert.isTrue(!!page1.head.querySelector('meta[charset=utf-8]'));
            assert.isTrue(!!page1.head.querySelector('meta[name=page2][content=page2]'));
        });
    });

    function toDocument(html) {
        return new DOMParser().parseFromString(html, 'text/html');
    }
});