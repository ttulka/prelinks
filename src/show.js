export default class ShowPage {
    constructor(document) {
        this.document = document;
    }
    show(page) {
        this._mergeHeaders(this.document.querySelector('head'), page.querySelector('head'));
        this._mergeBody(this.document.querySelector('body'), page.querySelector('body'));
    }
    _mergeBody(body, newBody) {
        body.innerHTML = newBody.innerHTML;

        body.querySelectorAll('script')
            .forEach(s => s.parentNode.replaceChild(this._scriptElement(s), s));
    }
    _mergeHeaders(head, newHead) {
        const headers = this._headers(head);
        const newHeaders = this._headers(newHead);
        const textHeaders = this._textHeaders(head);
        const newTextHeaders = this._textHeaders(newHead);
        headers
            .filter(h => !this._hasHeader(newHeaders, h))
            .forEach(({ node }) => head.removeChild(node));
        newHeaders
            .filter(h => !this._hasHeader(headers, h))
            .forEach(({ node }) => head.appendChild(node));

        newTextHeaders.forEach(({ name, node }) => {
            const old = textHeaders.find(h => name === h.name);
            if (old) {
                head.replaceChild(node, old.node);
            } else {
                head.appendChild(node)
            }
        });
    }
    _hasHeader(headers, { name, attributes }) {
        return headers.find(h => name === h.name && isSameArray(attributes, h.attributes));
    }
    _headers(head) {
        const headers = [];
        for (const ch of head.children) {
            if (ch.innerText) {
                continue;
            }
            const attributes = [];
            for (const { name, value } of ch.attributes) {
                attributes.push({ name, value });
            }
            headers.push({ name: ch.nodeName, attributes, node: ch });
        }
        return headers;
    }
    _textHeaders(head) {
        const headers = [];
        for (const ch of head.children) {
            if (ch.innerText) {
                headers.push({ name: ch.nodeName, node: ch });
            }
        }
        return headers;
    }
    _scriptElement(element) {
        if (element.id === 'prelinks') {
            return element;
        }
        const scriptEl = document.createElement("script");
        scriptEl.textContent = element.textContent;
        scriptEl.async = false;
        this._copyElementAttributes(scriptEl, element);
        return scriptEl;
    }
    _copyElementAttributes(dest, src) {
        for (const { name, value } of src.attributes) {
            dest.setAttribute(name, value)
        }
    }
}

function isSameArray(arr1, arr2) {
    return arr1.length === arr2.length
        && arr1.reduce((acc, cur) => acc &&
            arr2.find(({ name, value }) =>
                cur.name === name && cur.value === value), true);
}