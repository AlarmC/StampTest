import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import style from "./../styles/temp.module.css";
import map from "./../assets/images/map_02.jpg"
import camera from "./../assets/images/temp_camera.png"
import camera1 from "./../assets/images/camera_1.png"
import CustomSubTable from '../components/CustomSubTable';
import {GoPlay} from 'react-icons/go';
import {IoMdClose} from 'react-icons/io';

const TempPage = () => {

    const [tvTitle, setTvTitle] = useState("미원교");
    const [tvBool, setTvBool] = useState(false);

    let data = [
        {river_name: "무심천", observatory: "인차교", watch: "5.0", alert : "6.0", present: "1.16-" , flood: "" },
        {river_name: "무심천", observatory: "고은교", watch: "5.0", alert : "6.0", present: "1.08-" , flood: "" },
        {river_name: "무심천", observatory: "장평교", watch: "8.5", alert : "11.0", present: "0.69-" , flood: "" },
        {river_name: "무심천", observatory: "수영교", watch: "9.0", alert : "11.0", present: "0.76-" , flood: "" },
        // {river_name: "무심천", observatory: "청남교", watch: "", alert : "", present: "" , flood: "" },
        // {river_name: "무심천", observatory: "추정교", watch: "", alert : "", present: "" , flood: "" },
        {river_name: "무심천", observatory: "제2운천교", watch: "7.5", alert : "9.0", present: "2.81-" , flood: "" },
        {river_name: "가경천", observatory: "가경1교", watch: "7.0", alert : "8.0", present: "1.03-" , flood: "" },
        {river_name: "가경천", observatory: "하복대교", watch: "3.5", alert : "4.5", present: "0.50-" , flood: "" },
        {river_name: "발산천", observatory: "발산교", watch: "4.0", alert : "4.5", present: "1.49-" , flood: "" },
        {river_name: "율량천", observatory: "덕성교", watch: "7.0", alert : "8.0", present: "0.72-" , flood: "" },
        {river_name: "미원천", observatory: "미원교", watch: "4.0", alert : "5.0", present: "0.93-" , flood: "" },
        {river_name: "미원천", observatory: "성대2교", watch: "6.0", alert : "7.5", present: "0.41-" , flood: "" },
        {river_name: "감천", observatory: "운암교", watch: "3.0", alert : "4.0", present: "0.56-" , flood: "" },
    ]

    const columns = useMemo(() => [
        {
          Header: "하 천",
          accessor: "river_name",
        },
        {
            Header: "관측소",
            accessor: "observatory",
        },
        {
            Header: "주의보[m]",
            accessor: "watch",
        },
        {
            Header: "경보[m]",
            accessor: "alert",
        },
        {
            Header: "현재[m]",
            accessor: "present",
        },
        {
            Header: "홍수특보사항",
            accessor: "flood",
        },
    ]);

    const chgTitle = (data) => {
        setTvTitle(data);
        setTvBool(true);
    }

    return(
        <>
            <div className={style.temp_wrap}>
                <div className={style.temp_flex}>
                    <div className={style.temp_area1}>
                        <img src={camera} />
                        <ul>
                            <li onClick={() => chgTitle("미원교")} style={tvTitle == "미원교" ? {color:"white", background:"rgb(67,121,221)"} : null}><span>미원교</span><GoPlay color={tvTitle == "미원교" ? "black" : "blue"} size={20} /></li>
                            <li onClick={() => chgTitle("고은교")} style={tvTitle == "고은교" ? {color:"white", background:"rgb(67,121,221)"} : null}><span>고은교</span><GoPlay color={tvTitle == "고은교" ? "black" : "blue"} size={20} /></li>
                            <li onClick={() => chgTitle("장평교")} style={tvTitle == "장평교" ? {color:"white", background:"rgb(67,121,221)"} : null}><span>장평교</span><GoPlay color={tvTitle == "장평교" ? "black" : "blue"} size={20} /></li>
                            <li onClick={() => chgTitle("대농교")} style={tvTitle == "대농교" ? {color:"white", background:"rgb(67,121,221)"} : null}><span>대농교</span><GoPlay color={tvTitle == "대농교" ? "black" : "blue"} size={20} /></li>
                            <li onClick={() => chgTitle("조천교")} style={tvTitle == "조천교" ? {color:"white", background:"rgb(67,121,221)"} : null}><span>조천교</span><GoPlay color={tvTitle == "조천교" ? "black" : "blue"} size={20} /></li>
                            <li onClick={() => chgTitle("까치교")} style={tvTitle == "까치교" ? {color:"white", background:"rgb(67,121,221)"} : null}><span>까치교</span><GoPlay color={tvTitle == "까치교" ? "black" : "blue"} size={20} /></li>
                            <li onClick={() => chgTitle("제2운천교")} style={tvTitle == "제2운천교" ? {color:"white", background:"rgb(67,121,221)"} : null}><span>제2운천교</span><GoPlay color={tvTitle == "제2운천교" ? "black" : "blue"} size={20} /></li>
                            <li onClick={() => chgTitle("수영교")} style={tvTitle == "수영교" ? {color:"white", background:"rgb(67,121,221)"} : null}><span>수영교</span><GoPlay color={tvTitle == "수영교" ? "black" : "blue"} size={20} /></li>
                            <li onClick={() => chgTitle("하복대교")} style={tvTitle == "하복대교" ? {color:"white", background:"rgb(67,121,221)"} : null}><span>하복대교</span><GoPlay color={tvTitle == "하복대교" ? "black" : "blue"} size={20} /></li>
                            <li onClick={() => chgTitle("발산교")} style={tvTitle == "발산교" ? {color:"white", background:"rgb(67,121,221)"} : null}><span>발산교</span><GoPlay color={tvTitle == "발산교" ? "black" : "blue"} size={20} /></li>
                        </ul>
                        {tvBool &&
                        <div className={style.camera_area}>
                            <div className={style.camera_header}>
                                <h3>{tvTitle}</h3>
                                <div style={{textAlign : "center", cursor:"pointer"}} onClick={() => setTvBool(false)}>
                                    <IoMdClose size={25} />
                                </div>
                            </div>
                            <div style ={{height: "430px", textAlign: "center", marginTop:"20px"}}>
                                <img src={camera1} />
                            </div>
                        </div>
                        }
                    </div>
                    <div className={style.temp_area2}>
                        <div className={style.temp_info_header}>
                            <div className={style.temp_info_hd_title}>청주시 하천 관측시설 현황</div>
                            <div className={style.temp_info_btn_area}>
                                <button>홍수특보</button>
                                <button style={{borderLeft: "1px solid white", borderRight: "1px solid white"}}>갈수예보</button>
                                <button>강우레이더</button>
                            </div>
                        </div>
                        <div className={style.temp_river_info}>
                            <img src={map} />
                            <div>
                                <div className={style.temp_river_header}>관측시간:2023-08-29 10:00</div>
                                <CustomSubTable columns={columns} data={data} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TempPage;