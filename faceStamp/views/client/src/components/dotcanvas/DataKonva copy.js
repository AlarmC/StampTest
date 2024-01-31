import React, { useRef, useEffect, useState, useCallback } from 'react'
import Konva from 'konva';
import { Stage, Layer, Transformer, Text, Image, Line, Rect } from 'react-konva';

const DataKonva = ({dataArr, convert, delArr}) => {

    const imageRef = useRef([]);
    const trRef = useRef([]);
    const [datas, setDatas] = useState([]);
    const [selectedId, selectShape] = useState(null);

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
                            family: dataArr[dataNum -1].family,
                            fill: dataArr[dataNum -1].color,
                            stroke: dataArr[dataNum -1].color == "black" ? "white" : "black",
                            strokeWidth : 1,
                            type: "text",
                        }])
                    } else if(dataArr[dataNum-1].stroke == false){
                        setDatas([...datas, {
                            id: dataArr[dataNum -1].id,
                            x:0,
                            y:0,
                            fontSize: dataArr[dataNum -1].size,
                            text: dataArr[dataNum -1].contents,
                            family: dataArr[dataNum -1].family,
                            fill: dataArr[dataNum -1].color,
                            type: "text",
                        }])
                    }
                } else if(dataArr[dataNum-1].type == "icon"){
                    const image = new window.Image();
                    image.src = dataArr[dataNum -1].icon;
                    image.onload = () => {
                        setDatas([...datas, {
                            id: dataArr[dataNum - 1].id,
                            x: 30,
                            y: 30,
                            width: dataArr[dataNum -1].size,
                            height: dataArr[dataNum -1].size,
                            image: image,
                            type: "image",
                        }])
                    }
                }
            }
        }
    }, [dataArr]);

    useEffect(() => {
        console.log(datas);
    }, [datas])
  
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
        const newDatas = datas.filter((array) => array.id !== id);
        setDatas(newDatas);
        delArr(id);
        selectShape(null);
    }
  
    return (
        <>
            {dataArr != undefined ? (
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
                                                fontFamily={data.family}
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
                    </Layer>
                </Stage>
            ) : null}
        </>
    );
}

export default DataKonva;