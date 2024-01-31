import React, { useRef, useEffect, useState, useCallback } from 'react';
import CircleType from 'circletype';
import {fabric} from 'fabric';
import style from "./../../styles/custom.module.css";
// import { Stage, Layer, Group, Image, Circle, Transformer, TextPath } from 'react-konva';

const CustomTextArr = ({data}) => {

    const [textData, setTextData] = useState(null);
    const [textArr, setTextArr] = useState([]);

    useEffect(() => {
        if(data != null){
            setTextData(data);
            let splitData = data.contents;
            let arr = splitData.split("");
            setTextArr(arr);
        }
    }, [data])

    const upRef = useRef(null);
    const downRef = useRef(null);

    const radius = 225;
    const distance = 190;

    const [mWidth, setMWidth] = useState(0);
    const [mHeight, setMHeight] = useState(0);
    
    useEffect(() => {
        if(textData != null){
            // let data = textData.contents;
            // let arr = data.split("");
            // setTextArr(arr);
            if (upRef.current) {
                // CircleType 라이브러리를 적용합니다.
                let circleType = new CircleType(upRef.current);
                // 원의 반지름을 설정합니다. 원의 크기에 맞게 조정해주세요.
                circleType.radius(220);
                // 원의 중점을 설정합니다. 원의 중점에 맞게 조정해주세요.
                circleType.dir(1); // 시계 방향 (반시계 방향은 -1)

                // 문자 위치 추출
                const charPosition = textArr.map((char, index) => {
                    const element = upRef.current.children[0].children[index];
                    const rect = element.getBoundingClientRect();
                    return {
                        char,
                        lefts: element.offsetLeft,
                        left: rect.left,
                        right: rect.right,
                        y: rect.top + rect.height / 2,
                    }
                });


                const xValue1 = charPosition.map((char) => char.left);
                const xValue2 = charPosition.map((char) => char.right);
                const yValue = charPosition.map((char) => char.y);

                const minX = Math.min(...xValue1);
                const maxX = Math.max(...xValue2);
                const minY = Math.min(...yValue);
                const maxY = Math.max(...yValue);

                console.log(maxX, minX, textData.size);
                console.log((maxX - minX) + parseInt(textData.size) / 2)

                setMWidth((maxX - minX) + parseInt(textData.size) / 2);
                setMHeight(maxY - minY);
                
            }
            if (downRef.current) {
                let circleType = new CircleType(downRef.current);
                // 원의 반지름을 설정합니다. 원의 크기에 맞게 조정해주세요.
                circleType.radius(220);
                // 원의 중점을 설정합니다. 원의 중점에 맞게 조정해주세요.
                circleType.dir(-1); // 시계 방향 (반시계 방향은 -1)

                // 문자 위치 추출
                const charPosition = textArr.map((char, index) => {
                    const element = upRef.current.children[0].children[index];
                    const rect = element.getBoundingClientRect();
                    return {
                        char,
                        rect: rect,
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height / 2,
                    }
                });

                console.log(charPosition);

                const xValue = charPosition.map((char) => char.x);
                const yValue = charPosition.map((char) => char.y);

                const maxX = Math.max(...xValue);
                const minX = Math.min(...xValue);
                const maxY = Math.max(...yValue);
                const minY = Math.min(...yValue);

                console.log(xValue);

                setMWidth(maxX - minX + 35);
                setMHeight(maxY - minY + 35);
            }
        }
    }, [upRef, downRef, textArr]);


    useEffect(() => {
        if(mWidth > 0){
        }
    } , [mWidth, mHeight]);

    return (
        (textData != null &&
            (textData.fontsys == "horizon" ?
                (textData.option == 1 ?
                    <div id={"testData"} ref={upRef} style={{position:"absolute", top: "12px", left: "50%", width:`${mWidth}px`, transform:"translateX(-50%)"}}>{textData.contents}</div>
                    :
                    <div ref={downRef} style={{position:"absolute", bottom: "12px", left: "50%"}}>{textData.contents}</div>
                )
                :
                (textData.option == 1 ?
                    (textArr.map((char, index) => {
                        let texthalf = textArr.length / 2;
                        let angle = 270;
                        let x = 0;
                        let y = 0;
                        let rotAngle = 0;
                        if(texthalf >= index){
                            angle = 270 + (texthalf - index - 1) * parseInt((textData.size)/3);
                            let angleRad  = (angle * Math.PI) / 180;
                            let data = angle%360;
                            rotAngle = Math.abs(360 + (texthalf - index - 1)*15)
                            if(data<=360 && data > 270){
                                x = radius + (distance * Math.sin(angleRad));
                                y = radius - (distance * Math.cos(angleRad));
                            } else if(data<=270 && data > 180){
                                x = radius + (distance * Math.sin(angleRad));
                                y = radius - (distance * Math.cos(angleRad));
                            } else if(data<=180 && data > 90){
                                x = radius + (distance * Math.sin(angleRad));
                                y = radius - (distance * Math.cos(angleRad));
                            } else {
                                x = radius + (distance * Math.sin(angleRad));
                                y = radius - (distance * Math.cos(angleRad));
                            }
                        } else {
                            angle = 270 + (texthalf - index - 1) * parseInt((textData.size)/3);
                            let data = angle%360;
                            let angleRad  = (angle * Math.PI) / 180;
                            rotAngle = Math.abs(360 + (texthalf - index - 1)*15);
                            if(data<=360 && data > 270){
                                x = radius + (distance * Math.sin(angleRad));
                                y = radius - (distance * Math.cos(angleRad));
                            } else if(data<=270 && data > 180){
                                x = radius + (distance * Math.sin(angleRad));
                                y = radius - (distance * Math.cos(angleRad));
                            } else if(data<=180 && data > 90){
                                x = radius + (distance * Math.sin(angleRad));
                                y = radius - (distance * Math.cos(angleRad));
                            } else {
                                x = radius + (distance * Math.sin(angleRad));
                                y = radius - (distance * Math.cos(angleRad));
                            }
                        }

                        return (
                            <span
                                key={index}
                                style={{
                                    position: 'absolute',
                                    transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotAngle}deg)`,
                                }}
                            >
                                {char}
                            </span>
                        );
                    }))
                :
                (textArr.map((char, index) => {
                    let texthalf = textArr.length / 2;
                    let angle = 90;
                    let x = 0;
                    let y = 0;
                    let rotAngle = 0;
                    if(texthalf >= index){
                        angle = 90 - (texthalf - index - 1) * parseInt((textData.size)/3);
                        let angleRad  = (angle * Math.PI) / 180;
                        let data = angle%360;
                        rotAngle = Math.abs(360 - (texthalf - index - 1)*15)
                        if(data<=360 && data > 270){
                            x = radius + (distance * Math.sin(angleRad));
                            y = radius - (distance * Math.cos(angleRad));
                        } else if(data<=270 && data > 180){
                            x = radius + (distance * Math.sin(angleRad));
                            y = radius - (distance * Math.cos(angleRad));
                        } else if(data<=180 && data > 90){
                            x = radius + (distance * Math.sin(angleRad));
                            y = radius - (distance * Math.cos(angleRad));
                        } else {
                            x = radius + (distance * Math.sin(angleRad));
                            y = radius - (distance * Math.cos(angleRad));
                        }
                    } else {
                        angle = 90 - (texthalf - index - 1) * parseInt((textData.size)/3);
                        let data = angle%360;
                        let angleRad  = (angle * Math.PI) / 180;
                        rotAngle = Math.abs(360 - (texthalf - index - 1)*15);
                        if(data<=360 && data > 270){
                            x = radius + (distance * Math.sin(angleRad));
                            y = radius - (distance * Math.cos(angleRad));
                        } else if(data<=270 && data > 180){
                            x = radius + (distance * Math.sin(angleRad));
                            y = radius - (distance * Math.cos(angleRad));
                        } else if(data<=180 && data > 90){
                            x = radius + (distance * Math.sin(angleRad));
                            y = radius - (distance * Math.cos(angleRad));
                        } else {
                            x = radius + (distance * Math.sin(angleRad));
                            y = radius - (distance * Math.cos(angleRad));
                        }
                    }

                    return (
                        <span
                            key={index}
                            style={{
                                position: 'absolute',
                                transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotAngle}deg)`,
                            }}
                        >
                            {char}
                        </span>
                    );
                }))
                )
            )
        )
    );
}

export default CustomTextArr;