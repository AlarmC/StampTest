import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import DotTema from '../components/dotcanvas/DotTema';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { insert_dotinfo } from "./../modules/dotInfo";
import { encrypt } from "../lib/api/tokenCrypto";

const DotSettingTema = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector(({ user }) => ({
        user: user.user,
    }));

    useEffect(() => {
        if(user == null){
            navigate("/dotlogin");
        }
    }, [])
    
    const { type } = useParams();

    const [selectType, setSelectType] = useState(null);     // 선택할 사이즈 or 스타일 or 입력정보 타입

    useEffect(() => {
        console.log(type);
    }, [type])

    useEffect(() => { }, [selectType])

    return (
        <>
            <DotTema />
        </>
    )
}

export default DotSettingTema;