import React, { useRef, useEffect, useState, useCallback } from 'react'
import "./halftone.css";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

const DotTest3 = ({img, startPrint}) => {

    const { dotinfo } = useSelector(({ dotinfo }) => ({
        dotinfo: dotinfo.dotinfo,
    }));

    const [loadImage, setLoadImage ] = useState(null);

    const [compImage, setCompImage] = useState(null);

    useEffect(() => {
        setLoadImage(img);
    }, [])

    const HalfDivTop = styled.div`
    filter: grayscale(100%);
    `;
    const HalfDiv = styled.div`
    overflow: hidden;
    filter: contrast(1.2);
    width: 450px;
    height: 450px;

    background: url(${img}),radial-gradient(circle, #000, #fff) 0 0 /${3.5}px ${3.5}px space;

    background-blend-mode: hard-light;
    position: relative;


    &:after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background:url(${img});
    filter: blur(1px) brightness(3);
    mix-blend-mode: multiply;
    content: "";
    } 
    }
    `;


    return(
        <>
            <HalfDivTop>
                <section>
                    <HalfDiv></HalfDiv>
                </section>
            </HalfDivTop>
        </>
    )
}

export default DotTest3;