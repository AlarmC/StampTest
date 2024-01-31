import React, { useRef, useEffect, useState, useCallback } from 'react'
import Konva from 'konva';
import { Stage, Layer, Transformer, Text, Image, Circle, Group } from 'react-konva';

const PrintImgKonva = ({dataArr}) => {

    const imageRef = useRef([]);
    const [images, setImages] = useState([]);

  
    useEffect(() => {
        if(dataArr != undefined){
            let newDataArr = dataArr.map((item, index) => {
                const image = new window.Image();
                image.src = item.dummy;
                image.onload = () => {
                    setImages((prevData) => [
                        ...prevData,
                        {
                            id: item.id,
                            x: item.x * 2, // 이미지의 중심 x 좌표를 계산하여 원의 중심 x 좌표로 설정
                            y: item.y * 2, // 이미지의 중심 y 좌표를 계산하여 원의 중심 y 좌표로 설정
                            width: item.width * 2, // 이미지의 폭을 원의 지름으로 설정
                            height: item.height * 2, // 이미지의 높이를 원의 지름으로 설정
                            image: image,
                            type: 'image',
                        },
                    ]);
                };
                return null; // dataArr.map은 배열을 반환해야 하므로, 이 부분은 필요 없음
            });
        
            // newDataArr는 배열이기 때문에, 빈 요소(null)이 포함될 수 있으므로 해당 요소들을 제거하기 위해 filter 함수 사용
            newDataArr = newDataArr.filter((el) => el !== null);
        
            // 데이터 업데이트는 이미지 로드 후에 이루어져야 함
            setImages(newDataArr);
        }
    }, [dataArr]);
  
  
    return (
        <>
            {dataArr != undefined ? (
                <Stage width={793} height={1120}>
                    <Layer>
                        {images &&
                            images.map((data, i) => {
                                let circle_radi = 0;
                                if(data.width == 170){
                                    circle_radi = 93;
                                } else if(data.width == 143){
                                    circle_radi = 79.5;
                                } else if(data.width == 98){
                                    circle_radi = 57;
                                } else if(data.width == 87){
                                    circle_radi = 51.5;
                                } else if(data.width == 68){
                                    circle_radi = 42;
                                } else {
                                    circle_radi = 38;
                                }
                                return (
                                    <Group key={i}>
                                        <Circle
                                            x={95 + data.x - (190 - data.width)/2}
                                            y={95 + data.y - (190 - data.width)/2}
                                            radius={circle_radi} // 원의 지름을 95로 설정하므로 반지름은 95/2
                                            stroke="black"
                                            strokeWidth={1}
                                        />
                                        <Image
                                            ref={(el) => (imageRef.current[i] = el)}
                                            {...data}
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

export default PrintImgKonva;