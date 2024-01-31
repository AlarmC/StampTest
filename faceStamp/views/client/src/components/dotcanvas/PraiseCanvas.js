import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BiArrowBack } from 'react-icons/bi';
import { IoIosHome } from 'react-icons/io';
import domtoimage from 'dom-to-image-more';
import { Scrollbars } from 'react-custom-scrollbars'
import DotTest2 from './DotTest2';
import ImageManage from './ImageManage';
import CustomText from './CustomText';
import CustomTextArr from './CustomTextArr';
import TextKonva from "./TextKonva.js";
import IconKonva from './IconKonva.js';
import DataKonva from "./DataKonva.js"
import DrawKonva from './DrawKonva';
import Swal from "sweetalert2";
import style from "./../../styles/custom.module.css";
import { BsCircle } from "react-icons/bs";
import { BsImage } from "react-icons/bs";
import { GiPalette } from "react-icons/gi";
import { RxText } from "react-icons/rx";
import { FaStamp } from 'react-icons/fa';
import { RiImageAddLine } from 'react-icons/ri';
import { MdToggleOn } from 'react-icons/md';
import { MdToggleOff } from 'react-icons/md';
import { TbArrowBack } from 'react-icons/tb';
import { LuPipette } from 'react-icons/lu';
import { TfiPrinter } from 'react-icons/tfi'
import { AiOutlineDeliveredProcedure } from 'react-icons/ai';
import * as CommonAxios from "./../CommonAxios";
import ProgressBar from '../bar/ProgressBar';
import faceShape from '../../assets/faceShape/faceShape';
import faceIcon from '../../assets/faceIcon/faceIcon';
import hanguelCons from '../../assets/hanguelCons/hangeulCons';
import hanguelVowel from '../../assets/hanguelVowel/hangeulVowel';
import englishImg from '../../assets/englishImg/englishImg';
import numberImg from '../../assets/numberImg/numberImg';
import etcImg from '../../assets/etcImg/etcImg';
import ReactToPrint from "react-to-print";

