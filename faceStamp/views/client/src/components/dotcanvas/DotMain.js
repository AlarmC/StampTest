import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from "react-router-dom";
import style from "./../../styles/dot.module.css";
import { AiFillThunderbolt } from 'react-icons/ai';
import { FaTools } from 'react-icons/fa'
import { FaClipboardList } from 'react-icons/fa';

const DotMain = () => {

    return(
        <div className={style.dot_container}>
            <div className={style.dot_div}>
                <div className={style.main_contents}>
                    <div className={style.main_contents_svg}>
                        <AiFillThunderbolt size={80} color={"white"} />
                    </div>
                    <div className={style.main_contents_title}>빠른제작</div>
                    <div className={style.main_contents_text}>
                        기존 설정으로 빠르게 제작합니다. 이미지 보정이 필요없는 경우에 추천합니다.
                    </div>
                    <Link to="/dotset/quick">
                        <button className={style.main_select_btn}>선택하기</button>
                    </Link>
                </div>
                <div className={style.main_contents}>
                    <div className={style.main_contents_svg}>
                        <FaTools size={80} color={"white"} />
                    </div>
                    <div className={style.main_contents_title}>맞춤제작</div>
                    <div className={style.main_contents_text}>
                        이미지 보정, 레이아웃 등 사용자 맞춤형으로 제작할 수 있습니다.
                    </div>
                    <Link to="/dotset/custom">
                        <button className={style.main_select_btn}>선택하기</button>
                    </Link>
                </div>
                <div className={style.main_contents}>
                    <div className={style.main_contents_svg}>
                        <FaClipboardList size={80} color={"white"} />
                    </div>
                    <div className={style.main_contents_title}>도장리스트</div>
                    <div className={style.main_contents_text}>
                        제작된 페이스도장 결과물을 확인할 수 있습니다.
                    </div>
                    <Link to="/dotlist">
                        <button className={style.main_select_btn}>선택하기</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default DotMain;