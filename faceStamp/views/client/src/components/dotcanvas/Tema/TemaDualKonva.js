import React, { useRef, useEffect, useState, useCallback } from 'react'
import Konva from 'konva';
import { Stage, Layer, Image, Transformer, Group, Circle } from 'react-konva';
import * as CommonAxios from "./../../CommonAxios";

// 도장 유형과 이미지만 포함
const TemaDualKonva = ({ sw, sh, pos, bgChg, uptBg, convert, pixelate, former, showSize, sendImg, arrData, ips, imgMove, users, endEvt}) => {

    const imageRef = useRef([]);
    const trRef = useRef([]);

    const canvRef = useRef();
    const [imgNum, setImgNum] = useState(1);

    const [images, setImages] = useState([]);
    const [selectedId, selectShape] = useState(null);       // 도장유형, 이미지 선택
    const [selectedName, setSelectedName] = useState(null);
    const [pixelColor, setPixelColor] = useState('white');
    const [pixelSwtch, setPixelSwtch] = useState(false);
    const [printBool, setPrintBool] = useState(false);

    const [lastSwtch, setLastSwtch] = useState(false);


    const checkDeselect = (e) => {
        // 빈공간 클릭시 앵커 사라짐
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            selectShape(null);
        }

    };
  

    useEffect(() => {
        if(arrData != undefined){
            if(arrData.length > 0){
                let line = parseInt(showSize);
                let length = arrData.length;
                let post = 125 + (450-line)/2;
                let post_x = post;
                let post_y = post;
                console.log(pos);
                if(pos.x != 0){
                    post_x = post-pos.x;
                }
                if(pos.y != 0){
                    post_y = post-pos.y;
                }
                const img = new window.Image();
                if(arrData[length-1].id == "bgimg"){
                    let data = images.filter((item) => item.name == "bgimg");
                    if(data.length > 0){
                        let chg = images.map((item) => item.name == "bgimg" ? {...item, visible:false, name: "cancel" } : item);
                        img.src = arrData[length-1].img;
                        img.onload = () => {
                            setImages([...chg,
                                {
                                x: post_x,
                                y: post_y,
                                width: sw,
                                height: sh,
                                image: img,
                                id: `${imgNum}`,
                                name: arrData[length-1].id,
                                },
                                ]);
                        }
                        setImgNum(imgNum + 1);
                    } else {
                        img.src = arrData[length-1].img;
                        img.onload = () => {
                            setImages([...images,
                                {
                                x: post_x,
                                y: post_y,
                                width: sw,
                                height: sh,
                                image: img,
                                id: `${imgNum}`,
                                name: arrData[length-1].id,
                                },
                                ]);
                        }
                        setImgNum(imgNum + 1);
                    }
                } else if(arrData[length-1].id == "last") {
                    img.src = arrData[length-1].img;
                    img.onload = () => {
                        setImages([...images,
                            {
                            x: post,
                            y: post,
                            width: showSize,
                            height: showSize,
                            image: img,
                            id: `${imgNum}`,
                            name: arrData[length-1].id,
                            },
                        ]);
                    }
                    setImgNum(imgNum + 1);
                    setTimeout(() => {
                        setLastSwtch(true);
                    }, 1000)
                } else {
                    img.src = arrData[length-1].img;
                    img.onload = () => {
                        setImages([...images,
                            {
                            x: 300,
                            y: 300,
                            width: showSize/4,
                            height: showSize/4,
                            image: img,
                            id: `${imgNum}`,
                            name: arrData[length-1].id,
                            },
                        ]);
                    }
                    setImgNum(imgNum + 1);
                }
            }
        }

    }, [arrData, pos.x, pos.y, sw, sh])

    useEffect(() => {}, [printBool]);

    useEffect(() => {
        if(convert != null){
            selectShape(null);
            setPixelSwtch(true);
        }
    }, [convert])

    useEffect(() => {
        if(pixelSwtch && selectedId == null){

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
                setPrintBool(true);
                // const link = document.createElement('a');
                // link.download = 'cropped_image.png';
                // link.href = croppedImageDataURL;
                // link.click();
            };
        }
    }, [pixelSwtch, selectedId])

    useEffect(() => {
        if(lastSwtch){
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
                let now = new Date();
                const times = now.getTime();
                sendImg(croppedImageDataURL);

                let size = parseInt(showSize)/10;

                let sendData = {
                    user: users.ur_id,
                    printBool: users.ur_mode == 1 ? "true" : "false" ,
                    size: size,
                    type: `custom`,
                    style: "",
                    image: `${croppedImageDataURL}file_name:${users.ur_id}_${times}.pngfile_name:file_name:/${users.ur_id}/`,
                    file_name: `${users.ur_id}_${times}.png`,
                }

                CommonAxios.CommonAxios(
                    process.env.REACT_APP_HOSTDONAME + "/api/insert_stamp",
                    sendData,
                    function (result) {
                        if (result.messageinfo.state == "ok") {
                            endEvt("success");
                        } else {
                            endEvt("fail");
                        }
                    }
                );
            };
        }
    }, [lastSwtch])

    useEffect(() => {  }, [bgChg]);
  
    useEffect(() => {
        if(pixelColor != "white"){
            console.log(pixelColor)
        }
    }, [pixelColor]);

    useEffect(() => {
        if(former != null){
            if(former == false){
                selectShape(null);
            }
        }
    }, [former])
  
    const handleClick = (event, id, name) => {
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
            if(id != "group"){
                setSelectedName(name);
                if(selectedId != null){
                    selectShape(null);
                } else {
                    selectShape(id);
                }
            }
        }
    };

    // 이미지 이동 시 호출되는 콜백 함수
    const handleDragEnd = (e, id) => {
        const updatedImages = images.map((image, index) => {
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
        setImages(updatedImages);
    };
  
    useEffect(() => {
        // if(imgMove){
        //     if (selectedId) {
        //         let data = parseInt(selectedId);
        //         console.log(data);
        //         trRef.current[data-1].nodes([imageRef.current[data-1]]);
        //         trRef.current[data-1].getLayer().batchDraw();
        //     }
        // } else {
        // }
        if (selectedId != null) {
            if(trRef.current.length > 0){
                let data = parseInt(selectedId);
                trRef.current[data-1].nodes([imageRef.current[data-1]]);
                trRef.current[data-1].getLayer().batchDraw();
            }
            // if(trRef.current.length > 0){
            //     let length = images.filter((a) => a.name == "bgimg" || a.name == "cancel");
            //     if(selectedName == "bgimg"){
            //         let data = parseInt(selectedId);
            //         trRef.current[data-1].nodes([imageRef.current[0]]);
            //         trRef.current[data-1].getLayer().batchDraw();
            //     } else {
            //         let data = parseInt(selectedId);
            //         // let num = parseInt(length[0].id);
            //         let data2 = parseInt(selectedId) + length.length;
            //         if(data > length.length){
            //             trRef.current[data-1].nodes([imageRef.current[data-1]]);
            //             trRef.current[data-1].getLayer().batchDraw();
            //         } else {
            //             trRef.current[data2-1].nodes([imageRef.current[data2-1]]);
            //             trRef.current[data2-1].getLayer().batchDraw();
            //         }
            //     }
            // }
        }
    }, [selectedId, selectedName]);


    return (
        <>
            {arrData != undefined ? (
                <Stage ref={canvRef} width={700} height={700} onMouseDown={checkDeselect} onTouchStart={checkDeselect} 
                    // style={{background:`${pixelColor == "white" ? "unset" : pixelColor}`}}
                >
                    <Layer>
                        <Circle visible={pixelSwtch ? false : true} x={350} y={350} radius={showSize/2} stroke={"black"} strokeWidth={2} fill={pixelSwtch ? null : pixelColor} />
                        <Group
                            // onClick={(e) => handleClick(e, "group")}
                            clipFunc={imgMove == false && ((ctx) => {ctx.arc(showSize/2+125+(450-showSize)/2, showSize/2+125+(450-showSize)/2, showSize/2, 0, Math.PI * 2, false)})} 
                        >
                            {images &&
                                images.map((img, i) => {
                                    if(img.name == "bgimg" || img.name == "last"){
                                        let bool = true;        //드래그 여부
                                        let bool2 = true;       //이벤트 활성 여부
                                        let bool3 = true;       //보이기 여부
                                        let bool4 = 1;
                                        if(img.name == "bgimg"){            // 배경이미지
                                            if(printBool){
                                                bool = false;
                                                bool2 = false;
                                                bool3 = false;
                                            } else {
                                                if(bgChg){
                                                    bool = false;
                                                    bool2 = true
                                                } else {
                                                    if(imgMove){
                                                        bool = true;
                                                        bool2 = true;
                                                        bool4 = 0.5
                                                    } else {
                                                        bool = false;
                                                        bool2 = false;
                                                    }
                                                }
                                            }
                                        } else if(img.name == "last"){      // 픽셀화된 배경이미지
                                            if(printBool){
                                                bool = false;
                                                bool2 = false;
                                                bool3 = true;
                                            } else {
                                                bool = false;
                                                bool2 = false;
                                                bool3 = false;
                                            }
                                        }
                                        return(
                                            <>
                                                <Image
                                                    key={i}
                                                    ref={el => (imageRef.current[i] = el)}
                                                    image={img.image}
                                                    {...img}
                                                    draggable={bool}
                                                    listening={bool2}
                                                    visible={bool3}
                                                    opacity={bool4}
                                                    onClick={(e) => handleClick(e, img.id, img.name)}
                                                    onTap={(e) => handleClick(e, img.id, img.name)}
                                                    onDragEnd={(e) => handleDragEnd(e, img.id)}
                                                />
                                                {/* {selectedId &&
                                                    <>
                                                        <Transformer ref={el => (trRef.current[i] = el)} boundBoxFunc={(oldBox, newBox) => newBox} />
                                                    </>
                                                } */}
                                            </>
                                        )
                                    }
                                })
                            }
                        </Group>
                    </Layer>
                    <Layer>
                        {/* <Circle visible={pixelSwtch ? false : true} x={350} y={350} radius={showSize/2} stroke={"black"} strokeWidth={2} fill={pixelSwtch ? null : pixelColor} /> */}
                        <Group
                            onClick={(e) => handleClick(e, "group")}
                            clipFunc={imgMove == false && ((ctx) => {ctx.arc(showSize/2+125+(450-showSize)/2, showSize/2+125+(450-showSize)/2, showSize/2, 0, Math.PI * 2, false)})} 
                        >
                            {images &&
                                images.map((img, i) => {
                                    let bool = true;        //드래그 여부
                                    let bool2 = true;       //이벤트 활성 여부
                                    let bool3 = true;       //보이기 여부
                                    console.log(bgChg);
                                    if(img.name == "bgimg"){            // 배경이미지
                                        bool3 = false;
                                        if(printBool){
                                            bool = false;
                                            bool2 = false;
                                            bool3 = false;
                                        } else {
                                            if(bgChg){
                                                bool = false;
                                                bool2 = true
                                            } else {
                                                if(imgMove){
                                                    bool = true;
                                                    bool2 = true;
                                                } else {
                                                    bool = false;
                                                    bool2 = false;
                                                }
                                            }
                                        }
                                    } else if(img.name == "last"){      // 픽셀화된 배경이미지
                                        bool3 = false;
                                        if(printBool){
                                            bool = false;
                                            bool2 = false;
                                            bool3 = false;
                                        } else {
                                            bool = false;
                                            bool2 = false;
                                            bool3 = false;
                                        }
                                    } else if(img.name == "cancel") {   // 겹쳐진 배경이미지(bgimg)
                                        bool = false;
                                        bool2 = false;
                                        bool3 = false;
                                    } else {                            // 도장 유형
                                        if(printBool){
                                            bool = false;
                                            bool2 = false;
                                            bool3 = true;
                                        } else {
                                            if(pixelSwtch){
                                                bool3 = false;
                                            } else {
                                                if(bgChg){
                                                    bool= false;
                                                    bool2 = false;
                                                } else {
                                                    if(imgMove){   
                                                        bool = false;
                                                        bool2 = false;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    return (
                                        <>
                                            <Image
                                                key={i}
                                                ref={el => (imageRef.current[i] = el)}
                                                image={img.image}
                                                {...img}
                                                draggable={bool}
                                                listening={bool2}
                                                visible={bool3}
                                                onClick={(e) => handleClick(e, img.id, img.name)}
                                                onTap={(e) => handleClick(e, img.id, img.name)}
                                                onDragEnd={(e) => handleDragEnd(e, img.id)}
                                            />
                                            {/* {selectedId &&
                                                <>
                                                    <Transformer ref={el => (trRef.current[i] = el)} boundBoxFunc={(oldBox, newBox) => newBox} />
                                                </>
                                            } */}
                                        </>
                                    );
                                })
                            }
                            
                        </Group>
                        {images &&
                            images.map((img, i) => {
                                return (
                                    <>
                                        {selectedId &&
                                            <>
                                                <Transformer ref={el => (trRef.current[i] = el)} boundBoxFunc={(oldBox, newBox) => newBox} />
                                            </>
                                        }
                                    </>
                                );
                            })
                        }
                    </Layer>
                </Stage>
            ) : null}
        </>
    );
};

export default TemaDualKonva;