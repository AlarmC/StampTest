import React, { useRef, useEffect, useState, useCallback } from 'react'
import Konva from 'konva';
import { Stage, Layer, Image, Transformer, Group, Circle, Text } from 'react-konva';
import * as CommonAxios from "./../../CommonAxios";

// 도장 유형과 이미지만 포함
const ARKonva = ({ pos, bgChg, convert, former, showSize, arrData, users, endEvt, sendImg}) => {

    const imageRef = useRef([]);
    const trRef = useRef([]);

    const canvRef = useRef();
    const [imgNum, setImgNum] = useState(1);

    const [images, setImages] = useState([]);
    const [selectedId, selectShape] = useState(null);       // 이미지 선택자
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
            console.log(arrData);
            if(arrData.length > 0){
                let line = parseInt(showSize);
                let post = 125 + (450-line)/2;
                let lenth = arrData.length;
                console.log(line);

                const img = new window.Image();
                img.src = arrData[lenth-1].img;
                img.onload = () => {
                    setImages([{
                        x: post,
                        y: post,
                        width: line,
                        height: line,
                        image: img,
                        id: `${imgNum}`,
                        type:"img"
                    }])
                }
                setImgNum(imgNum + 1);
            }
        }

    }, [arrData, pos.x, pos.y])

    useEffect(() => {}, [printBool]);

    useEffect(() => {
        if(convert != null){
            selectShape(null);
            setLastSwtch(true);
        }
    }, [convert])

    // useEffect(() => {
    //     if(pixelSwtch && selectedId == null){

    //         // setPixelSwtch(false);
    //         // setTimeout(function(){
    //         //     pixelate();
    //         // }, 100);

    //         const stage = canvRef.current;
    //         const dataURL = stage.toDataURL();

    //         const cropCanvas = document.createElement('canvas');
    //         cropCanvas.width = showSize;
    //         cropCanvas.height = showSize;

    //         const ctx = cropCanvas.getContext('2d');
    //         const img = new window.Image();
    //         img.src = dataURL;

    //         let position = (450-showSize)/2 + 125;

    //         img.onload = () => {
    //             // 이미지를 원하는 위치와 크기로 자르고 새 캔버스에 그립니다.
    //             ctx.drawImage(img, position, position, showSize, showSize, 0, 0, showSize, showSize);

    //             // 새 캔버스의 데이터 URL을 이미지로 변환하여 보여줄 수 있습니다.
    //             const croppedImageDataURL = cropCanvas.toDataURL('image/png');
    //             pixelate(croppedImageDataURL);
    //             setPixelSwtch(false);
    //             setPrintBool(true);
    //             // const link = document.createElement('a');
    //             // link.download = 'cropped_image.png';
    //             // link.href = croppedImageDataURL;
    //             // link.click();
    //         };
    //     }
    // }, [pixelSwtch, selectedId])

    useEffect(() => {
        if(lastSwtch && selectedId == null){
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
    }, [lastSwtch, selectedId])

    useEffect(() => { }, [bgChg]);
  
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

    useEffect(() => {
        console.log(images);
    }, [images])


    return (
        <>
            {arrData != undefined ? (
                <Stage ref={canvRef} width={700} height={700} onMouseDown={checkDeselect} onTouchStart={checkDeselect} 
                    // style={{background:`${pixelColor == "white" ? "unset" : pixelColor}`}}
                >
                    <Layer>
                        {images &&
                            images.map((img, i) => {
                                return(
                                    <>
                                        <Image
                                            key={i}
                                            ref={el => (imageRef.current[i] = el)}
                                            image={img.image}
                                            {...img}
                                            visible={true}
                                            draggable={false}
                                        />
                                    </>
                                )
                            })
                        }
                    </Layer>
                </Stage>
            ) : null}
        </>
    );
};

export default ARKonva;