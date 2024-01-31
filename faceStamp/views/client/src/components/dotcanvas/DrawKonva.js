import React, { useRef, useEffect, useState, useCallback } from 'react'
import Konva from 'konva';
import { Stage, Layer, Transformer, Text, Image, Line, Rect, TextPath } from 'react-konva';

const DrawKonva = ({mode, color, linesDelete, lineWeight}) => {

    useEffect(() => {
        if(mode){
            console.log(mode);
            if(mode == "draw"){
                setTool('Pen');
            } else if(mode == "erase"){
                setTool('eraser')
            }
            setLineColor(color)
        }
    }, [mode, color, lineWeight])

    const [tool, setTool] = useState('');
    const [lineColor, setLineColor] = useState('black');
    const [lines, setLines] = useState([]);
    const isDrawing = React.useRef(false);

    const handleMouseDown = (e) => {
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        setLines([...lines, { tool, color: lineColor, strokeWidth: lineWeight+4, points: [pos.x, pos.y+32] }]);
    };

    const handleMouseMove = (e) => {
        // no drawing - skipping
        if (!isDrawing.current) {
        return;
        }
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        let lastLine = lines[lines.length - 1];
        // add point
        lastLine.points = lastLine.points.concat([point.x, point.y+32]);

        // replace last
        lines.splice(lines.length - 1, 1, lastLine);
        setLines(lines.concat());
    };

    const handleMouseUp = () => {
        isDrawing.current = false;
    };

    useEffect(() => {
    }, [lines, tool])

    useEffect(() => {
        if(linesDelete > 0){
            setLines((prevLines) => prevLines.slice(0, -1));
        }
    }, [linesDelete])
    
  
    return (
        <>
            <Stage width={450} height={450}  onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
                <Layer>
                {lines.map((line, i) => (
                    <Line
                        key={i}
                        points={line.points}
                        stroke={line.color}
                        strokeWidth={line.strokeWidth}
                        tension={0.5}
                        lineCap="round"
                        lineJoin="round"
                        globalCompositeOperation={
                            line.tool === 'eraser' ? 'destination-out' : 'source-over'
                        }
                    />
                ))}
                </Layer>
            </Stage>
        </>
    );
}

export default DrawKonva;