const PraiseCanvas = () => {

    const { user, dotinfo } = useSelector(({ user, dotinfo }) => ({
        user: user.user,
        dotinfo: dotinfo.dotinfo,
    }));

    const [settingSize, setSize ] = useState(450);
    const [mgSize, setMgSize] = useState(0);
    const [sizeBool, setSizeBool] = useState(false);

    useEffect(() => {
        if(dotinfo != undefined){
            let data = parseInt(dotinfo.size*10);
            let minus = 450 - data;
            setSize(data);
            setMgSize(minus/2);
            setSizeBool(true);
        }
    }, [dotinfo])

    const [imgOption, setImgOption] = useState(1);

    const [selectMenu, setSelectMenu] = useState(null);         // 우측 메뉴 선택 데이터
    const [testShape, setTestShape] = useState(null);           // 맞춤틀 적용 전 데이터
    const [selectShape, setSelectShape] = useState(null);       // 맞춤틀 적용 데이터
    const [shapeSwtch, setShapeSwtch] = useState(false);        // 맞춤틀 적용 후 이미지 업로드 버튼 유/무
    const [clipNum, setClipNum] = useState(100)

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

    const [testLight, setTestLight] = useState(10);             // 이미지 밝기 적용 전 데이터
    const [testCon, setTestCon] = useState(10);                 // 이미지 대비 적용 전 데이터

    const [imgModify, setImgModify] = useState(false);

    const [vtReverse, setVtReverse] = useState(1);      // 이미지 상/하 반전
    const [hzReverse, setHzReverse] = useState(1);      // 이미지 좌/우 반전

    const [testVt, setTestVt] = useState(1);            // 이미지 상/하 반전 적용 전 데이터
    const [testHz, setTestHz] = useState(1);            // 이미지 좌/우 반전 적용 전 데이터

    const [drawingMode, setDrawingMode] = useState(false);      // 그리기 도구 (그림모드 or 지우기모드 둘 중 하나가 on이면 true)
    const [modeName, setModeName] = useState("");               // 그리기 도구명 ( 그림모드 or 지우기모드 )

    const [selectIcon, setSelectIcon] = useState(null);         // 그리기 도구 아이콘 선택
    const [iconColor, setIconColor] = useState("black");
    const [iconStroke, setIconStroke] = useState(false);
    const [iconArr, setIconArr] = useState([]);                 // 아이콘 배열

    const [fontFamily, setFontFamily] = useState("Jua");        // 폰트종류
    const [fontsize, setFontsize] = useState(35);               // 폰트사이즈
    const [fontData, setFontData] = useState("");               // 입력한 내용
    const [fontcolor, setFontcolor] = useState("black");        // 폰트 색상(검, 흰)
    const [fontstroke, setFontstroke] = useState(false);        // 폰트 윤곽선
    const [fontsys, setFontsys] = useState("horizon");          // 폰트 모양(가로/세로)
    const [fontCurve, setFontCurve] = useState(false);          // 폰트 곡선 유무
    const [fontOption, setFontOption] = useState(1);            // 폰트 곡선 방향(1: 위/왼 , 2: 아래/오른)
    const [textArr, setTextArr] = useState([]);                 // 곡선 글자 배열

    const [konvaArr, setKonvaArr] = useState([])
    const [konvaNum, setKonvaNum] = useState(0);

    const [lineTextArr, setLineTextArr] = useState([]);         // 직선 글자 배열

    const [lineColor, setLineColor] = useState("black");
    const [lineWeight, setLineWeight] = useState(1);

    const [imgSwtch, setImgSwtch] = useState(false);

    const [imgWidth, setImgWidth] = useState(450);
    const [imgHeight, setImgHeight] = useState(450);
    const [imgLoad, setImgLoad] = useState(false);
    
    const [convtImg, setConvtImg] = useState(null);
    const [convtSwtch, setConvtSwtch] = useState(false);

    const [selectObj, setSelectObj] = useState(null);
    const [cvtData, setCvtData] = useState(null);

    const [printBool, setPrintBool] = useState(false);

    const [textChg, setTextChg] = useState(false);

    const [compImg, setCompImg] = useState(null);

    const [insertNum, setInsertNum] = useState(null);


    useEffect(() => {}, [lightValue, contrastValue, imgHeight, imgWidth, convtSwtch, imgLoad, compImg])

    // 맞춤틀 선택 취소 버튼
    const cancelShape = () => {
        setSelectMenu(null);
        setTestShape(selectShape);
    }
    // 맞춤틀 선택 적용 버튼
    const submitShape = () => {
        setShapeSwtch(true);
        setSelectShape(testShape);
        if(testShape == faceShape.img1){ setClipNum(100) }
        else if(testShape == faceShape.img2){ setClipNum(100) }
        else if(testShape == faceShape.img3){ setClipNum(100) }
        else if(testShape == faceShape.img4){ setClipNum(37) }
        else if(testShape == faceShape.img5){ setClipNum(41) }
        else if(testShape == faceShape.img6){ setClipNum(42) }
        else if(testShape == faceShape.img7){ setClipNum(43) }
        else if(testShape == faceShape.img8){ setClipNum(100) }
        else if(testShape == faceShape.img9){ setClipNum(43) }
        else if(testShape == faceShape.img10){ setClipNum(41) }
        else if(testShape == faceShape.img11){ setClipNum(150) }
        else if(testShape == faceShape.img12){ setClipNum(39) }
        else if(testShape == faceShape.img13){ setClipNum(40) }
        else if(testShape == faceShape.img14){ setClipNum(40) }
        else if(testShape == faceShape.img15){ setClipNum(40) }
        else if(testShape == faceShape.img16){ setClipNum(37) }
        else if(testShape == faceShape.img17){ setClipNum(37) }
        else if(testShape == faceShape.img18){ setClipNum(40) }
        else if(testShape == faceShape.img19){ setClipNum(40) }
        else if(testShape == faceShape.img20){ setClipNum(38) }
        else if(testShape == faceShape.img21){ setClipNum(44) }
        else if(testShape == faceShape.img22){ setClipNum(40) }
        setSelectMenu(null);
    }
    // 이미지 도구 취소 버튼
    const cancelImage = () => {
        setImgModify(false);
        setSelectMenu(null);
        setTestCon(contrastValue);
        setTestLight(lightValue);
        setTestHz(hzReverse);
        setTestVt(vtReverse);
    }
    // 이미지 도구 적용 버튼
    const submitImage = () => {
        setImgModify(false);
        setSelectMenu(null);
        setContrastValue(testCon);
        setLightValue(testLight);
        setHzReverse(testHz);
        setVtReverse(testVt);
    }

    // 임시 선택 아이콘 
    const tempSelectImg = (image) => {
        if(selectIcon == null){
            setSelectIcon(image);
            let img = image;
            if(img == faceIcon.img1){ if(iconColor == "white"){img = faceIcon.img1_1;}}
            if(img == faceIcon.img2){ if(iconColor == "white"){img = faceIcon.img2_1;}}
            if(img == faceIcon.img3){ if(iconColor == "white"){img = faceIcon.img3_1;}}
            if(img == faceIcon.img4){ if(iconColor == "white"){img = faceIcon.img4_1;}}
            if(img == faceIcon.img5){ if(iconColor == "white"){img = faceIcon.img5_1;}}
            if(img == faceIcon.img6){ if(iconColor == "white"){img = faceIcon.img6_1;}}
            if(img == faceIcon.img7){ if(iconColor == "white"){img = faceIcon.img7_1;}}
            if(img == faceIcon.img8){ if(iconColor == "white"){img = faceIcon.img8_1;}}
            if(img == faceIcon.img9){ if(iconColor == "white"){img = faceIcon.img9_1;}}
            if(img == faceIcon.img10){ if(iconColor == "white"){img = faceIcon.img10_1;}}
            if(img == faceIcon.img11){ if(iconColor == "white"){img = faceIcon.img11_1;}}
            if(img == faceIcon.img12){ if(iconColor == "white"){img = faceIcon.img12_1;}}
            if(img == faceIcon.img13){ if(iconColor == "white"){img = faceIcon.img13_1;}}
            if(img == faceIcon.img14){ if(iconColor == "white"){img = faceIcon.img14_1;}}
            if(img == faceIcon.img15){ if(iconColor == "white"){img = faceIcon.img15_1;}}
            if(img == faceIcon.img16){ if(iconColor == "white"){img = faceIcon.img16_1;}}
            if(img == faceIcon.img17){ if(iconColor == "white"){img = faceIcon.img17_1;}}
            if(img == faceIcon.img18){ if(iconColor == "white"){img = faceIcon.img18_1;}}
            if(img == faceIcon.img19){ if(iconColor == "white"){img = faceIcon.img19_1;}}
            if(img == faceIcon.img20){ if(iconColor == "white"){img = faceIcon.img20_1;}}
            if(img == faceIcon.img21){ if(iconColor == "white"){img = faceIcon.img21_1;}}
            if(img == faceIcon.img22){ if(iconColor == "white"){img = faceIcon.img22_1;}}
            if(img == faceIcon.img23){ if(iconColor == "white"){img = faceIcon.img23_1;}}
            if(img == faceIcon.img24){ if(iconColor == "white"){img = faceIcon.img24_1;}}
            if(img == faceIcon.img25){ if(iconColor == "white"){img = faceIcon.img25_1;}}
            if(img == faceIcon.img26){ if(iconColor == "white"){img = faceIcon.img26_1;}}
            if(img == faceIcon.img27){ if(iconColor == "white"){img = faceIcon.img27_1;}}
            if(img == faceIcon.img28){ if(iconColor == "white"){img = faceIcon.img28_1;}}
            if(img == faceIcon.img29){ if(iconColor == "white"){img = faceIcon.img29_1;}}
    
            let data = {
                id: konvaNum + 1,
                icon: img,
                color: iconColor,
                // stroke: iconStroke,
                stroke: true,
                size : 50,
                type: "icon"
            }
            setKonvaNum(konvaNum+1);
            setKonvaArr([...konvaArr, data]);
        } else {
            setSelectIcon(image);
            let img = image;
            if(img == faceIcon.img1){ if(iconColor == "white"){img = faceIcon.img1_1;}}
            if(img == faceIcon.img2){ if(iconColor == "white"){img = faceIcon.img2_1;}}
            if(img == faceIcon.img3){ if(iconColor == "white"){img = faceIcon.img3_1;}}
            if(img == faceIcon.img4){ if(iconColor == "white"){img = faceIcon.img4_1;}}
            if(img == faceIcon.img5){ if(iconColor == "white"){img = faceIcon.img5_1;}}
            if(img == faceIcon.img6){ if(iconColor == "white"){img = faceIcon.img6_1;}}
            if(img == faceIcon.img7){ if(iconColor == "white"){img = faceIcon.img7_1;}}
            if(img == faceIcon.img8){ if(iconColor == "white"){img = faceIcon.img8_1;}}
            if(img == faceIcon.img9){ if(iconColor == "white"){img = faceIcon.img9_1;}}
            if(img == faceIcon.img10){ if(iconColor == "white"){img = faceIcon.img10_1;}}
            if(img == faceIcon.img11){ if(iconColor == "white"){img = faceIcon.img11_1;}}
            if(img == faceIcon.img12){ if(iconColor == "white"){img = faceIcon.img12_1;}}
            if(img == faceIcon.img13){ if(iconColor == "white"){img = faceIcon.img13_1;}}
            if(img == faceIcon.img14){ if(iconColor == "white"){img = faceIcon.img14_1;}}
            if(img == faceIcon.img15){ if(iconColor == "white"){img = faceIcon.img15_1;}}
            if(img == faceIcon.img16){ if(iconColor == "white"){img = faceIcon.img16_1;}}
            if(img == faceIcon.img17){ if(iconColor == "white"){img = faceIcon.img17_1;}}
            if(img == faceIcon.img18){ if(iconColor == "white"){img = faceIcon.img18_1;}}
            if(img == faceIcon.img19){ if(iconColor == "white"){img = faceIcon.img19_1;}}
            if(img == faceIcon.img20){ if(iconColor == "white"){img = faceIcon.img20_1;}}
            if(img == faceIcon.img21){ if(iconColor == "white"){img = faceIcon.img21_1;}}
            if(img == faceIcon.img22){ if(iconColor == "white"){img = faceIcon.img22_1;}}
            if(img == faceIcon.img23){ if(iconColor == "white"){img = faceIcon.img23_1;}}
            if(img == faceIcon.img24){ if(iconColor == "white"){img = faceIcon.img24_1;}}
            if(img == faceIcon.img25){ if(iconColor == "white"){img = faceIcon.img25_1;}}
            if(img == faceIcon.img26){ if(iconColor == "white"){img = faceIcon.img26_1;}}
            if(img == faceIcon.img27){ if(iconColor == "white"){img = faceIcon.img27_1;}}
            if(img == faceIcon.img28){ if(iconColor == "white"){img = faceIcon.img28_1;}}
            if(img == faceIcon.img29){ if(iconColor == "white"){img = faceIcon.img29_1;}}

            let newKonva = konvaArr.map((item) => item.id == konvaNum ? {...item, icon: img} : item);
    
            setKonvaArr(newKonva);
        }
    }

    // 그리기 도구 취소 버튼
    const cancelDraw = () => {
        setSelectIcon(null);
        setIconColor("black");
        setIconStroke(false);
        setDrawingMode(false);
        setModeName("");
        setDrawSwtch(false);
        setSelectMenu(null);
    }
    // 그리기 도구 적용 버튼
    const submitDraw = () => {
        if(selectIcon != null){
            let img = selectIcon;
            if(selectIcon == faceIcon.img1){ if(iconColor == "white"){img = faceIcon.img1_1;}}
            if(selectIcon == faceIcon.img2){ if(iconColor == "white"){img = faceIcon.img2_1;}}
            if(selectIcon == faceIcon.img3){ if(iconColor == "white"){img = faceIcon.img3_1;}}
            if(selectIcon == faceIcon.img4){ if(iconColor == "white"){img = faceIcon.img4_1;}}
            if(selectIcon == faceIcon.img5){ if(iconColor == "white"){img = faceIcon.img5_1;}}
            if(selectIcon == faceIcon.img6){ if(iconColor == "white"){img = faceIcon.img6_1;}}
            if(selectIcon == faceIcon.img7){ if(iconColor == "white"){img = faceIcon.img7_1;}}
            if(selectIcon == faceIcon.img8){ if(iconColor == "white"){img = faceIcon.img8_1;}}
            if(selectIcon == faceIcon.img9){ if(iconColor == "white"){img = faceIcon.img9_1;}}
            if(selectIcon == faceIcon.img10){ if(iconColor == "white"){img = faceIcon.img10_1;}}
            if(selectIcon == faceIcon.img11){ if(iconColor == "white"){img = faceIcon.img11_1;}}
            if(selectIcon == faceIcon.img12){ if(iconColor == "white"){img = faceIcon.img12_1;}}
            if(selectIcon == faceIcon.img13){ if(iconColor == "white"){img = faceIcon.img13_1;}}
            if(selectIcon == faceIcon.img14){ if(iconColor == "white"){img = faceIcon.img14_1;}}
            if(selectIcon == faceIcon.img15){ if(iconColor == "white"){img = faceIcon.img15_1;}}
            if(selectIcon == faceIcon.img16){ if(iconColor == "white"){img = faceIcon.img16_1;}}
            if(selectIcon == faceIcon.img17){ if(iconColor == "white"){img = faceIcon.img17_1;}}
            if(selectIcon == faceIcon.img18){ if(iconColor == "white"){img = faceIcon.img18_1;}}
            if(selectIcon == faceIcon.img19){ if(iconColor == "white"){img = faceIcon.img19_1;}}
            if(selectIcon == faceIcon.img20){ if(iconColor == "white"){img = faceIcon.img20_1;}}
            if(selectIcon == faceIcon.img21){ if(iconColor == "white"){img = faceIcon.img21_1;}}
            if(selectIcon == faceIcon.img22){ if(iconColor == "white"){img = faceIcon.img22_1;}}
            if(selectIcon == faceIcon.img23){ if(iconColor == "white"){img = faceIcon.img23_1;}}
            if(selectIcon == faceIcon.img24){ if(iconColor == "white"){img = faceIcon.img24_1;}}
            if(selectIcon == faceIcon.img25){ if(iconColor == "white"){img = faceIcon.img25_1;}}
            if(selectIcon == faceIcon.img26){ if(iconColor == "white"){img = faceIcon.img26_1;}}
            if(selectIcon == faceIcon.img27){ if(iconColor == "white"){img = faceIcon.img27_1;}}
            if(selectIcon == faceIcon.img28){ if(iconColor == "white"){img = faceIcon.img28_1;}}
            if(selectIcon == faceIcon.img29){ if(iconColor == "white"){img = faceIcon.img29_1;}}

            let data = {
                id: konvaNum + 1,
                icon: img,
                color: iconColor,
                // stroke: iconStroke,
                stroke: true,
                size : 50,
                type: "icon"
            }
            setKonvaNum(konvaNum+1);
            setKonvaArr([...konvaArr, data]);
            setSelectIcon(null);
            setIconColor("black");
            setIconStroke(false);
            setSelectMenu(null);
            setDrawingMode(false);
            setModeName("");
            setDrawSwtch(false);
        } else {
            setSelectIcon(null);
            setIconColor("black");
            setIconStroke(false);
            setSelectMenu(null);
            setDrawingMode(false);
            setModeName("");
            setDrawSwtch(false);
        }
    }
    // 아이콘 or 글자 삭제
    const delKonvaArr = (id) => {
        let refArr = konvaArr.filter((item) => item.id !== id);
        setKonvaArr(refArr);
        if(refArr.length == 0){
            setKonvaNum(0)
        }
    }

    // 글자 도구 취소 버튼
    const cancelText = () => {
        setSelectMenu(null);
        setFontFamily("Jua");
        setFontsize(35);
        setFontData("");
        setFontcolor("black");
        setFontstroke(false);
        setFontsys("horizon");
        setFontCurve(false);
        setFontOption(1);    
    }
    // 글자 도구 적용 버튼
    const submitText = () => {
        let data = {
            id: konvaNum + 1,
            family: fontFamily,
            size: fontsize,
            contents: fontData,
            color: fontcolor,
            stroke: fontstroke,
            fontsys: fontsys,
            curve: fontCurve,
            option: fontOption,
            type: "text"
        }
        if(data.curve == true){
            setTextArr([...textArr, data]);
        } else if(data.curve == false){
            setKonvaArr([...konvaArr, data]);
        }
        setKonvaNum(konvaNum+1);
        setFontFamily("Jua");
        setFontsize(35);
        setFontData("");
        setFontstroke(false);
        setFontsys("horizon");
        setFontCurve(false);
        setFontOption(1); 
        setSelectMenu(null);
    }

    useEffect(() => {
        setFontcolor("black");
    }, [textArr, konvaArr])

    const chgLight = (type) => {
        if(type == "+"){
            let data = lightValue + 1;
            if(data > 15){
                data = 15
            }
            setTestLight(data);
        } else if(type == "-"){
            let data = lightValue - 1;
            if(data < 5){
                data = 5
            }
            setTestLight(data);
        }
    }

    const chgContrast = (type) => {
        if(type == "+"){
            let data = contrastValue + 1;
            if(data > 15){
                data = 15
            }
            setTestCon(data);
        } else if(type == "-"){
            let data = contrastValue - 1;
            if(data < 5){
                data = 5
            }
            setTestCon(data);
        }
    }

    const uptValue = (result) => {
        if(result[0] == "light"){
            setTestLight(result[1]);
        } else if(result[0] == "contrast") {
            setTestCon(result[1]);
        } else {
            let data = result[1];
            if(data < 1){
                data = 1;
            } else if(data > 10){
                data = 10;
            }
            setLineWeight(parseInt(data));
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
        setSelectMenu(null);
        // setImgModify(true);
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


    const handleImgClick = (e) => {
        if(selectedImage != null){
            setDrawSwtch(false);
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
    
                if(imgRatio > 1){
                    let lengths = settingSize / imgRatio;
                    let pos = (settingSize-lengths)/2;
                    setImgWidth(settingSize);
                    setImgHeight(lengths);
                    setPosition({x: 0, y: pos})
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

    const clickBool = (e) => {
        if(!textChg){
            e.stopPropagation();
        }
    }

    const settingMenu = (data) => {
        if(data == "shape"){
            setSelectMenu("shape");
            setShapeSwtch(false);
        } else {
            setTestShape(selectShape);
        }
        if(data == "image"){
            if(selectedImage == null){
                Swal.fire({
                    title: "알림",
                    text: "도장에 사용할 이미지를 업로드 해 주세요.",
                    icon: "error",
                    confirmButtonText: "확인",
                    }).then((res) => {
                        if (res.isConfirmed) {
                        }
                    });
            } else {
                setImgSwtch(true);
                setSelectMenu("image");
            }
        } else {
            setTestCon(contrastValue);
            setTestLight(lightValue);
            setTestHz(hzReverse);
            setTestVt(vtReverse);
        }
        if(data == "drawing"){
            setSelectMenu("drawing");
        } else {
            setDrawingMode(false);
            setModeName("");
            setDrawSwtch(false);
        }
        if(data == "text"){
            setSelectMenu("text");
        } else {
            setFontFamily("Jua");
            setFontsize(35);
            setFontData("");
            setFontcolor("black");
            setFontstroke(false);
            setFontsys("horizon");
            setFontCurve(false);
            setFontOption(1);
        }
    }

    const [drawSwtch, setDrawSwtch] = useState(false); // 그림모드 스위치
    const canvRef = useRef(null);
    const [ctxs, setCtxs] = useState();
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        // if(drawingMode != null){
        // }
        setDrawSwtch(drawingMode)
    }, [drawingMode])
  
    useEffect(() => {
        // const canvas = canvRef.current;
        // const context = canvas.getContext('2d');

        // context.strokeStyle = lineColor
        // context.lineWidth = lineWeight;
        // context.eraseWidth = 30;
        // setCtxs(context);
    }, [lineColor, lineWeight]);

    const startDraw = () => {
        setIsDrawing(true)
    }
    const finishDraw = () => {
        setIsDrawing(false)
    }
    const moveDraw = ({nativeEvent}) => {
        const {offsetX, offsetY} = nativeEvent;
        if(drawSwtch){
            if(modeName == "draw"){
                if(ctxs){
                    if(!isDrawing){
                        ctxs.beginPath();
                        ctxs.moveTo(offsetX, offsetY);
                    } else {
                        ctxs.lineTo(offsetX, offsetY);
                        ctxs.stroke();
                    }
                }
            } else if(modeName == "erase") {
                if(ctxs){
                    if(isDrawing){
                        ctxs.beginPath();
                        ctxs.moveTo(offsetX, offsetY);
                        ctxs.clearRect(offsetX-ctxs.eraseWidth/2, offsetY-ctxs.eraseWidth/2, ctxs.eraseWidth, ctxs.eraseWidth);
                    }
                }
            }
        }
    }

    const [linesToDelete, setLinesToDelete] = useState(0);

    const zeroCanv = () => {
        setLinesToDelete((prevValue) => prevValue + 1); // 선 하나씩 삭제를 요청
    }


    const chgDrawMode = (data) => {
        if(data == "draw"){
            setDrawingMode(true);
            setModeName("draw");
        } else if(data == "erase"){
            setDrawingMode(true);
            setModeName("erase");
        } else if(data == "off"){
            setDrawingMode(false);
            setModeName("");
        }
    }


    const fontChange = (e, type) => {
        if(type == "family"){
            setFontFamily(e.target.value);
        } else if(type == "size"){
            let data = e.target.value;
            if (/^[0-9]*$/.test(data)) {
                if(data != ""){
                    let parseData = parseInt(data);
                    if(parseData > 50 || parseData < 1){
                        parseData = fontsize;
                    }
                    setFontsize(parseData);
                } else {
                    setFontsize(0);
                }
            }
        } else if(type == "data"){
            setFontData(e.target.value);
        }
    }

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
            <div style={{minWidth: "700px", minHeight: "700px", padding:"125px"}}>
                <div className={style.stamp_canvas} ref={compRef} style={{width:`${settingSize}px`, height: `${settingSize}px`, padding:`${mgSize}px`}}>
                    {selectMenu && selectMenu == "text" &&
                        <CustomText onClick={(e) => clickBool(e)} family={fontFamily} fontsize={fontsize} fontdata={fontData} fontcolor={fontcolor} fontstroke={fontstroke} fontsys={fontsys} curveBool={fontCurve} curveOption={fontOption}    />
                    }
                    {textArr.length > 0 &&
                        textArr.map((item) => {
                            let colors = "black";
                            let strokes = "white";
                            if(item.color == "black"){
                                strokes = "white";
                            } else if(item.color == "white") {
                                colors = "white";
                                strokes = "black";
                            }
                            return(
                                <div className={style.stamp_text}
                                    style={item.stroke ?
                                        {pointerEvents: "none", color: `${colors}`, fontSize: `${item.size}px`, fontFamily: `${item.family}`,
                                        textShadow: `-3px -3px 3px ${strokes}, 3px -3px 3px ${strokes}, -3px 3px 3px ${strokes}, 3px 3px 3px ${strokes}`,}
                                        :
                                        {pointerEvents: "none", color: `${colors}`, fontSize: `${item.size}px`, fontFamily: `${item.family}`, }
                                    }
                                >
                                    <CustomTextArr data={item} />
                                </div>
                            )
                        })
                    }
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
                                {selectedImage &&
                                    <ImageManage imaged={selectedImage} sw={imgWidth} sh={imgHeight} pos={position}
                                        objValue={selectObj} uptObj={uptObj} bgChg={imgClick} uptBg={uptBg} former={imgModify}
                                        convert={cvtData} pixelate={imgPixelate} draw={drawingMode} clip={imgModify ? 100 : clipNum} type={"custom"}
                                        vertical={imgSwtch ? testVt : vtReverse} horizon={imgSwtch ? testHz : hzReverse}
                                    />
                                }
                            </div>
                        :
                            <div style={clipNum > 100 ? {position:"relative", clipPath: `circle(43% at 50% 43%)`} : {position:"relative", clipPath: `circle(${clipNum}%)`}}>
                                <DotTest2 img={convtImg} startPrint={printBool}/>
                            </div>
                        }
                    </div>
                    <div className={style.stamp_div} style={imgModify ? {filter:"contrast(0.1)", width:`${settingSize}px`, height:`${settingSize}px`, marginTop:`${mgSize}px`} : { width:`${settingSize}px`, height:`${settingSize}px`, marginTop:`${mgSize}px`}}  ref={photoRef}>
                        {testShape ?
                            <img src={testShape} />
                            :
                            (selectShape &&
                                <img src={selectShape} />
                            )
                        }
                    </div>
                    {/* {konvaArr.length > 0 &&
                        <div style={convtSwtch == false ? (imgModify ? {position: "absolute", top: "0", pointerEvents:"none", filter: "contrast(0.1)"} : (cvtData != null ? {position: "absolute", top: "0", pointerEvents:"none"} : {position: "absolute", top: "0"})) : {position: "absolute", top: "0", pointerEvents: "none"}}>
                            <DataKonva dataArr={konvaArr} convert={cvtData} delArr={delKonvaArr}/>
                        </div>
                    } */}
                    <div style={drawSwtch ? (imgModify ? {position: "absolute", top:"0", pointerEvents:"none", zIndex:"999", filter: "contrast(0.1)"}  : {position: "absolute", top:"0", pointerEvents:"auto", zIndex:"999"}) : {position: "absolute", top:"0", pointerEvents:"none", zIndex:"999"}}>
                        <DrawKonva mode={modeName} bool={drawingMode} color={lineColor} linesDelete={linesToDelete} lineWeight={lineWeight} />
                    </div>
                    <div className={style.chg_dom} style={{pointerEvents:"none"}}>
                    <TestTemaKonva arrData={testData} showSize={settingSize} />
                </div>
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
                    </div>
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

export default PraiseCanvas;