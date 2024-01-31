import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import DotSize from "../components/dotcanvas/DotSize";
import DotStyle from "../components/dotcanvas/DotStyle";
import DotInfo from '../components/dotcanvas/DotInfo';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { insert_dotinfo } from "./../modules/dotInfo";
import { encrypt } from "../lib/api/tokenCrypto";

const DotSettingPage = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, dotinfo } = useSelector(({ user, dotinfo }) => ({
        user: user.user,
        dotinfo: dotinfo.dotinfo,
    }));

    useEffect(() => {
        if(user == null){
            navigate("/dotlogin");
        }
    }, [])
    
    const { type } = useParams();

    const [selectType, setSelectType] = useState(null);     // 선택할 사이즈 or 스타일 or 입력정보 타입

    useEffect(() => {
        if(type == "quick"){
            setSelectType("size");
            let data = {
                size: "",
                style: "",
            }
            dispatch(insert_dotinfo(data))
        } else if (type == "custom"){
            setSelectType("size");
            let data = {
                size: "",
                style: "",
            }
            dispatch(insert_dotinfo(data))
        } else if (type.indexOf("style") != -1) {
            setSelectType("style");
            let result = type.split("_");
            let data = {
                size: result[1],
                style: "",
            }
            dispatch(insert_dotinfo(data))
            localStorage.setItem("dotInfo", encrypt(data, "dotInfo"));
        } else {
            setSelectType("info");
            let result = type.split("_");
            let data = {
                size: dotinfo.size,
                style: result[1],
                name: "이름란",
                num1: "010",
                num2: "1234",
                num3: "5678",
                number: "010-1234-5678",
                cont: "내용입니다"
            }
            dispatch(insert_dotinfo(data))
            localStorage.setItem("dotInfo", encrypt(data, "dotInfo"));
        }
    }, [type])

    useEffect(() => { }, [selectType])

    return (
        <>
            {selectType && selectType == "size" ?
                <DotSize type={type} />
                :
                (selectType && selectType == "style" ?
                    <DotStyle type={type} />
                    :
                    <DotInfo />
                )
            }
        </>
    )
}

export default DotSettingPage;