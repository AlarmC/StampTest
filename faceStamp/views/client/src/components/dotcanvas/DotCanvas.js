import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { insert_dotinfo } from "./../../modules/dotInfo";
import { RiImageAddLine } from 'react-icons/ri';
import { FaStamp } from 'react-icons/fa';
import { LuPipette } from 'react-icons/lu';
import { MdEditDocument } from 'react-icons/md';
import { TfiPrinter } from 'react-icons/tfi'
import { MdToggleOn } from 'react-icons/md';
import { MdToggleOff } from 'react-icons/md';
import { BiArrowBack } from 'react-icons/bi';
import { IoIosHome } from 'react-icons/io';
import { AiOutlineDeliveredProcedure } from 'react-icons/ai';
import ProgressBar from '../bar/ProgressBar';
import * as CommonAxios from "./../CommonAxios";
// import * as htmlToImage from 'html-to-image';
import domtoimage from 'dom-to-image-more';
// import DotTest from './DotTest';
import DotTest2 from './DotTest2';
import ImageManage from './ImageManage';
import TextManage from './TextManage';
import Swal from "sweetalert2";
import PreviewImage from './PreviewImage';
import PreviewText from './PreviewText';
import ReactToPrint from "react-to-print";

const DotCanvas = () => {

    const dispatch = useDispatch();

    const { user, dotinfo } = useSelector(({ user, dotinfo }) => ({
        user: user.user,
        dotinfo: dotinfo.dotinfo,
    }));

    const [selectedImage, setSelectedImage] = useState(null);   // 이미지 URL 주소
    const inputRef = useRef(null);
    const imgRef = useRef(null);
    const bgRef = useRef(null);
    const photoRef = useRef(null);
    const compRef = useRef(null);
    const printRef = useRef();
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const [imgClick, setImgClick] = useState(false);

    const [lightValue, setLightValue] = useState(10);           // 이미지 밝기
    const [contrastValue, setContrastValue] = useState(10);     // 이미지 대비

    const [imgWidth, setImgWidth] = useState(450);
    const [imgHeight, setImgHeight] = useState(450);
    const [imgLoad, setImgLoad] = useState(false);
    
    const [convtImg, setConvtImg] = useState(null);
    const [convtSwtch, setConvtSwtch] = useState(false);

    const [selectObj, setSelectObj] = useState(null);
    const [cvtData, setCvtData] = useState(null);

    const [printBool, setPrintBool] = useState(false);

    const [textChg, setTextChg] = useState(false);

    const [fontColor, setFontColor] = useState("black");
    const [fontStroke, setFontStroke] = useState(false);

    const [compImg, setCompImg] = useState(null);

    const [insertNum, setInsertNum] = useState(null);


    useEffect(() => {}, [lightValue, contrastValue, imgHeight, imgWidth, convtSwtch, imgLoad, compImg])

    const chgLight = (type) => {
        if(type == "+"){
            let data = lightValue + 1;
            if(data > 15){
                data = 15
            }
            setLightValue(data);
        } else if(type == "-"){
            let data = lightValue - 1;
            if(data < 5){
                data = 5
            }
            setLightValue(data);
        }
    }

    const chgContrast = (type) => {
        if(type == "+"){
            let data = contrastValue + 1;
            if(data > 15){
                data = 15
            }
            setContrastValue(data);
        } else if(type == "-"){
            let data = contrastValue - 1;
            if(data < 5){
                data = 5
            }
            setContrastValue(data);
        }
    }

    const uptValue = (result) => {
        if(result[0] == "light"){
            setLightValue(result[1]);
        } else {
            setContrastValue(result[1]);
        }
    }


    // 이미지 업로드 div 클릭
    const handleDivClick = () => {
        inputRef.current.click();
    };

    // 이미지 불러오기
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            const imageDataURL = reader.result;
            setSelectedImage(imageDataURL);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const changeTextData = () => {
        setTextChg(!textChg);
    }

    const convertImg = () => {
        if(selectedImage != null){
            setCvtData(1);
            Swal.fire({
                text: '이미지 변환 중입니다',
                showConfirmButton: false,
                showCancelButton: false,
            });
            Swal.showLoading();
        } else {
            Swal.fire({
                icon: 'error',
                title: '알림',
                text: '도장에 사용할 이미지를 업로드 해 주세요.',
                confirmButtonText: '확인',
            }).then((res) => {
                if(res.isConfirmed){

                }
            })
        }
    }
    // dom-to-image-more 이용
    const imgPixelate = (type) => {
        // 변환후 전체 포함한 이미지 스크린샷
        if(type == "comp"){
            const bgNode = compRef.current;
            // domtoimage.toPng 메소드를 사용하여 이미지를 캡처합니다.
            domtoimage.toPng(bgNode)
                .then((dataUrl) => {
                    // 이미지를 성공적으로 캡처한 경우 dataUrl이 반환됩니다.
                    // dataUrl을 사용하여 이미지를 처리하거나 표시합니다.
                    let now = new Date();
                    const times = now.getTime();
                    setCompImg(dataUrl);

                    let sendData = {
                        user: user.ur_id,
                        printBool: user.ur_mode == 1 ? "true" : "false" ,
                        size: dotinfo.size,
                        type: `quick`,
                        style: dotinfo.style,
                        image: `${dataUrl}file_name:${user.ur_id}_${times}.pngfile_name:file_name:/${user.ur_id}/`,
                        file_name: `${user.ur_id}_${times}.png`,
                    }

                    CommonAxios.CommonAxios(
                        process.env.REACT_APP_HOSTDONAME + "/api/insert_stamp",
                        sendData,
                        function (result) {
                            if (result.messageinfo.state == "ok") {
                                // Swal.close();
                                var getData = result.messageinfo.message;
                                setInsertNum(getData);
                                Swal.fire({
                                title: "업데이트 완료",
                                icon: "success",
                                confirmButtonText: "확인",
                                }).then((res) => {
                                    if (res.isConfirmed) {
                                        Swal.close();
                                    }
                                });
                            } else {
                                Swal.close();
                            }
                        }
                    );
                })
                .catch((error) => {
                    // 이미지 캡처에 실패한 경우 이곳에서 오류 처리를 합니다.
                    console.error('Image capture failed:', error);
                });
        // 변환전 이미지 스크린샷
        } else {
            const bgNode = bgRef.current;
            // domtoimage.toPng 메소드를 사용하여 이미지를 캡처합니다.
            domtoimage.toPng(bgNode)
                .then((dataUrl) => {
                    // 이미지를 성공적으로 캡처한 경우 dataUrl이 반환됩니다.
                    // dataUrl을 사용하여 이미지를 처리하거나 표시합니다.
                    // if(type == "comp"){
                    //     setCompImg(dataUrl);
                    //     Swal.close();
                    // } else {
                    // }
                    setConvtImg(dataUrl);
                })
                .catch((error) => {
                    // 이미지 캡처에 실패한 경우 이곳에서 오류 처리를 합니다.
                    console.error('Image capture failed:', error);
                });
        }
    }

    // 미리보기 관련 상태값, 배경색
    const [imgState, setImgState] = useState(null);
    const [imgBgc, setImgBgc] = useState("white");

    const chgPreview = (data) => {
        setImgState(data);
    }
    const chgPreviewBg = (data) => {
        setImgBgc(data);
    }


    const handleImgClick = (e) => {
        if(selectedImage != null){
            setImgClick(!imgClick);
        } else {
            Swal.fire({
                icon: 'error',
                title: '알림',
                text: '배경 선택에 사용할 이미지를 업로드 해 주세요.',
                confirmButtonText: '확인',
            }).then((res) => {
                if(res.isConfirmed){

                }
            })
        }
            
    }

    const uptObj = (data) => { setSelectObj(data) }
    const uptBg = (data) => { setImgClick(data); }

    // 이미지 사이즈 비율에 맞게 적용
    useEffect(() => {
        if(imgRef.current != null){
            const { naturalWidth, naturalHeight } = imgRef.current;
            const imgRatio = naturalWidth / naturalHeight;

            if(imgRatio > 1){
                let lengths = 450 / imgRatio;
                let pos = (450-lengths)/2;
                setImgWidth(450);
                setImgHeight(lengths);
                setPosition({x: 0, y: pos})
            } else if(imgRatio < 1) {
                let lengths = 450 * imgRatio;
                let pos = (450-lengths)/2;
                setImgWidth(lengths);
                setImgHeight(450);
                setPosition({x: 0, y: pos})
            }
            setImgLoad(true);
        }
    }, [selectedImage])

    useEffect(() => {
        if(convtImg != null){
            setConvtSwtch(true);
            setTimeout(() => {
                imgPixelate("comp");
            }, 1000)
            // Swal.close();
        }
    }, [convtImg])

    const clickBool = (e) => {
        if(!textChg){
            e.stopPropagation();
        }
    }

    const chgText = (type) => {
        if(textChg){
            Swal.fire({
                title: '텍스트 변경하기',
                input: 'text',
                inputPlaceholder: type == "name" ? dotinfo.name : (type == "num1" ? dotinfo.num1 : (type == "num2" ? dotinfo.num2 : (type == "num3" ? dotinfo.num3 : (type == "number" ? dotinfo.number : dotinfo.cont)) )),
                confirmButtonText: '확인',
                cancelButtonText: '취소',
                showCancelButton: true,
                showCloseButton: true
            }).then((res) => {
                if (res.isConfirmed) {
                    const inpVal = res.value;
                    let data = {
                        size : dotinfo.size,
                        style : dotinfo.style,
                        name : dotinfo.name,
                        num1 : dotinfo.num1,
                        num2 : dotinfo.num2,
                        num3 : dotinfo.num3,
                        number : dotinfo.number,
                        cont : dotinfo.cont,
                    }
                    if(type == "name"){
                        data.name = inpVal;
                        dispatch(insert_dotinfo(data))
                    } else if(type == "num1"){
                        data.num1 = inpVal;
                        dispatch(insert_dotinfo(data))
                    } else if(type == "num2"){
                        data.num2 = inpVal;
                        dispatch(insert_dotinfo(data))
                    } else if(type == "num3"){
                        data.num3 = inpVal;
                        dispatch(insert_dotinfo(data))
                    } else if(type == "number") {
                        data.number = inpVal;
                        dispatch(insert_dotinfo(data))
                    } else {
                        data.cont = inpVal;
                        dispatch(insert_dotinfo(data))
                    }
                }
            });
        }
    }

    const sendStamp = () => {

        let sendData = {
        }

        CommonAxios.CommonAxios(
            process.env.REACT_APP_HOSTDONAME + "/api/select_charged_list",
            sendData,
            function (result) {
                if (result.messageinfo.state == "ok") {
                    var getData = result.messageinfo.message;
                    let nameArr = getData.map(data => ({value: data.no , text: data.user_name}));

                    Swal.fire({
                        title: "전달받을 회원을 선택해주세요.",
                        input: "select",
                        inputOptions: {
                            ...nameArr.reduce((acc, option) => {
                                acc[option.value] = option.text;
                                return acc;
                            }, {})
                        }, 
                        inputPlaceholder: '선택해주세요.',
                        showCancelButton: "true",
                        cancelButtonText: "취소",
                    }).then(result => {
                        if(result.isConfirmed){
                            const nameValue = result.value;
                            const selectedArr = getData.filter((data) => data.no == nameValue);
                            let sendData2 = {
                                user: selectedArr[0].user_id,
                                list_no : insertNum,
                            }
                            sendToCharged(sendData2)

                        }
                    })
                } else {

                }
            }
        );
    }

    const sendToCharged = (data) => {
        CommonAxios.CommonAxios(
            process.env.REACT_APP_HOSTDONAME + "/api/send_list",
            data,
            function (result) {
                if (result.messageinfo.state == "ok") {
                    Swal.fire({
                        title: "전송 성공",
                        icon: 'success',
                        confirmButtonText: "확인",
                    }).then((res) => {
                        if (res.isConfirmed) {
                        }
                    });
                } else {
                    Swal.fire({
                        title: "전송 실패",
                        icon: 'error',
                        confirmButtonText: "확인",
                    }).then((res) => {
                        if (res.isConfirmed) {
                        }
                    });
                }
            }
        );
    }

    return (
        <>
            <div className='dot_left_menu'>
                <hr></hr>
                <div className='dot_menu_title'>미리보기</div>
                <div className='dot_preview'>
                    {compImg == null ?
                        <div className='dot_preview_circle'>
                            {selectedImage &&
                                <PreviewImage imaged={selectedImage} sw={imgWidth} sh={imgHeight} pos={position} bgc={imgBgc}
                                    bgChg={imgClick} state={imgState} bright={`${lightValue/10}`} contrast={`${contrastValue/10}`}
                                />
                            }
                            <PreviewText color={fontColor} stroke={fontStroke}/>
                            {dotinfo.style == "B" &&
                            <>
                                <div className='stamp_circle_line'></div>
                                <div className='stamp_circle'></div>
                            </>
                            }
                        </div>
                    :
                        <>
                        <img src={compImg} />
                        <div className='dot_print_area'>
                            <div className='dot_preview_dom' ref={printRef} style={
                                dotinfo.size == 45 ? {width:"186px", height:"186px"} : 
                                (dotinfo.size == 38 ? {width:"159px", height:"159px"} : 
                                (dotinfo.size == 26 ? {width:"114px", height:"114px"} :
                                (dotinfo.size == 23 ? {width:"103px", height:"103px"} :
                                (dotinfo.size == 18 ? {width:"84px", height:"84px"} :
                                {width:"76px", height:"76px"}))))}>
                                <img src={compImg} style={
                                    dotinfo.size == 45 ? {width:"170px", height:"170px"} : 
                                    (dotinfo.size == 38 ? {width:"143px", height:"143px"} : 
                                    (dotinfo.size == 26 ? {width:"98px", height:"98px"} :
                                    (dotinfo.size == 23 ? {width:"87px", height:"87px"} :
                                    (dotinfo.size == 18 ? {width:"68px", height:"68px"} :
                                    {width:"60px", height:"60px"}))))} 
                                />
                            </div>
                        </div>
                        </>
                    }
                    <div className='dot_preview_contents'>
                        <div className='dot_style_circle' style={{backgroundColor:"rgb(35,172,160)"}}>{dotinfo.style}</div>
                        <div className='dot_size_circle' style={{backgroundColor:"rgb(91, 91, 91)"}}>{dotinfo.size}</div>
                        <hr/>
                        <span>사이즈/mm</span>
                        <div className='dot_preview_font'>스타일</div>
                    </div>
                </div>
                <hr></hr>
                {convtSwtch == false ?
                <>
                    <div className='dot_menu_title'>도장 편집하기</div>
                    <div className='dot_btn_area'>
                        <div className='dot_btn_div' onClick={handleDivClick}>
                            <div className='dot_menu_btn' style={{background: "rgb(35,172,160)"}}>
                                <RiImageAddLine size="60" color="white" />
                                <input style={{display:"none"}} type="file" ref={inputRef} accept="image/*" onChange={handleImageUpload} />
                            </div>
                            <div style={{color:"rgb(35,172,160)", margin: "10px auto"}}>이미지 업로드</div>
                        </div>
                        <div className='dot_btn_div' onClick={changeTextData}>
                            <div className='dot_menu_btn' style={textChg ? {background:"rgb(91, 91, 91)"} : null}>
                                <MdEditDocument size="60" color={textChg ? "white" : "rgb(91, 91, 91)"} />
                            </div>
                            <div style={{margin: "10px auto"}}>글자 편집</div>
                        </div>
                        <div className='dot_btn_div' onClick={convertImg}>
                            <div className='dot_menu_btn' style={{background: "red"}}>
                                <FaStamp size="60" color="white" />
                            </div>
                            <div style={{color:"red", margin: "10px auto"}}>페이스도장 변환</div>
                        </div>
                        <div className='dot_btn_div' onClick={handleImgClick}>
                            <div className='dot_menu_btn' style={imgClick ? {background:"rgb(91, 91, 91)"} : {background:"white"}}>
                                <LuPipette size="60" color={imgClick ? "white" : "rgb(91, 91, 91)"} />
                            </div>
                            <div style={{margin: "10px auto"}}>배경색 변경</div>
                        </div>
                    </div>
                </>
                :
                (user && user.ur_mode == 1 ?
                    <>
                        <div className='dot_menu_title'>도장 전송하기</div>
                        <div className='dot_btn_area' style={{justifyContent : "normal"}}>
                            <div className='dot_btn_div' onClick={()=> sendStamp()}>
                                <div className='dot_menu_btn' style={{background: "red"}}>
                                    <AiOutlineDeliveredProcedure size="60" color="white" />
                                </div>
                                <div style={{color:"red", margin: "10px auto"}}>도장 전송하기</div>
                            </div>
                        </div>
                    </>
                :
                    <>
                        <div className='dot_menu_title'>도장 출력하기</div>
                        <div className='dot_btn_area' style={{justifyContent : "normal"}}>
                            <ReactToPrint trigger={()=>
                                <div className='dot_btn_div'>
                                    <div className='dot_menu_btn' style={{background: "red"}}>
                                        <TfiPrinter size="60" color="white" />
                                    </div>
                                    <div style={{color:"red", margin: "10px auto"}}>도장 출력하기</div>
                                </div>}
                                content={() => printRef.current}
                            />
                        </div>
                    </>
                )
                }
            </div>
            <div style={{minWidth: "700px", minHeight: "700px", padding:"125px"}}>
                <div className='stamp_canvas' ref={compRef}>
                    <TextManage onClick={(e) => clickBool(e)} clickEvt={chgText} color={fontColor} stroke={fontStroke} />
                    <div className='clip_path_area' ref={bgRef}>
                        {convtSwtch == false ?
                            <div className='img_scale' 
                                style={{
                                    width:`${imgWidth}px`, height:`${imgHeight}px`, 
                                    position: "relative",
                                    //  top:`${position.y}px`, left:`${position.x}px`,
                                    filter:`grayscale(1) brightness(${lightValue/10}) contrast(${contrastValue/10})`
                                }}>
                                <img className='stamp_img' src={selectedImage} ref={imgRef} 
                                    style={imgLoad == false ? {
                                        filter:`grayscale(1) brightness(${lightValue/10}) contrast(${contrastValue/10})`,
                                        height:`${imgHeight}px`, display: "none"
                                        // position: "absolute", left:"50%", top: "50%", transform: "translate(-50%, -50%)"
                                    }
                                    :
                                    {
                                        filter:`grayscale(1) brightness(${lightValue/10}) contrast(${contrastValue/10})`,
                                        width:`${imgWidth}px`, height:`${imgHeight}px`, display: "none"
                                    }}
                                />
                                {/* {dotinfo.style == "C" ?
                                    <div style={{background: `white`, width: `350px`,height: `350px`,margin: `50px`,border: `3px solid black`,borderRadius: `50%`,overflow: `hidden`}}/>
                                : null } */}
                                {selectedImage &&
                                    <ImageManage imaged={selectedImage} sw={imgWidth} sh={imgHeight} pos={position}
                                        objValue={selectObj} uptObj={uptObj} bgChg={imgClick} uptBg={uptBg} type={"quick"}
                                        convert={cvtData} pixelate={imgPixelate} sendState={chgPreview} sendBgc={chgPreviewBg}
                                    />
                                }
                            </div>
                        :
                            <DotTest2 img={convtImg} startPrint={printBool}/>
                        }
                    </div>
                    <div className='stamp_div' ref={photoRef}>
                        {dotinfo.style == "B" &&
                            <>
                                <div className='stamp_circle_line'></div>
                                <div className='stamp_circle'></div>
                            </>
                        }
                        {dotinfo.style == "C" ?
                            <div style={{width: `350px`,height: `350px`,margin: `44px`,border: `3px solid black`,borderRadius: `50%`}}/>
                        : null }
                    </div>
                </div>
            </div>
            <div className='dot_right_menu'>
                <div>
                    <Link to="/">
                        <div className='btn_area'>
                            <div className='btn_circle'>
                                <IoIosHome size={30} color={"white"} />
                            </div>
                            <div>메인으로</div>
                        </div>
                    </Link>
                    <Link to={"/dotset/info_" + dotinfo.style }>
                        <div className='btn_area'>
                            <div className='btn_circle'>
                                <BiArrowBack size={30} color={"white"} />
                            </div>
                            <div>이전으로</div>
                        </div>
                    </Link>
                </div>
                {convtSwtch == false ? 
                <>
                    <hr></hr>
                    <div className='dot_menu_title'>글자 설정</div>
                    <div>
                        <span className='bd_text'>색상</span>
                        <div className='dot_color_btn'>
                            <span>검은색</span>
                            <div style={fontColor == "black" ? {border: "5px solid rgb(35,172,160)"} : {border : "1px solid rgb(35,172,160)"}} onClick={() => setFontColor("black")} />
                            <span>흰색</span>
                            <div style={fontColor == "white" ? {border: "5px solid rgb(35,172,160)"} : {border : "1px solid rgb(35,172,160)"}} onClick={() => setFontColor("white")} />
                        </div>
                    </div>
                    <div style={{marginBottom: "20px", height: "40px", lineHeight: "40px"}}>
                        <span className='bd_text'>윤곽선</span>
                        { fontStroke ?
                            <MdToggleOn onClick={() => setFontStroke(false)} size={40} color={"rgb(35,172,160)"} />
                        :
                            <MdToggleOff onClick={() => setFontStroke(true)} size={40} color={"rgb(91, 91, 91)"} />
                        }
                    </div>
                    {selectedImage &&
                    <>
                        <hr></hr>
                        <div className='dot_menu_title'>밝기/대비 조정</div>
                        <div className='pg_line'>
                            <span>밝기</span>
                            <button onClick={()=>chgLight("-")}>-</button>
                                <ProgressBar value={lightValue} min={5} max={15} setValue={uptValue} type={"light"} />
                            <button onClick={()=>chgLight("+")}>+</button>
                        </div>
                        <div className='pg_line'>
                            <span>대비</span>
                            <button onClick={()=>chgContrast("-")}>-</button>
                                <ProgressBar value={contrastValue} min={5} max={15} setValue={uptValue} type={"contrast"} />
                            <button onClick={()=>chgContrast("+")}>+</button>
                        </div>
                    </>
                    }
                </>
                :
                null}
            </div>
        </>
    );


    

}

export default DotCanvas;