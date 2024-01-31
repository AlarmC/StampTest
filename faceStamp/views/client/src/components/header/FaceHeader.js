import logo from "../../assets/images/contents/chaeum.png";
import "./header.css";
import style from "./header.module.css"
import * as CommonAxios from "../CommonAxios";
import { Link, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import funersImg from "../../assets/images/contents/info_img.png";
import { useSelector } from "react-redux";
import { AiFillCloseCircle } from "react-icons/ai";
import { BsPersonCircle } from "react-icons/bs";
import { MdToggleOn } from 'react-icons/md';
import { MdToggleOff } from 'react-icons/md';

function FaceHeader() {
    const { user } = useSelector(({ user }) => ({
        user: user.user,
    }));

    const dropRef = useRef();
    const navigate = useNavigate();
    const [dropDownAction, setDropDownAction] = useState(false);

    const [subMenu, setSubMenu] = useState(false);
    const [idSave, setIdSave] = useState(false);
    const [autoLogin, setAutoLogin] = useState(false);

    useEffect(() => {
        let data = localStorage.getItem("loginState");
        if(data == "auto" && data != null){
            setAutoLogin(true);
        }
        if(data == "id" && data != null){
            setIdSave(true);
        }
    }, [])

    useEffect(() => {
        const checkIfClickedOutside = (e) => {
            if ( dropDownAction && dropRef.current && !dropRef.current.contains(e.target)) {
                setDropDownAction(false);
            }
        };
    
        document.addEventListener("mousedown", checkIfClickedOutside);
    
        return () => {
            document.removeEventListener("mousedown", checkIfClickedOutside);
        };
    }, [dropDownAction]);

    const noDropDown = () => {
        setDropDownAction(false);
    };
    
    const logoutFun = () => {
        let sendData = "";
        CommonAxios.CommonAxios(
          process.env.REACT_APP_HOSTDONAME + "/api/signout",
          sendData,
          function (result) {
            if (result.messageinfo.state === "ok") {
              localStorage.clear();
              document.location.href = "/";
            } else {
              alert(result.messageinfo.message);
            }
          }
        );
    };
    const HeaderLogout = () => {
        return (
            <div className="login active">
                <button
                type="button"
                className="login_btn"
                onClick={() => setDropDownAction(!dropDownAction)}
                >
                <div className="login_ico">
                    {/* <img
                    src={funersImg}
                    /> */}
                    <BsPersonCircle color={"rgb(171,171,171)"} size={40}/>
                </div>
                </button>
        
                {/* <!-- 해당 버튼 클릭시 레이어 팝업창이 열립니다 --> */}
                <div
                    className={`${dropDownAction ? "popup_box show" : "popup_box"}`}
                    ref={dropRef}
                    style={{minHeight:"100px"}}
                >
                    <div className="my_info">
                        <span className="info_img" style={{borderRadius:"0"}}>
                            <BsPersonCircle color={"rgb(171,171,171)"} size={40}/>
                        </span>
                        <div className="info_name">
                            <div className="name">
                                <span style={{fontWeight:"bold", fontSize:"20px"}}>{user.ur_name}</span> 회원님
                            <div>{user.ur_mode == 1 ? "무료회원" : "유료회원" }</div>
                            </div>
                        </div>
                    </div>
                    <ul className="mypage_list clearfix">
                        <li>
                            <div
                                className="mypage_link header_logout_btn"
                                onClick={logoutFun}
                            >
                                로그아웃
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        );
    };

    return (
        <header id="header">
            <div className="wrap">
                <div className="group">
                    <h1 className="logo">
                        <Link to="/" className="logo_anchor">
                            <img src={logo} alt="logo" />
                        </Link>
                    </h1>
                </div>
                <div className="group right">

                {!user ? null : <HeaderLogout />}
                </div>
            </div>

            <div className="lnb">
                <div className="menu_show" onClick={() => setSubMenu(true)}>
                    <button type="button" className="menu_btn">
                        주메뉴 열기
                    </button>
                </div>

                <nav className="menu after eachdown">
                    <div className="wrap">
                        <div className="depth depth1">
                            <ul className="depth_list depth1_list cut">
                                <li className="depth_item depth1_item">
                                    <Link to="/dotset/quick" className="depth_text depth1_text">
                                        <span>빠른제작</span>
                                    </Link>
                                </li>
                                <li className="depth_item depth1_item">
                                    <Link to="/dotset/custom" className="depth_text depth1_text">
                                        <span>맞춤제작</span>
                                    </Link>
                                </li>
                                <li className="depth_item depth1_item">
                                    <Link to="/dotlist" className="depth_text depth1_text">
                                        <span>도장리스트</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
            {subMenu &&
                <>
                    <div className={style.sideMenu}>
                        <div className={style.user_area}>
                            <span className={style.user_icon} style={{borderRadius:"0"}}>
                                <BsPersonCircle color={"rgb(171,171,171)"} size={40}/>
                            </span>
                            <div className={style.user_name}>
                                <div className="name">
                                    <span style={{fontWeight:"bold", fontSize:"20px"}}>{user.ur_name}</span> 회원님
                                <div>{user.ur_mode == 1 ? "무료회원" : "유료회원" }</div>
                                </div>
                            </div>
                        </div>
                        <hr></hr>
                        <div className={style.menu_area}>
                            <div className={style.menu_title}>메 뉴</div>
                            <ul>
                                <li><Link to="/dotset/quick">빠른 제작</Link></li>
                                <li><Link to="/dotset/custom">맞춤 제작</Link></li>
                                <li><Link to="/dotlist" >도장 리스트</Link></li>
                            </ul>
                        </div>
                        <hr></hr>
                        <div className={style.menu_area}>
                            <div className={style.menu_title}>로그인</div>
                            <div className={style.tag_area}>
                                <div>아이디 저장</div>
                                <div className={style.svg_right}>
                                {idSave ?
                                    <MdToggleOn color={"rgb(35,172,160)"} size={30} onClick={() => setIdSave(false)} />
                                    :
                                    <MdToggleOff size={30}  onClick={() => setIdSave(true)} />
                                }
                                </div>
                            </div>
                            <div className={style.tag_area}>
                                <div>자동 로그인</div>
                                <div className={style.svg_right}>
                                {autoLogin ?
                                    <MdToggleOn color={"rgb(35,172,160)"} size={30} onClick={() => setAutoLogin(false)} />
                                    :
                                    <MdToggleOff size={30}  onClick={() => setAutoLogin(true)} />
                                }
                                </div>
                            </div>
                        </div>
                        <div className={style.side_logout_btn} onClick={logoutFun}>
                            <div>로그아웃</div>
                        </div>
                        <div className={style.side_close_btn} onClick={() => setSubMenu(false)}>
                            <AiFillCloseCircle color={"red"} size={40} />
                            <div>닫기</div>
                        </div>
                    </div>
                    <div className={style.darken}></div>
                </>
            }
        </header>
    );
}

export default FaceHeader;
