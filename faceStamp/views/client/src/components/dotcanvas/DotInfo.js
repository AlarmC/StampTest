import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from "react-router-dom";
import styles from "./../../styles/dot.module.css";
import { useDispatch, useSelector } from "react-redux";
import { insert_dotinfo } from "./../../modules/dotInfo";
import { encrypt } from "./../../lib/api/tokenCrypto"

const DotInfo = () => {

    const dispatch = useDispatch();

    const { dotinfo } = useSelector(({ dotinfo }) => ({
        dotinfo: dotinfo.dotinfo,
    }));

    const [nameValue, setNameValue] = useState("");
    const [num1Value, setNum1Value] = useState("");
    const [num2Value, setNum2Value] = useState("");
    const [num3Value, setNum3Value] = useState("");
    const [contentValue, setContentValue] = useState("");

    useEffect(() => {
        if(dotinfo != null){
        }
    }, [dotinfo])

    const navigate = useNavigate();


    const linkClick = () => {
        let data = {
            size: dotinfo.size,
            style: dotinfo.style,
            name: nameValue == "" ? "이름란" : nameValue,
            num1: num1Value == "" ? "010" : num1Value,
            num2: num2Value == "" ? "1234" : num2Value,
            num3: num3Value == "" ? "5678" : num3Value,
            cont: contentValue == "" ? "내용입니다" : contentValue
        }
        data.number = data.num1 + "-" + data.num2 + "-" + data.num3;
        dispatch(insert_dotinfo(data))
        localStorage.setItem("dotInfo", encrypt(data, "dotInfo"));
        navigate("/dot/quick")
    }

    const nameChange = (e) => {
        let data = e.target.value;
        setNameValue(data);
    }
    const no1Change = (e) => {
        let data = e.target.value;
        if (/^[0-9]*$/.test(data)) {
            setNum1Value(data);
        }
    }
    const no2Change = (e) => {
        let data = e.target.value;
        if (/^[0-9]*$/.test(data)) {
            setNum2Value(data);
        }
    }
    const no3Change = (e) => {
        let data = e.target.value;
        if (/^[0-9]*$/.test(data)) {
            setNum3Value(data);
        }
    }
    const contentChange = (e) => {
        let data = e.target.value;
        setContentValue(data);
    }

    return(
        <div className={styles.setting_container}>
            <div className={styles.dot_header}>
                <div className={styles.dot_header_title}>
                    <span>빠른제작 {">"} 기본정보 입력</span>
                </div>
                <div className={styles.dot_header_contents}>도장에 들어갈 기본정보를 입력해주세요.</div>
            </div>
            <div className={styles.dot_contents}>
                <div className={styles.dots_info_div}>
                    {dotinfo && dotinfo.style == "A" ?
                        <div>
                            <div>이름</div>
                            <input type="text" value={nameValue} style={{width: "256px"}} onChange={(e) => nameChange(e)} />
                            <p></p>
                            <div>연락처</div>
                            <input type="text" value={num1Value} onChange={(e) => no1Change(e)}/>
                            <input type="text" value={num2Value} onChange={(e) => no2Change(e)}/>
                            <input type="text" value={num3Value} onChange={(e) => no3Change(e)}/>
                        </div>
                    :
                    (dotinfo.style == "D" ?
                        <div>
                            <div>이름</div>
                            <input type="text" value={nameValue} style={{width: "256px"}} onChange={(e) => nameChange(e)} />
                            <p></p>
                            <div>내용</div>
                            <input type="text" value={contentValue} style={{width: "256px"}} onChange={(e) => contentChange(e)}/>
                        </div>
                    :
                        <div>
                            <div>이름</div>
                            <input type="text" value={nameValue} style={{width: "256px"}} onChange={(e) => nameChange(e)} />
                            <p></p>
                            <div>연락처</div>
                            <input type="text" value={num1Value} onChange={(e) => no1Change(e)}/>
                            <input type="text" value={num2Value} onChange={(e) => no2Change(e)}/>
                            <input type="text" value={num3Value} onChange={(e) => no3Change(e)}/>
                        </div>    
                    )
                    }
                </div>
                <div className={styles.dots_info_div}>
                    <div>
                        <span>※ 빠른제작 편집모드에서도 도장내용을 입력 할 수 있습니다.</span>
                        <span>직접 입력을 원할 경우 다음 단계 버튼을 클릭해 주세요.</span>
                    </div>
                </div>
            </div>
            <div className={styles.dots_btn_area}>
                <Link to={"/dotset/style_" + dotinfo.size}>
                    <button>이전 단계</button>
                </Link>
                <button onClick={() => linkClick()}>다음 단계</button>
            </div>
        </div>
    )
}

export default DotInfo;