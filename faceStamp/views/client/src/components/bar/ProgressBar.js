import React, { useState, useEffect } from 'react';
import "./progress.css"

const ProgressBar = ({ value, min, max, setValue, type }) => {
    const [nowValue, setNowValue] = useState(0);

    useEffect(() => {
        if(value != undefined){
            if(type != "weight"){
                let data = ((value - min) / (max - min)) * 100;
                setNowValue(data);
            } else {
                let data = (value / (max - min)) * 100;
                setNowValue(data);
            }
        }
    }, [value])
    
    const handleBarClick = (e) => {
        const element = e.currentTarget;
        const ew = element.offsetWidth;
        const clickX = e.clientX - element.getBoundingClientRect().left;
        const leftPer = (clickX / ew) * 100 ;
        if(type != "weight"){
            let sendData = (parseInt(leftPer) / 10 ) + 5;
            setValue([type, sendData]);
        } else {
            let sendData = (parseInt(leftPer) / 10 );
            setValue([type, sendData]);
        }
    }

    // const handleDragStart = (e) => {
    //     e.dataTransfer.setData('text/plain', e.target.id);
    // };

    // const handleDragOver = (e) => {
    //     e.preventDefault();
    // };

    // const handleDrop = (e) => {
    //     e.preventDefault();
    //     const newValue = parseInt(e.dataTransfer.getData('text/plain'), 10);
    //     setNowValue(newValue);
    // };

    // const handleDrag = (e) => {
    //     const newValue = Math.floor((e.clientX / window.innerWidth) * 100);
    //     setNowValue(newValue);
    // };

    return (
        <div className="progress-bar" onClick={handleBarClick}>
            <div
                className="progress-bar-fill"
                style={{ width: `${nowValue}%` }}
                draggable="true"
                id={nowValue}
                // onDragStart={handleDragStart}
                // onDragOver={handleDragOver}
                // onDrop={handleDrop}
                // onDrag={handleDrag}
            />
            <button style={{left:`${nowValue}%`}} />
        </div>
    );
};

export default ProgressBar;