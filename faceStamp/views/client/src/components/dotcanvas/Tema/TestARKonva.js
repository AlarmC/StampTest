import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Stage, Layer, Image, Transformer, Group, Circle } from 'react-konva';
import domtoimage from 'dom-to-image-more';

const TestARKonva = ({ arrData, showSize }) => {

    const imageRef = useRef([]);
    const canvRef = useRef();

    const [imgArray, setImgArray]= useState([]);    // 이미지 json데이터 배열
    const [images, setImages] = useState([]);
  
    useEffect(() => {
        console.log(arrData);
        setImgArray(arrData);
    }, [arrData]);

    useEffect(() => {
        if(imgArray.length > 0){
            let post = 250 + (450-showSize)/2;

            const img = new window.Image();
            img.src = imgArray[0].img;
            img.onload = () => {
                setImages([
                    {
                    x: post/2,
                    y: post/2,
                    width: showSize,
                    height: showSize,
                    image: img,
                    id: imgArray[0].id,
                    name: imgArray[0].id,
                    },
                ]);
            }
            
        } else {
            setImages([]);
        }

    }, [imgArray])
  



    return (
        <>
            {arrData != undefined ? (
                <Stage ref={canvRef} width={700} height={700} >
                    <Layer>
                        <Group name="group" 
                            clipFunc={((ctx) => {ctx.arc(showSize/2+125+(450-showSize)/2, showSize/2+125+(450-showSize)/2, showSize/2, 0, Math.PI * 2, false)})} 
                        >
                            {images &&
                                images.map((img, i) => {
                                    return (
                                        <>
                                            <Image
                                                key={img.id}
                                                ref={el => (imageRef.current[i] = el)}
                                                image={img.image}
                                                {...img}
                                                listening={false}
                                            />
                                        </>
                                    );
                                })}
                            
                        </Group>
                    </Layer>
                </Stage>
            ) : null}
        </>
    );
};

export default TestARKonva;