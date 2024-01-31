import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Stage, Layer, Transformer, Text } from 'react-konva';

const TextKonva = ({textData}) => {

    const imageRef = useRef([]);
    const trRef = useRef([]);
    const [txt, setTxt] = useState([]);
    const [selectedId, selectShape] = useState(null);

    const checkDeselect = (e) => {
        // 빈공간 클릭시 앵커 사라짐
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            selectShape(null);
        }
    };
  
    useEffect(() => {
        if (textData != undefined) {
            let no = 0;
            let data = textData.map((item,index) => {
                no++;
                if(item.stroke == true){
                    return({
                        id: no,
                        x:0,
                        y:0,
                        fontSize: item.size,
                        text: item.contents,
                        family: item.family,
                        color: item.color,
                        stroke: item.color == "black" ? "white" : "black",
                        strokeWidth : 3,
                    })  
                } else if(item.stroke == false){
                    return({
                        id: no,
                        x:0,
                        y:0,
                        fontSize: item.size,
                        text: item.contents,
                        family: item.family,
                        color: item.color,
                    })    
                }
            })

            setTxt(data);
        }
    }, [textData]);
  
    const handleClick = (event, id) => {
        selectShape(id);
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
            {textData != undefined ? (
                <Stage width={450} height={450} onMouseDown={checkDeselect} onTouchStart={checkDeselect} >
                    <Layer className={'class'}>
                        {txt &&
                            txt.map((text, i) => {
                                return (
                                    <>
                                        <Text
                                            key={i}
                                            ref={el => (imageRef.current[i] = el)}
                                            {...text}
                                            fontFamily={text.family}
                                            draggable
                                            onClick={(e) => handleClick(e, text.id)}
                                            onTap={(e) => handleClick(e, text.id)}
                                        />
                                        {selectedId === text.id && <Transformer ref={el => (trRef.current[i] = el)} boundBoxFunc={(oldBox, newBox) => newBox} />}
                                    </>
                                );
                                
                            })}
                    </Layer>
                </Stage>
            ) : null}
        </>
    );
}

export default TextKonva;