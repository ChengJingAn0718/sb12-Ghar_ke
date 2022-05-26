import React, { useState, useEffect, useRef, useContext } from 'react';
import "../stylesheets/styles.css";
import BaseImage from '../components/BaseImage';
import { UserContext } from '../components/BaseShot';
import { getAudioPath, setExtraVolume, setPrimaryAudio, setRepeatType } from "../components/CommonFunctions"
import { prePathUrl } from "../components/CommonFunctions";
import OptionScene from "./optionScene"
import { setRepeatAudio, startRepeatAudio, stopRepeatAudio } from "../components/CommonFunctions"

let timerList = []
let stepCount = 0;
const audioNameList = [
    ['27', '28'],
    ['29', '30'],
    ['31', '32'],
    ['35', '36'],
    ['39', '40'],
    ['41', '42'],
    ['45', '46'],
    ['47', '48'],

]
const Scene = React.forwardRef(({ nextFunc, _baseGeo, _geo, loadFunc }, ref) => {
    const audioList = useContext(UserContext)
    const [isSecondShow, setSecondShow] = useState(false)
    const [isSceneLoad, setSceneLoad] = useState(false)

    const firstPartRef = useRef()
    const secondPartRef = useRef();
    const parentRef = useRef()

    const blackWhiteObject = useRef();
    const firstBGRef = useRef();
    const buttonRefs = useRef()
    const starRefs = Array.from({ length: 9 }, ref => useRef())

    const aniImageList = Array.from({ length: 4 }, ref => useRef())
    const optionRef = useRef()

    React.useImperativeHandle(ref, () => ({
        sceneLoad: () => {
            setSceneLoad(true)
        },
        sceneStart: () => {
            parentRef.current.className = 'aniObject'
            optionRef.current.startScene()
        },
        sceneEnd: () => {
            setSceneLoad(false)
            stepCount = 0;
        }

    }))


    const playZoomAnimation = () => {
        let imageNum = 0;
        blackWhiteObject.current.className = 'hideMask'
        firstBGRef.current.setClass('hideObject')

        aniImageList[0].current.setClass('showObject')


        let imageShowInterval = setInterval(() => {
            aniImageList[imageNum].current.setClass('hideObject')
            imageNum++
            aniImageList[imageNum].current.setClass('showobject')
            if (imageNum == 3) {
                clearInterval(imageShowInterval)
                setTimeout(() => {
                    showControlFunc()
                }, 500);
            }
        }, 150);
    }

    const showControlFunc = () => {

        blackWhiteObject.current.style.WebkitMaskImage = 'url("' + prePathUrl() + 'images/Questions/q' + (stepCount + 3) + '/mask.png")'
        firstBGRef.current.setUrl('Questions/q' + (stepCount + 3) + '/q0.png');

        aniImageList.map((image, index) => {
            if (index < 3)
                image.current.setUrl('Questions/q' + (stepCount + 3) + '/q' + (index + 1) + '.png')
        })

        buttonRefs.current.className = 'appear'

        if (stepCount == 0)
            audioList.commonAudio2.play();
        startRepeatAudio()
    }

    const returnBackground = () => {
        firstBGRef.current.setClass('show')
        buttonRefs.current.className = 'hideObject'
        aniImageList[3].current.setClass('hide')
        blackWhiteObject.current.className = 'show halfOpacity'
        setTimeout(() => {
            aniImageList[3].current.setUrl('Questions/q' + (stepCount + 2) + '/q4.png')
        }, 400);

        if (stepCount < audioNameList.length) {
            audioList.bodyAudio1.src = getAudioPath('questions/Q' + (stepCount + 2),
                audioNameList[stepCount][0]) //question
        }

        timerList[3] = setTimeout(() => {
            audioList.bodyAudio1.play().catch(error => { });

            setTimeout(() => {
                playZoomAnimation();

            }, audioList.bodyAudio1.duration * 1000 + 2000);
        }, 3500);

    }

    const clickAnswer = () => {
        //play answer..

        stopRepeatAudio()

        clearTimeout(timerList[3])
        clearTimeout(timerList[5])
        audioList.bodyAudio3.pause();

        audioList.bodyAudio2.play().catch(error => { });
        buttonRefs.current.style.pointerEvents = 'none'

        setTimeout(() => {
            audioList.successAudio.play().catch(error => { })
            starRefs[stepCount + 1].current.setClass('show')
            stepCount++

            if (stepCount < audioNameList.length) {
                audioList.bodyAudio2.src = getAudioPath('questions/Q' + (stepCount + 2), audioNameList[stepCount][1]) //answer
            }

            setTimeout(() => {
                audioList.successAudio.pause();
                audioList.successAudio.currentTime = 0;

                if (stepCount < 8) { //8
                    returnBackground();
                    buttonRefs.current.style.pointerEvents = ''
                }
                else {

                    loadFunc()
                    setTimeout(() => {
                        nextFunc()
                    }, 2000);
                }
            }, 4000);

        }, audioList.bodyAudio2.duration * 1000);
    }


    const clickedFunc = (num) => {
        if (num == 1) //right option
        {
            starRefs[stepCount].current.setClass('show')
            stepCount++
        }
        else {
            audioList.buzzAudio.play();
        }
        setSecondShow(true)
    }


    const startSecondPart = () => {
        firstPartRef.current.className = 'disapear'

        stepCount = 0

        setRepeatAudio(audioList.commonAudio2)
        setPrimaryAudio(audioList.bodyAudio1)

        setTimeout(() => {
            secondPartRef.current.className = 'aniObject'
            blackWhiteObject.current.className = 'show halfOpacity'

            aniImageList.map(image => {
                image.current.setClass('hideObject')
            })

            buttonRefs.current.className = 'hideObject'

            timerList[3] = setTimeout(() => {

                audioList.bodyAudio1.play().catch(error => { });

                setTimeout(() => {
                    playZoomAnimation();
                }, audioList.bodyAudio1.duration * 1000 + 1000);
            }, 2000);

        }, 500);

        audioList.bodyAudio1.src = getAudioPath('questions/Q' + (stepCount + 2), audioNameList[stepCount][0]) //question
        audioList.bodyAudio2.src = getAudioPath('questions/Q' + (stepCount + 2), audioNameList[stepCount][1])  //answer
    }


    return (

        <div>
            {isSceneLoad &&
                <div
                    ref={parentRef}
                    className='hideObject'>
                    <div
                        style={{
                            position: "fixed", width: _baseGeo.width + "px"
                            , height: _baseGeo.height + "px",
                            left: _baseGeo.left + 'px',
                            top: _baseGeo.top + 'px',
                            pointerEvents: 'none'
                        }}
                    >
                        <BaseImage
                            url={'bg/green_bg.png'}
                        />

                        {
                            Array.from(Array(9).keys()).map(value =>
                                <div
                                    style={{
                                        position: "fixed", width: _geo.width * 0.05 + "px",
                                        right: _geo.width * (value * 0.042 + 0.01) + 'px'
                                        , top: 0.02 * _geo.height + 'px'
                                        , cursor: "pointer",
                                    }}>
                                    <BaseImage
                                        url={'Icon/SB13_Progress_Bar_Gray.png'}
                                    />
                                    <BaseImage
                                        ref={starRefs[8 - value]}
                                        url={'Icon/SB13_Progress_Bar.png'}
                                        className='hideObject'
                                    />
                                </div>)
                        }
                    </div>

                    {setSecondShow &&
                        <div
                            ref={secondPartRef}
                            className='hideObject'
                            style={{
                                position: "fixed", width: _baseGeo.width + "px"
                                , height: _baseGeo.height + "px",
                                left: _baseGeo.left + 'px',
                                top: _baseGeo.top + 'px',
                            }}
                        >


                            <BaseImage
                                ref={firstBGRef}
                                url={"Questions/q2/q0.png"}
                            />

                            <div
                                ref={blackWhiteObject}
                                className="halfOpacity"
                                style={{
                                    position: "absolute", width: '100%'
                                    , height: '100%',
                                    left: '0%',
                                    top: '0%',
                                    WebkitMaskImage: 'url(' + prePathUrl() + 'images/Questions/q2/mask.png)',
                                    WebkitMaskSize: '100% 100%',
                                    WebkitMaskRepeat: "no-repeat",
                                    background: 'black',

                                }} >

                            </div>

                            {
                                [1, 2, 3].map(value =>
                                    <BaseImage
                                        ref={aniImageList[value - 1]}
                                        scale={1}
                                        posInfo={{ l: 0, t: 0 }}
                                        url={"Questions/q2/q" + value + ".png"}
                                    />
                                )
                            }

                            <div
                                style={{
                                    position: "fixed", width: _geo.width * 1.3 + "px",
                                    height: _geo.height + "px",
                                    left: _geo.left - _geo.width * 0.15 + 'px'
                                    , top: _geo.top - _geo.height * 0.19 + 'px'
                                }}>
                                <BaseImage
                                    ref={aniImageList[3]}
                                    url={"Questions/q2/q4.png"}
                                />
                            </div>



                            <div ref={buttonRefs}>
                                <div
                                    className='commonButton'
                                    onClick={clickAnswer}
                                    style={{
                                        position: "fixed", width: _geo.width * 0.1 + "px",
                                        height: _geo.width * 0.1 + "px",
                                        left: _geo.left + _geo.width * 0.445
                                        , top: _geo.top + _geo.height * 0.72
                                        , cursor: "pointer",
                                        borderRadius: '50%',
                                        overflow: 'hidden',

                                    }}>
                                    <img

                                        width={"370%"}
                                        style={{
                                            position: 'absolute',
                                            left: '-230%',
                                            top: '-32%'
                                        }}
                                        draggable={false}
                                        src={prePathUrl() + 'images/buttons/Answer_Button.svg'}
                                    />
                                </div>
                            </div>
                        </div>
                    }
                    <div
                        ref={firstPartRef}
                    >
                        <OptionScene
                            ref={optionRef}
                            clickedFunc={clickedFunc}
                            nextFunc={startSecondPart}
                            _baseGeo={_baseGeo}
                            _geo={_geo} />

                    </div>


                </div>

            }


        </div>
    );
});

export default Scene;
