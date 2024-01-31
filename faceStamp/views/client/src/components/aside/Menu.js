import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as CommonAxios from "../CommonAxios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./menu.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
// import EmailLogin from "./../../pages/EmailLogin";

function Menu(){
    // 주소 (리스트 클래스)
    const [ pathData, setPathData ] = useState();

    const [ list1, setList1 ] = useState(false);
    const [ list2, setList2 ] = useState(false);
    const [ list3, setList3 ] = useState(false);

    const [ head, setHead ] = useState(1);

    const { user } = useSelector(({ user }) => ({
        user: user.user,
    }));

    const location = useLocation();

    useEffect(() => {
        let adrs = location.pathname.split('/')[1];
        setPathData(adrs);
        if(adrs == "goodstype"){
            setList1(true);
            setHead(1)
        } else if(adrs == "userlist"){
            setList1(true);
            setHead(1)
        } else if(adrs == "post"){
            setList1(true);
            setHead(1)
        } else if(adrs == "place"){
            setList1(true);
            setHead(1)
        } else if(adrs == "config"){
            setList1(true);
            setHead(1)
        } else if(adrs == "roominfo"){
            setList1(true);
            setHead(1)
        } else if(adrs == "article"){
            setList2(true);
            setHead(2)
        } else if(adrs == "loginfo"){
            setList2(true);
            setHead(2)
        } else if(adrs == "canvas"){
            setList3(true);
            setHead(3)
        } else if(adrs == "canvasEach"){
            setList3(true);
            setHead(3)
        }
    }, [ location ])

    const openMenu = (no) => {
        if(no == 1){
            setList1(!list1);
        } else if(no == 2){
            setList2(!list2);
        } else if(no == 3){
            setList3(!list3);
        }
    }

    return(
        <div className="menuWrap">
            <div className="menu_title">
                <h2>{head == 1 ? "물품 관리" : head == 2 ? "자산 관리" : "물품 배치도"}</h2>
            </div>
            <div className="menu_contents">
                <ul className="head_menu_depth">
                    <li className="left_menu_content" onClick={()=>openMenu(1)}>
                        <div className="lmc_title">
                            <span>물품 관리</span>
                        </div>
                        <div className={list1 == true ? "lmc_content open" : "lmc_content close" } >
                            <ul>
                                <li className={pathData == "goodstype" ? "clicked" : ""}><Link to="/goodstype">물품종류관리</Link></li>
                                <li className={pathData == "userlist" ? "clicked" : ""}><Link to="/userlist">사용자관리</Link></li>
                                <li className={pathData == "post" ? "clicked" : ""}><Link to="/post">부서관리</Link></li>
                                <li className={pathData == "place" ? "clicked" : ""}><Link to="/place">위치관리</Link></li>
                                <li className={pathData == "roominfo" ? "clicked" : ""}><Link to="/roominfo">방정보관리</Link></li>
                                <li className={pathData == "config" ? "clicked" : ""}><Link to="/config">환경설정</Link></li>
                            </ul>
                        </div>
                    </li>
                    <li className="left_menu_content" onClick={()=>openMenu(2)}>
                        <div className="lmc_title">
                            <span>자산 관리</span>
                        </div>
                        <div className={list2 == true ? "lmc_content open" : "lmc_content close" }>
                            <ul>
                                <li className={pathData == "article" ? "clicked" : ""}><Link to="/article">물품정보</Link></li>
                                <li className={pathData == "loginfo" ? "clicked" : ""}><Link to="/loginfo">로그정보</Link></li>
                            </ul>
                        </div>
                    </li>
                    <li className="left_menu_content" onClick={()=>openMenu(3)}>
                        <div className="lmc_title">
                            <span><Link to="/canvasEach">물품 배치도</Link></span>
                            {/* <span>물품 배치도</span> */}
                        </div>
                        {/* <div className={list3 == true ? "lmc_content open" : "lmc_content close" }>
                            <ul>
                                <li className={pathData == "canvas" ? "clicked" : ""}><Link to="/canvas">방별 배치도</Link></li>
                                <li className={pathData == "canvasEach" ? "clicked" : ""}><Link to="/canvasEach">개별 배치도</Link></li>
                            </ul>
                        </div> */}
                    </li>
                    {/* <li className="left_menu_content" onClick={()=>openMenu(3)}>
                        <div className="lmc_title">
                            <span><Link to="/canvas">물품 배치도</Link></span>
                        </div>
                    </li> */}
                </ul>
            </div>
        </div>
    )
}

export default Menu;