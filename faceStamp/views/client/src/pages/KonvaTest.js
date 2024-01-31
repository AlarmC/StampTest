import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Stage, Layer, Image, Transformer, Group, Circle, Line, Text } from 'react-konva';

const KonvaTest = () => {


    const canvasRef = useRef();
    const imageRef = useRef([]);
    const trRef = useRef([]);

    const [selectedId, selectShape] = useState(null);
    const [writeTxt, setWriteTxt] = useState(null);
    const [textArr, setTextArr] = useState([]);

    useEffect(() => {
        if(writeTxt != null){
            setTextArr([{
                id: 1, text: writeTxt,
            }]);
        }
    }, [writeTxt])

    useEffect(() => {} , [textArr]);


    const textArr2 = [
        {id: 1, text: "일이삼사오육칠팔구십일이삼사오"},
        // {id: 2, text: "시험중입니다."}
    ]




    const checkDeselect = (e) => {
        // 빈공간 클릭시 앵커 사라짐
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            selectShape(null);
        }
    };

    const DrawCurvedText = (str) => {

        // 무회전 텍스트

        // let angle = Math.PI;    // 180도
        // let radius = 190;
        
        // const chars = str.text.split('');
        // const anglePerChar = angle/ chars.length;

        // // 우 => x (cos, index) , y (sin, index) // 좌 x (cos, -index) , y (sin, -index) 
        // // 하 => x (sin, index) , y (cos, index) // 좌 x (sin, -index) , y (cos, -index) 

        // return (
        //     chars.map((data, index) => {
        //         return(
        //             <Text
        //                 key={index}
        //                 x={35 + radius * Math.cos(index * anglePerChar - angle / 2)}
        //                 y={35 + radius * Math.sin(index * anglePerChar - angle / 2)}
        //                 text={data}
        //                 fontSize={30}
        //                 align="center"
        //                 rotation={10*index}
        //                 onClick={() => {
        //                     selectShape(str.id);
        //                 }}
        //             />
        //         )
        //     })
        // )

        // 무회전 텍스트

        let fontSize = 30;

        let radius = 190;
        
        const chars = str.text.split('');

        let angle = (fontSize/2 * chars.length) * Math.PI / 180;    // 180도
        const anglePerChar = angle/ chars.length;

        // 우 => x (cos, index) , y (sin, index) // 좌 x (cos, -index) , y (sin, -index) 
        // 하 => x (sin, index) , y (cos, index) // 좌 x (sin, -index) , y (cos, -index) 

        return (
            chars.map((data, index) => {
                let xpos;
                let ypos;
                let lng = chars.length/2;
                // 우 방향
                // if(lng > index){
                //     xpos = 225 + radius * Math.cos((index - lng) * anglePerChar);
                //     ypos = 225 + radius * Math.sin((index - lng) * anglePerChar);
                // } else {
                //     xpos = 225 + radius * Math.cos((index - lng) * anglePerChar);
                //     ypos = 225 + radius * Math.sin((index - lng) * anglePerChar);
                // }

                // let rotAngle = 360 + (index - lng)*10;
                // // 좌 방향
                // if(lng > index){
                //     xpos = 225 + radius * Math.cos(-(index - lng) * anglePerChar + Math.PI);
                //     ypos = 225 + radius * Math.sin(-(index - lng) * anglePerChar + Math.PI);
                // } else {
                //     xpos = 225 + radius * Math.cos(-(index - lng) * anglePerChar + Math.PI);
                //     ypos = 225 + radius * Math.sin(-(index - lng) * anglePerChar + Math.PI);
                // }

                // let rotAngle = 360 - (index - lng)*10;

                // 상 방향
                // if(lng > index){
                //     xpos = 225 + radius * Math.sin(-(index - lng) * anglePerChar + Math.PI);
                //     ypos = 225 + radius * Math.cos(-(index - lng) * anglePerChar + Math.PI);
                // } else {
                //     xpos = 225 + radius * Math.sin(-(index - lng) * anglePerChar + Math.PI);
                //     ypos = 225 + radius * Math.cos(-(index - lng) * anglePerChar + Math.PI);
                // }

                // let rotAngle = 360 + (index - lng)*10;

                // 하 방향
                if(lng > index){
                    xpos = 225 + radius * Math.sin((index - lng) * anglePerChar);
                    ypos = 225 + radius * Math.cos((index - lng) * anglePerChar);
                } else {
                    xpos = 225 + radius * Math.sin((index - lng) * anglePerChar);
                    ypos = 225 + radius * Math.cos((index - lng) * anglePerChar);
                }

                let rotAngle = 360 - (index - lng)*10;

                return(
                    <Text
                        key={index}
                        x={xpos}
                        y={ypos}
                        text={data}
                        fontSize={fontSize}
                        align="center"
                        rotation={rotAngle}
                        onClick={() => {
                            selectShape(str.id);
                        }}
                    />
                )

            })
        )
    }

    useEffect(() => {
        if(selectedId != null){
            if(trRef.current.length > 0){
                let data = parseInt(selectedId);
                trRef.current[data-1].nodes([imageRef.current[data-1]]);
                trRef.current[data-1].getLayer().batchDraw();
            }
        }
    }, [selectedId])



    return (
        <div>
            123123  
            <input type="text" onChange={(e) => setWriteTxt(e.target.value)} />
            <Stage width={450} height={450} onMouseDown={checkDeselect} onTouchStart={checkDeselect}>
                <Layer>
                    {textArr &&
                        textArr.map((data, i) => {
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
            </Stage>
        </div>
    )

}

export default KonvaTest;