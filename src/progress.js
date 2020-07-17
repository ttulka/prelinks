export default class ProgressMethod {
    constructor(id, styleId, styleValue) {
        this.id = id;
        this.styleId = styleId;
        this.styleValue = styleValue;
        this.origin = '';
    }
    show(document) {
        this.origin = document.body.style[this.styleId];
        document.body.style[this.styleId] = this.styleValue;
    }
    hide(document) {
        document.body.style[this.styleId] = this.origin;
    }
}