import React, { useEffect, useRef, useContext, useState } from 'react';
import "../stylesheets/styles.css";
import BaseImage from '../components/BaseImage';
import { UserContext } from '../components/BaseShot';
import { getAudioPath, prePathUrl, setExtraVolume } from "../components/CommonFunctions";

let currentMaskNum = 0;
const Scene = React.forwardRef(({ nextFunc, _baseGeo, loadFunc, _startTransition, bgLoaded }, ref) => {

    const audioList = useContext(UserContext)

    const baseObject = useRef();
    const blackWhiteObject = useRef();
    const colorObject = useRef();
    const currentImage = useRef()

    const [isSceneLoad, setSceneLoad] = useState(false)

    const audioNameList = [
        // '02', 
        '03', '04', '05',
        '06', '08', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20'
    ]

    const maskTransformList = [
        // { x: 0.1, y: 0.1, s: 1.2 },
        { x: 0.3, y: 0.05, s: 1.6 },
        { x: 0.35, y: 0.2, s: 2 },
        { x: 0.0, y: 0.1, s: 1.2 },
        { x: 0.0, y: 0.1, s: 1.2 },
        { x: 1.1, y: -0.4, s: 3.2 },
        { x: 0.7, y: -0.35, s: 3.4 },
        { x: -0.8, y: -0.8, s: 2.6 }, //7
        { x: 0.65, y: -0.43, s: 2.4 },
        { x: 0.2, y: -0.43, s: 2.4 },
        { x: 0.55, y: -0.7, s: 2.4 },
        { x: 0.05, y: -0.8, s: 2.6 },
        { x: -0.2, y: -0.4, s: 2.6 },
        { x: -0.4, y: -0.5, s: 2.8 },
        { x: -0.4, y: 0.05, s: 1.8 },
        { x: -0.3, y: 0.5, s: 3.2 },
        { x: -0.0, y: -0.25, s: 3.2 },
    ]

    const marginList = [
        // { l: 0.33, t: 0.65 },
        { l: 0.4, t: 0.65 },
        { l: 0.45, t: 0.42 },
        { l: 0.4, t: 0.52 },
        { l: 0.7, t: 0.42 },
        { l: 0.45, t: 0.72 },
        { l: 0.55, t: 0.72 },
        { l: 0.88, t: 0.75 }, //7
        { l: 0.45, t: 0.72 },
        { l: 0.6, t: 0.75 },
        { l: 0.45, t: 0.85 },
        { l: 0.65, t: 0.95 },
        { l: 0.75, t: 0.75 },
        { l: 0.75, t: 0.75 },
        { l: 0.85, t: 0.65 },
        { l: 0.75, t: 0.55 },
        { l: 0.69, t: 0.729 },
    ]

    const transitionList = [
        1.4, 1.4, 1.4, 1.4, 2.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4,
    ]

    function showIndividualImage() {

        baseObject.current.style.transition = transitionList[currentMaskNum] + 's'

        baseObject.current.style.transform =
            'translate(' + maskTransformList[currentMaskNum].x * 100 + '%,' + maskTransformList[currentMaskNum].y * 100 + '%) ' +
            'scale(' + maskTransformList[currentMaskNum].s + ') '

        setTimeout(() => {
            blackWhiteObject.current.className = 'show'
            colorObject.current.className = 'hide'
            setTimeout(() => {
                currentImage.current.style.transform =
                    "translate(" + _baseGeo.width * maskTransformList[currentMaskNum].s * (0.02 -
                        0.03 * marginList[currentMaskNum].l) / 2 + "px,"
                    + _baseGeo.height * maskTransformList[currentMaskNum].s * (0.02
                        - 0.03 * marginList[currentMaskNum].t) / 2 + "px)"
                    + "scale(1.03) "

                let timeDuration = audioList.bodyAudio1.duration * 1000
                audioList.bodyAudio1.play().catch(error => { });

                if (currentMaskNum == 0) {
                    setTimeout(() => {
                        currentImage.current.style.transform = "scale(1)"
                        setTimeout(() => {
                            colorObject.current.className = 'show'
                        }, 300);

                        setTimeout(() => {
                            blackWhiteObject.current.style.WebkitMaskImage = 'url("' + prePathUrl() + 'images/intro/window.png")'
                        }, 500);
                        let subPosInfo = { x: 0.35, y: 0.2, s: 1.8 } //have to mend......
                        let subMargin = { l: 0.45, t: 0.42 }
                        setTimeout(() => {
                            blackWhiteObject.current.className = 'show'
                            colorObject.current.className = 'hide'

                            setTimeout(() => {
                                currentImage.current.style.transform =
                                    "translate(" + _baseGeo.width * subPosInfo.s * (0.02 -
                                        0.03 * subMargin.l) / 2 + "px,"
                                    + _baseGeo.height * subPosInfo.s * (0.02
                                        - 0.03 * subMargin.t) / 2 + "px)"
                                    + "scale(1.03) "
                            }, 1000);
                        }, 1000);
                    }, 2000);
                }

                setTimeout(() => {
                    if (currentMaskNum < maskTransformList.length - 1)
                        audioList.bodyAudio1.src = getAudioPath('intro', audioNameList[currentMaskNum + 1])
                    setTimeout(() => {
                        currentImage.current.style.transform = "scale(1)"

                        setTimeout(() => {
                            colorObject.current.className = 'show'
                        }, 300);

                        setTimeout(() => {
                            if (currentMaskNum == maskTransformList.length - 1) {
                                // if (currentMaskNum == 0) {
                                baseObject.current.style.transform =
                                    'translate(' + 0 + '%,' + 0 + '%) ' +
                                    'scale(' + 1 + ') '

                                baseObject.current.style.transition = '2s'

                                setTimeout(() => {
                                    _startTransition(3)
                                    setTimeout(() => {
                                        audioList.wooAudio.play().catch(error => { });
                                        nextFunc()
                                    }, 300);
                                }, 3000);
                            }
                            else {
                                currentMaskNum++;

                                blackWhiteObject.current.style.WebkitMaskImage = 'url("' + prePathUrl() + 'images/intro/intro0' + (currentMaskNum + 4) + '.png")'
                                blackWhiteObject.current.className = 'hide'
                                setTimeout(() => {
                                    showIndividualImage()
                                }, 2000);
                            }
                        }, 500);
                    }, 2000);
                }, timeDuration);
            }, 1000);
        }, transitionList[currentMaskNum] * 1000 + 200);
    }

    React.useImperativeHandle(ref, () => ({
        sceneLoad: () => {
            setSceneLoad(true)
        },
        sceneStart: () => {
            audioList.bodyAudio1.src = getAudioPath('intro', '01');
            audioList.bodyAudio2.src = getAudioPath('intro', '02');


            blackWhiteObject.current.style.transition = "0.5s"
            currentImage.current.style.transition = '0.5s'

            baseObject.current.className = 'aniObject'

            setExtraVolume(audioList.bodyAudio1, 3)
            setExtraVolume(audioList.bodyAudio2, 3)
            setExtraVolume(audioList.bodyAudio3, 3)
            
            setTimeout(() => {

                audioList.bodyAudio1.play().catch(error => { })
                setTimeout(() => {
                    audioList.bodyAudio2.play()
                    audioList.bodyAudio1.src = getAudioPath('intro', '03')
                    setTimeout(() => {
                        showIndividualImage()
                    }, audioList.bodyAudio2.duration * 1000 + 1000);
                }, audioList.bodyAudio2.duration * 1000 + 1000);
                loadFunc();

            }, 2000);
        },
        sceneEnd: () => {
            currentMaskNum = 0;
            setSceneLoad(false)
        }
    }))

    return (
        <div>
            {
                isSceneLoad &&
                <div ref={baseObject}
                    className='hideObject'
                    style={{
                        position: "fixed", width: _baseGeo.width + "px"
                        , height: _baseGeo.height + "px",
                        left: _baseGeo.left + 'px',
                        top: _baseGeo.top + 'px',
                    }}
                >
                    <div
                        style={{
                            position: "absolute", width: '100%'
                            , height: '100%',
                            left: '0%',
                            top: '0%'
                        }} >
                        <img
                            width={'100%'}
                            style={{
                                position: 'absolute',
                                left: '0%',
                                top: '0%',

                            }}
                            onLoad={bgLoaded}
                            src={prePathUrl() + "images/intro/intro01.png"}
                        />
                    </div>

                    <div
                        ref={blackWhiteObject}
                        style={{
                            position: "absolute", width: '100%'
                            , height: '100%',
                            left: '0%',
                            top: '0%',
                            WebkitMaskImage: 'url("' + prePathUrl() + 'images/intro/intro0' + (currentMaskNum + 4) + '.png")',
                            WebkitMaskSize: '100% 100%',
                            WebkitMaskRepeat: "no-repeat"
                        }} >

                        <img
                            ref={currentImage}
                            width={'100%'}
                            style={{
                                position: 'absolute',
                                left: '0%',
                                top: '0%',
                            }}
                            src={prePathUrl() + "images/intro/intro.png"}
                        />

                    </div>


                    <div
                        ref={colorObject}
                        style={{
                            position: "absolute", width: '100%'
                            , height: '100%',
                            left: '0%',
                            top: '0%',
                        }} >
                        <img
                            width={'100%'}
                            style={{
                                position: 'absolute',
                                left: '0%',
                                top: '0%',
                            }}
                            src={prePathUrl() + "images/intro/intro.png"}

                        />
                    </div>


                </div>
            }
        </div>
    );
});

export default Scene;
