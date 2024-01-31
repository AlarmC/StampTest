import React, { useRef, useEffect, useState, useCallback } from 'react'
import { RiImageAddLine } from 'react-icons/ri'
import { FaStamp } from 'react-icons/fa'
import { LuPipette } from 'react-icons/lu'
import { MdEditDocument } from 'react-icons/md'

const ConvertImage = () => {

    const [selectedImage, setSelectedImage] = useState(null);
    const [imgWidth, setImgWidth] = useState(470);
    const [imgHeight, setImgHeight] = useState(470);
    const canvasRef = useRef(null);
    const inputRef = useRef(null);

    const handleDivClick = () => {
        inputRef.current.click();
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            const imageDataURL = reader.result;
            setSelectedImage(imageDataURL);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (selectedImage) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = new Image();

            // img.onload = () => {
            //     // 이미지 길이, 높이
            //     const cw = canvas.width = img.width*4;
            //     const ch = canvas.height = img.height*4;

            //     ctx.drawImage(img, 0, 0);

            //     const data = ctx.getImageData(0, 0, cw, ch);
            //     ctx.clearRect(0, 0, cw, ch);
            //     console.log(data.data);
            //     const particles = [];
            //     for (let y = 0, y2 = data.height; y < y2; y++) {
            //         for (let x = 0, x2 = data.width; x < x2; x++) {
            //             if (data.data[(x * 4 + y * 4 * data.width) + 2] < 255 && data.data[(x * 4 + y * 4 * data.width) + 1] < 255 && data.data[(x * 4 + y * 4 * data.width)] < 255) {
            //                 const particle = {
            //                     x : x,
            //                     y : y,
            //                     // color : "hsl("+(x*3.6)+",50%,50%)"
            //                     color: "rgb("+data.data[(x * 4 + y * 4 * data.width)] + "," + data.data[(x * 4 + y * 4 * data.width) +1] + "," + data.data[(x * 4 + y * 4 * data.width) +2] + ")",
            //                 };
            //                 particles.push(particle);
            //             }
            //         }
            //     }
            //     console.log(particles);
                
            //     ctx.beginPath();
            //     const PI2 = Math.PI * 2;

            //     for(let i=0, j=particles.length;i<j;i++){
            //         const particle = particles[i];
            //         // ctx.arc(particle.x, particle.y, 1, 0, PI2);
            //         ctx.fillStyle = particle.color;
            //         // ctx.closePath();
            //         ctx.fillRect(particle.x*4, particle.y*4, 3, 3);
            //     }
                

            // };

            img.onload = () => {
                // 이미지 길이, 높이
                const cw = canvas.width = img.width;
                const ch = canvas.height = img.height;


                ctx.fillStyle = 'white'; // 배경색
                ctx.fillRect(0, 0, cw, ch);

                ctx.globalCompositeOperation = 'destination-out';
                // 원형 (radius : 1, 2, 3)
                ctx.beginPath();
                const radius = 1;   // 원의 반지름
                const spacer = 3;   // 간격
                const diameter = radius * 2;
                const PI2 = Math.PI * 2;
                // // 기본 버전
                // for (let y = radius; y < ch; y += diameter + spacer) {
                //     for (let x = radius; x < cw; x += diameter + spacer) {
                //         ctx.arc(x, y, radius, 0, PI2);
                //         ctx.closePath();
                //     }
                // }

                // 점 추가 버전
                let i = 0;
                for (let y = radius; y < ch; y += (diameter + spacer)/2) {
                    if(i%2 === 0){
                        for (let x = radius; x < cw; x += diameter + spacer) {
                            ctx.arc(x, y, radius, 0, PI2);
                            ctx.closePath();
                        }
                    } else {
                        for (let x = diameter+spacer/2; x < cw; x += diameter + spacer) {
                            ctx.arc(x, y, radius, 0, PI2);
                            ctx.closePath();
                        }
                    }

                    i++;
                }

                ctx.fill();

                ctx.globalCompositeOperation = 'destination-atop';
                ctx.drawImage(img, 0, 0);
                ctx.globalCompositing='source-over';

            };

            img.src = selectedImage;
        }
    }, [selectedImage]);


    return (
        <>
            <div className='dot_left_menu'>
                <hr></hr>
                <span>미리보기</span>
                <hr></hr>
                <span>도장 편집하기</span>
                <div className='dot_btn_area'>
                    <div className='dot_btn_div' onClick={handleDivClick}>
                        <div className='dot_menu_btn' style={{background: "rgb(35,172,160)"}}>
                            <RiImageAddLine size="60" color="white" />
                            <input style={{display:"none"}} type="file" ref={inputRef} accept="image/*" onChange={handleImageUpload} />
                        </div>
                        <div style={{color:"rgb(35,172,160)"}}>이미지 업로드</div>
                    </div>
                    <div className='dot_btn_div'>
                        <div className='dot_menu_btn'>
                            <MdEditDocument size="60" color="black" />
                        </div>
                        <div>글자 편집</div>
                    </div>
                    <div className='dot_btn_div' onClick={handleDivClick}>
                        <div className='dot_menu_btn' style={{background: "red"}}>
                            <FaStamp size="60" color="white" />
                        </div>
                        <div style={{color:"red"}}>페이스도장 변환</div>
                    </div>
                    <div className='dot_btn_div' onClick={handleDivClick}>
                        <div className='dot_menu_btn'>
                            <LuPipette size="60" color="black" />
                        </div>
                        <div>배경색 변경</div>
                    </div>
                </div>
            </div>
            <div className='stamp_area'>
                <div className='stamp_div'>
                    {selectedImage && (
                        <canvas ref={canvasRef} style={{ filter: 'grayscale(1)' }} />
                    )}
                </div>
            </div>
        </>
    );


    

}

export default ConvertImage;