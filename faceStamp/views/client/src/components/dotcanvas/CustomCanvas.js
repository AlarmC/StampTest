import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BiArrowBack } from 'react-icons/bi';
import { IoIosHome } from 'react-icons/io';
import domtoimage from 'dom-to-image-more';
import { Scrollbars } from 'react-custom-scrollbars'
import DotTest2 from './DotTest3';
import ImageManage from './ImageManage';
import CustomText from './CustomText';
import CustomTextArr from './CustomTextArr';
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
import ReactToPrint from "react-to-print";
import brush from "./../../assets/images/brush.png";
import eraser from "./../../assets/images/eraser.png";

const CustomCanvas = ({user, dotinfo}) => {

    // const { user, dotinfo } = useSelector(({ user, dotinfo }) => ({
    //     user: user.user,
    //     dotinfo: dotinfo.dotinfo,
    // }));
    console.log("123123");

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

    const [tempImg, setTempImg] = useState([]);

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

    const [cancData, setCancData] = useState(null);

    // 임시 선택 아이콘 
    const tempSelectImg = (image) => {
        setSelectIcon(image);
        // if(selectIcon == null){
        //     let img = image;
        //     if(img == faceIcon.img1){ if(iconColor == "white"){img = faceIcon.img1_1;}}
        //     if(img == faceIcon.img2){ if(iconColor == "white"){img = faceIcon.img2_1;}}
        //     if(img == faceIcon.img3){ if(iconColor == "white"){img = faceIcon.img3_1;}}
        //     if(img == faceIcon.img4){ if(iconColor == "white"){img = faceIcon.img4_1;}}
        //     if(img == faceIcon.img5){ if(iconColor == "white"){img = faceIcon.img5_1;}}
        //     if(img == faceIcon.img6){ if(iconColor == "white"){img = faceIcon.img6_1;}}
        //     if(img == faceIcon.img7){ if(iconColor == "white"){img = faceIcon.img7_1;}}
        //     if(img == faceIcon.img8){ if(iconColor == "white"){img = faceIcon.img8_1;}}
        //     if(img == faceIcon.img9){ if(iconColor == "white"){img = faceIcon.img9_1;}}
        //     if(img == faceIcon.img10){ if(iconColor == "white"){img = faceIcon.img10_1;}}
        //     if(img == faceIcon.img11){ if(iconColor == "white"){img = faceIcon.img11_1;}}
        //     if(img == faceIcon.img12){ if(iconColor == "white"){img = faceIcon.img12_1;}}
        //     if(img == faceIcon.img13){ if(iconColor == "white"){img = faceIcon.img13_1;}}
        //     if(img == faceIcon.img14){ if(iconColor == "white"){img = faceIcon.img14_1;}}
        //     if(img == faceIcon.img15){ if(iconColor == "white"){img = faceIcon.img15_1;}}
        //     if(img == faceIcon.img16){ if(iconColor == "white"){img = faceIcon.img16_1;}}
        //     if(img == faceIcon.img17){ if(iconColor == "white"){img = faceIcon.img17_1;}}
        //     if(img == faceIcon.img18){ if(iconColor == "white"){img = faceIcon.img18_1;}}
        //     if(img == faceIcon.img19){ if(iconColor == "white"){img = faceIcon.img19_1;}}
        //     if(img == faceIcon.img20){ if(iconColor == "white"){img = faceIcon.img20_1;}}
        //     if(img == faceIcon.img21){ if(iconColor == "white"){img = faceIcon.img21_1;}}
        //     if(img == faceIcon.img22){ if(iconColor == "white"){img = faceIcon.img22_1;}}
        //     if(img == faceIcon.img23){ if(iconColor == "white"){img = faceIcon.img23_1;}}
        //     if(img == faceIcon.img24){ if(iconColor == "white"){img = faceIcon.img24_1;}}
        //     if(img == faceIcon.img25){ if(iconColor == "white"){img = faceIcon.img25_1;}}
        //     if(img == faceIcon.img26){ if(iconColor == "white"){img = faceIcon.img26_1;}}
        //     if(img == faceIcon.img27){ if(iconColor == "white"){img = faceIcon.img27_1;}}
        //     if(img == faceIcon.img28){ if(iconColor == "white"){img = faceIcon.img28_1;}}
        //     if(img == faceIcon.img29){ if(iconColor == "white"){img = faceIcon.img29_1;}}
    
        //     let data = {
        //         id: konvaNum + 1,
        //         icon: img,
        //         color: iconColor,
        //         // stroke: iconStroke,
        //         stroke: true,
        //         size : 50,
        //         type: "icon"
        //     }
        //     setKonvaNum(konvaNum+1);
        //     setKonvaArr([...konvaArr, data]);
        // } else {
        //     setSelectIcon(image);
        //     let img = image;
        //     if(img == faceIcon.img1){ if(iconColor == "white"){img = faceIcon.img1_1;}}
        //     if(img == faceIcon.img2){ if(iconColor == "white"){img = faceIcon.img2_1;}}
        //     if(img == faceIcon.img3){ if(iconColor == "white"){img = faceIcon.img3_1;}}
        //     if(img == faceIcon.img4){ if(iconColor == "white"){img = faceIcon.img4_1;}}
        //     if(img == faceIcon.img5){ if(iconColor == "white"){img = faceIcon.img5_1;}}
        //     if(img == faceIcon.img6){ if(iconColor == "white"){img = faceIcon.img6_1;}}
        //     if(img == faceIcon.img7){ if(iconColor == "white"){img = faceIcon.img7_1;}}
        //     if(img == faceIcon.img8){ if(iconColor == "white"){img = faceIcon.img8_1;}}
        //     if(img == faceIcon.img9){ if(iconColor == "white"){img = faceIcon.img9_1;}}
        //     if(img == faceIcon.img10){ if(iconColor == "white"){img = faceIcon.img10_1;}}
        //     if(img == faceIcon.img11){ if(iconColor == "white"){img = faceIcon.img11_1;}}
        //     if(img == faceIcon.img12){ if(iconColor == "white"){img = faceIcon.img12_1;}}
        //     if(img == faceIcon.img13){ if(iconColor == "white"){img = faceIcon.img13_1;}}
        //     if(img == faceIcon.img14){ if(iconColor == "white"){img = faceIcon.img14_1;}}
        //     if(img == faceIcon.img15){ if(iconColor == "white"){img = faceIcon.img15_1;}}
        //     if(img == faceIcon.img16){ if(iconColor == "white"){img = faceIcon.img16_1;}}
        //     if(img == faceIcon.img17){ if(iconColor == "white"){img = faceIcon.img17_1;}}
        //     if(img == faceIcon.img18){ if(iconColor == "white"){img = faceIcon.img18_1;}}
        //     if(img == faceIcon.img19){ if(iconColor == "white"){img = faceIcon.img19_1;}}
        //     if(img == faceIcon.img20){ if(iconColor == "white"){img = faceIcon.img20_1;}}
        //     if(img == faceIcon.img21){ if(iconColor == "white"){img = faceIcon.img21_1;}}
        //     if(img == faceIcon.img22){ if(iconColor == "white"){img = faceIcon.img22_1;}}
        //     if(img == faceIcon.img23){ if(iconColor == "white"){img = faceIcon.img23_1;}}
        //     if(img == faceIcon.img24){ if(iconColor == "white"){img = faceIcon.img24_1;}}
        //     if(img == faceIcon.img25){ if(iconColor == "white"){img = faceIcon.img25_1;}}
        //     if(img == faceIcon.img26){ if(iconColor == "white"){img = faceIcon.img26_1;}}
        //     if(img == faceIcon.img27){ if(iconColor == "white"){img = faceIcon.img27_1;}}
        //     if(img == faceIcon.img28){ if(iconColor == "white"){img = faceIcon.img28_1;}}
        //     if(img == faceIcon.img29){ if(iconColor == "white"){img = faceIcon.img29_1;}}

        //     let newKonva = konvaArr.map((item) => item.id == konvaNum ? {...item, icon: img} : item);
    
        //     setKonvaArr(newKonva);
        // }
    }

    useEffect(() => {
        if(selectIcon != null){
            let img = selectIcon
            if(img == faceIcon.img1){
                if(iconColor == "black" && iconStroke == false){
                    img = faceIcon.img1;
                } else if(iconColor == "black" && iconStroke){
                    img = faceIcon.img1_2;
                } else if(iconColor == "white" && iconStroke == false){
                    img = faceIcon.img1_1;
                } else {
                    img = faceIcon.img1_3;
                }
            } else if(img == faceIcon.img2){
                if(iconColor == "black" && iconStroke == false){
                    img = faceIcon.img2;
                } else if(iconColor == "black" && iconStroke){
                    img = faceIcon.img2_2;
                } else if(iconColor == "white" && iconStroke == false){
                    img = faceIcon.img2_1;
                } else {
                    img = faceIcon.img2_3;
                }
            } else if(img == faceIcon.img3){
                if(iconColor == "black" && iconStroke == false){
                    img = faceIcon.img3;
                } else if(iconColor == "black" && iconStroke){
                    img = faceIcon.img3_2;
                } else if(iconColor == "white" && iconStroke == false){
                    img = faceIcon.img3_1;
                } else {
                    img = faceIcon.img3_3;
                }
            } else if(img == faceIcon.img4){
                if(iconColor == "black" && iconStroke == false){
                    img = faceIcon.img4;
                } else if(iconColor == "black" && iconStroke){
                    img = faceIcon.img4_2;
                } else if(iconColor == "white" && iconStroke == false){
                    img = faceIcon.img4_1;
                } else {
                    img = faceIcon.img4_3;
                }
            } else if(img == faceIcon.img5){
                if(iconColor == "black" && iconStroke == false){
                    img = faceIcon.img5;
                } else if(iconColor == "black" && iconStroke){
                    img = faceIcon.img5_2;
                } else if(iconColor == "white" && iconStroke == false){
                    img = faceIcon.img5_1;
                } else {
                    img = faceIcon.img5_3;
                }
            } else if(img == faceIcon.img6){
                if(iconColor == "black" && iconStroke == false){
                    img = faceIcon.img6;
                } else if(iconColor == "black" && iconStroke){
                    img = faceIcon.img6_2;
                } else if(iconColor == "white" && iconStroke == false){
                    img = faceIcon.img6_1;
                } else {
                    img = faceIcon.img6_3;
                }
            } else if(img == faceIcon.img7){
                if(iconColor == "black" && iconStroke == false){
                    img = faceIcon.img7;
                } else if(iconColor == "black" && iconStroke){
                    img = faceIcon.img7_2;
                } else if(iconColor == "white" && iconStroke == false){
                    img = faceIcon.img7_1;
                } else {
                    img = faceIcon.img7_3;
                }
            } else if(img == faceIcon.img8){
                if(iconColor == "black" && iconStroke == false){
                    img = faceIcon.img8;
                } else if(iconColor == "black" && iconStroke){
                    img = faceIcon.img8_2;
                } else if(iconColor == "white" && iconStroke == false){
                    img = faceIcon.img8_1;
                } else {
                    img = faceIcon.img8_3;
                }
            } else if(img == faceIcon.img9){
                if(iconColor == "black" && iconStroke == false){
                    img = faceIcon.img9;
                } else if(iconColor == "black" && iconStroke){
                    img = faceIcon.img9_2;
                } else if(iconColor == "white" && iconStroke == false){
                    img = faceIcon.img9_1;
                } else {
                    img = faceIcon.img9_3;
                }
            } else if(img == faceIcon.img10){
                if(iconColor == "black" && iconStroke == false){
                    img = faceIcon.img10;
                } else if(iconColor == "black" && iconStroke){
                    img = faceIcon.img10_2;
                } else if(iconColor == "white" && iconStroke == false){
                    img = faceIcon.img10_1;
                } else {
                    img = faceIcon.img10_3;
                }
            } else if(img == faceIcon.img11){
                if(iconColor == "black" && iconStroke == false){
                    img = faceIcon.img11;
                } else if(iconColor == "black" && iconStroke){
                    img = faceIcon.img11_2;
                } else if(iconColor == "white" && iconStroke == false){
                    img = faceIcon.img11_1;
                } else {
                    img = faceIcon.img11_3;
                }
            } else if(img == faceIcon.img12){
                if(iconColor == "black" && iconStroke == false){
                    img = faceIcon.img12;
                } else if(iconColor == "black" && iconStroke){
                    img = faceIcon.img12_2;
                } else if(iconColor == "white" && iconStroke == false){
                    img = faceIcon.img12_1;
                } else {
                    img = faceIcon.img12_3;
                }
            } else if(img == faceIcon.img13){
                if(iconColor == "black" && iconStroke == false){
                    img = faceIcon.img13;
                } else if(iconColor == "black" && iconStroke){
                    img = faceIcon.img13_2;
                } else if(iconColor == "white" && iconStroke == false){
                    img = faceIcon.img13_1;
                } else {
                    img = faceIcon.img13_3;
                }
            } else if(img == faceIcon.img14){
                if(iconColor == "black" && iconStroke == false){
                    img = faceIcon.img14;
                } else if(iconColor == "black" && iconStroke){
                    img = faceIcon.img14_2;
                } else if(iconColor == "white" && iconStroke == false){
                    img = faceIcon.img14_1;
                } else {
                    img = faceIcon.img14_3;
                }
            } else if(img == faceIcon.img15){
                if(iconColor == "black" && iconStroke == false){
                    img = faceIcon.img15;
                } else if(iconColor == "black" && iconStroke){
                    img = faceIcon.img15_2;
                } else if(iconColor == "white" && iconStroke == false){
                    img = faceIcon.img15_1;
                } else {
                    img = faceIcon.img15_3;
                }
            } else if(img == faceIcon.img16){
                if(iconColor == "black" && iconStroke == false){
                    img = faceIcon.img16;
                } else if(iconColor == "black" && iconStroke){
                    img = faceIcon.img16_2;
                } else if(iconColor == "white" && iconStroke == false){
                    img = faceIcon.img16_1;
                } else {
                    img = faceIcon.img16_3;
                }
            } else if(img == faceIcon.img17){
                if(iconColor == "black" && iconStroke == false){
                    img = faceIcon.img17;
                } else if(iconColor == "black" && iconStroke){
                    img = faceIcon.img17_2;
                } else if(iconColor == "white" && iconStroke == false){
                    img = faceIcon.img17_1;
                } else {
                    img = faceIcon.img17_3;
                }
            } else if(img == faceIcon.img18){
                if(iconColor == "black" && iconStroke == false){
                    img = faceIcon.img18;
                } else if(iconColor == "black" && iconStroke){
                    img = faceIcon.img18_2;
                } else if(iconColor == "white" && iconStroke == false){
                    img = faceIcon.img18_1;
                } else {
                    img = faceIcon.img18_3;
                }
            } else if(img == faceIcon.img19){
                if(iconColor == "black" && iconStroke == false){
                    img = faceIcon.img19;
                } else if(iconColor == "black" && iconStroke){
                    img = faceIcon.img19_2;
                } else if(iconColor == "white" && iconStroke == false){
                    img = faceIcon.img19_1;
                } else {
                    img = faceIcon.img19_3;
                }
            } else if(img == faceIcon.img20){
                if(iconColor == "black" && iconStroke == false){
                    img = faceIcon.img20;
                } else if(iconColor == "black" && iconStroke){
                    img = faceIcon.img20_2;
                } else if(iconColor == "white" && iconStroke == false){
                    img = faceIcon.img20_1;
                } else {
                    img = faceIcon.img20_3;
                }
            } else if(img == faceIcon.img21){
                if(iconColor == "black" && iconStroke == false){
                    img = faceIcon.img21;
                } else if(iconColor == "black" && iconStroke){
                    img = faceIcon.img21_2;
                } else if(iconColor == "white" && iconStroke == false){
                    img = faceIcon.img21_1;
                } else {
                    img = faceIcon.img21_3;
                }
            } else if(img == faceIcon.img22){
                if(iconColor == "black" && iconStroke == false){
                    img = faceIcon.img22;
                } else if(iconColor == "black" && iconStroke){
                    img = faceIcon.img22_2;
                } else if(iconColor == "white" && iconStroke == false){
                    img = faceIcon.img22_1;
                } else {
                    img = faceIcon.img22_3;
                }
            } else if(img == faceIcon.img23){
                if(iconColor == "black" && iconStroke == false){
                    img = faceIcon.img23;
                } else if(iconColor == "black" && iconStroke){
                    img = faceIcon.img23_2;
                } else if(iconColor == "white" && iconStroke == false){
                    img = faceIcon.img23_1;
                } else {
                    img = faceIcon.img23_3;
                }
            } else if(img == faceIcon.img24){
                if(iconColor == "black" && iconStroke == false){
                    img = faceIcon.img24;
                } else if(iconColor == "black" && iconStroke){
                    img = faceIcon.img4_2;
                } else if(iconColor == "white" && iconStroke == false){
                    img = faceIcon.img24_1;
                } else {
                    img = faceIcon.img24_3;
                }
            } else if(img == faceIcon.img25){
                if(iconColor == "black" && iconStroke == false){
                    img = faceIcon.img25;
                } else if(iconColor == "black" && iconStroke){
                    img = faceIcon.img25_2;
                } else if(iconColor == "white" && iconStroke == false){
                    img = faceIcon.img25_1;
                } else {
                    img = faceIcon.img25_3;
                }
            } else if(img == faceIcon.img26){
                if(iconColor == "black" && iconStroke == false){
                    img = faceIcon.img26;
                } else if(iconColor == "black" && iconStroke){
                    img = faceIcon.img26_2;
                } else if(iconColor == "white" && iconStroke == false){
                    img = faceIcon.img26_1;
                } else {
                    img = faceIcon.img26_3;
                }
            } else if(img == faceIcon.img27){
                if(iconColor == "black" && iconStroke == false){
                    img = faceIcon.img27;
                } else if(iconColor == "black" && iconStroke){
                    img = faceIcon.img27_2;
                } else if(iconColor == "white" && iconStroke == false){
                    img = faceIcon.img27_1;
                } else {
                    img = faceIcon.img27_3;
                }
            } else if(img == faceIcon.img28){
                if(iconColor == "black" && iconStroke == false){
                    img = faceIcon.img28;
                } else if(iconColor == "black" && iconStroke){
                    img = faceIcon.img28_2;
                } else if(iconColor == "white" && iconStroke == false){
                    img = faceIcon.img28_1;
                } else {
                    img = faceIcon.img28_3;
                }
            } else if(img == faceIcon.img29){
                if(iconColor == "black" && iconStroke == false){
                    img = faceIcon.img29;
                } else if(iconColor == "black" && iconStroke){
                    img = faceIcon.img29_2;
                } else if(iconColor == "white" && iconStroke == false){
                    img = faceIcon.img29_1;
                } else {
                    img = faceIcon.img29_3;
                }
            }

            let data = {
                id: konvaNum + 1,
                icon: img,
                size : 50,
                type: "icon"
            }

            setTempImg([data]);
        }
    }, [selectIcon, iconColor, iconStroke])

    // 그리기 도구 취소 버튼
    const cancelDraw = () => {
        setSelectIcon(null);
        setIconColor("black");
        setIconStroke(false);
        setDrawingMode(false);
        setModeName("");
        setDrawSwtch(false);
        setSelectMenu(null);
        let data = konvaArr[konvaArr.length -1].id;
        setCancData(data);

    }
    // 그리기 도구 적용 버튼
    const submitDraw = () => {
        // if(selectIcon != null){
        //     let img = selectIcon;
        //     if(selectIcon == faceIcon.img1){ if(iconColor == "white"){img = faceIcon.img1_1;}}
        //     if(selectIcon == faceIcon.img2){ if(iconColor == "white"){img = faceIcon.img2_1;}}
        //     if(selectIcon == faceIcon.img3){ if(iconColor == "white"){img = faceIcon.img3_1;}}
        //     if(selectIcon == faceIcon.img4){ if(iconColor == "white"){img = faceIcon.img4_1;}}
        //     if(selectIcon == faceIcon.img5){ if(iconColor == "white"){img = faceIcon.img5_1;}}
        //     if(selectIcon == faceIcon.img6){ if(iconColor == "white"){img = faceIcon.img6_1;}}
        //     if(selectIcon == faceIcon.img7){ if(iconColor == "white"){img = faceIcon.img7_1;}}
        //     if(selectIcon == faceIcon.img8){ if(iconColor == "white"){img = faceIcon.img8_1;}}
        //     if(selectIcon == faceIcon.img9){ if(iconColor == "white"){img = faceIcon.img9_1;}}
        //     if(selectIcon == faceIcon.img10){ if(iconColor == "white"){img = faceIcon.img10_1;}}
        //     if(selectIcon == faceIcon.img11){ if(iconColor == "white"){img = faceIcon.img11_1;}}
        //     if(selectIcon == faceIcon.img12){ if(iconColor == "white"){img = faceIcon.img12_1;}}
        //     if(selectIcon == faceIcon.img13){ if(iconColor == "white"){img = faceIcon.img13_1;}}
        //     if(selectIcon == faceIcon.img14){ if(iconColor == "white"){img = faceIcon.img14_1;}}
        //     if(selectIcon == faceIcon.img15){ if(iconColor == "white"){img = faceIcon.img15_1;}}
        //     if(selectIcon == faceIcon.img16){ if(iconColor == "white"){img = faceIcon.img16_1;}}
        //     if(selectIcon == faceIcon.img17){ if(iconColor == "white"){img = faceIcon.img17_1;}}
        //     if(selectIcon == faceIcon.img18){ if(iconColor == "white"){img = faceIcon.img18_1;}}
        //     if(selectIcon == faceIcon.img19){ if(iconColor == "white"){img = faceIcon.img19_1;}}
        //     if(selectIcon == faceIcon.img20){ if(iconColor == "white"){img = faceIcon.img20_1;}}
        //     if(selectIcon == faceIcon.img21){ if(iconColor == "white"){img = faceIcon.img21_1;}}
        //     if(selectIcon == faceIcon.img22){ if(iconColor == "white"){img = faceIcon.img22_1;}}
        //     if(selectIcon == faceIcon.img23){ if(iconColor == "white"){img = faceIcon.img23_1;}}
        //     if(selectIcon == faceIcon.img24){ if(iconColor == "white"){img = faceIcon.img24_1;}}
        //     if(selectIcon == faceIcon.img25){ if(iconColor == "white"){img = faceIcon.img25_1;}}
        //     if(selectIcon == faceIcon.img26){ if(iconColor == "white"){img = faceIcon.img26_1;}}
        //     if(selectIcon == faceIcon.img27){ if(iconColor == "white"){img = faceIcon.img27_1;}}
        //     if(selectIcon == faceIcon.img28){ if(iconColor == "white"){img = faceIcon.img28_1;}}
        //     if(selectIcon == faceIcon.img29){ if(iconColor == "white"){img = faceIcon.img29_1;}}

        //     let data = {
        //         id: konvaNum + 1,
        //         icon: img,
        //         color: iconColor,
        //         // stroke: iconStroke,
        //         stroke: true,
        //         size : 50,
        //         type: "icon"
        //     }
        //     setKonvaNum(konvaNum+1);
        //     setKonvaArr([...konvaArr, data]);
        //     setSelectIcon(null);
        //     setIconColor("black");
        //     setIconStroke(false);
        //     setSelectMenu(null);
        //     setDrawingMode(false);
        //     setModeName("");
        //     setDrawSwtch(false);
        // } else {
            // setSelectIcon(null);
            // setIconColor("black");
            // setIconStroke(false);
            // setSelectMenu(null);
            // setDrawingMode(false);
            // setModeName("");
            // setDrawSwtch(false);
        // }
        setKonvaNum(konvaNum+1);
        setKonvaArr([...konvaArr, tempImg[0]]);
        setTempImg([]);
        setSelectIcon(null);
        setIconColor("black");
        setIconStroke(false);
        setSelectMenu(null);
        setDrawingMode(false);
        setModeName("");
        setDrawSwtch(false);
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
        if(fontCurve == true){
            setTextArr([...textArr, data]);
        } else if(fontCurve == false){
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
                setPosition({x: pos, y: 0})
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

    useEffect(() => { setDrawSwtch(drawingMode) }, [drawingMode])
  
    useEffect(() => { }, [lineColor, lineWeight]);


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
                {compImg && 
                    <div className='dot_print_area'>
                        <div className='dot_preview_dom' ref={printRef} style={
                            dotinfo.size == 45 ? {width:"190px", height:"190px"} : 
                            (dotinfo.size == 38 ? {width:"163px", height:"163px"} : 
                            (dotinfo.size == 26 ? {width:"118px", height:"118px"} :
                            (dotinfo.size == 23 ? {width:"107px", height:"107px"} :
                            (dotinfo.size == 18 ? {width:"88px", height:"88px"} :
                            {width:"80px", height:"80px"}))))}>
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
                }
                {selectMenu && selectMenu == "shape" &&
                    <>
                        <hr></hr>
                        <div className={style.dot_menu_title}>맞춤틀 선택</div>
                        <div className={style.dot_shape_div}>
                            <Scrollbars thumbsize={125}>
                                <img src={faceShape.img1} onClick={() => setTestShape(faceShape.img1)} />
                                <img src={faceShape.img2} onClick={() => setTestShape(faceShape.img2)} />
                                <img src={faceShape.img3} onClick={() => setTestShape(faceShape.img3)} />
                                <img src={faceShape.img4} onClick={() => setTestShape(faceShape.img4)} />
                                <img src={faceShape.img5} onClick={() => setTestShape(faceShape.img5)} />
                                <img src={faceShape.img6} onClick={() => setTestShape(faceShape.img6)} />
                                <img src={faceShape.img7} onClick={() => setTestShape(faceShape.img7)} />
                                <img src={faceShape.img8} onClick={() => setTestShape(faceShape.img8)} />
                                <img src={faceShape.img9} onClick={() => setTestShape(faceShape.img9)} />
                                <img src={faceShape.img10} onClick={() => setTestShape(faceShape.img10)} />
                                <img src={faceShape.img11} onClick={() => setTestShape(faceShape.img11)} />
                                <img src={faceShape.img12} onClick={() => setTestShape(faceShape.img12)} />
                                <img src={faceShape.img13} onClick={() => setTestShape(faceShape.img13)} />
                                <img src={faceShape.img14} onClick={() => setTestShape(faceShape.img14)} />
                                <img src={faceShape.img15} onClick={() => setTestShape(faceShape.img15)} />
                                <img src={faceShape.img16} onClick={() => setTestShape(faceShape.img16)} />
                                <img src={faceShape.img17} onClick={() => setTestShape(faceShape.img17)} />
                                <img src={faceShape.img18} onClick={() => setTestShape(faceShape.img18)} />
                                <img src={faceShape.img19} onClick={() => setTestShape(faceShape.img19)} />
                                <img src={faceShape.img20} onClick={() => setTestShape(faceShape.img20)} />
                                <img src={faceShape.img21} onClick={() => setTestShape(faceShape.img21)} />
                                <img src={faceShape.img22} onClick={() => setTestShape(faceShape.img22)} />
                            </Scrollbars>
                        </div>
                        <div className={style.dot_shape_btn_area}>
                            <button onClick={() => cancelShape()}>취 소</button>
                            <button onClick={() => submitShape()}>적 용</button>
                        </div>
                    </>
                }
                { selectMenu && selectMenu == "image" &&
                    <>
                        <hr></hr>
                        <div className={style.dot_menu_title}>밝기/대비 조정</div>
                        <div className='pg_line'>
                            <span>밝기</span>
                            <button onClick={()=>chgLight("-")}>-</button>
                                <ProgressBar value={testLight} min={5} max={15} setValue={uptValue} type={"light"} />
                            <button onClick={()=>chgLight("+")}>+</button>
                        </div>
                        <div className='pg_line' style={{marginBottom: "25px"}}>
                            <span>대비</span>
                            <button onClick={()=>chgContrast("-")}>-</button>
                                <ProgressBar value={testCon} min={5} max={15} setValue={uptValue} type={"contrast"} />
                            <button onClick={()=>chgContrast("+")}>+</button>
                        </div>
                        <hr></hr>
                        <div className={style.dot_menu_title}>이미지 영역 편집</div>
                        <div className={style.dot_edit_area}>
                            <div>
                                <div>이미지 조정</div>
                                <div className={style.dot_edit_toggle}>
                                    {imgModify ?
                                        <MdToggleOn color={"rgb(35,172,160)"} size={30} onClick={() => setImgModify(false)}/>
                                    :
                                        <MdToggleOff size={30} onClick={() => setImgModify(true)}/>
                                    }
                                </div>
                            </div>
                            <div>
                                상/하 반전
                                <div className={style.dot_image_toggle}>
                                    {testVt == 1 ?
                                        <MdToggleOff size={30} onClick={() => setTestVt(-1)}/>
                                    :
                                        <MdToggleOn size={30} color={"rgb(35,172,160)"} onClick={() => setTestVt(1)}/>
                                    }
                                </div>
                            </div>
                            <div>
                                좌/우 반전
                                <div className={style.dot_image_toggle}>
                                    {testHz == 1 ?
                                        <MdToggleOff size={30} onClick={() => setTestHz(-1)}/>
                                    :
                                        <MdToggleOn size={30} color={"rgb(35,172,160)"} onClick={() => setTestHz(1)}/>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className={style.dot_shape_btn_area}>
                            <button onClick={() => cancelImage()}>취 소</button>
                            <button onClick={() => submitImage()}>적 용</button>
                        </div>
                    </>
                }
                {selectMenu && selectMenu == "drawing" &&
                    <>
                        <hr></hr>
                        <div className={style.dot_menu_title}>그리기 도구</div>
                        <div className={style.dot_edit_area}>
                            <div>
                                <div>그림모드</div>
                                <div className={style.dot_edit_toggle}>
                                    {drawingMode && modeName == "draw" ?
                                        <MdToggleOn color={"rgb(35,172,160)"} size={30} onClick={() => chgDrawMode("off")}/>
                                    :
                                        <MdToggleOff size={30} onClick={() => chgDrawMode("draw")}/>
                                    }
                                </div>
                            </div>
                            <div>
                                <div>색상</div>
                                <div className='dot_color_btn'>
                                    <span>검은색</span>
                                    <div style={lineColor == "black" ? {border: "5px solid rgb(35,172,160)"} : {border : "1px solid rgb(35,172,160)"}} onClick={() => setLineColor("black")} />
                                    <span>흰색</span>
                                    <div style={lineColor == "white" ? {border: "5px solid rgb(35,172,160)"} : {border : "1px solid rgb(35,172,160)"}} onClick={() => setLineColor("white")} />
                                </div>
                            </div>
                            <div className={style.pg_bar}>
                                <span>선굵기</span>
                                <ProgressBar value={lineWeight} min={1} max={10} setValue={uptValue} type={"weight"} />
                            </div>
                            <div>
                                <div>지우기모드</div>
                                <div className={style.dot_edit_toggle}>
                                    {drawingMode && modeName == "erase" ?
                                        <MdToggleOn color={"rgb(35,172,160)"} size={30} onClick={() => chgDrawMode("off")}/>
                                    :
                                        <MdToggleOff size={30} onClick={() => chgDrawMode("erase")}/>
                                    }
                                </div>
                            </div>
                            <div>
                                <div>되돌리기</div>
                                <div className={style.dot_edit_button}>
                                    <div style={{width:"30px", height:"30px", borderRadius:"50%", border:"1px solid rgb(35,172,160)", background:"white"}}>
                                        <TbArrowBack size={24} color={"rgb(35,172,160)"} onClick={() => zeroCanv()}/>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div>배경색 변경</div>
                                <div className={style.dot_edit_button2} onClick={handleImgClick}>
                                    <div style={imgClick ? {background:"rgb(91, 91, 91)"} : {background:"white"}}>
                                        <LuPipette size={20} color={imgClick ? "white" : "rgb(91, 91, 91)"} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr></hr>
                        <div className={style.dot_menu_title}>아이콘 리스트</div>
                        <div className={style.dot_shape_div3}>
                            <Scrollbars thumbsize={125}>
                                <img src={faceIcon.img1} onClick={() => tempSelectImg(faceIcon.img1)} />
                                <img src={faceIcon.img2} onClick={() => tempSelectImg(faceIcon.img2)} />
                                <img src={faceIcon.img3} onClick={() => tempSelectImg(faceIcon.img3)} />
                                <img src={faceIcon.img4} onClick={() => tempSelectImg(faceIcon.img4)} />
                                <img src={faceIcon.img5} onClick={() => tempSelectImg(faceIcon.img5)} />
                                <img src={faceIcon.img6} onClick={() => tempSelectImg(faceIcon.img6)} />
                                <img src={faceIcon.img7} onClick={() => tempSelectImg(faceIcon.img7)} />
                                <img src={faceIcon.img8} onClick={() => tempSelectImg(faceIcon.img8)} />
                                <img src={faceIcon.img9} onClick={() => tempSelectImg(faceIcon.img9)} />
                                <img src={faceIcon.img10} onClick={() => tempSelectImg(faceIcon.img10)} />
                                <img src={faceIcon.img11} onClick={() => tempSelectImg(faceIcon.img11)} />
                                <img src={faceIcon.img12} onClick={() => tempSelectImg(faceIcon.img12)} />
                                <img src={faceIcon.img13} onClick={() => tempSelectImg(faceIcon.img13)} />
                                <img src={faceIcon.img14} onClick={() => tempSelectImg(faceIcon.img14)} />
                                <img src={faceIcon.img15} onClick={() => tempSelectImg(faceIcon.img15)} />
                                <img src={faceIcon.img16} onClick={() => tempSelectImg(faceIcon.img16)} />
                                <img src={faceIcon.img17} onClick={() => tempSelectImg(faceIcon.img17)} />
                                <img src={faceIcon.img18} onClick={() => tempSelectImg(faceIcon.img18)} />
                                <img src={faceIcon.img19} onClick={() => tempSelectImg(faceIcon.img19)} />
                                <img src={faceIcon.img20} onClick={() => tempSelectImg(faceIcon.img20)} />
                                <img src={faceIcon.img21} onClick={() => tempSelectImg(faceIcon.img21)} />
                                <img src={faceIcon.img22} onClick={() => tempSelectImg(faceIcon.img22)} />
                                <img src={faceIcon.img23} onClick={() => tempSelectImg(faceIcon.img23)} />
                                <img src={faceIcon.img24} onClick={() => tempSelectImg(faceIcon.img24)} />
                                <img src={faceIcon.img25} onClick={() => tempSelectImg(faceIcon.img25)} />
                                <img src={faceIcon.img26} onClick={() => tempSelectImg(faceIcon.img26)} />
                                <img src={faceIcon.img27} onClick={() => tempSelectImg(faceIcon.img27)} />
                                <img src={faceIcon.img28} onClick={() => tempSelectImg(faceIcon.img28)} />
                                <img src={faceIcon.img29} onClick={() => tempSelectImg(faceIcon.img29)} />
                            </Scrollbars>
                        </div>
                        <div className={style.dot_edit_area}>
                            <div>
                                <div>색상</div>
                                <div className='dot_color_btn'>
                                    <span>검은색</span>
                                    <div style={iconColor == "black" ? {border: "5px solid rgb(35,172,160)"} : {border : "1px solid rgb(35,172,160)"}} onClick={() => setIconColor("black")} />
                                    <span>흰색</span>
                                    <div style={iconColor == "white" ? {border: "5px solid rgb(35,172,160)"} : {border : "1px solid rgb(35,172,160)"}} onClick={() => setIconColor("white")} />
                                </div>
                            </div>
                            <div>
                                <div>윤곽선</div>
                                <div className={style.dot_edit_toggle}>
                                    {iconStroke ?
                                        <MdToggleOn color={"rgb(35,172,160)"} size={30} onClick={() => setIconStroke(false)}/>
                                    :
                                        <MdToggleOff size={30} onClick={() => setIconStroke(true)}/>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className={style.dot_shape_btn_area}>
                            <button onClick={() => cancelDraw()}>취 소</button>
                            <button onClick={() => submitDraw()}>적 용</button>
                        </div>
                    </>
                }
                {selectMenu && selectMenu == "text" &&
                    <>
                        <hr></hr>
                        <div className={style.dot_menu_title}>글자 정보</div>
                        <div className={style.dot_flex_div}>
                            <div>서체</div>
                            <select style={{fontFamily:"Jua"}} onChange={(e) => fontChange(e, "family")}>
                                <option value={"Jua"} style={{fontFamily:"Jua"}}>주아</option>
                                <option value={"Hanna"} style={{fontFamily:"Hanna"}}>한나는 열한살</option>
                                <option value={"Nanum Gothic"} style={{fontFamily:"Nanum Gothic"}}>나눔고딕</option>
                                <option value={"Nanum Square"} style={{fontFamily:"Nanum Square"}}>나눔스퀘어</option>
                                <option value={"Nanum Myeongjo"} style={{fontFamily:"Nanum Myeongjo"}}>나눔명조</option>
                                <option value={"Monsori"} style={{fontFamily:"Monsori"}}>몬소리</option>
                                <option value={"GodoMaum"} style={{fontFamily:"GodoMaum"}}>고도마음체</option>
                            </select>
                        </div>
                        <div className={style.dot_flex_div}>
                            <div>크기</div>
                            <input type="text" style={{width: "60px", textAlign: "center"}} value={fontsize} onChange={(e) => fontChange(e, "size")} />
                        </div>
                        <div className={style.dot_flex_div}>
                            <div>내용</div>
                            <input type="text" style={{width: "150px", paddingLeft: "10px"}} onChange={(e) => fontChange(e, "data")} />
                        </div>
                        <div className={style.dot_edit_area}>
                            <div>
                                <div>색상</div>
                                <div className='dot_color_btn'>
                                    <span>검은색</span>
                                    <div style={fontcolor == "black" ? {border: "5px solid rgb(35,172,160)"} : {border : "1px solid rgb(35,172,160)"}} onClick={() => setFontcolor("black")} />
                                    <span>흰색</span>
                                    <div style={fontcolor == "white" ? {border: "5px solid rgb(35,172,160)"} : {border : "1px solid rgb(35,172,160)"}} onClick={() => setFontcolor("white")} />
                                </div>
                            </div>
                            <div>
                                <div>윤곽선</div>
                                <div className={style.dot_edit_toggle}>
                                    {fontstroke ?
                                        <MdToggleOn color={"rgb(35,172,160)"} size={30} onClick={() => setFontstroke(false)}/>
                                    :
                                        <MdToggleOff size={30} onClick={() => setFontstroke(true)}/>
                                    }
                                </div>
                            </div>
                        </div>
                        <hr></hr>
                        <div className={style.dot_menu_title}>글자 모양</div>
                        <div className={style.dot_edit_area}>
                            <div className={style.dot_font_style}>
                                <span>가로쓰기</span>
                                <div style={fontsys == "horizon" ? {border: "5px solid rgb(35,172,160)"} : {border : "1px solid rgb(35,172,160)"}} onClick={() => setFontsys("horizon")} />
                                <span>세로쓰기</span>
                                <div style={fontsys == "vertical" ? {border: "5px solid rgb(35,172,160)"} : {border : "1px solid rgb(35,172,160)"}} onClick={() => setFontsys("vertical")} />
                            </div>
                            <div>
                                <div>곡선쓰기</div>
                                <div className={style.dot_edit_toggle}>
                                    {fontCurve ?
                                        <MdToggleOn color={"rgb(35,172,160)"} size={30} onClick={() => setFontCurve(false)}/>
                                    :
                                        <MdToggleOff size={30} onClick={() => setFontCurve(true)}/>
                                    }
                                </div>
                            </div>
                            {fontCurve && 
                                <div className={style.dot_font_style}>
                                    {fontsys == "horizon" ?
                                        <span>위</span> : <span>왼쪽</span>
                                    }
                                    <div style={fontOption == 1 ? {border: "5px solid rgb(35,172,160)"} : {border : "1px solid rgb(35,172,160)"}} onClick={() => setFontOption(1)} />
                                    {fontsys == "horizon" ?
                                        <span>아래</span> : <span>오른쪽</span>
                                    }
                                    <div style={fontOption == 2 ? {border: "5px solid rgb(35,172,160)"} : {border : "1px solid rgb(35,172,160)"}} onClick={() => setFontOption(2)} />
                                </div>
                            }
                        </div>
                        <div className={style.dot_shape_btn_area}>
                            <button onClick={() => cancelText()}>취 소</button>
                            <button onClick={() => submitText()}>적 용</button>
                        </div>
                    </>
                } 
            </div>
            <div style={{minWidth: "700px", minHeight: "700px", padding:"125px"}}>
                <div className={style.stamp_canvas} ref={compRef}>
                    {selectMenu && selectMenu == "text" &&
                        <CustomText onClick={(e) => clickBool(e)} family={fontFamily} fontsize={fontsize} fontdata={fontData} fontcolor={fontcolor} fontstroke={fontstroke} fontsys={fontsys} curveBool={fontCurve} curveOption={fontOption}    />
                    }
                    {/* {textArr.length > 0 &&
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
                        // <CustomTextArr data={textArr} />
                    } */}
                    <div className={style.clip_path_area} ref={bgRef} style={imgModify ? {overflow: "unset"} : (imgClick ? {overflow: "hidden"} : {overflow: "hidden", pointerEvents:"none"})}>
                        {convtSwtch == false ?
                            <div className='img_scale' 
                                style={{
                                    width:`${imgWidth}px`, height:`${imgHeight}px`, 
                                    position: "relative",
                                    filter:`grayscale(1) brightness(${imgSwtch ? testLight/10 : lightValue/10}) contrast(${imgSwtch ? testCon/10 : contrastValue/10})`
                                }}>
                                <img className='stamp_img' src={selectedImage} ref={imgRef} 
                                    style={imgLoad == false ? {
                                        filter:`grayscale(1) brightness(${imgSwtch ? testLight/10 : lightValue/10}) contrast(${imgSwtch ? testCon/10 : contrastValue/10})`,
                                        height:`${imgHeight}px`, display: "none"
                                    }
                                    :
                                    {
                                        filter:`grayscale(1) brightness(${lightValue/10}) contrast(${contrastValue/10})`,
                                        width:`${imgWidth}px`, height:`${imgHeight}px`, display: "none"
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
                    <div className={style.stamp_div} style={imgModify ? {filter:"contrast(0.1)"} : null}  ref={photoRef}>
                        {testShape ?
                            <img src={testShape} />
                            :
                            (selectShape &&
                                <img src={selectShape} />
                            )
                        }
                    </div>
                    {konvaArr.length + tempImg.length + textArr.length > 0 &&
                        <div style={convtSwtch == false ? (imgModify ? {position: "absolute", top: "0", pointerEvents:"none", filter: "contrast(0.1)"} : (cvtData != null ? {position: "absolute", top: "0", pointerEvents:"none"} : {position: "absolute", top: "0"})) : {position: "absolute", top: "0", pointerEvents: "none"}}>
                            <DataKonva dataArr={konvaArr} textArr={textArr} tempArr={tempImg} convert={cvtData} delArr={delKonvaArr} cancel={cancData}/>
                        </div>
                    }
                    {/* {lineTextArr.length > 0 &&
                        <div style={{position: "absolute", top: "0"}}>
                            <TextKonva textData={lineTextArr} />
                        </div>
                    }
                    {iconArr.length > 0 &&
                        <div style={{position: "absolute", top: "0"}}>
                            <IconKonva imageData={iconArr} />
                        </div>
                    } */}
                    <div style={drawSwtch == false ? 
                        (imgModify ? 
                            {position: "absolute", top:"0", pointerEvents:"none", zIndex:"999", filter: "contrast(0.1)"}  : 
                            {position: "absolute", top:"0", pointerEvents:"none", zIndex:"999"}
                        ) 
                        : 
                        (drawingMode == true ? 
                            (modeName == "draw" ?
                                {cursor: `url(${brush}),auto`, position: "absolute", top:"15", pointerEvents:"auto", zIndex:"999"} :
                                {cursor: `url(${eraser}),auto`, position: "absolute", top:"55", pointerEvents:"auto", zIndex:"999"}
                            ) : 
                            {position: "absolute", top:"0", pointerEvents:"none", zIndex:"999"}
                        )
                    }>
                        <DrawKonva mode={modeName} bool={drawingMode} color={lineColor} linesDelete={linesToDelete} lineWeight={lineWeight} />
                    </div>
                    {/* <canvas ref={canvRef} width={450} height={450} 
                        style={drawSwtch ? {position: 'absolute', top: `0`, left: `0`, pointerEvents: `auto`} :
                             {position: 'absolute', top: `0`, left: `0`, pointerEvents: "none"}
                        }
                        onMouseDown={startDraw}
                        onMouseUp={finishDraw}
                        onMouseMove={moveDraw}
                        onMouseLeave={finishDraw}
                    /> */}
                    {/* {selectedImage == null && shapeSwtch == true && selectShape &&
                    <div className={style.stamp_svg_area} onClick={handleDivClick}>
                        <div className={style.stamp_svg_btn} style={{background: "rgb(35,172,160)"}}>
                            <RiImageAddLine size="60" color="white" />
                        </div>
                        <div>이미지 업로드 </div>
                        <input style={{display:"none"}} type="file" ref={inputRef} accept="image/*" onChange={handleImageUpload} />
                    </div>
                    } */}
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
                <Link to="/dotset/custom">
                    <div className={style.btn_area}>
                        <div className={style.btn_circle}>
                            <BiArrowBack size={30} color={"white"} />
                        </div>
                        <div>이전으로</div>
                    </div>
                </Link>
                <div className={style.dot_menu_title}>
                    <hr></hr>
                    <div>메뉴</div>
                </div>
                {convtSwtch == false ? 
                <>
                    <div className={style.style_btn_area}>
                        <div className={style.style_btn} style={selectMenu == "shape" ? { backgroundColor: "rgb(91, 91, 91)", color:"white"} : null} onClick={() => settingMenu("shape")}>
                            <div className={style.style_btn_icon} style={selectMenu == "shape" ? { border:"2px solid white"} : null}>
                                <BsCircle size={40} />
                            </div>
                            <span>맞춤틀 선택</span>
                        </div>
                        <div className={style.style_btn} style={ selectShape ? null : {display:"none"}} onClick={handleDivClick}>
                            <div className={style.style_btn_icon}>
                                <RiImageAddLine size={36} color={"white"} />
                            </div>
                            <span>이미지 업로드</span>
                            <input style={{display:"none"}} type="file" ref={inputRef} accept="image/*" onChange={handleImageUpload} />
                        </div>
                        <div className={style.style_btn} style={selectMenu == "image" ? { backgroundColor: "rgb(91, 91, 91)", color:"white"} : null} onClick={() => settingMenu("image")}>
                            <div className={style.style_btn_icon} style={selectMenu == "image" ? { backgroundColor:"white" } : null}>
                                <BsImage size={36} color={selectMenu == "image" ? "rgb(91, 91, 91)" : "white"} />
                            </div>
                            <span>이미지 도구</span>
                        </div>
                        <div className={style.style_btn} style={selectMenu == "drawing" ? { backgroundColor: "rgb(91, 91, 91)", color:"white"} : null} onClick={() => settingMenu("drawing")}>
                            <div className={style.style_btn_icon} style={selectMenu == "drawing" ? { backgroundColor:"white" } : null}>
                                <GiPalette size={40} color={selectMenu == "drawing" ? "rgb(91, 91, 91)" : "white"} />
                            </div>
                            <span>그리기 도구</span>
                        </div>
                        <div className={style.style_btn} style={selectMenu == "text" ? { backgroundColor: "rgb(91, 91, 91)", color:"white"} : null} onClick={() => settingMenu("text")}>
                            <div className={style.style_btn_icon} style={selectMenu == "text" ? { backgroundColor:"white" } : null}>
                                <RxText size={40} color={selectMenu == "text" ? "rgb(91, 91, 91)" : "white"} />
                            </div>
                            <span>글자 도구</span>
                        </div>
                        <div className={style.style_btn} onClick={convertImg}>
                            <div className={style.style_btn_icon}>
                                <FaStamp size={30} color={"white"} />
                            </div>
                            <span>페이스도장 변환</span>
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

export default CustomCanvas;