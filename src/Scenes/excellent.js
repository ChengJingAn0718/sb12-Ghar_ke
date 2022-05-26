import React, { useContext, useRef, useEffect } from 'react';
import "../stylesheets/styles.css";
import { UserContext } from "../components/BaseShot"
import {  getAudioPath } from "../components/CommonFunctions"
import { prePathUrl } from "../components/CommonFunctions";

let timerList = []

export default function Scene({ nextFunc, _geo, _baseGeo }) {

    const audioList = useContext(UserContext)
    const replayBtn = useRef()
    useEffect(() => {

        audioList.bodyAudio1.src = getAudioPath('common', 'excellent')
        timerList[0] = setTimeout(() => {

            audioList.bodyAudio1.play();

            timerList[3] = setTimeout(() => {
                audioList.clapAudio.pause();
                audioList.clapAudio.currentTime = 0;

                audioList.yeahAudio.pause();
                audioList.yeahAudio.currentTime = 0;

                audioList.clapAudio.play().catch(error => { }).catch(error => { })
                audioList.yeahAudio.play().catch(error => { }).catch(error => { })

                replayBtn.current.className = 'aniObject'

                timerList[1] = setTimeout(() => {
                    audioList.backAudio.volume = 0.05;

                    audioList.replayAudio.play().catch(error => { });

                    timerList[2] = setTimeout(() => {
                        audioList.backAudio.volume = 0.15;


                    }, audioList.replayAudio.duration * 1000);
                }, 5000);
            }, audioList.bodyAudio1.duration * 1000 - 500);

        }, 1500);



        return () => {

            timerList.map(timer => {
                clearTimeout(timer)
            })

            audioList.bodyAudio1.pause();
            audioList.replayAudio.pause();

            audioList.clapAudio.pause();
            audioList.yeahAudio.pause();

            audioList.clapAudio.currentTime = 0;
            audioList.yeahAudio.currentTime = 0;
            audioList.replayAudio.currentTime = 0;

            audioList.backAudio.volume = 0.15;

        }
    }, [])

    return (
        <div className='aniObject'>
            < div className="excellentText" style={{
                position: "fixed",
                width: _baseGeo.width * 1 + "px",
                height: _baseGeo.height + 'px',
                left: _baseGeo.left + "px",
                top: _baseGeo.top + "px",

            }}>
                <img width={"100%"}
                    src={prePathUrl() + "images/bg/spakle.png"}
                />
            </div>

            < div className="aniObject" style={{
                position: "fixed",
                width: _baseGeo.width * 1 + "px",
                height: _baseGeo.height + 'px',
                left: _baseGeo.left + "px",
                top: _baseGeo.top + "px",

            }}>
                <img width={"100%"}
                    src={prePathUrl() + "images/bg/excellent.png"}
                />
            </div>

            <div ref={replayBtn}
                className='hideObject'
            >
                <div
                    className='commonButton'
                    onClick={() => {
                        setTimeout(() => {
                            nextFunc()
                        }, 200);
                    }}
                    style={{
                        position: "fixed", width: _geo.width * 0.1 + "px",
                        height: _geo.width * 0.1 + "px",
                        left: _geo.left + _geo.width * 0.45
                        , top: _geo.top + _geo.height * 0.8
                        , cursor: "pointer",
                    }}>
                    <img

                        width={"100%"}
                        draggable={false}
                        src={prePathUrl() + 'images/buttons/replay_blue.svg'}
                    />
                </div>
            </div>
        </div>
    );
}