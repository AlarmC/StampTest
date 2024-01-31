import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as CommonAxios from "../CommonAxios";
import { Link, useNavigate } from "react-router-dom";
import "./menu.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import EmailLogin from "./../../pages/EmailLogin";

function LeftMenu2(){

    const { user } = useSelector(({ user }) => ({
        user: user.user,
    }));
    const [modal, setModal] = useState(false);


    return(
        <div className="leftWrap">
            <ul>
                <li>
                    <Link to="/" className="left_menu_1">
                        <span>홈</span>
                    </Link>
                </li>
                <li>
                    <Link to="/goodstype" className="left_menu_3">
                        <span>물품관리</span>
                    </Link>
                </li>
                <li>
                    <Link to="/article" className="left_menu_3">
                        <span>자산관리</span>
                    </Link>
                </li>
                
            </ul>
        </div>
    )
}

export default LeftMenu2;