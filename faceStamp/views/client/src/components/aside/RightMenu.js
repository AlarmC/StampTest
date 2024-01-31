import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as CommonAxios from "../CommonAxios";
import { Link, useNavigate } from "react-router-dom";
import home from "./../../assets/images/icon_home.png";
import "./menu.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

function RightMenu(){

    return(
        <div className="rightWrap">
            <ul>
                <li className="accum_amount">
                    <h5>누적 발전량 / 발전효율</h5>
                    <div>
                        <div className="accum_energy">
                            <p>누적 발전량</p>
                            <p>367.39MWh</p>
                        </div>
                        <div className="accum_co2">
                            <p>누적 Co2저감량</p>
                            <p>168.782 ton</p>
                        </div>
                    </div>
                </li>
                <li className="equip_state">
                    <h5>장비 연결 상태</h5>
                    <div className="inverter">
                        <div>
                            <p>인버터</p>
                            <div>
                                <div>
                                    <img src={home} />
                                    <p>다스인버터</p>
                                </div>
                                <div>
                                    <img src={home} />
                                    <p>헥스인버터</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="env_sensor">
                        <div>
                            <p>환경센서</p>
                            <div>
                                <div>
                                    <img src={home} />
                                    <p>환경센서</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="acs_panel">
                        <div>
                            <p>접속반</p>
                            <div>
                                <div>
                                    <img src={home} />
                                    <p>접속반</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
                <li className="acs_panel_state">
                    <h5>접속반 채널 상태</h5>
                    <div className="acs_panel_ch">
                        <div>
                            <p>접속반 채널</p>
                            <div>
                                <div>
                                    <img src={home} />
                                    <p>1CH</p>
                                </div>
                                <div>
                                    <img src={home} />
                                    <p>1CH</p>
                                </div>
                                <div>
                                    <img src={home} />
                                    <p>1CH</p>
                                </div>
                                <div>
                                    <img src={home} />
                                    <p>1CH</p>
                                </div>
                                <div>
                                    <img src={home} />
                                    <p>1CH</p>
                                </div>
                                <div>
                                    <img src={home} />
                                    <p>1CH</p>
                                </div>
                                <div>
                                    <img src={home} />
                                    <p>1CH</p>
                                </div>
                                <div>
                                    <img src={home} />
                                    <p>1CH</p>
                                </div>
                                <div>
                                    <img src={home} />
                                    <p>1CH</p>
                                </div>
                                <div>
                                    <img src={home} />
                                    <p>1CH</p>
                                </div>
                                <div>
                                    <img src={home} />
                                    <p>1CH</p>
                                </div>
                                {/* <div>
                                    <img src={home} />
                                    <p>1CH</p>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    )
}

export default RightMenu;