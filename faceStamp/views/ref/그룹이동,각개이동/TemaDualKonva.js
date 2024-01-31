import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Stage, Layer, Image, Transformer, Group, Circle } from 'react-konva';
import domtoimage from 'dom-to-image-more';

const TemaDualKonva = ({ sw, sh, pos, bgChg, uptBg, convert, pixelate, former, showSize, sendBgc, arrData, ips, imgMove}) => {

    const imageRef = useRef([]);
    const trRef = useRef([]);
    const groupRef = useRef();
    const transRef = useRef();

    const canvRef = useRef();

    const [imgArray, setImgArray]= useState([]);    // 이미지 json데이터 배열
    const [printBool, setPrintBool] = useState(false);

    const [images, setImages] = useState([]);
    const [selectedId, selectShape] = useState(null);
    const [pixelColor, setPixelColor] = useState('white');
    const [pixelSwtch, setPixelSwtch] = useState(false);

    const [groupClick, setGroupClick] = useState(false);

    const [imageState, setImageState] = useState(null);



    const checkDeselect = (e) => {
        // // 빈공간 클릭시 앵커 사라짐
        // const clickedOnEmpty = e.target === e.target.getStage();
        // if (clickedOnEmpty) {
        //     selectShape(null);
        // }
        if(imgMove){
            selectShape("bgimg");
        } else {
            if(e.target == e.target.getStage()){
                selectShape(null);
                return;
            }
    
            const clicked = e.target.getParent().className === "Transformer";
            if (clicked) {
                return;
            }
    
            const name = e.target.name();
            if (name) {
                selectShape(name);
            } else {
                selectShape(null);
            }
        }

    };
  
    useEffect(() => {
        if (arrData != undefined) {
            setImgArray(arrData);
        }
    }, [arrData, pos.x, pos.y, sw, sh]);

    useEffect(() => {
        if(imgArray.length > 0){
            let line = parseInt(showSize);
            let post = 125 + (450-line)/2;
            let post_x = post;
            let post_y = post;
            if(pos.x != 0){
                post_x = pos.x*2;
            }
            if(pos.y != 0){
                post_y = pos.y*2;
            }
            const img = new window.Image();
            if(imgArray.length == 1){
                img.src = imgArray[0].img;
                img.onload = () => {
                    setImages([
                        {
                        x: post,
                        y: post,
                        width: showSize,
                        height: showSize,
                        image: img,
                        id: imgArray[0].id,
                        name: imgArray[0].id,
                        },
                    ]);
                }
            } else if(imgArray.length == 2){
                img.src = imgArray[1].img;
                if(images.length == 2){
                    img.onload = () => {
                        setImages([
                            {
                            x: post_x,
                            y: post_y,
                            width: sw,
                            height: sh,
                            image: img,
                            id: imgArray[1].id,
                            name: imgArray[1].id,
                            }, images[1]
                        ]);
                    }
                } else {
                    img.onload = () => {
                        setImages([
                            {
                            x: post_x,
                            y: post_y,
                            width: sw,
                            height: sh,
                            image: img,
                            id: imgArray[1].id,
                            name: imgArray[1].id,
                            }, images[0]
                        ]);
                    }
                }
            }
            img.onerror = () => {
                console.error('이미지 로드에 실패했습니다.');
            };
        }

    }, [imgArray, pos.x, pos.y, sw, sh])

    useEffect(() => {
        if(convert != null){
            selectShape(null);
            setPixelSwtch(true);
            setPrintBool(true);
        }
    }, [convert])

    useEffect(() => {
        if(pixelSwtch && selectedId == null){

            const groupData = groupRef.current;
            console.log(groupData); 
            // setPixelSwtch(false);
            // setTimeout(function(){
            //     pixelate();
            // }, 100);

            const stage = canvRef.current;
            const dataURL = stage.toDataURL();

            const cropCanvas = document.createElement('canvas');
            cropCanvas.width = showSize;
            cropCanvas.height = showSize;

            const ctx = cropCanvas.getContext('2d');
            const img = new window.Image();
            img.src = dataURL;

            let position = (450-showSize)/2 + 125;

            img.onload = () => {
                // 이미지를 원하는 위치와 크기로 자르고 새 캔버스에 그립니다.
                ctx.drawImage(img, position, position, showSize, showSize, 0, 0, showSize, showSize);

                // 새 캔버스의 데이터 URL을 이미지로 변환하여 보여줄 수 있습니다.
                const croppedImageDataURL = cropCanvas.toDataURL('image/png');
                pixelate(croppedImageDataURL);
                setPixelSwtch(false);
                // const link = document.createElement('a');
                // link.download = 'cropped_image.png';
                // link.href = croppedImageDataURL;
                // link.click();
            };
        }
    }, [selectedId, pixelSwtch])

    useEffect(() => { }, [bgChg]);
  
    useEffect(() => {
        if(pixelColor != "white"){
            console.log(pixelColor)
            // sendBgc(pixelColor)
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
        if(imgMove){
            if (selectedId) {
                trRef.current[0].nodes([imageRef.current[0]]);
                trRef.current[0].getLayer().batchDraw();
            }
        }
    }, [selectedId]);

    useEffect(() => {
        if(groupClick){
            if(printBool == false){
                if(imgMove == false){
                    transRef.current.nodes([groupRef.current]);
                    transRef.current.getLayer().batchDraw();
                }
            }
        }
    }, [groupClick])

    return (
        <>
            {arrData != undefined ? (
                <Stage ref={canvRef} width={700} height={700} onMouseDown={checkDeselect} onTouchStart={checkDeselect} 
                    // style={{background:`${pixelColor == "white" ? "unset" : pixelColor}`}}
                >
                    <Layer>
                        <Circle x={350} y={350} radius={showSize/2} stroke={"black"} strokeWidth={2} fill={pixelColor} />
                        <Group name="group" 
                            ref={groupRef} 
                            clipFunc={imgMove == false && ((ctx) => {ctx.arc(showSize/2+125, showSize/2+125, showSize/2, 0, Math.PI * 2, false)})} 
                            draggable={printBool == true ? false : !imgMove}
                            onClick={() => setGroupClick(!groupClick)}
                        >
                            {images &&
                                images.map((img, i) => {
                                    let bool = false;
                                    if(img.id == "bgimg"){
                                        if(imgMove){
                                            bool = true;
                                        }
                                    }
                                    let visible = true;
                                    if(img.id != "bgimg"){
                                        visible = false;
                                    }

                                    return (
                                        <>
                                            <Image
                                                key={i}
                                                ref={el => (imageRef.current[i] = el)}
                                                image={img.image}
                                                {...img}
                                                draggable={imgMove == false ? false : bool}
                                                listening={imgMove == false ? true : bool}
                                                visible={pixelSwtch == false ? true : visible}
                                                onClick={(e) => handleClick(e, img.id)}
                                                onTap={(e) => handleClick(e, img.id)}
                                            />
                                            {selectedId && imgMove && <Transformer ref={el => (trRef.current[i] = el)} boundBoxFunc={(oldBox, newBox) => newBox} />}
                                        </>
                                    );
                                })}
                            
                        </Group>
                        {groupClick &&
                            (imgMove == false &&
                                <Transformer
                                    ref={transRef}
                                    keepRatio={false}
                                />
                            )
                        }
                    </Layer>
                </Stage>
            ) : null}
        </>
    );
};

export default TemaDualKonva;