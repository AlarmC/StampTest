import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
// import "./../styles/test.scss";
import '@9am/img-halftone';
import DotTest2 from '../components/dotcanvas/DotTest2';

const TestPage = () => {

    const [loadImage, setLoadImage] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            const imageDataURL = reader.result;
            setLoadImage(imageDataURL);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    return(
        <div className='canvas' style={{height:"500px"}}>
            <input type="file" onChange={handleFileChange} accept="image/*" />
            {loadImage &&
            <>
                <DotTest2  img={loadImage} startPrint={false} />
                {/* <img src={loadImage} /> */}
                {/* <img-halftone src={loadImage} style={{filter:"grayscale(1)"}} cellsize="4"></img-halftone> */}
            </>
            }
        </div>
    )

}

export default TestPage;