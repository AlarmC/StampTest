import React, { useRef, useEffect, useState, useCallback } from 'react'
import "./halftone.css";

const DotTest = ({img}) => {

    
    useEffect(() => {
        // setLoadImage(img);
    }, [])

    // 픽셀 변환 + 알파 효과 적용
    const [loadImage, setLoadImage] = useState(null);
    const canvasRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            const imageDataURL = reader.result;
            setLoadImage(imageDataURL);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if(loadImage != null){
            const FPS = 60;  // frames per second => 비디오의 부드러움과 속도를 나타내는 변수
            const DPF = 512; // dots per frame  => 한 프레임당 그려지는 점의 수
            // const elKernel = document.getElementById('elKernel');

            const drawFnHash = {};

            drawFnHash.dots = function({ctx, cx, cy, s, kernel}) {
                const r = (kernel/2) * (1 - s); // no overlap
                ctx.beginPath();
                ctx.ellipse(cx, cy, r, r, 0, 0, 2* Math.PI)
                ctx.fill();
                ctx.closePath();
            };

            //
            // reg ui event
            //

            function onDone({onCanvas}) {
                enableAllControls();
            }

            function onError(err) {
                console.error(err);
                // enableAllControls();
            }

            function enableAllControls() {
                // elKernel.disabled = false;
            }

            // function disableAllControls() {
            //     elKernel.disabled = true;
            // }

            function onInput() {
                // const kernel = Number(elKernel.value);
                const kernel = 8;   // 도트 사이즈
                const frameEl = document.querySelector("#elFrame");
                const img = document.createElement('img');
                const file = document.querySelector('input[type=file]').files[0];
                const reader = new FileReader();
                
                reader.onloadend = function() {
                    img.src = loadImage;
                    img.onload = function() {
                    fx({frameEl, drawFn: drawFnHash.dots, kernel, imgsrc: img.src})
                        .then(onDone)
                        .catch(onError);
                    }
                }

                if (file) {
                    reader.readAsDataURL(file);
                }
            }

            // elKernel.addEventListener("input", onInput);
            onInput();

            //
            // fx flow
            //
            function fx({frameEl, drawFn, kernel, imgsrc}) {
                const el = frameEl.querySelector("canvas");
                
                return Promise.resolve(imgsrc)
                    .then(toImage())
                    .then(setup({el}))
                    .then(halftone({kernel}))
                    .then(render({dotsPerFrame: DPF, fps: FPS, drawFn}));
            }

            //
            // create an Image{} with a blob url
            //
            function toImage() {
                return function(url) {
                    return new Promise(function (resolve, reject) {
                        const image = new Image();
                        image.addEventListener("load", e => resolve(image));
                        image.addEventListener("error", e => reject(e));
                        image.src = url;
                    });
                }
            }

            //
            // halftone fx
            //
            function halftone({kernel=10}) {
                function grayscale({r, g, b}) {
                    return 0.2 * r/255 + 0.7 * g/255 + 0.1 * b/255;
                }
                
                function samplize({x, y, imageData}) {
                    const {width, data} = imageData;
                    const samples = [];
                    for (let i = y; i < y+kernel; i++) {
                        for (let j = x; j < x+kernel; j++) {
                            const at = (i * width + j) * 4; 
                            let r = data[at];
                            let g = data[at + 1];
                            let b = data[at + 2];
                            // if(r <=200 && g<=200 && b <=200){
                            //     r = r*0.7;
                            //     g = g*0.7;
                            //     b = g*0.7;
                            // }
                            samples.push({r, g, b});
                        }
                    }
                    let sum = 0;
                    for (const sample of samples)
                    sum += grayscale(sample);
                    return sum / samples.length;
                }
                
                return function ({onCanvas, imageData}) {
                    const halftoneData = {
                        kernel: kernel,
                        width: imageData.width/kernel|0,
                        height: imageData.height/kernel|0,
                        data:[]
                    };
                    
                    for (let y = 0; y <= imageData.height - kernel; y+=kernel) {
                        for (let x = 0; x <= imageData.width - kernel; x+=kernel) {
                            halftoneData.data.push(samplize({x, y, imageData}));
                        }
                    }
                    
                    return {halftoneData, onCanvas};
                };
            }

            //
            // lazy rendering, draw partial dots on each frame
            //
            function render({dotsPerFrame=1, fps=10, drawFn}) {
                return function({halftoneData, onCanvas}) {
                    const ctx = onCanvas.getContext("2d");
                    const {width, height, kernel, data} = halftoneData;
                    const dotsCount = width * height;

                    return new Promise((resolve) => {
                        
                        let dotsDrawn = 0;
                        (function tick() {
                            for(let i = 0; i < dotsPerFrame && dotsDrawn < dotsCount; i++) {
                                const cx = (dotsDrawn % width) * kernel + kernel/2;
                                const cy = (dotsDrawn / width | 0) * kernel + kernel/2;
                                const s = data[dotsDrawn];
                                drawFn({ctx, cx, cy, s, kernel});
                                dotsDrawn += 1;
                            }    
                            
                            if (dotsDrawn < dotsCount)
                            setTimeout(tick, 1000/fps);
                            else
                            resolve({onCanvas});
                        }());
                    });
                }
            }

            //
            // add onscreen canvas as a subs. of <img> to container
            // create offscreen canvas to get pixel data of <img>
            //
            function setup({el}) {
                return function (image) {

                    const onCanvas = canvasRef.current;
                    onCanvas.width = image.width;
                    onCanvas.height = image.height;
                    const onContext = onCanvas.getContext("2d");
                    onContext.fillStyle = "white";
                    onContext.fillRect(0,0,onCanvas.width,onCanvas.height);
                    onContext.fillStyle = "black";
                    el.parentNode.appendChild(onCanvas);
                    
                    const offCanvas = document.createElement("canvas");
                    offCanvas.width = onCanvas.width;
                    offCanvas.height = onCanvas.height;
                    const offContext = offCanvas.getContext("2d");
                    offContext.drawImage(image, 0, 0, offCanvas.width, offCanvas.height);
                    const imageData = offContext.getImageData(0,0, offCanvas.width, offCanvas.height);

                    return {onCanvas, imageData};
                }
            }
        }
    }, [loadImage])


    return(
        <>
            <input type="file" onChange={handleFileChange} accept="image/*" />
            {loadImage &&
                <div class="clip_path_area" id="elFrame">
                    <canvas ref={canvasRef}/>
                </div>
            }
        </>
    )

}

export default DotTest;