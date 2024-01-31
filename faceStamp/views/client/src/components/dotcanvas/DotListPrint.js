import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BiArrowBack } from 'react-icons/bi';
import { Scrollbars } from 'react-custom-scrollbars'
import style from "./../../styles/custom.module.css";
import { TfiPrinter } from 'react-icons/tfi'
import { getList } from '../../modules/list';
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import faceIcon from '../../assets/faceIcon/faceIcon';
import ReactToPrint, {useReactToPrint} from "react-to-print";
import * as CommonAxios from "./../CommonAxios";
import PrintImgKonva from './PrintImgKonva';
import PreviewImgKonva from './PreviewImgKonva';
import PreviewPrint from './PreviewPrint';
import PrintImage from './PrintImage';

const DotListPrint = () => {

    const dispatch = useDispatch();

    const { user, list } = useSelector(({ user, list }) => ({
        user: user.user,
        list: list.list,
    }));

    useEffect(() => {
        if(user != null){
            let data = {
                id: user.ur_id
            }
            dispatch(getList(data));
        }
    }, [])

    useEffect(() => {

    }, [list])

    const [selectedImg, setSelectedImg] = useState([]);
    const [printSize, setPrintSize] = useState("a4");

    const printRef = useRef();
    const print2Ref = useRef();

    const sendImage = (data) => {
        if(data){
            if(printSize == "a4"){
                let datas = {
                    size: data.image_size == 45 ? 85 : (data.image_size == 38 ? 71.5 : (data.image_size == 26 ? 49 : (data.image_size == 23 ? 43.5 : (data.image_size == 18 ? 34 : 30)))),
                    image: process.env.REACT_APP_HOSTDONAME + `/${data.image_producer}/` + data.image_name,
                }
                setSelectedImg([...selectedImg, datas]);
            } else if(printSize == "45mm"){
                if(selectedImg.length < 8){
                    let datas = {
                        size: data.image_size == 45 ? 85 : (data.image_size == 38 ? 71.5 : (data.image_size == 26 ? 49 : (data.image_size == 23 ? 43.5 : (data.image_size == 18 ? 34 : 30)))),
                        image: process.env.REACT_APP_HOSTDONAME + `/${data.image_producer}/` + data.image_name,
                    }
                    setSelectedImg([...selectedImg, datas]);
                }
            } else if(printSize == "38mm"){
                if(selectedImg.length < 12){
                    let datas = {
                        size: data.image_size == 45 ? 85 : (data.image_size == 38 ? 71.5 : (data.image_size == 26 ? 49 : (data.image_size == 23 ? 43.5 : (data.image_size == 18 ? 34 : 30)))),
                        image: process.env.REACT_APP_HOSTDONAME + `/${data.image_producer}/` + data.image_name,
                    }
                    setSelectedImg([...selectedImg, datas]);
                }
            } else {
                if(selectedImg.length < 16){
                    let datas = {
                        size: data.image_size == 45 ? 85 : (data.image_size == 38 ? 71.5 : (data.image_size == 26 ? 49 : (data.image_size == 23 ? 43.5 : (data.image_size == 18 ? 34 : 30)))),
                        image: process.env.REACT_APP_HOSTDONAME + `/${data.image_producer}/` + data.image_name,
                    }
                    setSelectedImg([...selectedImg, datas]);
                }
            }
        }
    }
    const [printData, setPrintData] = useState([]);

    const transData = (data) => {
        if(data){
            console.log(data);
            setPrintData(data);
        }
    }


    const editPrintSize = (data) => {
        Swal.fire({
            title: "알림",
            text: "프린트 설정을 변경하시겠습니까?",
            icon: "warning",
            confirmButtonText: "확인",
            showCancelButton: "true",
            cancelButtonText: "취소",
            }).then((res) => {
                if (res.isConfirmed) {
                    setPrintSize(data);
                    setSelectedImg([]);
                }
            });
    }

    // const handlePrint = async () => {
    //     Swal.fire({
    //         text: '프린트 준비 중 입니다',
    //         showConfirmButton: false,
    //         showCancelButton: false,
    //     });
    //     Swal.showLoading();
    //     performPrint();
    // };

    // const performPrint = async () => {
    //     const canvas = await html2canvas(printRef.current);
    //     const newCanvas = document.createElement('canvas');
    //     newCanvas.width = canvas.width * 2;
    //     newCanvas.height = canvas.height * 2;
    //     const newContext = newCanvas.getContext('2d');
    //     newContext.drawImage(canvas, 0, 0, newCanvas.width, newCanvas.height);

    //     const imageElement = new Image();
    //     imageElement.src = newCanvas.toDataURL('image/png');
    //     printRef.current.appendChild(imageElement);

    //     handleReactPrint();

    //     Swal.close();
    // }

    // const handleReactPrint = useReactToPrint({
    //     content: () => printRef.current,
    // });

    return (
        <div className={style.dot_list_wrap}>
            <div className={style.dot_left_menu}>
                
                <div className={style.dot_list_div}>
                    <Scrollbars thumbsize={125}>
                        {list && list.length > 0 && list.map((item) => {
                            let saveData = item;
                            if(printSize == "a4"){
                                return(
                                    <div className={style.dot_frame}>
                                        <div className={style.dot_header_title}>
                                            {item.image_type == "quick" ? "빠른제작" : "맞춤제작"}
                                        </div>
                                        <div className={style.dot_lap_area}>
                                            <div className={style.dot_size_area}>
                                                {item.image_type == "quick" ?
                                                    <>
                                                        <div className={style.dot_style_circle}>{item.image_style}</div>
                                                        <div className={style.dot_size_circle}>{item.image_size}</div>
                                                    </>
                                                :
                                                    <div className={style.dot_size_circle2}>{item.image_size + "x" +item.image_size}</div>
                                                }
                                            </div>
                                            <div className={style.dot_image_area}>
                                                <img src={process.env.REACT_APP_HOSTDONAME + `/${item.image_producer}/` + item.image_name} 
                                                    style={
                                                    item.image_size == 45 ? {width:"85px", height:"85px", margin:"4px"} : 
                                                    (item.image_size == 38 ? {width:"71.5px", height:"71.5px", margin:"10.25px"} : 
                                                    (item.image_size == 26 ? {width:"49px", height:"49px", margin:"22px"} :
                                                    (item.image_size == 23 ? {width:"43.5px", height:"43.5px", margin:"24.75px"} :
                                                    (item.image_size == 18 ? {width:"34px", height:"34px", margin:"29.5px"} :
                                                    {width:"30px", height:"30px", margin:"31.5px"}))))} 
                                                />
                                            </div>
                                        </div>
                                        <button onClick={() => sendImage(saveData)}>출력</button>
                                    </div>
                                )
                            } else if(printSize == "45mm"){
                                if(item.image_size == 45){
                                    return(
                                        <div className={style.dot_frame}>
                                            <div className={style.dot_header_title}>
                                                {item.image_type == "quick" ? "빠른제작" : "맞춤제작"}
                                            </div>
                                            <div className={style.dot_lap_area}>
                                                <div className={style.dot_size_area}>
                                                    {item.image_type == "quick" ?
                                                        <>
                                                            <div className={style.dot_style_circle}>{item.image_style}</div>
                                                            <div className={style.dot_size_circle}>{item.image_size}</div>
                                                        </>
                                                    :
                                                        <div className={style.dot_size_circle2}>{item.image_size + "x" +item.image_size}</div>
                                                    }
                                                </div>
                                                <div className={style.dot_image_area}>
                                                    <img src={process.env.REACT_APP_HOSTDONAME + `/${item.image_producer}/` + item.image_name} 
                                                        style={{width:"85px", height:"85px", margin:"4px"}} 
                                                    />
                                                </div>
                                            </div>
                                            <button onClick={() => sendImage(saveData)}>출력</button>
                                        </div>
                                    )
                                } else {
                                    return null;
                                }
                            } else if(printSize == "38mm"){
                                if(item.image_size == 38){
                                    return(
                                        <div className={style.dot_frame}>
                                            <div className={style.dot_header_title}>
                                                {item.image_type == "quick" ? "빠른제작" : "맞춤제작"}
                                            </div>
                                            <div className={style.dot_lap_area}>
                                                <div className={style.dot_size_area}>
                                                    {item.image_type == "quick" ?
                                                        <>
                                                            <div className={style.dot_style_circle}>{item.image_style}</div>
                                                            <div className={style.dot_size_circle}>{item.image_size}</div>
                                                        </>
                                                    :
                                                        <div className={style.dot_size_circle2}>{item.image_size + "x" +item.image_size}</div>
                                                    }
                                                </div>
                                                <div className={style.dot_image_area}>
                                                    <img src={process.env.REACT_APP_HOSTDONAME + `/${item.image_producer}/` + item.image_name} 
                                                        style={{width:"71.5px", height:"71.5px", margin:"10.25px"}} 
                                                    />
                                                </div>
                                            </div>
                                            <button onClick={() => sendImage(saveData)}>출력</button>
                                        </div>
                                    )
                                } else {
                                    return null;
                                }
                            } else if(printSize == "26mm"){
                                if(item.image_size <= 26){
                                    return(
                                        <div className={style.dot_frame}>
                                            <div className={style.dot_header_title}>
                                                {item.image_type == "quick" ? "빠른제작" : "맞춤제작"}
                                            </div>
                                            <div className={style.dot_lap_area}>
                                                <div className={style.dot_size_area}>
                                                    {item.image_type == "quick" ?
                                                        <>
                                                            <div className={style.dot_style_circle}>{item.image_style}</div>
                                                            <div className={style.dot_size_circle}>{item.image_size}</div>
                                                        </>
                                                    :
                                                        <div className={style.dot_size_circle2}>{item.image_size + "x" +item.image_size}</div>
                                                    }
                                                </div>
                                                <div className={style.dot_image_area}>
                                                    <img src={process.env.REACT_APP_HOSTDONAME + `/${item.image_producer}/` + item.image_name} 
                                                        style={{width:"71.5px", height:"71.5px", margin:"10.25px"}}
                                                    />
                                                </div>
                                            </div>
                                            <button onClick={() => sendImage(saveData)}>출력</button>
                                        </div>
                                    )
                                } else {
                                    return null;
                                }
                            }
                        })}
                    </Scrollbars>
                </div>
            </div>
            {/* 프린트 될 부분 */}
            <div style={{width: "400px", height: "570px", border:"1px solid black", marginTop:"100px", background:"white"}}>
                
                {printSize == "a4" ?
                <>
                    <PreviewImgKonva dataArr={selectedImg} sendData={transData} />
                    {/* {printData.length > 0 &&
                    } */}
                    <div style={{display:"none"}}>
                        <div className={style.print_content} ref={printRef}>
                            <PrintImgKonva dataArr={printData} />
                        </div>
                    </div>
                </>
                :
                <>
                    <PreviewPrint dataArr={selectedImg} size={printSize} />
                    <div style={{display:"none"}}>
                        <div className={style.print_content} ref={print2Ref}>
                            <PrintImage dataArr={selectedImg} size={printSize} />
                        </div>
                    </div>
                </>
                }
            </div>
            <div className={style.dot_right_menu} style={{width:"140px"}}>
                <Link to="/dotlist">
                    <div className={style.btn_area}>
                        <div className={style.btn_circle}>
                            <BiArrowBack size={30} color={"white"} />
                        </div>
                        <div>이전으로</div>
                    </div>
                </Link>
                <hr></hr>
                <div className='dot_menu_title'>프린트 설정</div>
                    <div className='dot_color_btn' style={{marginLeft:"0px"}}>
                        <span style={{width:"31px"}}>A4</span>
                        <div style={printSize == "a4" ? {border: "5px solid rgb(35,172,160)"} : {border : "1px solid rgb(35,172,160)"}} onClick={() => editPrintSize("a4")} />
                        <br></br>
                        <span style={{width:"31px"}}>26mm</span>
                        <div style={printSize == "26mm" ? {border: "5px solid rgb(35,172,160)"} : {border : "1px solid rgb(35,172,160)"}} onClick={() => editPrintSize("26mm")} />
                        <br></br>
                        <span style={{width:"31px"}}>38mm</span>
                        <div style={printSize == "38mm" ? {border: "5px solid rgb(35,172,160)"} : {border : "1px solid rgb(35,172,160)"}} onClick={() => editPrintSize("38mm")} />
                        <br></br>
                        <span style={{width:"31px"}}>45mm</span>
                        <div style={printSize == "45mm" ? {border: "5px solid rgb(35,172,160)"} : {border : "1px solid rgb(35,172,160)"}} onClick={() => editPrintSize("45mm")} />
                    </div>
                <div>
                </div>
                <div className='dot_btn_area' style={{justifyContent : "normal", position:"fixed", bottom: "50px", right:"10px"}}>
                    {printSize == "a4" ?
                    <ReactToPrint trigger={()=>
                        <div className='dot_btn_div'>
                            <div className='dot_menu_btn' style={{background: "red"}}>
                                <TfiPrinter size="60" color="white" />
                            </div>
                            <div style={{color:"red", margin: "10px auto"}}>도장 출력하기</div>
                        </div>}
                        content={() => printRef.current}
                    />
                    :
                    <ReactToPrint trigger={()=>
                        <div className='dot_btn_div'>
                            <div className='dot_menu_btn' style={{background: "red"}}>
                                <TfiPrinter size="60" color="white" />
                            </div>
                            <div style={{color:"red", margin: "10px auto"}}>도장 출력하기</div>
                        </div>}
                        content={() => print2Ref.current}
                    />
                    }
                    {/* <div className='dot_btn_div' onClick={() => handlePrint()}>
                        <div className='dot_menu_btn' style={{background: "red"}}>
                            <TfiPrinter size="60" color="white" />
                        </div>
                        <div style={{color:"red", margin: "10px auto"}}>도장 출력하기</div>
                    </div> */}
                </div>
            </div>
        </div>
    );


    

}

export default DotListPrint;