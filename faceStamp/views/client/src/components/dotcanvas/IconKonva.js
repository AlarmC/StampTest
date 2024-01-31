import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Stage, Layer, Transformer, Image } from 'react-konva';

const IconKonva = ({imageData, chgIcon}) => {

    const imageRef = useRef([]);
    const trRef = useRef([]);
    const [icon, setIcon] = useState([]);
    const [selectedId, selectShape] = useState(null);

    const checkDeselect = (e) => {
        // 빈공간 클릭시 앵커 사라짐
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            selectShape(null);
        }
    };
  
    useEffect(() => {
        if (imageData != undefined) {
            if(imageData.length > 0){
                const image = new window.Image();
                image.src = imageData[0].icon;
                image.onload = () => {
                    setIcon([{
                        id: imageData[0].id,
                        x: imageData[0].x,
                        y: imageData[0].y,
                        scaleX: imageData[0].scaleX,
                        scaleY: imageData[0].scaleY,
                        rotation: imageData[0].rotation,
                        image: image,
                        dummy: imageData[0].icon,
                        type: "icon",
                    }])
                }
            }
        }
    }, [imageData]);
  
    const handleClick = (event, id) => {
        selectShape(id);
    };

    // 이미지 이동 시 호출되는 콜백 함수
    const handleDragEnd = (e, id) => {
        const node = imageRef.current[0];
        const updatedImages = icon.map((image, index) => {
            if (image.id === id) {
                // 이동된 이미지의 위치를 업데이트
                return {
                    ...image,
                    x: node._lastPos.x,
                    y: node._lastPos.y,
                    scaleX: node.attrs.scaleX,
                    scaleY: node.attrs.scaleY,
                    rotation: node.attrs.rotation
                };
            }
            return image;
        });
        setIcon(updatedImages);
        chgIcon(updatedImages[0]);
    };
  
    useEffect(() => {
        if (selectedId) {
            let data = parseInt(selectedId);
            trRef.current[data-1].nodes([imageRef.current[data-1]]);
            trRef.current[data-1].getLayer().batchDraw();
        }
    }, [selectedId]);
  
    return (
        <>
            {imageData != undefined ? (
                <Stage width={450} height={450} onMouseDown={checkDeselect} onTouchStart={checkDeselect} >
                    <Layer className={'class'}>
                        {icon &&
                            icon.map((icon, i) => {
                                return (
                                    <>
                                        <Image
                                            key={i}
                                            ref={el => (imageRef.current[i] = el)}
                                            {...icon}
                                            scaleX={icon.scaleX}
                                            scaleY={icon.scaleY}
                                            draggable
                                            onClick={(e) => handleClick(e, icon.id)}
                                            onTap={(e) => handleClick(e, icon.id)}
                                            onDragEnd={(e) => handleDragEnd(e, icon.id)}
                                            onTransformEnd={(e) => handleDragEnd(e, icon.id)}
                                        />
                                        {selectedId === icon.id && <Transformer ref={el => (trRef.current[i] = el)} boundBoxFunc={(oldBox, newBox) => newBox} />}
                                    </>
                                );
                                
                            })}
                    </Layer>
                </Stage>
            ) : null}
        </>
    );
}

export default IconKonva;