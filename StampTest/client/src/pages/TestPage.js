import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import DotTest2 from './DotTest2';

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
            </>
            }
        </div>
    )

}

export default TestPage;