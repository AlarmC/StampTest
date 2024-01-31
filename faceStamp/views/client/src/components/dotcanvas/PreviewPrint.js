import React, { useRef, useEffect, useState, useCallback } from 'react'
// import { Stage, Layer, Image, Transformer, Text } from 'react-konva';
import { useDispatch, useSelector } from "react-redux";

const PreviewPrint = ({dataArr, size}) => {

    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        // Set canvas size to the specified dimensions
        const canvasWidth = 400; // in pixels
        const canvasHeight = 570; // in pixels
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Draw the rectangles
        const rectangleWidth = 270; // in pixels
        const rectangleHeight = 220; // in pixels
        if(size == "26mm"){
            const rectanglePositions = [
                { x: 65, y: 50 },
                { x: 65, y: 300 },
            ];
    
            context.strokeStyle = 'black'; // Set rectangle and circle border color
            rectanglePositions.forEach(({ x, y }) => {
                context.strokeRect(x, y, rectangleWidth, rectangleHeight);
    
                // Draw the circles inside each rectangle
                const circleDiameter = 59; // in pixels
                const circleRadius = circleDiameter / 2;

                context.fillStyle = "#f6f6f6";
                
                context.beginPath();
                context.arc(x + circleRadius + 7, y + circleRadius + 34, circleRadius, 0, 2 * Math.PI);
                context.fill();
                context.stroke();
                
                context.beginPath();
                context.arc(x + circleRadius*3 + 14, y + circleRadius + 34, circleRadius, 0, 2 * Math.PI);
                context.fill();
                context.stroke();
    
                context.beginPath();
                context.arc(x + circleRadius*5 + 21, y + circleRadius + 34, circleRadius, 0, 2 * Math.PI);
                context.fill();
                context.stroke();
    
                context.beginPath();
                context.arc(x + circleRadius*7 + 28, y + circleRadius + 34, circleRadius, 0, 2 * Math.PI);
                context.fill();
                context.stroke();

                context.beginPath();
                context.arc(x + circleRadius + 7, y + rectangleHeight - circleRadius - 34, circleRadius, 0, 2 * Math.PI);
                context.fill();
                context.stroke();
                
                context.beginPath();
                context.arc(x + circleRadius*3 + 14, y + rectangleHeight - circleRadius - 34, circleRadius, 0, 2 * Math.PI);
                context.fill();
                context.stroke();
    
                context.beginPath();
                context.arc(x + circleRadius*5 + 21, y + rectangleHeight - circleRadius - 34, circleRadius, 0, 2 * Math.PI);
                context.fill();
                context.stroke();
    
                context.beginPath();
                context.arc(x + circleRadius*7 + 28, y + rectangleHeight - circleRadius - 34, circleRadius, 0, 2 * Math.PI);
                context.fill();
                context.stroke();
            });
        }

        if(size == "38mm"){
            const rectanglePositions = [
                { x: 65, y: 50 },
                { x: 65, y: 300 },
            ];
    
            context.strokeStyle = 'black'; // Set rectangle and circle border color
            rectanglePositions.forEach(({ x, y }) => {
                context.strokeRect(x, y, rectangleWidth, rectangleHeight);
    
                // Draw the circles inside each rectangle
                const circleDiameter = 81; // in pixels
                const circleRadius = circleDiameter / 2;

                context.fillStyle = "#f6f6f6";
                
                context.beginPath();
                context.arc(x + circleRadius + 6, y + circleRadius + 19, circleRadius, 0, 2 * Math.PI);
                context.fill();
                context.stroke();
                
                context.beginPath();
                context.arc(x + circleRadius*3 + 12, y + circleRadius + 19, circleRadius, 0, 2 * Math.PI);
                context.fill();
                context.stroke();

                context.beginPath();
                context.arc(x + circleRadius*5 + 18, y + circleRadius + 19, circleRadius, 0, 2 * Math.PI);
                context.fill();
                context.stroke();
    
                context.beginPath();
                context.arc(x + circleRadius + 6, y + rectangleHeight - circleRadius - 19, circleRadius, 0, 2 * Math.PI);
                context.fill();
                context.stroke();
    
                context.beginPath();
                context.arc(x + circleRadius*3 + 12, y + rectangleHeight - circleRadius - 19, circleRadius, 0, 2 * Math.PI);
                context.fill();
                context.stroke();

                context.beginPath();
                context.arc(x + circleRadius*5 + 18, y + rectangleHeight - circleRadius - 19, circleRadius, 0, 2 * Math.PI);
                context.fill();
                context.stroke();
            });
        }

        if(size == "45mm"){
            const rectanglePositions = [
                { x: 65, y: 50 },
                { x: 65, y: 300 },
            ];
    
            context.strokeStyle = 'black'; // Set rectangle and circle border color
            rectanglePositions.forEach(({ x, y }) => {
                context.strokeRect(x, y, rectangleWidth, rectangleHeight);

                context.fillStyle = "#f6f6f6";
    
                // Draw the circles inside each rectangle
                const circleDiameter = 95; // in pixels
                const circleRadius = circleDiameter / 2;
                
                context.beginPath();
                context.arc(x + circleRadius + 10, y + circleRadius + 10, circleRadius, 0, 2 * Math.PI);
                context.fill();
                context.stroke();
                
                context.beginPath();
                context.arc(x + circleRadius*3 + 20, y + circleRadius + 10, circleRadius, 0, 2 * Math.PI);
                context.fill();
                context.stroke();
    
                context.beginPath();
                context.arc(x + circleRadius*2 + 10, y + rectangleHeight - circleRadius - 10, circleRadius, 0, 2 * Math.PI);
                context.fill();
                context.stroke();
    
                context.beginPath();
                context.arc(x + circleRadius*4 + 20, y + rectangleHeight - circleRadius - 10, circleRadius, 0, 2 * Math.PI);
                context.fill();
                context.stroke();
            });
        }
        

        
    }, [size]);
    
    useEffect(() => {

        if(dataArr.length > 0){
            console.log(dataArr);

            if(size == "26mm"){
                const imgPos = [
                    { x: 77, y: 89 },
                    { x: 143, y: 89 },
                    { x: 209, y: 89 },
                    { x: 275, y: 89 },
                    { x: 77, y: 182 },
                    { x: 143, y: 182 },
                    { x: 209, y: 182 },
                    { x: 275, y: 182 },
                    { x: 77, y: 339 },
                    { x: 143, y: 339 },
                    { x: 209, y: 339 },
                    { x: 275, y: 339 },
                    { x: 77, y: 432 },
                    { x: 143, y: 432 },
                    { x: 209, y: 432 },
                    { x: 275, y: 432 },
                ]
    
                let imgArr = dataArr;
    
                for(let i = 0; i < imgArr.length; i++){
                    const image = new Image();
                    image.src = imgArr[i].image;
                    let x, y;
                    if(i%4 == 0){
                        x = 72 + (59 - imgArr[i].size) / 2;
                    } else if(i%4 == 1){
                        x = 138 + (59 - imgArr[i].size) / 2;
                    } else if(i%4 == 2){
                        x = 204 + (59 - imgArr[i].size) / 2;
                    } else if(i%4 == 3){
                        x = 270 + (59 - imgArr[i].size) / 2;
                    }

                    if(parseInt(i/4) == 0){
                        y = 84 + (59 - imgArr[i].size) / 2;
                    } else if(parseInt(i/4) == 1){
                        y = 177 + (59 - imgArr[i].size) / 2;
                    } else if(parseInt(i/4) == 2){
                        y = 334 + (59 - imgArr[i].size) / 2;
                    } else if(parseInt(i/4) == 3){
                        y = 427 + (59 - imgArr[i].size) / 2;
                    }
                    image.onload = () => {
                        const canvas = canvasRef.current;
                        const context = canvas.getContext('2d');
                        context.drawImage(image, x, y, imgArr[i].size, imgArr[i].size);
                    };
    
                }
            }

            if(size == "38mm"){
                const imgPos = [
                    { x: 75.75, y: 73.75 },
                    { x: 162.75, y: 73.75 },
                    { x: 249.75, y: 73.75 },
                    { x: 75.75, y: 174.75 },
                    { x: 162.75, y: 174.75 },
                    { x: 249.75, y: 174.75 },
                    { x: 75.75, y: 323.75 },
                    { x: 162.75, y: 323.75 },
                    { x: 249.75, y: 323.75 },
                    { x: 75.75, y: 424.75 },
                    { x: 162.75, y: 424.75 },
                    { x: 249.75, y: 424.75 },
                ]
    
                let imgArr = dataArr;
    
                for(let i = 0; i < imgArr.length; i++){
                    const image = new Image();
                    image.src = imgArr[i].image;
                    image.onload = () => {
                        const canvas = canvasRef.current;
                        const context = canvas.getContext('2d');
                        context.drawImage(image, imgPos[i].x, imgPos[i].y, imgArr[i].size, imgArr[i].size);
                    };
    
                }
            }

            if(size == "45mm"){
                const imgPos = [
                    { x: 80, y: 65 },
                    { x: 185, y: 65 },
                    { x: 127.5, y: 170 },
                    { x: 232.5, y: 170 },
                    { x: 80, y: 315 },
                    { x: 185, y: 315 },
                    { x: 127.5, y: 420 },
                    { x: 232.5, y: 420 },
                ]
    
                let imgArr = dataArr;
    
                for(let i = 0; i < imgArr.length; i++){
                    const image = new Image();
                    image.src = imgArr[i].image;
                    image.onload = () => {
                        const canvas = canvasRef.current;
                        const context = canvas.getContext('2d');
                        context.drawImage(image, imgPos[i].x, imgPos[i].y, imgArr[i].size, imgArr[i].size);
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

export default PreviewPrint;