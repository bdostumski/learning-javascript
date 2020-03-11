"use strict";

export default class PointPosition {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

export function Coords(e, canvas) {
    let canv = canvas.getBoundingClientRect();
    let x = Math.round(e.clientX - canv.left);
    let y = Math.round(e.clientY - canv.top);

    return new PointPosition(x, y);
}

export function Distance(startPosition, currentPosition) {
    return Math.sqrt(Math.pow(currentPosition.x - startPosition.x, 2) + Math.pow(currentPosition.y - startPosition.y, 2));
}