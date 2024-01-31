import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from "react-router-dom";
import style from "./../../styles/dot.module.css";
import { useDispatch, useSelector } from "react-redux";
import { insert_dotinfo } from "./../../modules/dotInfo";
import Swal from "sweetalert2";

const DotSize = ({type}) => {

    const dispatch = useDispatch();

    useEffect(() => {

    }, [])

    const navigate = useNavigate();

    const linkClick = () => {
        if(seletedSize != null){
            if(type == "quick"){
                navigate(`/dotset/style_` + seletedSize);
            } else {
                let data = {
                    size: seletedSize,
                    style: "",
                }
                dispatch(insert_dotinfo(data));
                navigate(`/dot/custom`);
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: '알림',
                text: '도장 사이즈를 선택해주세요.',
                confirmButtonText: '확인',
            }).then((res) => {
                if(res.isConfirmed){

                }
            })
        }
    }

    const [seletedSize, setSelectedSize] = useState(null);

    return(
        <div className={style.setting_container}>
            <div className={style.dot_header}>
                <div className={style.dot_header_title}>
                    {type == "quick" ? 
                        <span>빠른제작 {">"} 사이즈 선택</span>
                    :
                        <span>맞춤제작 {">"} 사이즈 선택</span>
                    }
                </div>
                <div className={style.dot_header_contents}>도장 사이즈를 선택해주세요.</div>
            </div>
            <div className={style.dot_contents}>
                <div className={style.dots_contents_div}>
                    <div className={style.dots_divide}>
                        <div className={style.dots_contents_outcircle}>
                            <div className={seletedSize == 16 ? `${style.dots_contents_incircle} ${style.seleted_incircle}` : style.dots_contents_incircle}  onClick={() => setSelectedSize(16)}>
                                <div className={style.dots_contents_center_num}>16</div>
                                <div className={style.dots_contents_bottom_mm}>mm</div>
                            </div>
                        </div>
                    </div>
                    <div className={style.dots_divide}>    
                        <div className={style.dots_contents_outcircle}>
                            <div className={seletedSize == 18 ? `${style.dots_contents_incircle} ${style.seleted_incircle}` : style.dots_contents_incircle}  onClick={() => setSelectedSize(18)}>
                                <div className={style.dots_contents_center_num}>18</div>
                                <div className={style.dots_contents_bottom_mm}>mm</div>
                            </div>
                        </div>
                    </div>
                    <div className={style.dots_divide}>    
                        <div className={style.dots_contents_outcircle}>
                            <div className={seletedSize == 23 ? `${style.dots_contents_incircle} ${style.seleted_incircle}` : style.dots_contents_incircle} onClick={() => setSelectedSize(23)}>
                                <div className={style.dots_contents_center_num}>23</div>
                                <div className={style.dots_contents_bottom_mm}>mm</div>
                            </div>
                        </div>
                    </div>
                    <div className={style.dots_divide}>    
                        <div className={style.dots_contents_outcircle}>
                            <div className={seletedSize == 26 ? `${style.dots_contents_incircle} ${style.seleted_incircle}` : style.dots_contents_incircle} onClick={() => setSelectedSize(26)}>
                                <div className={style.dots_contents_center_num}>26</div>
                                <div className={style.dots_contents_bottom_mm}>mm</div>
                            </div>
                        </div>
                    </div>
                    <div className={style.dots_divide}>    
                        <div className={style.dots_contents_outcircle}>
                            <div className={seletedSize == 38 ? `${style.dots_contents_incircle} ${style.seleted_incircle}` : style.dots_contents_incircle} onClick={() => setSelectedSize(38)}>
                                <div className={style.dots_contents_center_num}>38</div>
                                <div className={style.dots_contents_bottom_mm}>mm</div>
                            </div>
                        </div>
                    </div>
                    <div className={style.dots_divide}>    
                        <div className={style.dots_contents_outcircle}>
                            <div className={seletedSize == 45 ? `${style.dots_contents_incircle} ${style.seleted_incircle}` : style.dots_contents_incircle} onClick={() => setSelectedSize(45)}>
                                <div className={style.dots_contents_center_num}>45</div>
                                <div className={style.dots_contents_bottom_mm}>mm</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={style.dots_contents_div}>
                    <div className={style.dots_divide}>
                        <div className={style.dots_contents_outcircle} />
                        <div className={style.dots_bottom} />
                        <div className={seletedSize == 16 ? `${style.dots_bottom_circle} ${style.seleted_bottom_circle}` : style.dots_bottom_circle} onClick={() => setSelectedSize(16)}/>
                    </div>
                    <div className={style.dots_divide}>    
                        <div className={style.dots_contents_outcircle} />
                        <div className={style.dots_bottom} />
                        <div className={seletedSize == 18 ? `${style.dots_bottom_circle} ${style.seleted_bottom_circle}` : style.dots_bottom_circle} onClick={() => setSelectedSize(18)}/>
                    </div>
                    <div className={style.dots_divide}>    
                        <div className={style.dots_contents_outcircle} />
                        <div className={style.dots_bottom} />
                        <div className={seletedSize == 23 ? `${style.dots_bottom_circle} ${style.seleted_bottom_circle}` : style.dots_bottom_circle} onClick={() => setSelectedSize(23)}/>
                    </div>
                    <div className={style.dots_divide}>    
                        <div className={style.dots_contents_outcircle} />
                        <div className={style.dots_bottom} />
                        <div className={seletedSize == 26 ? `${style.dots_bottom_circle} ${style.seleted_bottom_circle}` : style.dots_bottom_circle} onClick={() => setSelectedSize(26)}/>
                    </div>
                    <div className={style.dots_divide}>    
                        <div className={style.dots_contents_outcircle} />
                        <div className={style.dots_bottom} />
                        <div className={seletedSize == 38 ? `${style.dots_bottom_circle} ${style.seleted_bottom_circle}` : style.dots_bottom_circle} onClick={() => setSelectedSize(38)}/>
                    </div>
                    <div className={style.dots_divide}>    
                        <div className={style.dots_contents_outcircle} />
                        <div className={style.dots_bottom} />
                        <div className={seletedSize == 45 ? `${style.dots_bottom_circle} ${style.seleted_bottom_circle}` : style.dots_bottom_circle} onClick={() => setSelectedSize(45)}/>
                    </div>
                </div>
            </div>
            <div className={style.dots_btn_area}>
                <Link to="/">
                    <button>이전 단계</button>
                </Link>
                <button onClick={() => linkClick()}>다음 단계</button>
            </div>
        </div>
    )
}

export default DotSize;