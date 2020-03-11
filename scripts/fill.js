"use strict";

import PointPosition from "./coords.js";


export default class Fill {

    constructor(canvas, point, color) {
        this.ctx = canvas.getContext("2d");

        this.imageData = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        const targetColor = this.getPixelColor(point);

        const replacementColor = this.hexToRGBA(color);

        this.fillStack = [];
        this.floodFill(point, targetColor, replacementColor);
        this.replacementColor();
    }

    floodFill(point, targetColor, replacementColor) {
        if(this.colorsMatch(targetColor, replacementColor)) return;

        const currentColor = this.getPixelColor(point);

        if(this.colorsMatch(currentColor, targetColor)) {

            this.setPixel(point, replacementColor);
            
            this.fillStack.push([new PointPosition(point.x + 1, point.y), targetColor, replacementColor]);
            
            this.fillStack.push([new PointPosition(point.x - 1, point.y), targetColor, replacementColor]);
            
            this.fillStack.push([new PointPosition(point.x, point.y + 1), targetColor, replacementColor]);
            
            this.fillStack.push([new PointPosition(point.x, point.y - 1), targetColor, replacementColor]);
        }
    }

    replacementColor() {
        if(this.fillStack.length) {
            let range = this.fillStack.length;
            for(let i=0; i<range; i++) {
                this.floodFill(this.fillStack[i][0], this.fillStack[i][1], this.fillStack[i][2]);
            }
            this.fillStack.splice(0, range);
            this.replacementColor();
        } else {
            this.ctx.putImageData(this.imageData, 0, 0);
            this.fillStack = [];
        }
    }

    getPixelColor(point) {
        
        if(point.x < 0 || point.y < 0 || point.x >= this.imageData.width, point.y >= this.imageData.height) {
            return [-1, -1, -1, -1]
        } else {
            
            const offset = (point.y * this.imageData.width + point.x) * 4;
            return [
                this.imageData.data[offset + 0], 
                this.imageData.data[offset + 1], 
                this.imageData.data[offset + 2], 
                this.imageData.data[offset + 3], 
            ]
        }
    }

    
    setPixel(point, replacementColor) {
        const offset = (point.y * this.imageData.width + point.x) * 4;
        this.imageData.data[offset + 0] = replacementColor[0];
        this.imageData.data[offset + 1] = replacementColor[1];
        this.imageData.data[offset + 2] = replacementColor[2];
        this.imageData.data[offset + 3] = replacementColor[3];
    }


    colorsMatch(color1, color2) {
        return color1[0] === color2[0] && color1[1] === color2[1] && color1[2] === color2[2] && color1[3] === color2[3];
    }

    
    hexToRGBA(hex) {
        
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        
        return [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16),
            255
        ];
    }
}