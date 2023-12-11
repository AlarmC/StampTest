import React, { useRef, useEffect, useState, useCallback } from 'react'
// import domtoimage from 'dom-to-image-more';
import "./halftone.css";

const WIDTH = 100;
const HEIGHT = 100;
var PIXELS_PER_DOT = 4;          // 도트크기
var PIXELS_PER_RESOLUTION = 3;    // 도트간격
const INITIAL_ANGLE = 45; // 회전 각도

const createCanvas = (width, height) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    return canvas;
};

const positionToDataIndex = (x, y, width) => {
    width = width || WIDTH;
    // data is arranged as [R, G, B, A, R, G, B, A, ...]
    return (y * width + x) * 4;
};

const map = (value, minA, maxA, minB, maxB) => {
    return ((value - minA) / (maxA - minA)) * (maxB - minB) + minB;
};

const rotatePointAboutPosition = ([x, y], [rotX, rotY], angle) => {
    return [
        (x - rotX) * Math.cos(angle) - (y - rotY) * Math.sin(angle) + rotX,
        (x - rotX) * Math.sin(angle) + (y - rotY) * Math.cos(angle) + rotY,
    ];
};

const halftone = ({
    angle,
    dotSize,
    dotResolution,
    targetCtx,
    sourceCtx,
    width,
    height,
    color,
    layer,
}) => {
    const sourceImageData = sourceCtx.getImageData(0, 0, width, height);
    angle = (angle * Math.PI) / 180;
    targetCtx.fillStyle = "white";
    layer || targetCtx.fillRect(0, 0, width, height);
    targetCtx.fillStyle = color || "black";
  
    // get the four corners of the screen
    const tl = [0, 0];
    const tr = [width, 0];
    const br = [width, height];
    const bl = [0, height];
  
    // rotate the screen, then find the minimum and maximum of the values.
    const boundaries = [tl, br, tr, bl].map(([x, y]) => {
      return rotatePointAboutPosition([x, y], [width / 2, height / 2], angle);
    });
    const minX = Math.min(...boundaries.map((point) => point[0])) | 0;
    const minY = Math.min(...boundaries.map((point) => point[1])) | 0;
    const maxY = Math.max(...boundaries.map((point) => point[1])) | 0;
    const maxX = Math.max(...boundaries.map((point) => point[0])) | 0;
  
    for (let y = minY; y < maxY; y += dotResolution) {
        for (let x = minX; x < maxX; x += dotResolution) {
            let [rotatedX, rotatedY] = rotatePointAboutPosition(
                [x, y],
                [width / 2, height / 2],
                -angle
            );
    
            if (
                rotatedX < 0 ||
                rotatedY < 0 ||
                rotatedX > width ||
                rotatedY > height
            ) {
                continue;
            }
            const index = positionToDataIndex(
                Math.floor(rotatedX),
                Math.floor(rotatedY),
                width
            );
            // we're always operating on grayscale images, so just grab the value from
            // the red channel.
            const value = sourceImageData.data[index];
            const alpha = sourceImageData.data[index + 3];
            if (alpha) {
                const circleRadius = map(value, 0, 255, dotSize / 2, 0);
                targetCtx.beginPath();
                targetCtx.arc(rotatedX, rotatedY, circleRadius, 0, Math.PI * 2);
                targetCtx.closePath();
                targetCtx.fill();
            }
        }
    }
};

const resize = (canvas, width, height) => {
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
};


// 과장님의 검은색 바탕의 흰색 도트 구현한 픽셀당 색상을 가져와서 본 이미지에 삽입
const DotTest2 = ({img, startPrint}) => {

    useEffect(() => {
        setLoadImage(img);
    }, [])

    const canvasRef = useRef(null);
    const rotationCtxRef = useRef(null);
    const stillLifeCtxRef = useRef(null);

    const [loadImage, setLoadImage ] = useState(null);

    useEffect(() => {

        if(loadImage != null){

            const canvas = canvasRef.current;
            const rotationCtx = canvas.getContext("2d");
            rotationCtxRef.current = rotationCtx;
    
            const stillLifeCanvas = createCanvas(WIDTH, HEIGHT);
            const stillLifeCtx = stillLifeCanvas.getContext("2d");
            stillLifeCtxRef.current = stillLifeCtx;
    
            const stillLife = new Image();
    
            const stillLifeReady = new Promise((resolve) => {
                stillLife.src = loadImage; // 이미지 경로 수정 필요
                stillLife.onload = () => {
                    const aspectRatio = stillLife.height / stillLife.width;
                    stillLife.width = Math.min(stillLife.width, window.screen.width - 50);
                    stillLife.height = stillLife.width * aspectRatio;
    
                    resize(stillLifeCanvas, stillLife.width, stillLife.height);
                    stillLifeCtx.drawImage(stillLife, 0, 0, stillLife.width, stillLife.height);
                    resolve();
                };
            });

            // 일반 하프톤
            stillLifeReady.then(() => {
                const rotationCtx = rotationCtxRef.current;
                const stillLifeCtx = stillLifeCtxRef.current;
                resize(canvas, stillLife.width, stillLife.height);
                halftone({
                    angle: INITIAL_ANGLE,
                    dotSize: PIXELS_PER_DOT,
                    dotResolution: PIXELS_PER_RESOLUTION,
                    targetCtx: rotationCtx,
                    sourceCtx: stillLifeCtx,
                    width: stillLife.width,
                    height: stillLife.height,
                    color: "black",
                });
            });
    
        }
    }, [loadImage]);

    
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