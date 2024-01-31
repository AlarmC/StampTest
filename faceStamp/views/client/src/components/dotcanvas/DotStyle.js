import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from "react-router-dom";
import style from "./../../styles/dot.module.css";
import stamp1 from "./../../assets/faceImage/stamp1.png";
import stamp2 from "./../../assets/faceImage/stamp2.png";
import stamp3 from "./../../assets/faceImage/stamp3.png";
import stamp4 from "./../../assets/faceImage/stamp4.png";
import stamp5 from "./../../assets/faceImage/stamp5.png";
import Swal from "sweetalert2";

const DotStyle = ({type}) => {

    const [seletedStyle, setSelectedStyle] = useState(null);// 선택한 스타일
    const [sizeNum, setSizeNum] = useState(null);           // 사이즈
    const [sizeBool, setSizeBool] = useState(true);         // 사이즈별 스타일 선택 가능 유무(16, 18 사이즈일 때, B, C 선택 불가)
    
    
    useEffect(() => {
        let result = type.substr(6, 2);
        setSizeNum(result);
        if(result == "16" || result == "18"){
            setSizeBool(false);
        }
    }, [type])

    const navigate = useNavigate();

    const linkClick = () => {
        if(seletedStyle != null){
            if(seletedStyle == "T"){
                navigate(`/dotset/tema`);
            } else {
                navigate(`/dotset/info_` + seletedStyle);
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: '알림',
                text: '도장 스타일을 선택해주세요.',
                confirmButtonText: '확인',
            }).then((res) => {
                if(res.isConfirmed){

                }
            })
        }
    }


    return(
        <div className={style.setting_container}>
            <div className={style.dot_header}>
                <div className={style.dot_header_title}>
                    <span>빠른제작 {">"} 스타일 선택</span>
                </div>
                <div className={style.dot_header_contents}>도장 스타일을 선택해주세요.</div>
            </div>
            <div className={style.dot_contents}>
                <div className={style.dots_contents_div}>
                    <div className={style.dots_divide}>
                        <div className={seletedStyle == "A" ? `${style.dots_contents_style_circle} ${style.selected_circle}` : style.dots_contents_style_circle} onClick={() => setSelectedStyle("A")}>
                            <img src={stamp1} />
                        </div>
                    </div>
                    {sizeBool ?
                        <>
                            <div className={style.dots_divide}>    
                                <div className={seletedStyle == "B" ? `${style.dots_contents_style_circle} ${style.selected_circle}` : style.dots_contents_style_circle} onClick={() => setSelectedStyle("B")}>
                                    <img src={stamp2} />
                                </div>
                            </div>
                            <div className={style.dots_divide}>    
                                <div className={seletedStyle == "C" ? `${style.dots_contents_style_circle} ${style.selected_circle}` : style.dots_contents_style_circle} onClick={() => setSelectedStyle("C")}>
                                    <img src={stamp3} />
                                </div>
                            </div>
                        </>
                    :
                        <>
                            <div className={style.dots_divide} style={{opacity:"0.5", cursor:"auto"}}>    
                                <div style={{cursor: "auto"}} className={seletedStyle == "B" ? `${style.dots_contents_style_circle} ${style.selected_circle}` : style.dots_contents_style_circle}>
                                    <img src={stamp2} />
                                </div>
                            </div>
                            <div className={style.dots_divide} style={{opacity:"0.5"}}>    
                                <div style={{cursor: "auto"}} className={seletedStyle == "C" ? `${style.dots_contents_style_circle} ${style.selected_circle}` : style.dots_contents_style_circle}>
                                    <img src={stamp3} />
                                </div>
                            </div>
                        </>
                    }
                    <div className={style.dots_divide}>    
                        <div className={seletedStyle == "D" ? `${style.dots_contents_style_circle} ${style.selected_circle}` : style.dots_contents_style_circle} onClick={() => setSelectedStyle("D")}>
                            <img src={stamp4} />
                        </div>
                    </div>
                    <div className={style.dots_divide}>    
                        <div className={seletedStyle == "T" ? `${style.dots_contents_style_circle} ${style.selected_circle}` : style.dots_contents_style_circle} onClick={() => setSelectedStyle("T")}>
                            <img src={stamp5} />
                        </div>
                    </div>
                </div>
                <div className={style.dots_contents_div}>
                    <div className={style.dots_divide}>
                        <div style={{cursor: "auto"}} className={style.dots_contents_style_circle} />
                        <div className={style.dots_bottom} />
                        <div className={seletedStyle == "A" ? `${style.dots_bottom_circle} ${style.seleted_bottom_circle}` : style.dots_bottom_circle} onClick={() => setSelectedStyle("A")}/>
                        <div className={style.dots_bottom_txt}>A형</div>
                    </div>
                    {sizeBool ?
                        <>
                            <div className={style.dots_divide}>    
                                <div style={{cursor: "auto"}} className={style.dots_contents_style_circle} />
                                <div className={style.dots_bottom} />
                                <div className={seletedStyle == "B" ? `${style.dots_bottom_circle} ${style.seleted_bottom_circle}` : style.dots_bottom_circle} onClick={() => setSelectedStyle("B")}/>
                                <div className={style.dots_bottom_txt}>B형</div>
                            </div>
                            <div className={style.dots_divide}>    
                                <div style={{cursor: "auto"}} className={style.dots_contents_style_circle} />
                                <div className={style.dots_bottom} />
                                <div className={seletedStyle == "C" ? `${style.dots_bottom_circle} ${style.seleted_bottom_circle}` : style.dots_bottom_circle} onClick={() => setSelectedStyle("C")}/>
                                <div className={style.dots_bottom_txt}>C형</div>
                            </div>
                        </>
                    :
                        <>
                            <div className={style.dots_divide}>    
                                <div style={{opacity: "0.5", cursor: "auto"}} className={style.dots_contents_style_circle} />
                                <div className={style.dots_bottom} />
                                <div style={{cursor: "auto", border:"0"}} className={seletedStyle == "B" ? `${style.dots_bottom_circle} ${style.seleted_bottom_circle}` : style.dots_bottom_circle}/>
                                <div className={style.dots_bottom_txt}>B형</div>
                            </div>
                            <div className={style.dots_divide}>    
                                <div style={{opacity: "0.5", cursor: "auto"}} className={style.dots_contents_style_circle} />
                                <div className={style.dots_bottom} />
                                <div style={{cursor: "auto", border:"0"}} className={seletedStyle == "C" ? `${style.dots_bottom_circle} ${style.seleted_bottom_circle}` : style.dots_bottom_circle}/>
                                <div className={style.dots_bottom_txt}>C형</div>
                            </div>
                        </>
                    }
                    <div className={style.dots_divide}>    
                        <div style={{cursor: "auto"}} className={style.dots_contents_style_circle} />
                        <div className={style.dots_bottom} />
                        <div className={seletedStyle == "D" ? `${style.dots_bottom_circle} ${style.seleted_bottom_circle}` : style.dots_bottom_circle} onClick={() => setSelectedStyle("D")}/>
                        <div className={style.dots_bottom_txt}>D형</div>
                    </div>
                    <div className={style.dots_divide}>    
                        <div style={{cursor: "auto"}} className={style.dots_contents_style_circle} />
                        <div className={style.dots_bottom} />
                        <div className={seletedStyle == "T" ? `${style.dots_bottom_circle} ${style.seleted_bottom_circle}` : style.dots_bottom_circle} onClick={() => setSelectedStyle("T")}/>
                        <div className={style.dots_bottom_txt}>테마제작형</div>
                    </div>
                </div>
            </div>
            <div className={style.dots_btn_area}>
                <Link to="/dotset/quick">
                    <button>이전 단계</button>
                </Link>
                <button onClick={() => linkClick()}>다음 단계</button>
                {/* <Link to={"/dotset/info_" + seletedStyle}>
                </Link> */}
            </div>
        </div>
    )
}

export default DotStyle;