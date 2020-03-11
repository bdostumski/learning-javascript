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

import Paint from "./paint.js";


var paint = new Paint("canvas");

paint.activeTool = PENCIL;
paint.lineWidth = 1;
paint.brushWidth = 3;
paint.selectedColor = "#000000";
paint.fillShapes = false;
paint.drawEffects = false;

paint.event();


document.querySelectorAll("[data-command]").forEach(
    element => {
        element.addEventListener("click", () => {
            
            let command = element.getAttribute("data-command");
            

            if(command == 'undo') {
                paint.undoPaint();
            } else if(command == "open") {

                var canvas = document.getElementById("canvas");
                let open = document.querySelector(".canvas-open");
                
                document.querySelector("[data-command=open]").classList.toggle("active");
                
                
                if(open.style.display == "none") {
                    open.style.display = "block";
                    
                } else {
                    open.style.display = "none";
                }
        
                document.querySelectorAll("[open-data]").forEach(
                    element => {
                        element.addEventListener("click", () => {
                            let command = element.getAttribute("open-data");
                            paint.openImage(command);
                            
                        });
                    }
                );
            }else if(command == 'size') {
                var canvas = document.getElementById("canvas");
                let canv = document.querySelector(".canvas-size");
                document.querySelector("[data-command=size]").classList.toggle("active");

            
                if(canv.style.display == "none") {
                    canv.style.display = "block";

                    let canv_width = document.querySelector("[data=canvas-width]");
                    let canv_height = document.querySelector("[data=canvas-height]");
                    let canv_button = document.querySelector("[data=resize]");

                    canv_width.value = canvas.width;
                    canv_height.value = canvas.height;
                    canv_button.onclick = e => paint.canvasSize(e);

                } else {
                    canv.style.display = "none";
                }
            } else if(command == 'save') {
                var canvas = document.getElementById("canvas");
                var image = canvas.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
                var link = document.createElement("a");
                link.download = "daVinci.png";
                link.href = image;
                link.click();
            } else if(command == 'fill-shapes') {
                document.querySelector("[data-command=fill-shapes]").classList.toggle("active");
                paint.fillShapesColor();
            } else if(command == 'effects') {
                document.querySelector("[data-command=effects]").classList.toggle("active");
                paint.drawingEffects();
            }
        });
    }
);


document.querySelectorAll("[data-tool]").forEach(
    element => {
        element.addEventListener("click", () => {
            document.querySelector("[data-tool].active").classList.toggle("active");
            element.classList.toggle("active");


            var selectedTool = element.getAttribute("data-tool");
            paint.activeTool = selectedTool;
            

            switch(selectedTool) {
                
                case PENCIL:
                    document.querySelector(".shapes-effects").style.display = "none";

                    document.querySelector(".group.line-width").style.display = "block";
                    document.querySelector(".group.brush-width").style.display = "none";
                    break;
                case LINE:
                case RECTANGLE:
                case CIRCLE:
                case ELLIPSE:
                case TRIANGLE:
                    document.querySelector(".shapes-effects").style.display = "block";
            
                    document.querySelector(".group.line-width").style.display = "block";
                    document.querySelector(".group.brush-width").style.display = "none";
                    break;
                    
                case BRUSH:
                case ERASER:
                    document.querySelector(".shapes-effects").style.display = "none";
                    document.querySelector(".group.line-width").style.display = "none";
                    document.querySelector(".group.brush-width").style.display = "block";
                    break;
                    
                default:
                    document.querySelector(".shapes-effects").style.display = "none";
                    document.querySelector(".group.line-width").style.display = "none";
                    document.querySelector(".group.brush-width").style.display = "none";
                    break;
            }
        });
    }
);


document.querySelectorAll("[data-line-width]").forEach(
    element => {
        element.addEventListener("click", () => {
            document.querySelector("[data-line-width].active").classList.toggle("active");
            element.classList.toggle("active");

            let linewidth = element.getAttribute("data-line-width");
            paint.lineWidth = linewidth;

        });
    }
);


document.querySelectorAll("[data-brush-width]").forEach(
    element => {
        element.addEventListener("click", () => {
            document.querySelector("[data-brush-width].active").classList.toggle("active");
            element.classList.toggle("active");

            
            let brushwidth = element.getAttribute("data-brush-width");
            paint.brushWidth = brushwidth;
        });
    }
);


document.querySelectorAll("[data-color]").forEach(
    element => {
        element.addEventListener("click", () => {
            document.querySelector("[data-color].active").classList.toggle("active");
            element.classList.toggle("active");

            let color = element.getAttribute("data-color");
            paint.selectedColor = color;
        });
    }
);

document.querySelector(".input_color").addEventListener("input", () => {

    let color = document.querySelector(".input_color");
    let div = document.querySelector('[title="Color Picker"]'); 
    div.setAttribute("data-color", color.value);
    
    paint.selectedColor = color.value;

});