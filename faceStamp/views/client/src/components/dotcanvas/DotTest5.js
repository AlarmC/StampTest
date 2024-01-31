import React, { useRef, useEffect, useState, useCallback } from 'react'
import domtoimage from 'dom-to-image-more';
import "./halftone.css";


// 과장님의 검은색 바탕의 흰색 도트 구현한 픽셀당 색상을 가져와서 본 이미지에 삽입
const DotTest2 = ({img, startPrint}) => {
    useEffect(() => {
        setLoadImage(img);
    }, [])

    const canvasRef = useRef(null);

    const [loadImage, setLoadImage ] = useState(null);

    const [compImage, setCompImage] = useState(null);


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
    }, [loadImage]);

    useEffect(() => {
        if(startPrint == true){
            const bgNode = canvasRef.current;

            // domtoimage.toPng 메소드를 사용하여 이미지를 캡처합니다.
            domtoimage.toPng(bgNode)
                .then((dataUrl) => {
                    // 이미지를 성공적으로 캡처한 경우 dataUrl이 반환됩니다.
                    // dataUrl을 사용하여 이미지를 처리하거나 표시합니다.
                    const img = new Image();
                    img.src = dataUrl;
                    // img.style.width = '170px'; // 원하는 크기로 조정
                    // img.style.height = '170px';
                    setCompImage(img.src);
                })
                .catch((error) => {
                    // 이미지 캡처에 실패한 경우 이곳에서 오류 처리를 합니다.
                    console.error('Image capture failed:', error);
                });
        }
    }, [startPrint])

    
    return(
        <>
            {loadImage &&
            <>
                {/* <input type="file" onChange={handleFileChange} accept="image/*" /> */}
                <canvas ref={canvasRef} ></canvas>
            </>
            }
        </>
    )

}

export default DotTest2;