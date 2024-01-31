import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BiArrowBack } from 'react-icons/bi';
import { IoIosHome } from 'react-icons/io';
import domtoimage from 'dom-to-image-more';
import { Scrollbars } from 'react-custom-scrollbars'
import DotTest2 from './../DotTest2';
import Swal from "sweetalert2";
import style from "./../../../styles/custom.module.css";
import { FaStamp } from 'react-icons/fa';
import { RiImageAddLine } from 'react-icons/ri';
import { LuPipette } from 'react-icons/lu';
import { TfiPrinter } from 'react-icons/tfi'
import { MdToggleOn } from 'react-icons/md';
import { MdToggleOff } from 'react-icons/md';
import { AiOutlineDeliveredProcedure } from 'react-icons/ai';
import * as CommonAxios from "./../../CommonAxios";
import ProgressBar from '../../bar/ProgressBar';
import hanguelCons from '../../../assets/hanguelCons/hangeulCons';
import hanguelVowel from '../../../assets/hanguelVowel/hangeulVowel';
import englishImg from '../../../assets/englishImg/englishImg';
import numberImg from '../../../assets/numberImg/numberImg';
import etcImg from '../../../assets/etcImg/etcImg';
import ReactToPrint from "react-to-print";
import TemaDualKonva from './TemaDualKonva';

