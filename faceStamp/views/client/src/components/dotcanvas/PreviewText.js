import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from "react-redux";
import CircleType from 'circletype';
// import { Stage, Layer, Group, Image, Circle, Transformer, TextPath } from 'react-konva';

const PreviewText = ({color, stroke}) => {

    const { dotinfo } = useSelector(({ dotinfo }) => ({
        dotinfo: dotinfo.dotinfo,
    }));

    const textRef = useRef(null);
    const numberRef = useRef(null);

    useEffect(() => {
        if (textRef.current) {
            // CircleType 라이브러리를 적용합니다.
            const circleType = new CircleType(textRef.current);
            // 원의 반지름을 설정합니다. 원의 크기에 맞게 조정해주세요.
            circleType.radius(75);
            // 원의 중점을 설정합니다. 원의 중점에 맞게 조정해주세요.
            circleType.dir(1); // 시계 방향 (반시계 방향은 -1)
        }
        if (numberRef.current) {
            const circleType = new CircleType(numberRef.current);
            // 원의 반지름을 설정합니다. 원의 크기에 맞게 조정해주세요.
            circleType.radius(75);
            // 원의 중점을 설정합니다. 원의 중점에 맞게 조정해주세요.
            circleType.dir(-1); // 시계 방향 (반시계 방향은 -1)
        }
    }, [textRef, numberRef, dotinfo]);


    // 스타일 A 유형
    const text = dotinfo.name.split('');
    const radius = 75;
    const distance = 60;

    const [strokeColor, setStrokeColor] = useState("white");

    useEffect(() => {
        if(color == "black"){
            setStrokeColor("white");
        } else if(color == "white"){
            setStrokeColor("black");
        }
    }, [color, stroke])

    return (
        <div className='stamp_dot_text' 
            style={stroke ?
                {pointerEvents: "none", color: `${color}`, position: "absolute", fontSize:"13px", fontWeight:"bold", width: "150px", height: "150px",
                textShadow: `-3px -3px 3px ${strokeColor}, 3px -3px 3px ${strokeColor}, -3px 3px 3px ${strokeColor}, 3px 3px 3px ${strokeColor}`,}
                :
                {pointerEvents: "none", color: `${color}`, position: "absolute", fontSize:"13px", fontWeight:"bold", width: "150px", height: "150px",}
            }
        >
            {dotinfo.style == "A" &&
                (text.map((char, index) => {
                    let texthalf = text.length / 2;
                    let angle = 270;
                    let x = 0;
                    let y = 0;
                    let rotAngle = 0;
                    if(texthalf >= index){
                        angle = 270 + (texthalf - index - 1) * 17;
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
                        angle = 270 + (texthalf - index - 1) * 17;
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
                                pointerEvents: "auto",
                                zIndex: "3",
                                transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotAngle}deg)`,
                            }}
                        >
                            {char}
                        </span>
                    );
                }))
            }
            {dotinfo.style =="B" &&
                <>
                    <div className='stamp_b_name' >{dotinfo.name}</div>
                    <div className='stamp_b_num1' >{dotinfo.num1}</div>
                    <div className='stamp_b_num2' >{dotinfo.num2}</div>
                    <div className='stamp_b_num3' >{dotinfo.num3}</div>
                </>
            }
            {dotinfo.style =="C" &&
                <>
                    <div className='stamp_c_div preview_c_top' ref={textRef}>{dotinfo.name}</div>
                    <div className='stamp_c_div preview_c_bottom' style={{position:"absolute", bottom: "0", left: "50%"}} ref={numberRef}>{dotinfo.number}</div>
                </>
            }
            {dotinfo.style =="D" &&
                <>
                    <div className='stamp_c_div stamp_c_top' ref={textRef}>{dotinfo.name}</div>
                    <div className='stamp_c_div stamp_c_bottom' style={{position:"absolute", bottom: "0", left: "50%"}} ref={numberRef}>{dotinfo.cont}</div>
                </>
            }
        </div>
    );
}

export default PreviewText;