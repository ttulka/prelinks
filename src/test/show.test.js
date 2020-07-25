const assert = chai.assert;

import ShowPage from '../show.js';

describe('ShowPage', () => {

    const PAGE1 = new DOMParser().parseFromString(`
        <html>
            <head>
                <title>TestPage1</title>
                <meta charset="utf-8">
                <meta name="page1" content="page1">
            </head>
            <body>Page1</body>
        </html>`, 'text/html');
    const PAGE2 = new DOMParser().parseFromString(`
        <html>
            <head>
                <title>TestPage2</title>
                <meta charset="utf-8">
                <meta name="page2" content="page2">
            </head>
            <body>Page2</body>
        </html>`, 'text/html');
    
    describe('show', () => {
        
        it('body is showned', () => { 
            const doc = PAGE1.cloneNode(true);
            const showPage = new ShowPage(doc);

            showPage.show(PAGE2.cloneNode(true));

            assert.equal(doc.body.innerText, PAGE2.body.innerText);
        });

        it('headers are merged', () => {
            const doc = PAGE1.cloneNode(true);
            const showPage = new ShowPage(doc);

            showPage.show(PAGE2.cloneNode(true));

            const headers = Array.from(doc.head.children); 

            assert.equal(doc.head.childElementCount, 3);
            assert.equal(doc.head.querySelector('title').innerText, 'TestPage2');
            assert.isTrue(!!doc.head.querySelector('meta[charset=utf-8]'));
            assert.isTrue(!!doc.head.querySelector('meta[name=page2][content=page2]'));
        });
    });
});