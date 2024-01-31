import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import style from "./../../styles/dot.module.css";
import stamp1 from "./../../assets/faceTema/stamp1.png";
import stamp2 from "./../../assets/faceTema/stamp2.png";
import stamp3 from "./../../assets/faceTema/stamp3.png";
import stamp4 from "./../../assets/faceTema/stamp4.png";
import stamp5 from "./../../assets/faceTema/stamp5.png";
import Swal from "sweetalert2";

const DotTema = () => {

    const [seletedStyle, setSelectedStyle] = useState(null);// 선택한 스타일
 
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { dotinfo } = useSelector(({ dotinfo }) => ({
        dotinfo: dotinfo.dotinfo,
    }));

    const linkClick = () => {
        if(seletedStyle != null){
            if(seletedStyle == "A"){
                navigate(`/tema/edu`);
            } else if(seletedStyle == "B"){
                navigate(`/tema/praise`);
            } else if(seletedStyle == "C"){
                navigate(`/tema/wedding`);
            } else if(seletedStyle == "D"){
                navigate(`/tema/music`);
            } else {
                navigate(`/tema/ar`);
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: '알림',
                text: '테마를 선택해주세요.',
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
                    <span>빠른제작 {">"} 테마선택</span>
                </div>
                <div className={style.dot_header_contents}>테마를 선택해주세요.</div>
            </div>
            <div className={style.dot_contents}>
                <div className={style.dots_contents_div}>
                    <div className={style.dots_divide}>
                        <div className={seletedStyle == "A" ? `${style.dots_contents_style_circle} ${style.selected_circle}` : style.dots_contents_style_circle} onClick={() => setSelectedStyle("A")}>
                            <img src={stamp1} />
                        </div>
                    </div>
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
                        <div className={style.dots_bottom_tema_txt}>교육</div>
                    </div>
                    <div className={style.dots_divide}>
                        <div style={{cursor: "auto"}} className={style.dots_contents_style_circle} />
                        <div className={style.dots_bottom} />
                        <div className={seletedStyle == "B" ? `${style.dots_bottom_circle} ${style.seleted_bottom_circle}` : style.dots_bottom_circle} onClick={() => setSelectedStyle("B")}/>
                        <div className={style.dots_bottom_tema_txt}>칭찬</div>
                    </div>
                    <div className={style.dots_divide}>
                        <div style={{cursor: "auto"}} className={style.dots_contents_style_circle} />
                        <div className={style.dots_bottom} />
                        <div className={seletedStyle == "C" ? `${style.dots_bottom_circle} ${style.seleted_bottom_circle}` : style.dots_bottom_circle} onClick={() => setSelectedStyle("C")}/>
                        <div className={style.dots_bottom_tema_txt}>웨딩</div>
                    </div>
                    <div className={style.dots_divide}>    
                        <div style={{cursor: "auto"}} className={style.dots_contents_style_circle} />
                        <div className={style.dots_bottom} />
                        <div className={seletedStyle == "D" ? `${style.dots_bottom_circle} ${style.seleted_bottom_circle}` : style.dots_bottom_circle} onClick={() => setSelectedStyle("D")}/>
                        <div className={style.dots_bottom_tema_txt}>음악</div>
                    </div>
                    <div className={style.dots_divide}>    
                        <div style={{cursor: "auto"}} className={style.dots_contents_style_circle} />
                        <div className={style.dots_bottom} />
                        <div className={seletedStyle == "T" ? `${style.dots_bottom_circle} ${style.seleted_bottom_circle}` : style.dots_bottom_circle} onClick={() => setSelectedStyle("T")}/>
                        <div className={style.dots_bottom_tema_txt}>AR도장</div>
                    </div>
                </div>
            </div>
            <div className={style.dots_btn_area}>
                <Link to={`/dotset/style_` + dotinfo.size}>
                    <button>이전 단계</button>
                </Link>
                <button onClick={() => linkClick()}>다음 단계</button>
            </div>
        </div>
    )
}

export default DotTema;