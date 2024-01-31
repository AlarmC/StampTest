import React, { useRef, useEffect, useState, useCallback } from 'react'
import Konva from 'konva';
import { Stage, Layer, Transformer, Text, Image, Circle, Group } from 'react-konva';

const PreviewImgKonva = ({dataArr, sendData}) => {

    const imageRef = useRef([]);
    const trRef = useRef([]);
    const [datas, setDatas] = useState([]);

  
    useEffect(() => {
        if (dataArr != undefined) {
            if(dataArr.length > 0){
                let no = 0;
                let dataNum = dataArr.length;
                const image = new window.Image();
                image.src = dataArr[dataNum -1].image;
                image.onload = () => {
                    setDatas([...datas, {
                        id: dataNum,
                        x: 30,
                        y: 30,
                        width: dataArr[dataNum -1].size,
                        height: dataArr[dataNum -1].size,
                        image: image,
                        dummy: dataArr[dataNum -1].image,
                        type: "image",
                    }])
                }
            }
        }
    }, [dataArr]);

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
        if(datas.length > 0){
            sendData(datas);
        }
    }, [datas])
  
  
    return (
        <>
            {dataArr != undefined ? (
                <Stage width={400} height={570}>
                    <Layer>
                        {datas &&
                            datas.map((data, i) => {
                                let circle_radi = 0;
                                if(data.width == 85){
                                    circle_radi = 93;
                                } else if(data.width == 71.5){
                                    circle_radi = 79.5;
                                } else if(data.width == 49){
                                    circle_radi = 57;
                                } else if(data.width == 43.5){
                                    circle_radi = 51.5;
                                } else if(data.width == 34){
                                    circle_radi = 42;
                                } else {
                                    circle_radi = 38;
                                }
                                console.log(data.width, circle_radi);
                                return (
                                    <Group key={i}>
                                        <Circle
                                            x={47.5 + data.x - (95 - data.width)/2}
                                            y={47.5 + data.y - (95 - data.width)/2}
                                            radius={circle_radi/2} // 원의 지름을 95로 설정하므로 반지름은 95/2
                                            stroke="black"
                                            strokeWidth={1}
                                        />
                                        <Image
                                            ref={(el) => (imageRef.current[i] = el)}
                                            {...data}
                                            draggable
                                            onDragEnd={(e) => handleDragEnd(e, data.id)}
                                        />
                                    </Group>
                                );
                                
                            })}
                    </Layer>
                </Stage>
            ) : null}
        </>
    );
}

export default PreviewImgKonva;