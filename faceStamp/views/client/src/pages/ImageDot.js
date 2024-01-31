import React, { useRef, useEffect, useState, useCallback } from 'react'
// import Menu from '../components/aside/Menu';
import DotCanvas from '../components/dotcanvas/DotCanvas';
// import CustomCanvas from '../components/dotcanvas/Custom/CustomCanvas';
import CustomCanvas from '../components/dotcanvas/CustomCanvas';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ConvertImage from '../components/dotcanvas/ConvertImage';
import HalfTone from '../components/dotcanvas/HalfTone';
import DotTest from '../components/dotcanvas/DotTest';
import DotTest2 from '../components/dotcanvas/DotTest2';
import "./../styles/canvas.css";
import "./../styles/dot.css";

function ImageDot() {

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

    const [selectType, setSelectType] = useState(null);

    useEffect(() => {
        if(type == "quick"){
            setSelectType("quick");
        } else {
            setSelectType("custom");
        }
    }, [type])

    return (
        <div className='flex-wrap'>
            {selectType && selectType == "quick" ?
                <DotCanvas />
                :
                <CustomCanvas user={user} dotinfo={dotinfo} />
            }
        </div>
    );
}

export default ImageDot;