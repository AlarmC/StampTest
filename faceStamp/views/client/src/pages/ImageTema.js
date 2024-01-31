import React, { useRef, useEffect, useState, useCallback } from 'react'
// import Menu from '../components/aside/Menu';
import DotCanvas from '../components/dotcanvas/DotCanvas';
import CustomCanvas from '../components/dotcanvas/CustomCanvas';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ConvertImage from '../components/dotcanvas/ConvertImage';
import HalfTone from '../components/dotcanvas/HalfTone';
import DotTest from '../components/dotcanvas/DotTest';
import DotTest2 from '../components/dotcanvas/DotTest2';
import EduCanvas from '../components/dotcanvas/Tema/EduCanvas';
import PraiseCanvas from '../components/dotcanvas/Tema/PraiseCanvas';
import WeddingCanvas from '../components/dotcanvas/Tema/WeddingCanvas';
import MusicCanvas from '../components/dotcanvas/Tema/MusicCanvas';
import ARCanvas from '../components/dotcanvas/Tema/ARCanvas';
import "./../styles/canvas.css";
import "./../styles/dot.css";

function ImageTema() {

    const { type } = useParams();

    const [selectType, setSelectType] = useState(null);

    useEffect(() => {
    }, [type])

    return (
        <div className='flex-wrap'>
            {type == "edu" && <EduCanvas />}
            {type == "praise" && <PraiseCanvas />}
            {type == "wedding" && <WeddingCanvas />}
            {type == "music" && <MusicCanvas />}
            {type == "ar" && <ARCanvas />}
        </div>
    );
}

export default ImageTema;