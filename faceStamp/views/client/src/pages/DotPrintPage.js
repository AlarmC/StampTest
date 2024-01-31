import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import DotListPrint from "./../components/dotcanvas/DotListPrint"
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const DotPrintPage = () => {
    
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
            <DotListPrint />
        </>
    )
}

export default DotPrintPage;