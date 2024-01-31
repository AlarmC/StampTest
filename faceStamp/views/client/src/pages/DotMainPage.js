import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import DotMain from "./../components/dotcanvas/DotMain"
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const DotMainPage = () => {
    
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

    return (
        <>
            <DotMain />
        </>
    )
}

export default DotMainPage;