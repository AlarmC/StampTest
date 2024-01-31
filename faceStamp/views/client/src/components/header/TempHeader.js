import "./header.css";
import style from "./header.module.css"
import * as CommonAxios from "../CommonAxios";
import { Link, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import funersImg from "../../assets/images/contents/info_img.png";
import { useSelector } from "react-redux";
import logo2 from "../../assets/images/logoImg.png"
import mainImg from "../../assets/images/mainImg.jpg"

function TempHeader() {

    return (
        <header id="header">
            <div className="wrap">
                <div className="group">
                    <h1 className="logo" style={{top:"6px"}}>
                        <Link to="/" className="logo_anchor" style={{width:"auto"}}>
                            <img src={logo2} alt="logo" />
                            <span style={{marginLeft:"10px"}}>통합관측센터</span>
                        </Link>
                    </h1>
                </div>
            </div>

            <div className="lnb" style={{height:"50px"}}>

                <nav className="menu after eachdown">
                    <div className="wrap">
                        <div className="depth depth1">
                            <ul className="depth_list depth1_list cut" style={{paddingLeft: "500px"}}>
                                {/* <li className="depth_item depth1_item">
                                    <Link to="/dotset/quick" className="depth_text depth1_text" style={{padding:"20px 20px"}}>
                                        <span>빠른제작</span>
                                    </Link>
                                </li>
                                <li className="depth_item depth1_item">
                                    <Link to="/dotset/custom" className="depth_text depth1_text" style={{padding:"20px 20px"}}>
                                        <span>맞춤제작</span>
                                    </Link>
                                </li>
                                <li className="depth_item depth1_item">
                                    <Link to="/dotlist" className="depth_text depth1_text" style={{padding:"20px 20px"}}>
                                        <span>도장리스트</span>
                                    </Link>
                                </li> */}
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
            <div style={{background:`url(${mainImg})`, width:"100%", height:"300px", backgroundSize:"cover", position:"relative"}}>
                <div className="menu_div">
                    <ul style={{width: "1200px", margin:"5px auto", display:"flex", justifyContent:"center"}}>
                        <li className="menu_li">정보공개</li>
                        <li className="menu_li">수문정보</li>
                        <li className="menu_li">하천정보</li>
                        <li className="menu_li">전자 민원실</li>
                        <li className="menu_li">알림마당</li>
                        <li className="menu_li">하천수행정</li>
                        <li className="menu_li">통제소 소개</li>
                        <li className="menu_li">국민마당</li>
                    </ul>
                    <hr style={{marginTop:"0"}}></hr>
                    <div style={{width: "1200px", margin:"70px auto 0"}}>
                        <h2 style={{textAlign:"center", fontSize:"40px"}}>안전한 청주!</h2>
                        <br></br>
                        <h3 style={{textAlign:"center", fontSize:"30px"}}>청주시가 함께 합니다</h3>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default TempHeader;
