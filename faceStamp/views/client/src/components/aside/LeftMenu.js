import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as CommonAxios from "../CommonAxios";
import { Link, useNavigate } from "react-router-dom";
import "./menu.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
// import EmailLogin from "./../../pages/EmailLogin";
import {TbPhoto} from "react-icons/tb";

function LeftMenu(){

    const { user } = useSelector(({ user }) => ({
        user: user.user,
    }));
    const [modal, setModal] = useState(false);


    return(
        <div className="leftWrap">
            <ul>
                <li>
                    <Link to="/" className="left_menu_2">
                        <span style={{ textAlign:"left" }}>실시간모니터링1</span>
                    </Link>
                </li>
                <li>
                    <Link to="/mains" className="left_menu_2">
                        <span style={{ textAlign:"left" }}>실시간모니터링2</span>
                    </Link>
                </li>
                {/* <li>
                    <Link to="/monitor" className="left_menu_2">
                        <span>모니터링</span>
                    </Link>
                </li> */}
                <li>
                    <Link to="/report" className="left_menu_2">
                        <span style={{ textAlign:"left" }}>보고서</span>
                    </Link>
                </li>
                {/* <li>
                    {!user ? 
                        // <div onClick={onLogin}>
                        <span onClick={() =>{setModal(true)}}>설정</span>
                        // <Link to="/login/email">
                        // </Link>
                        // </div> 
                        :
                        <Link to="/setting" className="left_menu_4">
                            <span>설정</span>
                        </Link>
                    }
                    {
                        modal == true ? <EmailLogin type={1} /> : null
                    }
                </li> */}
                <li>
                    <Link to="/canvasEach" className="left_menu_2">
                        <span style={{display:"inline-block", textAlign:"left", float:"left", margin:"0"}}>캔버스</span>
                        <TbPhoto size="30" color="white" />
                    </Link>
                    {/* {!user ? 
                        <span onClick={() =>{setModal(true)}}>캔버스</span>
                        :
                    }
                    {
                        modal == true ? <EmailLogin type={2} /> : null
                    } */}
                </li>
                {/* <li>
                    <Link to="/" className="left_menu_5">
                        <span>패킷뷰</span>
                    </Link>
                </li> */}
            </ul>
        </div>
    )
}

export default LeftMenu;