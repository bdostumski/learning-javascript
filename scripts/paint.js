"use strict";

const LINE = "line";
const RECTANGLE = "rectangle";
const CIRCLE = "circle";
const ELLIPSE = "ellipse";
const TRIANGLE = "triangle";
const PENCIL = "pencil";
const BRUSH = "brush";
const PAINT_BUCKET = "paint-bucket";
const ERASER = "eraser";

import { Coords, Distance } from "./coords.js";
import Fill from "./fill.js";

export default class Paint {

    constructor(canvasID) {
        

        this.canvas = document.getElementById(canvasID);
        this.ctx = canvas.getContext("2d");
        this.undoStack = [];
        this.undoLimit = 10;

    }

    /**
     * @param {string} tool
     */
    set activeTool(tool) {
        this._tool = tool;
    }

    /**
     * @param {number} linewidth
     */
    set lineWidth(linewidth) {
        this._lineWidth = linewidth;
        this.ctx.lineWidth = this._lineWidth;
    }

    /**
     * @param {number} brushwidth
     */
    set brushWidth(brushwidth) {
        this._brushWidth = brushwidth;
        this.ctx.brushWidth = this._brushWidth;
    }

    /**
     * @param {string} color
     */
    set selectedColor(color) {
        this._color = color;
        this.ctx.strokeStyle = this._color;
    }

    

    /**
     * @param {boolean} shapeFillColor
     */
    set fillShapes(shapeFillColor) {
        this._shapeFillColor = shapeFillColor;
    }

    /**
     * @param {boolean} drawEffect
     */
    set drawEffects(drawEffect) {
        this._drawEffect = drawEffect;
    }

    event() {
        this.canvas.onmousedown = e => this.onMouseDown(e);
    }

    onMouseDown(e) {

        
        this.savedData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        
        
        if(this.undoStack.length >= this.undoLimit) this.undoStack.shift();
        this.undoStack.push(this.savedData);
        
        
        this.startPosition = Coords(e, this.canvas);

        
        this.canvas.onmousemove = e => this.onMouseMove(e);
        document.onmouseup = e => this.onMouseUp(e);  
        

        
        if(this._tool == PENCIL || this._tool == BRUSH) {
            
            this.ctx.beginPath();
            this.ctx.moveTo(this.startPosition.x, this.startPosition.y);
        } else if(this._tool == PAINT_BUCKET) {
            
            new Fill(this.canvas, this.startPosition, this._color);
        } else if(this._tool == ERASER) {
            this.ctx.clearRect(this.startPosition.x, this.startPosition.y, this._brushWidth, this._brushWidth);
        }
    }

    onMouseMove(e) {
        this.currentPosition = Coords(e, this.canvas);
        

        switch(this._tool) {
            case LINE: 
            case RECTANGLE:
            case CIRCLE: 
            case ELLIPSE:
            case TRIANGLE:
                this.drawShape(this._lineWidth);
                break;
            case PENCIL:
                this.drawLine(this._lineWidth);
                break;
            case BRUSH:
                this.drawLine(this._brushWidth);
                break;
            case ERASER: 
                this.ctx.clearRect(this.currentPosition.x, this.currentPosition.y, this._brushWidth, this._brushWidth);
            default:
                break;
        }
    }

    onMouseUp() {
        this.canvas.onmousemove = null;
        document.onmouseup = null;
    }

