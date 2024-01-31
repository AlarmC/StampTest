import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Stage, Layer, Image, Transformer, Text } from 'react-konva';
import { useDispatch, useSelector } from "react-redux";

const ImageManage = ({ imaged, sw, sh, pos, bgChg, uptBg, convert, pixelate, vertical, horizon, draw }) => {

    const imageRef = useRef();
    const trRef = useRef();
    const [images, setImages] = useState([]);
    const [selectedId, selectShape] = useState(null);
    const [pixelColor, setPixelColor] = useState('white');
    const [pixelSwtch, setPixelSwtch] = useState(false);

    const [xChg, setXChg] = useState(1);    // 좌/우 반전
    const [yChg, setYChg] = useState(1);    // 상/하 반전

    const [drawSwtch, setDrawSwtch] = useState(false);
    const [ctxs, setCtxs] = useState();
    const [isDrawing, setIsDrawing] = useState(false);

    const contextRef = useRef(null);

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
        if(draw != null){
            setDrawSwtch(draw)
        }
    }, [draw])

    useEffect(() => {
        if(imageRef.current) {
            const canvas = imageRef.current.getCanvas();
            const context = canvas.getContext('2d');
            context.strokeStyle = "black";
            context.lineWidth = "2.5";
            contextRef.current = context;

            setCtxs(context);
        }
    }, [imageRef])

    const startDraw = () => {
        setIsDrawing(true)
    }
    const finishDraw = () => {
        setIsDrawing(false)
    }
    const moveDraw = (event) => {
        // console.log(event.evt)
        const {offsetX, offsetY} = event.evt;
        if(ctxs){
            if(!isDrawing){
                ctxs.beginPath();
                ctxs.moveTo(offsetX, offsetY);
            } else {
                ctxs.lineTo(offsetX, offsetY);
                ctxs.stroke();
            }
        }
    }
    

    useEffect(() => {
        if(convert != null){
            selectShape(null);
            setPixelSwtch(true);
        }
    }, [convert])

    useEffect(() => {
        if(pixelSwtch && selectedId == null){
            console.log(4)
            setPixelSwtch(false);
            setTimeout(function(){
                pixelate();
            }, 100);
        }
    }, [selectedId, pixelSwtch])

    useEffect(() => { }, [bgChg]);
  
    useEffect(() => {
        // console.log(pixelColor);
    }, [pixelColor]);
  
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
  
    return (
        <>
            {imaged != undefined ? (
                <Stage width={450} height={450} onMouseDown={checkDeselect} onTouchStart={checkDeselect} 
                    style={dotinfo.style == "C" ?
                            {background:`${pixelColor == "white" ? "unset" : pixelColor}`, width: `350px`, height: `350px`, margin: `50px`, border:"3px solid white", borderRadius: "50%", overflow : "hidden"} 
                        :
                            {background:`${pixelColor == "white" ? "unset" : pixelColor}`}
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
                                    draggable={!isDrawing}
                                    onClick={(e) => handleClick(e, img.id)}
                                    onTap={(e) => handleClick(e, img.id)}
                                    scaleX={xChg}
                                    scaleY={yChg}
                                    offsetX={xChg == -1 ? img.width : 0}
                                    offsetY={yChg == -1 ? img.height : 0}
                                    onMouseDown={startDraw}
                                    onMouseUp={finishDraw}
                                    onMouseMove={moveDraw}
                                    onMouseLeave={finishDraw}
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