import React, { useRef, useEffect, useState, useCallback } from 'react'
import Konva from 'konva';
import { Stage, Layer, Transformer, Text, Image, Line, Rect, Group } from 'react-konva';

const DataKonva = ({dataArr, textArr, tempArr, convert, delArr, cancel}) => {

    const imageRef = useRef([]);
    const trRef = useRef([]);
    const [datas, setDatas] = useState([]);             // 일반 글자 , 이미지
    const [selectedId, selectShape] = useState(null);

    const [curveArr, setCurveArr] = useState([]);

    const [temps, setTemps] = useState([]);             // 아이콘 이미지

    const checkDeselect = (e) => {
        // 빈공간 클릭시 앵커 사라짐
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            selectShape(null);
        }
    };

    useEffect(() => {
        if(convert != null){
            selectShape(null);
        }
    }, [convert])
  
    useEffect(() => {
        if (dataArr != undefined) {
            if(dataArr.length > 0){
                let dataNum = dataArr.length;
                if(dataArr[dataNum-1].type == "text"){
                    if(dataArr[dataNum-1].stroke == true){
                        setDatas([...datas, {
                            id: dataArr[dataNum -1].id,
                            x:0,
                            y:0,
                            fontSize: dataArr[dataNum -1].size,
                            text: dataArr[dataNum -1].contents,
                            fontFamily: dataArr[dataNum -1].family,
                            fill: dataArr[dataNum -1].color,
                            stroke: dataArr[dataNum -1].color == "black" ? "white" : "black",
                            strokeWidth : 5,
                            fillAfterStrokeEnabled: true,
                            wrap: dataArr[dataNum - 1].fontsys == "horizon" ? "none" : "char",
                            width: dataArr[dataNum - 1].fontsys == "vertical" ? dataArr[dataNum-1].size : "auto", 
                            type: "text",
                        }])
                    } else if(dataArr[dataNum-1].stroke == false){
                        setDatas([...datas, {
                            id: dataArr[dataNum -1].id,
                            x:0,
                            y:0,
                            fontSize: dataArr[dataNum -1].size,
                            text: dataArr[dataNum -1].contents,
                            fontFamily: dataArr[dataNum -1].family,
                            fill: dataArr[dataNum -1].color,
                            wrap: dataArr[dataNum - 1].fontsys == "horizon" ? "none" : "char",
                            width: dataArr[dataNum - 1].fontsys == "vertical" ? dataArr[dataNum-1].size : "auto", 
                            type: "text",
                        }])
                    }
                } else if(dataArr[dataNum-1].type == "icon"){
                    const image = new window.Image();
                    image.src = dataArr[dataNum -1].icon;
                    image.onload = () => {
                        setDatas([...datas, {
                            id: dataArr[dataNum - 1].id,
                            x: 80,
                            y: 80,
                            width: dataArr[dataNum -1].size,
                            height: dataArr[dataNum -1].size,
                            image: image,
                            type: "image",
                        }])
                    }
                    setTemps([]);
                }
            }
        }
    }, [dataArr]);

    useEffect(() => {
        if(textArr != undefined){
            if(textArr.length > 0){
                let textNum = textArr.length;
                setCurveArr([...curveArr, {
                    id: textArr[textNum -1].id,
                    x:0,
                    y:0,
                    fontSize: textArr[textNum -1].size,
                    text: textArr[textNum -1].contents,
                    fontFamily: textArr[textNum -1].family,
                    fill: textArr[textNum -1].color,
                    stroke: textArr[textNum -1].stroke,
                    strokeColor : textArr[textNum -1].color == "black" ? "white" : "black",
                    fontsys : textArr[textNum -1].fontsys,
                    option : textArr[textNum -1].option,
                    type: "text",
                }])
            }
        }
    }, [textArr])

    const DrawCurvedText = (str) => {

        // Curved 텍스트

        let fontSize = 30;

        let radius = 190;
        
        const chars = str.text.split('');

        let angle = (str.fontSize/2 * chars.length) * Math.PI / 180;    // 180도
        const anglePerChar = angle/ chars.length;

        return (
            chars.map((data, index) => {
                let xpos;
                let ypos;
                let lng = chars.length/2;
                let rotAngle;
                if(str.fontsys == "horizon"){
                    //위
                    if(str.option == 1){
                        if(lng > index){
                            xpos = 225 + radius * Math.sin(-(index - lng) * anglePerChar + Math.PI);
                            ypos = 210 + radius * Math.cos(-(index - lng) * anglePerChar + Math.PI);
                        } else {
                            xpos = 225 + radius * Math.sin(-(index - lng) * anglePerChar + Math.PI);
                            ypos = 210 + radius * Math.cos(-(index - lng) * anglePerChar + Math.PI);
                        }
                        rotAngle = 360 + (index - lng)*10;
                    //아래
                    } else {
                        if(lng > index){
                            xpos = 225 + radius * Math.sin((index - lng) * anglePerChar);
                            ypos = 210 + radius * Math.cos((index - lng) * anglePerChar);
                        } else {
                            xpos = 225 + radius * Math.sin((index - lng) * anglePerChar);
                            ypos = 210 + radius * Math.cos((index - lng) * anglePerChar);
                        }
        
                        rotAngle = 360 - (index - lng)*10;
                    }
                } else {
                    //왼쪽
                    if(str.option == 1){
                        if(lng > index){
                            xpos = 210 + radius * Math.cos(-(index - lng) * anglePerChar + Math.PI);
                            ypos = 210 + radius * Math.sin(-(index - lng) * anglePerChar + Math.PI);
                        } else {
                            xpos = 210 + radius * Math.cos(-(index - lng) * anglePerChar + Math.PI);
                            ypos = 210 + radius * Math.sin(-(index - lng) * anglePerChar + Math.PI);
                        }

                        rotAngle = 360 - (index - lng)*10;
                    //오른쪽
                    } else {
                        if(lng > index){
                            xpos = 210 + radius * Math.cos((index - lng) * anglePerChar);
                            ypos = 210 + radius * Math.sin((index - lng) * anglePerChar);
                        } else {
                            xpos = 210 + radius * Math.cos((index - lng) * anglePerChar);
                            ypos = 210 + radius * Math.sin((index - lng) * anglePerChar);
                        }
        
                        rotAngle = 360 + (index - lng)*10;
                    }

                }

                let strokeColor;
                if(str.fill == "black"){
                    strokeColor = "white"
                } else {
                    strokeColor = "black"
                }
                if(str.stroke){
                    return(
                        <>
                            <Text
                                key={index}
                                x={xpos}
                                y={ypos}
                                text={data}
                                fontSize={str.fontSize}
                                fontFamily={str.fontFamily}
                                fill={str.fill}
                                stroke={strokeColor}
                                strokeWidth={5}
                                fillAfterStrokeEnabled={true}
                                align="center"
                                rotation={rotAngle}
                                onClick={() => {
                                    selectShape(str.id);
                                }}
                            />
                        </>
                    )
                } else {
                    return(
                        <>
                            <Text
                                key={index}
                                x={xpos}
                                y={ypos}
                                text={data}
                                fontSize={str.fontSize}
                                fontFamily={str.fontFamily}
                                fill={str.fill}
                                align="center"
                                rotation={rotAngle}
                                onClick={() => {
                                    selectShape(str.id);
                                }}
                            />
                        </>
                    )
                }

            })
        )
    }

    useEffect(() => {
        if(tempArr != undefined){
            if(tempArr.length > 0){
                const image = new window.Image();
                image.src = tempArr[0].icon;
                image.onload = () => {
                    setTemps([{
                        id: tempArr[0].id,
                        x: 80,
                        y: 80,
                        width: tempArr[0].size,
                        height: tempArr[0].size,
                        image: image,
                        type: "image",
                    }])
                }
            }
        }
    }, [tempArr])

    useEffect(() => {
        
    }, [temps])

    useEffect(() => {
        if(cancel != null){
            const updatedDatas = datas.map((data) => {
                console.log(data.id == cancel);
                console.log(data.id == parseInt(cancel));
                if (data.id === cancel) {
                    return {
                        ...data,
                        visible: false, // Toggle visibility
                    };
                }
                return data;
            });
            setDatas(updatedDatas);
        }
    }, [cancel])

    useEffect(() => { }, [datas])
  
    const handleClick = (event, id) => {
        selectShape(id);
    };

    // 이미지 이동 시 호출되는 콜백 함수
    const handleDragEnd = (e, id) => {
        const updatedImages = datas.map((image, index) => {
            if (image.id === id) {
                // 이동된 이미지의 위치를 업데이트
                return {
                    ...image,
                    x: e.target.x(),
                    y: e.target.y(),
                };
            }
            return image;
        });
        setDatas(updatedImages);
    };
  
    useEffect(() => {
        if (selectedId) {
            let data = parseInt(selectedId);
            trRef.current[data-1].nodes([imageRef.current[data-1]]);
            trRef.current[data-1].getLayer().batchDraw();
        }
    }, [selectedId]);

    const handleDelete = (id) => {
        // const newDatas = datas.filter((array) => array.id !== id);
        // setDatas(newDatas);
        // delArr(id);
        // selectShape(null);

        const deletedData = datas.find((data) => data.id === id);
        if (!deletedData) {
            return; // Return early if the data to be deleted is not found
        }

        const updatedDatas = datas.filter((data) => data.id !== id);
        setDatas(updatedDatas);
        delArr(id);
        selectShape(null);

        // Remove the deleted item's references from the arrays
        const dataIndex = datas.indexOf(deletedData);
        if (dataIndex >= 0) {
            trRef.current.splice(dataIndex, 1);
            imageRef.current.splice(dataIndex, 1);
        }

        // Check if datas is empty and clear refs accordingly
        if (updatedDatas.length === 0) {
            trRef.current = [];
            imageRef.current = [];
        }
    }
  
    return (
        <>
            {dataArr != undefined || tempArr != undefined || textArr != undefined ? (
                <Stage width={450} height={450} onMouseDown={checkDeselect} onTouchStart={checkDeselect} >
                    <Layer>
                        {datas &&
                            datas.map((data, i) => {
                                if(data.type == "text"){
                                    return (
                                        <>
                                            <Text
                                                key={i}
                                                ref={el => (imageRef.current[i] = el)}
                                                {...data}
                                                draggable
                                                onClick={(e) => handleClick(e, data.id)}
                                                onTap={(e) => handleClick(e, data.id)}
                                                onDragEnd={(e) => handleDragEnd(e, data.id)}
                                            />
                                            {selectedId === data.id && 
                                                <>
                                                    <Transformer ref={el => (trRef.current[i] = el)} boundBoxFunc={(oldBox, newBox) => newBox} />
                                                    <Rect
                                                        stroke="rgb(127, 207, 255)"
                                                        x={data.x-20}
                                                        y={data.y-20}
                                                        width={10}
                                                        height={10}
                                                        fill="white"
                                                        onClick={() => handleDelete(data.id)}
                                                    />
                                                    <Line
                                                        points={[
                                                            data.x - 20, data.y - 10,  // 시작점
                                                            data.x - 10, data.y - 20  // 끝점
                                                        ]}
                                                        stroke="rgb(127, 207, 255)"
                                                        strokeWidth={2}
                                                        onClick={() => handleDelete(data.id)}
                                                    />
                                                    <Line
                                                        points={[
                                                            data.x - 20, data.y - 20,  // 시작점
                                                            data.x - 10, data.y - 10  // 끝점
                                                        ]}
                                                        stroke="rgb(127, 207, 255)"
                                                        strokeWidth={2}
                                                        onClick={() => handleDelete(data.id)}
                                                    />
                                                </>
                                            }
                                        </>
                                    );
                                } else if(data.type == "image"){
                                    return (
                                        <>
                                            <Image
                                                key={i}
                                                ref={el => (imageRef.current[i] = el)}
                                                {...data}
                                                draggable
                                                filters={[Konva.Filters.Threshold]}
                                                blurRadius={1}
                                                onClick={(e) => handleClick(e, data.id)}
                                                onTap={(e) => handleClick(e, data.id)}
                                                onDragEnd={(e) => handleDragEnd(e, data.id)}
                                            />
                                            {selectedId === data.id && 
                                                <>
                                                    <Transformer ref={el => (trRef.current[i] = el)} boundBoxFunc={(oldBox, newBox) => newBox} />
                                                    <Rect
                                                        stroke="rgb(127, 207, 255)"
                                                        x={data.x-20}
                                                        y={data.y-20}
                                                        width={10}
                                                        height={10}
                                                        fill="white"
                                                        onClick={() => handleDelete(data.id)}
                                                    />
                                                    <Line
                                                        points={[
                                                            data.x - 20, data.y - 10,  // 시작점
                                                            data.x - 10, data.y - 20  // 끝점
                                                        ]}
                                                        stroke="rgb(127, 207, 255)"
                                                        strokeWidth={2}
                                                        onClick={() => handleDelete(data.id)}
                                                    />
                                                    <Line
                                                        points={[
                                                            data.x - 20, data.y - 20,  // 시작점
                                                            data.x - 10, data.y - 10  // 끝점
                                                        ]}
                                                        stroke="rgb(127, 207, 255)"
                                                        strokeWidth={2}
                                                        onClick={() => handleDelete(data.id)}
                                                    />
                                                </>
                                            }
                                        </>
                                    );
                                }
                                
                            })}
                        {curveArr &&
                        curveArr.map((data, i) => {
                            return(
                                <>
                                    <Group id={"gr_" + data.id} draggable ref={el => (imageRef.current[i] = el)}>
                                        {DrawCurvedText(data)}
                                    </Group>
                                    {selectedId && 
                                        <Transformer
                                            ref={el => (trRef.current[i] = el)} boundBoxFunc={(oldBox, newBox) => newBox}
                                        />
                                    }
                                </>
                            )
                        })
                    }
                    </Layer>
                    <Layer>
                        {temps &&
                            temps.map((data, i) => {
                                return (
                                    <>
                                        <Image
                                            key={i}
                                            {...data}
                                            draggable={false}
                                            listening={false}
                                        />
                                    </>
                                )
                            })
                        }
                    </Layer>
                </Stage>
            ) : null}
        </>
    );
}

export default DataKonva;