    drawShape(_lineWidth) {
        
        if(this._drawEffect == false) {
            this.ctx.putImageData(this.savedData, 0, 0);
        }

        
        this.ctx.beginPath();


        switch(this._tool) {
            case LINE:
                this.ctx.moveTo(this.startPosition.x, this.startPosition.y);
                this.ctx.lineTo(this.currentPosition.x, this.currentPosition.y);
                break;
            case RECTANGLE:
                this.ctx.rect(this.startPosition.x, this.startPosition.y, this.currentPosition.x - this.startPosition.x, this.currentPosition.y - this.startPosition.y);

                
                if(this._shapeFillColor == true) {
                    
                    this.ctx.fillStyle = this._color;
                    this.ctx.fillRect(this.startPosition.x, this.startPosition.y, this.currentPosition.x - this.startPosition.x, this.currentPosition.y - this.startPosition.y);        
                }
                
                
                break;
            case CIRCLE:     
                
                let distance = Distance(this.startPosition, this.currentPosition);
                this.ctx.arc(this.startPosition.x, this.startPosition.y, distance, 0, 2 * Math.PI, false);
                
                
                if(this._shapeFillColor == true) {
                    this.ctx.fillStyle = this._color;
                    this.ctx.fill();
                }                

                break;
            case ELLIPSE:                 
                this.ctx.save();
                if(this._drawEffect == false) {
                    this.ctx.beginPath();
                }
                var x = 1*((this.startPosition.x-this.currentPosition.x)/2);
                var y = 1*((this.startPosition.y-this.currentPosition.y)/2);
                this.ctx.scale(x, y);
                var centerx = (this.currentPosition.x/x)+1;
                var centery = (this.currentPosition.y/y)+1;
                this.ctx.arc(centerx, centery, 1, 0, 2*Math.PI);
                this.ctx.restore();
                this.ctx.stroke();
                
                if(this._shapeFillColor == true) {
                    this.ctx.fillStyle = this._color;
                    this.ctx.fill();
                }
            
                
                break;
            case TRIANGLE:
                
                this.ctx.moveTo(this.startPosition.x + (this.currentPosition.x - this.startPosition.x) / 2, this.startPosition.y);

                this.ctx.lineTo(this.startPosition.x, this.currentPosition.y);
                this.ctx.lineTo(this.currentPosition.x, this.currentPosition.y);
                
                if(this._shapeFillColor == true) {
                    this.ctx.fillStyle = this._color;
                    this.ctx.fill();
                }

                this.ctx.closePath();
                
                break;
            default:
                break;
        }
        this.ctx.stroke();
    }

    drawLine(_lineWidth) {
        
        this.ctx.lineWidth = _lineWidth;
        this.ctx.lineTo(this.currentPosition.x, this.currentPosition.y);
        
        this.ctx.stroke();
    }

    undoPaint() {
        if(this.undoStack.length > 0) {
            this.ctx.putImageData(this.undoStack[this.undoStack.length - 1], 0, 0);
            this.undoStack.pop();
        } else {
            alert("No undo available!");
        }
    }

    canvasSize() {
        this.canv = document.querySelector(".canvas-size");

        this.canv_width = document.querySelector("[data=canvas-width]");
        this.canv_height = document.querySelector("[data=canvas-height]");
        

        this.canvas.width = this.canv_width.value;
        this.canvas.height = this.canv_height.value;
    }
    
    openImage(e) {
        
        let input = document.querySelector('[open-data="local-image"]');
        input.addEventListener('change', e => {
            
                var imgLocal = new Image();
                imgLocal.src = URL.createObjectURL(e.target.files[0]);
                imgLocal.onload = () => {

                    this.canvas.width = imgLocal.width;
                    this.canvas.height = imgLocal.height;
                    this.ctx.drawImage(imgLocal, 0, 0, imgLocal.width, imgLocal.height);

                }
        });
        
        if(e == 'new-drawing') {
            
            var img = new Image();
            let x = this.canvas.width = 980;
            let y = this.canvas.height = 680;
            this.ctx.drawImage(img, 0, 0, x, y);
            for(let i=0; i< this.undoLimit; i++) {
            this.undoStack.pop();
            }

        } else if (e == 'url-image') {

            let url = prompt("URL address of immage: ");

            if(url != null) {
                var img = new Image();

                img.onload = () => {
                    this.canvas.width = img.width;
                    this.canvas.height = img.height;
                    this.ctx.drawImage(img, 0, 0);
                    img.crossOrigin = "anonymous";

                }
                img.src = url;
                
            }
        }
    }

    fillShapesColor() {
        
        if(this._shapeFillColor == false) {
            document.querySelector("[alt='Rectangle Tool']").src = "../images/paint/fill_rectangular.png";
            document.querySelector("[alt='Circle Tool']").src = "../images/paint/fill_circle.png";
            document.querySelector("[alt='Ellipse Tool']").src="../images/paint/fill_ellipse.png";
            document.querySelector("[alt='Triangle Tool']").src = "../images/paint/fill_triangle.png";
            this._shapeFillColor = true;

        } else {
            document.querySelector("[alt='Rectangle Tool']").src = "../images/paint/rectangular.png";
            document.querySelector("[alt='Circle Tool']").src = "../images/paint/circle.png";
            document.querySelector("[alt='Ellipse Tool']").src="../images/paint/ellipse.png";
            document.querySelector("[alt='Triangle Tool']").src = "../images/paint/triangle.png";
            this._shapeFillColor = false;
        }
    }

    drawingEffects() {
        if(this._drawEffect == false) {
            this._drawEffect = true;
        } else {
            this._drawEffect = false;
        }
    }
}