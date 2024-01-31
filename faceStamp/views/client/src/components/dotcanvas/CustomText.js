import React, { useRef, useEffect, useState, useCallback } from 'react';
import style from "./../../styles/custom.module.css";
import { Stage, Layer, Group, Text } from 'react-konva';

const CustomText = ({family, fontsize, fontdata, fontcolor, fontstroke, fontsys, curveBool, curveOption}) => {

    const [textData, setTextData] = useState("");
    const [curveVal, setCurveVal] = useState(false);    // 커브옵션

    const [fontSys, setFontSys] = useState("horizon");
    const [txtWidth, setTxtWidth] = useState();
    const [txtWrap, setTxtWrap] = useState("none");

    const [strColor, setStrColor] = useState("white");

    useEffect(() => {
        setCurveVal(curveBool);
    }, [curveBool])

    useEffect(() => {
        if(fontdata != ""){
            setTextData(fontdata);
        }
    }, [fontdata])

    useEffect(() => {
        if(fontsys == "horizon"){
            setFontSys("horizon");
            setTxtWidth("auto");
            setTxtWrap("none")
            if(fontstroke){
                if(fontcolor == "black"){
                    setStrColor("white");
                } else {
                    setStrColor("black");
                }
            }
        } else {
            setFontSys("vertical");
            setTxtWrap("char")
            setTxtWidth(fontsize);
            if(fontstroke){
                if(fontcolor == "black"){
                    setStrColor("white");
                } else {
                    setStrColor("black");
                }
            }
        }
    }, [fontsys, fontstroke, fontcolor])

    useEffect(() => {
        if(fontstroke){
            if(fontcolor == "black"){
                setStrColor("white");
            } else {
                setStrColor("black");
            }
        }
    }, [fontstroke, fontcolor])

    useEffect(() => {}, [fontdata, family, fontsize, curveOption])

    const DrawCurvedText = () => {

        // Curved 텍스트

        let radius = 190;
        
        const chars = textData.split('');

        let angle = (fontsize/2 * chars.length) * Math.PI / 180;    // 180도
        const anglePerChar = angle/ chars.length;

        return (
            chars.map((data, index) => {
                let xpos;
                let ypos;
                let lng = chars.length/2;
                let rotAngle;
                if(fontSys == "horizon"){
                    //위
                    if(curveOption == 1){
                        if(lng >= index){
                            xpos = 225 + radius * Math.sin(-(index - lng) * anglePerChar + Math.PI);
                            ypos = 210 + radius * Math.cos(-(index - lng) * anglePerChar + Math.PI);
                        } else {
                            xpos = 225 + radius * Math.sin(-(index - lng) * anglePerChar + Math.PI);
                            ypos = 210 + radius * Math.cos(-(index - lng) * anglePerChar + Math.PI);
                        }
                        rotAngle = Math.abs(360 - (lng - index - 1)*15);
                        // rotAngle = 360 + (index - lng)*10;
                    //아래
                    } else {
                        if(lng > index){
                            xpos = 225 + radius * Math.sin((index - lng) * anglePerChar);
                            ypos = 210 + radius * Math.cos((index - lng) * anglePerChar);
                        } else {
                            xpos = 225 + radius * Math.sin((index - lng) * anglePerChar);
                            ypos = 210 + radius * Math.cos((index - lng) * anglePerChar);
                        }
                        rotAngle = Math.abs(360 + (lng - index - 1)*15);
                        // rotAngle = 360 - (index - lng)*10;
                    }
                } else {
                    //왼쪽
                    if(curveOption == 1){
                        if(lng >= index){
                            xpos = 210 + radius * Math.cos(-(index - lng) * anglePerChar + Math.PI);
                            ypos = 210 + radius * Math.sin(-(index - lng) * anglePerChar + Math.PI);
                        } else {
                            xpos = 210 + radius * Math.cos(-(index - lng) * anglePerChar + Math.PI);
                            ypos = 210 + radius * Math.sin(-(index - lng) * anglePerChar + Math.PI);
                        }

                        rotAngle = Math.abs(360 + (lng - index - 1)*15);
                        // rotAngle = 360 - (index - lng)*10;
                    //오른쪽
                    } else {
                        if(lng > index){
                            xpos = 210 + radius * Math.cos((index - lng) * anglePerChar);
                            ypos = 210 + radius * Math.sin((index - lng) * anglePerChar);
                        } else {
                            xpos = 210 + radius * Math.cos((index - lng) * anglePerChar);
                            ypos = 210 + radius * Math.sin((index - lng) * anglePerChar);
                        }
        
                        rotAngle = Math.abs(360 - (lng - index - 1)*15);
                        // rotAngle = 360 + (index - lng)*10;
                    }

                }

                if(fontstroke){
                    return(
                        <>
                            <Text
                                // key={index}
                                x={xpos}
                                y={ypos}
                                text={data}
                                fontSize={fontsize}
                                fontFamily={family}
                                fill={fontcolor}
                                stroke={strColor}
                                strokeWidth={5}
                                align="center"
                                rotation={rotAngle}
                                fillAfterStrokeEnabled={true}
                            />
                        </>
                    )
                } else {
                    return(
                        <>
                            <Text
                                // key={index}
                                x={xpos}
                                y={ypos}
                                text={data}
                                fontSize={fontsize}
                                fontFamily={family}
                                fill={fontcolor}
                                align="center"
                                rotation={rotAngle}
                            />
                        </>
                    )
                }

            })
        )
    }


    return (
        <div className={style.stamp_text}>
            <Stage width={450} height={450} >
                <Layer>
                    {curveVal == true ?
                        <Group>
                            {DrawCurvedText()}
                        </Group>
                        :
                        <>
                            {fontstroke ?
                                <Text
                                    x={0}
                                    y={0}
                                    text={textData}
                                    fontSize={fontsize}
                                    fontFamily={family}
                                    stroke={strColor}
                                    strokeWidth={5}
                                    wrap={txtWrap}
                                    width={txtWidth}
                                    fill={fontcolor}
                                    fillAfterStrokeEnabled={true}
                                />   
                            :
                                <Text
                                    x={0}
                                    y={0}
                                    text={textData}
                                    fontSize={fontsize}
                                    fontFamily={family}
                                    wrap={txtWrap}
                                    width={txtWidth}
                                    fill={fontcolor}
                                />
                            }
                        </>
                    }
                </Layer>
            </Stage>
        </div>
    );
}

export default CustomText;