import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from "react-router-dom";
import style from "./../../styles/login.module.css";
import { BsFillPersonFill } from 'react-icons/bs';
import { AiFillLock } from 'react-icons/ai';
import { MdToggleOff } from 'react-icons/md';
import { MdToggleOn } from 'react-icons/md';
import face_logo from "./../../assets/faceImage/face_logo.png"
import face_mark from "./../../assets/faceImage/face_mark.png"
import { getUsers, logout } from "./../../modules/user";
import Swal from "sweetalert2";
import { encrypt } from "./../../lib/api/tokenCrypto";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";


const DotLogin = () => {
    const inpUsingRef = useRef([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(({ user }) => ({
        user: user.user,
    }));

    const [ idToggle, setIdToggle ] = useState(false);
    const [ autoToggle, setAutoToggle ] = useState(false);

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            onLogin(inpUsingRef.current[0].value, inpUsingRef.current[1].value);
        }
    };

    const onLogin = (id, pw) => {
        if(id === ""){
            return (
                Swal.fire({
                    icon: 'error',
                    title: '알림',
                    text: '아이디를 입력해주세요.',
                    confirmButtonText: '확인',
                }).then((res) => {
                    if(res.isConfirmed){
    
                    }
                })
            )
        } else if( pw === ""){
            return (
                Swal.fire({
                    icon: 'error',
                    title: '알림',
                    text: '비밀번호를 입력해주세요.',
                    confirmButtonText: '확인',
                }).then((res) => {
                    if(res.isConfirmed){
    
                    }
                })
            )
        }

        let data = "none";
        if(autoToggle){ data = "auto"}
        else if(idToggle){ data = "id"}

        const sendData = {
            id: id,
            password: pw,
            state: data
        };
    
        dispatch(getUsers(sendData));
    };

    useEffect(() => {
        const error = "사용자 아이디와 비밀번호를 확인하여 주시기 바랍니다.";
        if (user !== null && user === error) {
            Swal.fire({
                title: "로그인 실패",
                text: "아이디와 비밀번호를 확인해주세요.",
                icon: "error",
                confirmButtonText: "확인",
                confirmButtonColor: "#FF0000",
                allowOutsideClick: false,
            });
            dispatch(logout());
        } else if (user !== null && user !== error) {
            // localStorage.setItem("serveInfo", user);
            let loginState = ""
            if(autoToggle){
                loginState = "auto";
                localStorage.setItem("loginState", loginState);
                localStorage.setItem("serveInfo", encrypt(user, "serveInfo"));
            } else if(idToggle){
                loginState = "id";
                localStorage.setItem("loginState", loginState);
                localStorage.setItem("loginId", inpUsingRef.current[0].value)
                sessionStorage.setItem("serveInfo", encrypt(user, "serveInfo"));
            } else {
                loginState = "none";
                localStorage.setItem("loginState", loginState);
                sessionStorage.setItem("serveInfo", encrypt(user, "serveInfo"));
            }
            navigate("/");
        }
    }, [navigate, user]);

    useEffect(() => {
        let bool = localStorage.getItem("loginId");
        inpUsingRef.current[0].value = bool;
    }, [])


    return(
        <div className={style.login_container}>
            <div className={style.login_div}>
                <div className={style.login_content}>
                    <h3 className={style.login_title}>로그인</h3>
                    <div className={style.login_space}>
                        <BsFillPersonFill size={30} color={"rgb(81, 189, 178)"} />
                        <input
                            type="text"
                            className={style.login_id_inp}
                            placeholder='아이디를 입력해주세요'
                            ref={(elem) => (inpUsingRef.current[0] = elem)}
                        />
                    </div>
                    <div className={style.login_space}>
                        <AiFillLock size={30} color={"rgb(81, 189, 178)"} />
                        <input
                            type="password"
                            className={style.login_id_inp}
                            placeholder='패스워드를 입력해주세요'
                            ref={(elem) => (inpUsingRef.current[1] = elem)}
                            onKeyPress={handleKeyPress}
                        />
                    </div>
                    <div className={style.login_tog_div}>
                        {idToggle == false ?
                            <><MdToggleOff onClick={() => setIdToggle(!idToggle)} color={"gray"} size={30} /><span>아이디저장</span></>
                            :
                            <><MdToggleOn onClick={() => setIdToggle(!idToggle)} color={"rgb(81, 189, 178)"} size={30} /><span>아이디저장</span></>
                        } 
                        {autoToggle == false ?
                            <><MdToggleOff onClick={() => setAutoToggle(!autoToggle)} color={"gray"} size={30} /><span>자동로그인</span></>
                            :
                            <><MdToggleOn onClick={() => setAutoToggle(!autoToggle)} color={"rgb(81, 189, 178)"} size={30} /><span>자동로그인</span></>
                        } 
                    </div>
                    <button onClick={() => onLogin(inpUsingRef.current[0].value, inpUsingRef.current[1].value)}>
                        <div className={style.login_btn}>로그인</div>
                    </button>
                    {/* <Link to="/">
                    </Link> */}
                    <div className={style.login_inq_msg}>
                        <div>아이디/패스워드 분실시 본사에 문의하세요.</div>
                        <div>대표번호:1599-2308</div>
                    </div>
                </div>
                <div className={style.login_content}>
                    <div className={style.login_img_div}>
                        <img src={face_logo} />
                        <img src={face_mark} />
                    </div>
                    <div className={style.login_txt_space}>
                        <h3>사진을 도장에 새기다.</h3>
                        <div>추억의 순간을 도장으로 기록하세요</div>
                        {/*<button className={style.login_guide_btn}>홈페이지 안내</button>*/}
                    </div>
                </div>
            </div>
        </div>
    )

}

export default DotLogin;