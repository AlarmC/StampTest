import React, { useRef, useEffect, useState, useCallback } from 'react'
import { RiImageAddLine } from 'react-icons/ri'
import { FaStamp } from 'react-icons/fa'
import { LuPipette } from 'react-icons/lu'
import { MdEditDocument } from 'react-icons/md'
import "./halftone.css";

const HalfTone = () => {

    const canvasRef = useRef(null);

    const [loadImage, setLoadImage] = useState(null);

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

    // 이미지 픽셀 변환 적용
    useEffect(() => {
        if(loadImage != null){
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {

                // 이미지 길이, 높이
                const cw = canvas.width = img.width;
                const ch = canvas.height = img.height;
                const pixelSize = 5;
                ctx.drawImage(img, 0, 0);

                for (let y = 0; y < ch; y+= pixelSize) {
                    for (let x = 0; x < cw; x+= pixelSize) {
                        let colorData = ctx.getImageData(x, y, pixelSize, pixelSize);
                        let { data } = colorData;
                        let pixelCnt = pixelSize * pixelSize * 3;
                        let totalRed = 0;
                        let totalGreen = 0;
                        let totalBlue = 0;
                        let totalAlpha = 0;
                        for (let i = 0; i < data.length; i += 4) {
                            totalRed += data[i];
                            totalGreen += data[i + 1];
                            totalBlue += data[i + 2];
                            totalAlpha += data[i + 3];
                        }
                        let total = totalRed + totalGreen + totalBlue;
                        let result = total / pixelCnt;
                        if ((y % 2 === 0 && x % 2 === 0) || (y % 2 === 1 && x % 2 === 1)) {
                            if(totalAlpha == 0){
                                ctx.fillStyle = 'white';
                                ctx.fillRect(x, y, pixelSize, pixelSize);
                            } else {
                                if(result <= 127){
                                    let lgth = 128 - result;
                                    let rotateLgth = lgth / 256;
                                    let posX = x + pixelSize/2;
                                    let posY = y + pixelSize/2;
                                    ctx.fillStyle = 'black';
                                    ctx.fillRect(x, y, pixelSize, pixelSize);
                                    ctx.fillStyle = 'white';
                                    ctx.beginPath();
                                    ctx.arc(posX, posY, pixelSize * rotateLgth, 0, Math.PI * 2);
                                    ctx.closePath();
                                    ctx.fill();
                                } else {
                                    // let lgth = 256 - result;
                                    // let rotateLgth = lgth / 256;
                                    // let posX = x + pixelSize/2;
                                    // let posY = y + pixelSize/2;
                                    // ctx.fillStyle = 'white';
                                    // ctx.fillRect(x, y, pixelSize, pixelSize);
                                    // ctx.fillStyle = 'black';
                                    // ctx.beginPath();
                                    // ctx.arc(posX, posY, pixelSize * rotateLgth, 0, Math.PI * 2);
                                    // ctx.closePath();
                                    // ctx.fill();
                                    ctx.fillStyle = 'white';
                                    ctx.fillRect(x, y, pixelSize, pixelSize);
                                }
                            }
                        } else {
                            if(totalAlpha == 0){
                                ctx.fillStyle = 'white';
                                ctx.fillRect(x, y, pixelSize, pixelSize);
                            } else {
                                if(result >= 128){
                                    let lgth = 256 - result;
                                    let rotateLgth = lgth / 256;
                                    let posX = x + pixelSize/2;
                                    let posY = y + pixelSize/2;
                                    ctx.fillStyle = 'white';
                                    ctx.fillRect(x, y, pixelSize, pixelSize);
                                    ctx.fillStyle = 'black';
                                    ctx.beginPath();
                                    ctx.arc(posX, posY, pixelSize * rotateLgth, 0, Math.PI * 2);
                                    ctx.closePath();
                                    ctx.fill();
                                    // for (let i = 0; i < data.length; i += 4) {
                                    //     let colorData = data[i] + data[i+1] + data[i+2];
                                    //     let result2 = colorData / 3;
                                    //     let num = i/4;
                                    //     let xw = num%5 + x;
                                    //     let yh = num/5 + y;
                                    //     if(result2 >= 192){
                                    //         ctx.fillStyle = 'white';
                                    //         ctx.fillRect(xw, yh, 1, 1);
                                    //     } else {
                                    //         ctx.fillStyle = 'black';
                                    //         ctx.fillRect(xw, yh, 1, 1);
                                    //     }
                                    // }
                                } else {
                                    // let lgth = 128 - result;
                                    // let rotateLgth = lgth / 256;
                                    // let posX = x + pixelSize/2;
                                    // let posY = y + pixelSize/2;
                                    // ctx.fillStyle = 'black';
                                    // ctx.fillRect(x, y, pixelSize, pixelSize);
                                    // ctx.fillStyle = 'white';
                                    // ctx.beginPath();
                                    // ctx.arc(posX, posY, pixelSize * rotateLgth, 0, Math.PI * 2);
                                    // ctx.closePath();
                                    // ctx.fill();
                                    ctx.fillStyle = 'black';
                                    ctx.fillRect(x, y, pixelSize, pixelSize);
                                }
                            }
                        }
                    }
                }

                // const dataURL = canvas.toDataURL("image/jpeg");
                // setUptImage(dataURL);


            }
            img.src = loadImage;
        }
    }, [loadImage])
    
    return(
        <div>
            <input type="file" onChange={handleFileChange} accept="image/*" />
            <canvas ref={canvasRef}></canvas>
        </div>
    )


    // // 하프톤 효과만 적용
    //     const [selectedImage, setSelectedImage] = useState(null);
    //   const targetCanvasRef = useRef(null);

    //   useEffect(() => {
    //     if (selectedImage) {
    //         const reader = new FileReader();

    //         reader.onload = (event) => {
    //             const image = new Image();

    //             image.onload = () => {
    //                 const width = image.width;
    //                 const height = image.height;

    //                 // create target canvas
    //                 const targetCanvas = targetCanvasRef.current;
    //                 const targetCtx = targetCanvas.getContext('2d');
    //                 targetCanvas.width = width;
    //                 targetCanvas.height = height;

    //                 // helper functions
    //                 const positionToDataIndex = (x, y, width) => {
    //                     width = width || targetCanvas.width;
    //                     return (y * width + x) * 4;
    //                 };

    //                 const map = (value, minA, maxA, minB, maxB) => {
    //                     return ((value - minA) / (maxA - minA)) * (maxB - minB) + minB;
    //                 };

    //                 const halftone = (angle, dotSize, dotResolution) => {
    //                     const sourceCanvas = document.createElement('canvas');
    //                     sourceCanvas.width = width;
    //                     sourceCanvas.height = height;
    //                     const sourceCtx = sourceCanvas.getContext('2d');
    //                     sourceCtx.drawImage(image, 0, 0, width, height);

    //                     const sourceImageData = sourceCtx.getImageData(0, 0, width, height);
    //                     angle = (angle * Math.PI) / 180;

    //                     targetCtx.fillStyle = 'white';
    //                     targetCtx.fillRect(0, 0, width, height);
    //                     targetCtx.fillStyle = 'black';

    //                     const boundaries = [
    //                         [0, 0],
    //                         [width, 0],
    //                         [width, height],
    //                         [0, height]
    //                     ].map(([x, y]) => {
    //                         return rotatePointAboutPosition([x, y], [width / 2, height / 2], angle);
    //                     });

    //                     const minX = Math.min(...boundaries.map((point) => point[0])) | 0;
    //                     const minY = Math.min(...boundaries.map((point) => point[1])) | 0;
    //                     const maxY = Math.max(...boundaries.map((point) => point[1])) | 0;
    //                     const maxX = Math.max(...boundaries.map((point) => point[0])) | 0;

    //                     for (let y = minY; y < maxY; y += dotResolution) {
    //                         for (let x = minX; x < maxX; x += dotResolution) {
    //                             let [rotatedX, rotatedY] = rotatePointAboutPosition(
    //                                 [x, y],
    //                                 [width / 2, height / 2],
    //                                 -angle
    //                             );

    //                             if (
    //                                 rotatedX < 0 ||
    //                                 rotatedY < 0 ||
    //                                 rotatedX > width ||
    //                                 rotatedY > height
    //                             ) {
    //                                 continue;
    //                             }
    //                             const index = positionToDataIndex(
    //                                 Math.floor(rotatedX),
    //                                 Math.floor(rotatedY),
    //                                 width
    //                             );
    //                             const value = sourceImageData.data[index];
    //                             const alpha = sourceImageData.data[index + 3];
    //                             if (alpha) {
    //                                 const circleRadius = map(value, 0, 255, dotSize / 2, 0);
    //                                 targetCtx.beginPath();
    //                                 targetCtx.arc(rotatedX, rotatedY, circleRadius, 0, Math.PI * 2);
    //                                 targetCtx.closePath();
    //                                 targetCtx.fill();
    //                             }
    //                         }
    //                     }
    //                 };

    //                 const rotatePointAboutPosition = ([x, y], [rotX, rotY], angle) => {
    //                     return [
    //                     (x - rotX) * Math.cos(angle) - (y - rotY) * Math.sin(angle) + rotX,
    //                     (x - rotX) * Math.sin(angle) + (y - rotY) * Math.cos(angle) + rotY
    //                     ];
    //                 };

    //                 // draw initial halftone image
    //                 halftone(0,6,4);
    //             };

    //             image.src = event.target.result;
    //         };

    //         reader.readAsDataURL(selectedImage);
    //         }
    //     }, [selectedImage]);

    //     const handleFileChange = (event) => {
    //         const file = event.target.files[0];
    //         setSelectedImage(file);
    //     };

    //     return (
    //         <div>
    //             <input type="file" onChange={handleFileChange} accept="image/*" />
    //             <canvas ref={targetCanvasRef}></canvas>
    //         </div>
    //     );

    // // 픽셀 변환 + 알파 효과 적용
    // const [loadImage, setLoadImage ] = useState(null);
    // const [uptImage, setUptImage] = useState(null)

    // const canvasRef = useRef(null);
    // const updateRef = useRef(null);

    // const handleFileChange = (event) => {
    //     const file = event.target.files[0];
    //     const reader = new FileReader();

    //     reader.onload = () => {
    //         const imageDataURL = reader.result;
    //         setLoadImage(imageDataURL);
    //     };

    //     if (file) {
    //         reader.readAsDataURL(file);
    //     }
    // };

    // // 이미지 픽셀 변환 적용
    // useEffect(() => {
    //     if(loadImage != null){
    //         const canvas = canvasRef.current;
    //         const ctx = canvas.getContext('2d');
    //         const img = new Image();

    //         img.onload = () => {

    //             // 이미지 길이, 높이
    //             const cw = canvas.width = img.width;
    //             const ch = canvas.height = img.height;
    //             ctx.drawImage(img, 0, 0);

    //             let pixelArr = ctx.getImageData(0, 0, cw, ch).data;
    //             let sample_size = 5;

    //             for(let y=0; y<ch; y+= sample_size){
    //                 for(let x=0; x<cw; x+= sample_size){
    //                     let p = (x + (y*cw))*4;
    //                     ctx.fillStyle = "rgba(" + pixelArr[p] + "," + pixelArr[p+1] + "," + pixelArr[p+2] + "," + pixelArr[p+3] + ")";
    //                     ctx.fillRect(x,y, sample_size, sample_size);
    //                 }
    //             }
                
    //             // let img2 = new Image();
    //             // img2.src = canvas.toDataURL("image/jpeg");

    //             // img2.width = 600;
    //             // document.body.appendChild(img2);

    //             const dataURL = canvas.toDataURL("image/jpeg");
    //             setUptImage(dataURL);


    //         }
    //         img.src = loadImage;
    //     }
    // }, [loadImage])

    // useEffect(() => {
    //     if(loadImage != null){
    //         const img2 = new Image();
            
    //         img2.onload = () => {
    //             const canvas = updateRef.current;
    //             const ctx = canvas.getContext('2d');

    //             // 이미지 길이, 높이
    //             const cw = canvas.width = img2.width*4;
    //             const ch = canvas.height = img2.height*4;

    //             // 픽셀단위//
    //             ctx.drawImage(img2, 0, 0);

    //             const data = ctx.getImageData(0, 0, cw, ch);
    //             ctx.clearRect(0, 0, cw, ch);
    //             const particles = [];
    //             for (let y = 0, y2 = data.height; y < y2; y++) {
    //                 for (let x = 0, x2 = data.width; x < x2; x++) {
    //                     if (data.data[(x * 4 + y * 4 * data.width) + 2] < 255 && data.data[(x * 4 + y * 4 * data.width) + 1] < 255 && data.data[(x * 4 + y * 4 * data.width)] < 255) {
    //                         const particle = {
    //                             x : x,
    //                             y : y,
    //                             // color : "hsl("+(x*3.6)+",50%,50%)"
    //                             color: "rgb("+data.data[(x * 4 + y * 4 * data.width)] + "," + data.data[(x * 4 + y * 4 * data.width) +1] + "," + data.data[(x * 4 + y * 4 * data.width) +2] + ")",
    //                         };
    //                         particles.push(particle);
    //                     }
    //                 }
    //             }
    //             console.log(particles);
                
    //             ctx.beginPath();
    //             const PI2 = Math.PI * 2;

    //             for(let i=0, j=particles.length;i<j;i++){
    //                 const particle = particles[i];
    //                 // ctx.arc(particle.x, particle.y, 1, 0, PI2);
    //                 ctx.fillStyle = particle.color;
    //                 // ctx.closePath();
    //                 ctx.fillRect(particle.x*4, particle.y*4, 3, 3);
    //             }


    //             //원형//

    //             // 이미지 길이, 높이
    //             // const cw = canvas.width = img2.width;
    //             // const ch = canvas.height = img2.height;

    //             // ctx.fillStyle = 'white'; // 배경색
    //             // ctx.fillRect(0, 0, cw, ch);

    //             // ctx.globalCompositeOperation = 'destination-out';
    //             // // 원형 (radius : 1, 2, 3)
    //             // ctx.beginPath();
    //             // const radius = 2;   // 원의 반지름
    //             // const spacer = 3;   // 간격
    //             // const diameter = radius * 2;
    //             // const PI2 = Math.PI * 2;
    //             // // // 기본 버전
    //             // for (let y = radius; y < ch; y += diameter + spacer) {
    //             //     for (let x = radius; x < cw; x += diameter + spacer) {
    //             //         ctx.arc(x, y, radius, 0, PI2);
    //             //         ctx.closePath();
    //             //     }
    //             // }

    //             ctx.fill();

    //             ctx.globalCompositeOperation = 'destination-atop';
    //             ctx.drawImage(img2, 0, 0);
    //             ctx.globalCompositing='source-over';



    //             const width = img2.width;
    //             const height = img2.height;

    //             // create target canvas
    //             const targetCanvas = updateRef.current;
    //             const targetCtx = targetCanvas.getContext('2d');
    //             targetCanvas.width = width;
    //             targetCanvas.height = height;

    //             // helper functions
    //             const positionToDataIndex = (x, y, width) => {
    //                 width = width || targetCanvas.width;
    //                 return (y * width + x) * 4;
    //             };

    //             const map = (value, minA, maxA, minB, maxB) => {
    //                 return ((value - minA) / (maxA - minA)) * (maxB - minB) + minB;
    //             };

    //             const halftone = (angle, dotSize, dotResolution) => {
    //                 const sourceCanvas = document.createElement('canvas');
    //                 sourceCanvas.width = width;
    //                 sourceCanvas.height = height;
    //                 const sourceCtx = sourceCanvas.getContext('2d');
    //                 sourceCtx.drawImage(img2, 0, 0, width, height);

    //                 const sourceImageData = sourceCtx.getImageData(0, 0, width, height);
    //                 angle = (angle * Math.PI) / 180;

    //                 targetCtx.fillStyle = 'white';
    //                 targetCtx.fillRect(0, 0, width, height);
    //                 targetCtx.fillStyle = 'black';

    //                 const boundaries = [
    //                     [0, 0],
    //                     [width, 0],
    //                     [width, height],
    //                     [0, height]
    //                 ].map(([x, y]) => {
    //                     return rotatePointAboutPosition([x, y], [width / 2, height / 2], angle);
    //                 });

    //                 const minX = Math.min(...boundaries.map((point) => point[0])) | 0;
    //                 const minY = Math.min(...boundaries.map((point) => point[1])) | 0;
    //                 const maxY = Math.max(...boundaries.map((point) => point[1])) | 0;
    //                 const maxX = Math.max(...boundaries.map((point) => point[0])) | 0;

    //                 for (let y = minY; y < maxY; y += dotResolution) {
    //                     for (let x = minX; x < maxX; x += dotResolution) {
    //                         let [rotatedX, rotatedY] = rotatePointAboutPosition(
    //                             [x, y],
    //                             [width / 2, height / 2],
    //                             -angle
    //                         );

    //                         if (
    //                             rotatedX < 0 ||
    //                             rotatedY < 0 ||
    //                             rotatedX > width ||
    //                             rotatedY > height
    //                         ) {
    //                             continue;
    //                         }
    //                         const index = positionToDataIndex(
    //                             Math.floor(rotatedX),
    //                             Math.floor(rotatedY),
    //                             width
    //                         );
    //                         const value = sourceImageData.data[index];
    //                         const alpha = sourceImageData.data[index + 3];
    //                         if (alpha) {
    //                             const circleRadius = map(value, 0, 255, dotSize / 2, 0);
    //                             targetCtx.beginPath();
    //                             targetCtx.arc(rotatedX, rotatedY, circleRadius, 0, Math.PI * 2);
    //                             targetCtx.closePath();
    //                             targetCtx.fill();
    //                         }
    //                     }
    //                 }
    //             };

    //             const rotatePointAboutPosition = ([x, y], [rotX, rotY], angle) => {
    //                 return [
    //                 (x - rotX) * Math.cos(angle) - (y - rotY) * Math.sin(angle) + rotX,
    //                 (x - rotX) * Math.sin(angle) + (y - rotY) * Math.cos(angle) + rotY
    //                 ];
    //             };

    //             // draw initial halftone image
    //             halftone(0,6,3);
    //         };

    //         img2.src = uptImage;
    //     }
    // }, [uptImage])



    // return(
    //     <div>
    //         <input type="file" onChange={handleFileChange} accept="image/*" />
    //         <canvas ref={canvasRef} style={{display:"none"}}></canvas>
    //         {uptImage &&
    //             <canvas ref={updateRef} style={{filter:"grayscale(1)"}}/>
    //         }
    //     </div>
    // )

}

export default HalfTone;