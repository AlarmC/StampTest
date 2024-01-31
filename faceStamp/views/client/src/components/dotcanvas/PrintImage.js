import React, { useRef, useEffect, useState, useCallback } from 'react'
// import { Stage, Layer, Image, Transformer, Text } from 'react-konva';
import { useDispatch, useSelector } from "react-redux";

const PrintImage = ({dataArr, size}) => {

    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        // Set canvas size to the specified dimensions
        const canvasWidth = 793; // in pixels
        const canvasHeight = 1100; // in pixels
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Draw the rectangles
        const rectangleWidth = 540; // in pixels
        const rectangleHeight = 440; // in pixels
        const rectanglePositions = [
            { x: 130, y: 100 },
            { x: 130, y: 600 },
        ];

        context.strokeStyle = 'black'; // Set rectangle and circle border color
        rectanglePositions.forEach(({ x, y }) => {
            context.strokeRect(x, y, rectangleWidth, rectangleHeight);
        });
        
    }, [size]);
    
    useEffect(() => {

        if(dataArr.length > 0){
            console.log(dataArr);

            if(size == "26mm"){
    
                let imgArr = dataArr;
    
                for(let i = 0; i < imgArr.length; i++){
                    const image = new Image();
                    image.src = imgArr[i].image;
                    let x, y;
                    if(i % 4 == 0){
                        x = 144 + (59 - imgArr[i].size);
                    } else if(i % 4 == 1){
                        x = 276 + (59 - imgArr[i].size);
                    } else if(i % 4 == 2){
                        x = 408 + (59 - imgArr[i].size);
                    } else if(i % 4 == 3){
                        x = 540 + (59 - imgArr[i].size);
                    }

                    if(parseInt(i/4) == 0){
                        y = 168 + (59 - imgArr[i].size);
                    } else if(parseInt(i/4) == 1){
                        y = 354 + (59 - imgArr[i].size);
                    } else if(parseInt(i/4) == 2){
                        y = 668 + (59 - imgArr[i].size);
                    } else if(parseInt(i/4) == 3){
                        y = 854 + (59 - imgArr[i].size);
                    }
                    image.onload = () => {
                        const canvas = canvasRef.current;
                        const context = canvas.getContext('2d');

                        // 이미지 감싸는 원 테두리 그리기
                        const circleRadius = imgArr[i].size + 10; 
                        context.strokeStyle = "rgb(0, 0, 0)"; 
                        context.lineWidth = 1;
                        context.beginPath();
                        context.arc(x + circleRadius -10, y + circleRadius -10, circleRadius, 0, 2 * Math.PI);
                        context.stroke();

                        context.drawImage(image, x, y, imgArr[i].size*2, imgArr[i].size*2);
                    };
    
                }
            }

            if(size == "38mm"){
                const imgPos = [
                    { x: 75.75*2, y: 73.75*2 },
                    { x: 162.75*2, y: 73.75*2 },
                    { x: 249.75*2, y: 73.75*2 },
                    { x: 75.75*2, y: 174.75*2 },
                    { x: 162.75*2, y: 174.75*2 },
                    { x: 249.75*2, y: 174.75*2 },
                    { x: 75.75*2, y: 323.75*2 },
                    { x: 162.75*2, y: 323.75*2 },
                    { x: 249.75*2, y: 323.75*2 },
                    { x: 75.75*2, y: 424.75*2 },
                    { x: 162.75*2, y: 424.75*2 },
                    { x: 249.75*2, y: 424.75*2 },
                ]
    
                let imgArr = dataArr;
    
                for(let i = 0; i < imgArr.length; i++){
                    const image = new Image();
                    image.src = imgArr[i].image;
                    image.onload = () => {
                        const canvas = canvasRef.current;
                        const context = canvas.getContext('2d');

                        // 이미지 감싸는 원 테두리 그리기
                        const circleRadius = imgArr[i].size + 10; 
                        context.strokeStyle = "rgb(0, 0, 0)"; 
                        context.lineWidth = 1;
                        context.beginPath();
                        context.arc(imgPos[i].x + circleRadius -10, imgPos[i].y + circleRadius -10, circleRadius, 0, 2 * Math.PI);
                        context.stroke();

                        context.drawImage(image, imgPos[i].x, imgPos[i].y, imgArr[i].size*2, imgArr[i].size*2);
                    };
    
                }
            }

            if(size == "45mm"){
                const imgPos = [
                    { x: 80*2, y: 65*2 },
                    { x: 185*2, y: 65*2 },
                    { x: 127.5*2, y: 170*2 },
                    { x: 232.5*2, y: 170*2 },
                    { x: 80*2, y: 315*2 },
                    { x: 185*2, y: 315*2 },
                    { x: 127.5*2, y: 420*2 },
                    { x: 232.5*2, y: 420*2 },
                ]
    
                let imgArr = dataArr;
    
                for(let i = 0; i < imgArr.length; i++){
                    const image = new Image();
                    image.src = imgArr[i].image;
                    image.onload = () => {
                        const canvas = canvasRef.current;
                        const context = canvas.getContext('2d');

                        // 이미지 감싸는 원 테두리 그리기
                        const circleRadius = imgArr[i].size + 10; 
                        context.strokeStyle = "rgb(0, 0, 0)"; 
                        context.lineWidth = 1;
                        context.beginPath();
                        context.arc(imgPos[i].x + circleRadius -10, imgPos[i].y + circleRadius -10, circleRadius, 0, 2 * Math.PI);
                        context.stroke();

                        context.drawImage(image, imgPos[i].x, imgPos[i].y, imgArr[i].size*2, imgArr[i].size*2);
                    };
    
                }
            }
            
        }
        
    }, [dataArr])

    return(
        <>
            <canvas ref={canvasRef}></canvas>
        </>
    )
    
};

export default PrintImage;