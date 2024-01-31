import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Stage, Layer, Image, Transformer, Text } from 'react-konva';
import { useDispatch, useSelector } from "react-redux";

const ImageManage = ({ imaged, sw, sh, pos, bgChg, uptBg, convert, pixelate, vertical, horizon, clip, type, former, sendState, sendBgc}) => {

    const imageRef = useRef();
    const trRef = useRef();
    const [images, setImages] = useState([]);
    const [selectedId, selectShape] = useState(null);
    const [pixelColor, setPixelColor] = useState('white');
    const [pixelSwtch, setPixelSwtch] = useState(false);

    const [xChg, setXChg] = useState(1);
    const [yChg, setYChg] = useState(1);

    const [imageState, setImageState] = useState(null);

    const { dotinfo } = useSelector(({ dotinfo }) => ({
        dotinfo: dotinfo.dotinfo,
    }));


    const checkDeselect = (e) => {
        // 빈공간 클릭시 앵커 사라짐
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            selectShape(null);
        }
    };
  
    useEffect(() => {
        if (imaged != undefined) {
            const img = new window.Image();
            console.log(sw, sh);
            img.src = imaged;
            {dotinfo.style == "C" ?
            img.onload = () => {
                setImages([
                    {
                    x: pos.x,
                    y: pos.y,
                    width: sw * 0.8,
                    height: sh * 0.8,
                    image: img,
                    id: 'img1',
                    },
                ]);
            }
            :
            img.onload = () => {
                setImages([
                    {
                    x: pos.x,
                    y: pos.y,
                    width: sw,
                    height: sh,
                    image: img,
                    id: 'img1',
                    },
                ]);
            };
            }
            img.onerror = () => {
                console.error('이미지 로드에 실패했습니다.');
            };
        }
    }, [imaged, pos.x, pos.y, sw, sh]);

    useEffect(() => {
        if(vertical != null){
            setYChg(vertical);
        }
        if(horizon != null){
            setXChg(horizon);
        }
    }, [vertical, horizon])

    useEffect(() => {
        if(convert != null){
            selectShape(null);
            setPixelSwtch(true);
        }
    }, [convert])

    useEffect(() => {
        if(pixelSwtch && selectedId == null){
            setPixelSwtch(false);
            setTimeout(function(){
                pixelate();
            }, 100);
        }
    }, [selectedId, pixelSwtch])

    useEffect(() => { }, [bgChg]);
  
    useEffect(() => {
        if(pixelColor != "white"){
            if(type == "quick"){
                sendBgc(pixelColor)
            }
        }
    }, [pixelColor]);

    useEffect(() => {
        if(former != null){
            if(former == false){
                selectShape(null);
            }
        }
    }, [former])
  
    const handleClick = (event, id) => {
        if (bgChg) {
            const stage = event.target.getStage();
            const x = event.evt.offsetX;
            const y = event.evt.offsetY;
            const context = event.target.getLayer().getCanvas()._canvas.getContext('2d');
            // console.log(context.getImageData(0, 0, 450, 450));
            const pixelData = context.getImageData(x, y, 1, 1).data;
            const color = `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;
            setPixelColor(color);
            uptBg(false);
        } else {
            selectShape(id);
        }
    };
  
    useEffect(() => {
        if (selectedId) {
            trRef.current.nodes([imageRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [selectedId]);

    const handleTransformEnd = () => {
        const node = imageRef.current;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        const rotation = node.rotation();
        setImageState({
            x: node.x(),
            y: node.y(),
            width: node.width() * scaleX,
            height: node.height() * scaleY,
            rotation: rotation,
        });
    };

    useEffect(() => {
        if(imageState != null){
            if(type == "quick"){
                sendState(imageState)
            }
        }
    }, [imageState])
  
    return (
        <>
            {imaged != undefined ? (
                <Stage width={450} height={450} onMouseDown={checkDeselect} onTouchStart={checkDeselect} 
                    style={dotinfo.style == "C" ?
                            {background:`${pixelColor == "white" ? "unset" : pixelColor}`, width: `350px`, height: `350px`, margin: `50px`, border:"3px solid white", borderRadius: "50%", overflow : "hidden"} 
                        :
                            (type == "custom" ? 
                                (clip > 100 ? 
                                    {background:`${pixelColor == "white" ? "unset" : pixelColor}`, clipPath : `circle(43% at 50% 43%)`} 
                                :
                                    {background:`${pixelColor == "white" ? "unset" : pixelColor}`, clipPath : `circle(${clip}%)`}
                                )
                            : 
                                {background:`${pixelColor == "white" ? "unset" : pixelColor}`}
                            )
                    }
                    onClick={handleTransformEnd}
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
                                    draggable
                                    onClick={(e) => handleClick(e, img.id)}
                                    onTap={(e) => handleClick(e, img.id)}
                                    scaleX={xChg}
                                    scaleY={yChg}
                                    offsetX={xChg == -1 ? img.width : 0}
                                    offsetY={yChg == -1 ? img.height : 0}
                                    // onTransformEnd={handleTransformEnd}
                                    />
                                );
                            })}
                        {selectedId && <Transformer ref={trRef} boundBoxFunc={(oldBox, newBox) => newBox} />}
                    </Layer>
                </Stage>
            ) : null}
        </>
    );
  };

export default ImageManage;