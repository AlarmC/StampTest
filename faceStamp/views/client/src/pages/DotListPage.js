import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import DotList from "./../components/dotcanvas/DotList"
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const DotListPage = () => {
    
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
            <DotList />
        </>
    )
}

export default DotListPage;