const EduCanvas = () => {

    const { user, dotinfo } = useSelector(({ user, dotinfo }) => ({
        user: user.user,
        dotinfo: dotinfo.dotinfo,
    }));

    const [settingSize, setSize ] = useState(450);      // 선택된 사이즈별 중앙 원의 크기
    const [mgSize, setMgSize] = useState(0);            // 선택된 사이즈별 중앙 원의 padding 및 margin값
    const [sizeBool, setSizeBool] = useState(false);    // 사이즈 계산 여부

    // 선택한 도장 사이즈에 맞도록 사이즈 계산
    useEffect(() => {
        if(dotinfo != undefined){
            let data = parseInt(dotinfo.size*10);
            let minus = 450 - data;
            setSize(data);
            setMgSize(minus/2);
            setSizeBool(true);
        }
    }, [dotinfo])

    const [imgOption, setImgOption] = useState(1);              // 이미지 타입 종류

    const [testShape, setTestShape] = useState(null);           // 맞춤틀 적용 전 데이터
    const [selectShape, setSelectShape] = useState(null);       // 맞춤틀 적용 데이터
    const [clipNum, setClipNum] = useState(100);

    const [imgArr, setImgArr] = useState([]);
    const [imgNo, setImgNo] = useState(0);

    useEffect(() => {
        if(testShape != null){
            let data = {
                id: "shape",
                img: testShape,
            }
            setImgArr([data]);
            setSelectedImage(null);
        }
    }, [testShape])

    const [imageChg, setImageChg] = useState(false)

    const [selectedImage, setSelectedImage] = useState(null);   // 이미지 URL 주소
    const inputRef = useRef(null);
    const imgRef = useRef(null);

    useEffect(() => {
        if(selectedImage != null){
            let data = {
                id: "bgimg",
                img: selectedImage,
                no: imgNo+1,
            }
            setImgNo(imgNo+1);
            setImgArr([imgArr[0], data]);
        }
    }, [selectedImage])

    const canvRef = useRef(null);
    const bgRef = useRef(null);
    const photoRef = useRef(null);
    const compRef = useRef(null);
    const printRef = useRef();
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const [imgClick, setImgClick] = useState(false);

    const [lightValue, setLightValue] = useState(10);           // 이미지 밝기
    const [contrastValue, setContrastValue] = useState(10);     // 이미지 대비

    const [testLight, setTestLight] = useState(10);             // 이미지 밝기 적용 전 데이터
    const [testCon, setTestCon] = useState(10);                 // 이미지 대비 적용 전 데이터

    const [imgModify, setImgModify] = useState(false);

    const [imgSwtch, setImgSwtch] = useState(false);

    const [imgWidth, setImgWidth] = useState(450);
    const [imgHeight, setImgHeight] = useState(450);
    const [imgLoad, setImgLoad] = useState(false);
    
    const [convtImg, setConvtImg] = useState(null);
    const [convtSwtch, setConvtSwtch] = useState(false);

    const [selectObj, setSelectObj] = useState(null);
    const [cvtData, setCvtData] = useState(null);

    const [printBool, setPrintBool] = useState(false);

    const [compImg, setCompImg] = useState(null);

    const [insertNum, setInsertNum] = useState(null);


    useEffect(() => {}, [lightValue, contrastValue, imgHeight, imgWidth, convtSwtch, imgLoad, compImg, imgArr, mgSize])


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
        } else if(result[0] == "contrast") {
            setContrastValue(result[1]);
        } else {
            let data = result[1];
            if(data < 1){
                data = 1;
            } else if(data > 10){
                data = 10;
            }
        }
    }


    // 이미지 업로드 div 클릭
    const handleDivClick = () => {
        if(testShape != null){
            inputRef.current.value = null;
            inputRef.current.click();
        } else {
            Swal.fire({
                icon: 'error',
                title: '알림',
                text: '도장 유형을 선택해주세요.',
                confirmButtonText: '확인',
            }).then((res) => {
                if(res.isConfirmed){

                }
            })
        }
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


    const convertImg = () => {
        // setImgModify(true);
        if(selectedImage != null){
            setCvtData(1);
            setImageChg(false)
            Swal.fire({
                text: '이미지 변환 중입니다',
                showConfirmButton: false,
                showCancelButton: false,
            });
            Swal.showLoading();
        } else {
            Swal.fire({
                text: '이미지 변환 중입니다',
                showConfirmButton: false,
                showCancelButton: false,
            });
            Swal.showLoading();
            imgPixelate("comp");
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
                        type: `custom`,
                        style: "",
                        image: `${dataUrl}file_name:${user.ur_id}_${times}.pngfile_name:file_name:/${user.ur_id}/`,
                        file_name: `${user.ur_id}_${times}.png`,
                    }

                    CommonAxios.CommonAxios(
                        process.env.REACT_APP_HOSTDONAME + "/api/insert_stamp",
                        sendData,
                        function (result) {
                            if (result.messageinfo.state == "ok") {
                                setConvtSwtch(true);
                                // Swal.close();
                                var getData = result.messageinfo.message;
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
            setConvtImg(type);
            setImgArr([imgArr[0]]);
        }
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
            if(sizeBool){
                const { naturalWidth, naturalHeight } = imgRef.current;
                const imgRatio = naturalWidth / naturalHeight;
                console.log(settingSize);
                if(imgRatio > 1){
                    let lengths = 450 * imgRatio;
                    let pos = (lengths-settingSize)/2;
                    setImgWidth(lengths);
                    setImgHeight(settingSize);
                    setPosition({x: pos, y: 0})
                    // let lengths = 450 / imgRatio;
                    // let pos = (450-lengths)/2;
                    // setImgWidth(settingSize);
                    // setImgHeight(lengths);
                    // setPosition({x: 0, y: pos})
                } else if(imgRatio < 1) {
                    let lengths = settingSize * imgRatio;
                    let pos = (settingSize-lengths)/2;
                    setImgWidth(lengths);
                    setImgHeight(settingSize);
                    setPosition({x: pos, y: 0})
                }
                setImgLoad(true);
            }
        }
    }, [selectedImage, sizeBool])

    useEffect(() => {
        if(convtImg != null){
            setConvtSwtch(true);
            setTimeout(() => {
                imgPixelate("comp");
            }, 1000)
            // Swal.close();
        }
    }, [convtImg])

    const chgOption = (e) => {
        console.log(e.target.value)
        setImgOption(e.target.value)
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
            <div className={style.dot_left_menu}>
                
                <hr></hr>
                <div className={style.dot_menu_title}>한글 도장</div>
                <div className={style.dot_menu_select_box}>
                    <span>종류</span>
                    <select onChange={(e) => chgOption(e)}>
                        <option value={1}>한글 자음 도장</option>
                        <option value={2}>한글 모음 도장</option>
                        <option value={3}>영문 도장</option>
                        <option value={4}>숫자 도장</option>
                        <option value={5}>학습 도장</option>
                        <option value={6}>도로교통 표지 도장</option>
                    </select>
                </div>
                <div className={style.dot_shape_div}>
                    {imgOption == 1 &&
                        <Scrollbars thumbsize={125}>
                            <img src={hanguelCons.img1} onClick={() => setTestShape(hanguelCons.img1)} />
                            <img src={hanguelCons.img2} onClick={() => setTestShape(hanguelCons.img2)} />
                            <img src={hanguelCons.img3} onClick={() => setTestShape(hanguelCons.img3)} />
                            <img src={hanguelCons.img4} onClick={() => setTestShape(hanguelCons.img4)} />
                            <img src={hanguelCons.img5} onClick={() => setTestShape(hanguelCons.img5)} />
                            <img src={hanguelCons.img6} onClick={() => setTestShape(hanguelCons.img6)} />
                            <img src={hanguelCons.img7} onClick={() => setTestShape(hanguelCons.img7)} />
                            <img src={hanguelCons.img8} onClick={() => setTestShape(hanguelCons.img8)} />
                            <img src={hanguelCons.img9} onClick={() => setTestShape(hanguelCons.img9)} />
                            <img src={hanguelCons.img10} onClick={() => setTestShape(hanguelCons.img10)} />
                            <img src={hanguelCons.img11} onClick={() => setTestShape(hanguelCons.img11)} />
                            <img src={hanguelCons.img12} onClick={() => setTestShape(hanguelCons.img12)} />
                            <img src={hanguelCons.img13} onClick={() => setTestShape(hanguelCons.img13)} />
                            <img src={hanguelCons.img14} onClick={() => setTestShape(hanguelCons.img14)} />
                            <img src={hanguelCons.img15} onClick={() => setTestShape(hanguelCons.img15)} />
                            <img src={hanguelCons.img16} onClick={() => setTestShape(hanguelCons.img16)} />
                            <img src={hanguelCons.img17} onClick={() => setTestShape(hanguelCons.img17)} />
                            <img src={hanguelCons.img18} onClick={() => setTestShape(hanguelCons.img18)} />
                            <img src={hanguelCons.img19} onClick={() => setTestShape(hanguelCons.img19)} />
                        </Scrollbars>
                    }
                    {imgOption == 2 &&
                        <Scrollbars thumbsize={125}>
                            <img src={hanguelVowel.img1} onClick={() => setTestShape(hanguelVowel.img1)} />
                            <img src={hanguelVowel.img2} onClick={() => setTestShape(hanguelVowel.img2)} />
                            <img src={hanguelVowel.img3} onClick={() => setTestShape(hanguelVowel.img3)} />
                            <img src={hanguelVowel.img4} onClick={() => setTestShape(hanguelVowel.img4)} />
                            <img src={hanguelVowel.img5} onClick={() => setTestShape(hanguelVowel.img5)} />
                            <img src={hanguelVowel.img6} onClick={() => setTestShape(hanguelVowel.img6)} />
                            <img src={hanguelVowel.img7} onClick={() => setTestShape(hanguelVowel.img7)} />
                            <img src={hanguelVowel.img8} onClick={() => setTestShape(hanguelVowel.img8)} />
                            <img src={hanguelVowel.img9} onClick={() => setTestShape(hanguelVowel.img9)} />
                            <img src={hanguelVowel.img10} onClick={() => setTestShape(hanguelVowel.img10)} />
                            <img src={hanguelVowel.img11} onClick={() => setTestShape(hanguelVowel.img11)} />
                            <img src={hanguelVowel.img12} onClick={() => setTestShape(hanguelVowel.img12)} />
                            <img src={hanguelVowel.img13} onClick={() => setTestShape(hanguelVowel.img13)} />
                        </Scrollbars>
                    }
                    {imgOption == 3 &&
                        <Scrollbars thumbsize={125}>
                            <img src={englishImg.img1} onClick={() => setTestShape(englishImg.img1)} />
                            <img src={englishImg.img2} onClick={() => setTestShape(englishImg.img2)} />
                            <img src={englishImg.img3} onClick={() => setTestShape(englishImg.img3)} />
                            <img src={englishImg.img4} onClick={() => setTestShape(englishImg.img4)} />
                            <img src={englishImg.img5} onClick={() => setTestShape(englishImg.img5)} />
                            <img src={englishImg.img6} onClick={() => setTestShape(englishImg.img6)} />
                            <img src={englishImg.img7} onClick={() => setTestShape(englishImg.img7)} />
                            <img src={englishImg.img8} onClick={() => setTestShape(englishImg.img8)} />
                            <img src={englishImg.img9} onClick={() => setTestShape(englishImg.img9)} />
                            <img src={englishImg.img10} onClick={() => setTestShape(englishImg.img10)} />
                            <img src={englishImg.img11} onClick={() => setTestShape(englishImg.img11)} />
                            <img src={englishImg.img12} onClick={() => setTestShape(englishImg.img13)} />
                            <img src={englishImg.img14} onClick={() => setTestShape(englishImg.img14)} />
                            <img src={englishImg.img15} onClick={() => setTestShape(englishImg.img15)} />
                            <img src={englishImg.img16} onClick={() => setTestShape(englishImg.img16)} />
                            <img src={englishImg.img17} onClick={() => setTestShape(englishImg.img17)} />
                            <img src={englishImg.img18} onClick={() => setTestShape(englishImg.img18)} />
                            <img src={englishImg.img19} onClick={() => setTestShape(englishImg.img19)} />
                            <img src={englishImg.img20} onClick={() => setTestShape(englishImg.img20)} />
                            <img src={englishImg.img21} onClick={() => setTestShape(englishImg.img21)} />
                            <img src={englishImg.img22} onClick={() => setTestShape(englishImg.img22)} />
                            <img src={englishImg.img23} onClick={() => setTestShape(englishImg.img23)} />
                            <img src={englishImg.img24} onClick={() => setTestShape(englishImg.img24)} />
                            <img src={englishImg.img25} onClick={() => setTestShape(englishImg.img25)} />
                            <img src={englishImg.img26} onClick={() => setTestShape(englishImg.img26)} />
                        </Scrollbars>
                    }
                    {imgOption == 4 &&
                        <Scrollbars thumbsize={125}>
                            <img src={numberImg.img1} onClick={() => setTestShape(numberImg.img1)} />
                            <img src={numberImg.img2} onClick={() => setTestShape(numberImg.img2)} />
                            <img src={numberImg.img3} onClick={() => setTestShape(numberImg.img3)} />
                            <img src={numberImg.img4} onClick={() => setTestShape(numberImg.img4)} />
                            <img src={numberImg.img5} onClick={() => setTestShape(numberImg.img5)} />
                            <img src={numberImg.img6} onClick={() => setTestShape(numberImg.img6)} />
                            <img src={numberImg.img7} onClick={() => setTestShape(numberImg.img7)} />
                            <img src={numberImg.img8} onClick={() => setTestShape(numberImg.img8)} />
                            <img src={numberImg.img9} onClick={() => setTestShape(numberImg.img9)} />
                            <img src={numberImg.img10} onClick={() => setTestShape(numberImg.img10)} />
                            <img src={numberImg.img11} onClick={() => setTestShape(numberImg.img11)} />
                            <img src={numberImg.img12} onClick={() => setTestShape(numberImg.img12)} />
                            <img src={numberImg.img13} onClick={() => setTestShape(numberImg.img13)} />
                            <img src={numberImg.img14} onClick={() => setTestShape(numberImg.img14)} />
                            <img src={numberImg.img15} onClick={() => setTestShape(numberImg.img15)} />
                            <img src={numberImg.img16} onClick={() => setTestShape(numberImg.img16)} />
                            <img src={numberImg.img17} onClick={() => setTestShape(numberImg.img17)} />
                            <img src={numberImg.img18} onClick={() => setTestShape(numberImg.img18)} />
                            <img src={numberImg.img19} onClick={() => setTestShape(numberImg.img19)} />
                            <img src={numberImg.img20} onClick={() => setTestShape(numberImg.img20)} />
                        </Scrollbars>
                    }
                    {imgOption == 5 &&
                        <Scrollbars thumbsize={125}>
                            <img src={etcImg.img1} onClick={() => setTestShape(etcImg.img1)} />
                            <img src={etcImg.img2} onClick={() => setTestShape(etcImg.img2)} />
                            <img src={etcImg.img3} onClick={() => setTestShape(etcImg.img3)} />
                        </Scrollbars>
                    }
                    {imgOption == 6 &&
                        <Scrollbars thumbsize={125}>
                            <img src={etcImg.img4} onClick={() => setTestShape(etcImg.img4)} />
                            <img src={etcImg.img5} onClick={() => setTestShape(etcImg.img5)} />
                            <img src={etcImg.img6} onClick={() => setTestShape(etcImg.img6)} />
                            <img src={etcImg.img7} onClick={() => setTestShape(etcImg.img7)} />
                            <img src={etcImg.img8} onClick={() => setTestShape(etcImg.img8)} />
                            <img src={etcImg.img9} onClick={() => setTestShape(etcImg.img9)} />
                            <img src={etcImg.img10} onClick={() => setTestShape(etcImg.img10)} />
                            <img src={etcImg.img11} onClick={() => setTestShape(etcImg.img11)} />
                        </Scrollbars>
                    }
                </div>
            </div>
            <div className={style.canvas_area} style={{minWidth: "700px", minHeight: "700px", padding:"125px", position:"relative"}}>
                <div className={style.stamp_canvas} ref={compRef} style={{width:`${settingSize}px`, height: `${settingSize}px`, padding:`${mgSize}px`}}>
                    
                    <div className={style.clip_path_area} ref={bgRef} style={imgModify ? {overflow: "unset", width:`${settingSize}px`, height:`${settingSize}px`} : (imgClick ? {overflow: "hidden", width:`${settingSize}px`, height:`${settingSize}px`} : {overflow: "hidden", pointerEvents:"none", width:`${settingSize}px`, height:`${settingSize}px`})}>
                        {convtSwtch == false ?
                            <div className='img_scale' 
                                style={{
                                    width:`${settingSize}px`, height:`${settingSize}px`, 
                                    position: "relative",
                                    filter:`grayscale(1) brightness(${imgSwtch ? testLight/10 : lightValue/10}) contrast(${imgSwtch ? testCon/10 : contrastValue/10})`
                                }}>
                                <img className='stamp_img' src={selectedImage} ref={imgRef} 
                                    style={imgLoad == false ? {
                                        filter:`grayscale(1) brightness(${imgSwtch ? testLight/10 : lightValue/10}) contrast(${imgSwtch ? testCon/10 : contrastValue/10})`,
                                        height:`${settingSize}px`, display: "none"
                                    }
                                    :
                                    {
                                        filter:`grayscale(1) brightness(${lightValue/10}) contrast(${contrastValue/10})`,
                                        width:`${settingSize}px`, height:`${settingSize}px`, display: "none"
                                    }}
                                />
                                {/* {selectedImage &&
                                    <ImageManage imaged={selectedImage} sw={imgWidth} sh={imgHeight} pos={position}
                                        objValue={selectObj} uptObj={uptObj} bgChg={imgClick} uptBg={uptBg} former={imgModify}
                                        convert={cvtData} pixelate={imgPixelate} clip={imgModify ? 100 : clipNum} type={"custom"}
                                    />
                                } */}
                            </div>
                        :
                            <div style={clipNum > 100 ? {position:"relative", clipPath: `circle(43% at 50% 43%)`} : {position:"relative", clipPath: `circle(${clipNum}%)`}}>
                                <DotTest2 img={convtImg} startPrint={printBool}/>
                            </div>
                        }
                    </div>
                    {/* <div className={style.stamp_div} style={imgModify ? {filter:"contrast(0.1)", width:`${settingSize}px`, height:`${settingSize}px`, marginTop:`${mgSize}px`} : { width:`${settingSize}px`, height:`${settingSize}px`, marginTop:`${mgSize}px`}}  ref={photoRef}>
                        {testShape ?
                            <img src={testShape} />
                            :
                            (selectShape &&
                                <img src={selectShape} />
                            )
                        }
                    </div> */}
                </div>
                <div className={style.chg_dom} ref={canvRef} style={{filter:`grayscale(1) brightness(${lightValue/10}) contrast(${contrastValue/10})`}}>
                    <TemaDualKonva 
                        sw={imgWidth} sh={imgHeight} pos={position} arrData={imgArr} ips={mgSize} showSize={settingSize}
                        objValue={selectObj} uptObj={uptObj} bgChg={imgClick} uptBg={uptBg} former={imgModify}
                        convert={cvtData} pixelate={imgPixelate} clip={imgModify ? 100 : clipNum} imgMove={imageChg}
                    />
                </div>
            </div>
            <div className={style.dot_right_menu}>
                <Link to="/">
                    <div className={style.btn_area}>
                        <div className={style.btn_circle}>
                            <IoIosHome size={30} color={"white"} />
                        </div>
                        <div>메인으로</div>
                    </div>
                </Link>
                <Link to="/dotset/tema">
                    <div className={style.btn_area}>
                        <div className={style.btn_circle}>
                            <BiArrowBack size={30} color={"white"} />
                        </div>
                        <div>이전으로</div>
                    </div>
                </Link>
                <div className={style.dot_tema_menu_title}>
                    <hr></hr>
                    <div>도장 편집하기</div>
                </div>
                {convtSwtch == false ? 
                <>
                    <div className={style.dot_btn_area}>
                        <div className={style.dot_btn_div} onClick={handleDivClick}>
                            <div className={style.dot_menu_btn} style={{background: "rgb(35,172,160)"}}>
                                <RiImageAddLine size="50" color="white" />
                                <input style={{display:"none"}} type="file" ref={inputRef} accept="image/*" onChange={handleImageUpload} />
                            </div>
                            <div style={{color:"rgb(35,172,160)", margin: "10px auto"}}>이미지 업로드</div>
                        </div>
                        <div className={style.dot_btn_div} onClick={handleImgClick}>
                            <div className={style.dot_menu_btn} style={imgClick ? {background:"rgb(91, 91, 91)"} : {background:"white"}}>
                                <LuPipette size="50" color={imgClick ? "white" : "rgb(91, 91, 91)"} />
                            </div>
                            <div style={{margin: "10px auto"}}>배경색 변경</div>
                        </div>
                        <div className={style.dot_btn_div} onClick={convertImg}>
                            <div className={style.dot_menu_btn} style={{background: "red"}}>
                                <FaStamp size="50" color="white" />
                            </div>
                            <div style={{color:"red", margin: "10px auto"}}>페이스도장 변환</div>
                        </div>
                    </div>
                    {selectedImage != null &&
                    <>
                        <div className={style.dot_tema_menu_title}>
                            <hr></hr>
                            <div>밝기/대비 조정</div>
                        </div>
                        <div className={style.dot_tema_pg_area}>
                            <div className={style.pg_line}>
                                <span>밝기</span>
                                <button onClick={()=>chgLight("-")}>-</button>
                                <ProgressBar value={lightValue} min={5} max={15} setValue={uptValue} type={"light"} />
                                <button onClick={()=>chgLight("+")}>+</button>
                            </div>
                            <div className={style.pg_line}>
                                <span>대비</span>
                                <button onClick={()=>chgContrast("-")}>-</button>
                                <ProgressBar value={contrastValue} min={5} max={15} setValue={uptValue} type={"contrast"} />
                                <button onClick={()=>chgContrast("+")}>+</button>
                            </div>
                            <div className={style.pg_line}>
                                <span>이미지 조정</span>
                                {imageChg ?
                                    <MdToggleOn color={"rgb(35,172,160)"} size={30} onClick={() => setImageChg(false)}/>
                                :
                                    <MdToggleOff size={30} onClick={() => setImageChg(true)}/>
                                }
                            </div>
                        </div>
                    </>
                    }
                </>
                :
                (user && user.ur_mode == 1 ?
                    <>
                        <div className='dot_btn_area' style={{justifyContent : "normal", position:"fixed", bottom: "50px", right:"10px"}}>
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
                        <div className='dot_btn_area' style={{justifyContent : "normal", position:"fixed", bottom: "50px", right:"10px"}}>
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
                )}
            </div>
        </>
    );


    

}

export default EduCanvas;