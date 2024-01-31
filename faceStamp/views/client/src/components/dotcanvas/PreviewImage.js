import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Stage, Layer, Image, Transformer, Text } from 'react-konva';
import { useDispatch, useSelector } from "react-redux";

const PreviewImage = ({ imaged, sw, sh, pos, bgChg, state, bright, contrast, bgc}) => {

    const imageRef = useRef();
    const [images, setImages] = useState([]);
    const [pixelColor, setPixelColor] = useState('white');

    const { dotinfo } = useSelector(({ dotinfo }) => ({
        dotinfo: dotinfo.dotinfo,
    }));
  
    useEffect(() => {
        if (imaged != undefined) {
            const img = new window.Image();
            img.src = imaged;
            {dotinfo.style == "C" ?
            img.onload = () => {
                setImages([
                    {
                    x: (pos.x / 3),
                    y: (pos.y / 3),
                    width: (sw * 0.8 / 3),
                    height: (sh * 0.8 / 3),
                    image: img,
                    id: 'img1',
                    rotation: 0
                    },
                ]);
            }
            :
            img.onload = () => {
                setImages([
                    {
                    x: pos.x / 3,
                    y: pos.y / 3,
                    width: sw / 3,
                    height: sh / 3,
                    image: img,
                    id: 'img1',
                    rotation: 0
                    },
                ]);
            };
            }
            img.onerror = () => {
                console.error('이미지 로드에 실패했습니다.');
            };
        }
    }, [imaged, pos.x, pos.y, sw, sh]);


    useEffect(() => { }, [bgChg]);
  
    useEffect(() => {
        // console.log(pixelColor);
    }, [pixelColor]);
  

    useEffect(() => {
        if(state != null){
            let beforedata = images[0];
            const img = new window.Image();
            img.src = imaged;
            img.onload = () => {
                setImages([
                    {
                        x: state.x / 3,
                        y: (state.y / 3),
                        width: (state.width / 3),
                        height: (state.height / 3),
                        image: beforedata.image,
                        id: 'img1',
                        rotation: state.rotation
                    },
                ])
            }           
        }
    }, [state])

  
    return (
        <>
            {imaged != undefined ? (
                <Stage width={150} height={150}
                    style={dotinfo.style == "C" ?
                            {
                                position:"absolute", zIndex:`1`, background:`${bgc}`,
                                width: `116px`, height: `116px`, margin: `16px`, border:"1px solid black",
                                filter: `grayscale(1) brightness(${bright}) contrast(${contrast})`,
                                borderRadius: "50%", overflow : "hidden"
                            } 
                        :
                            {
                                position:"absolute", zIndex:`1`, background:`${bgc}`, 
                                filter: `grayscale(1) brightness(${bright}) contrast(${contrast})`,
                            }
                    }
                >
                    <Layer>
                        {images &&
                            images.map((img, i) => {
                                return (
                                    <Image
                                    key={i}
                                    ref={imageRef}
                                    image={img.image}
                                    {...img}
                                    // draggable
                                    />
                                );
                            })}
                    </Layer>
                </Stage>
            ) : null}
        </>
    );
  };

export default PreviewImage;