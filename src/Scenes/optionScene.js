import React, { useEffect, useRef, useContext, useState } from 'react';
import "../stylesheets/styles.css";
import BaseImage from '../components/BaseImage';
import { UserContext } from '../components/BaseShot';
import { getAudioPath, prePathUrl, setPrimaryAudio, setRepeatAudio, setRepeatType, startRepeatAudio, stopRepeatAudio } from "../components/CommonFunctions";

let randomList = []
let answerList = []

let optionList = [0, 1, 0, 1]
let optionType = 0;

const iconMovePosList = [
    [
        { left: "11%", top: '49%' },
        { left: "42.3%", top: '49%' },
        { left: "74%", top: '49%' }
    ],
    [
        { left: "11%", top: '44%' },
        { left: "44%", top: '44%' },
    ]
]


const posInfoList = {
    icon: [
        { sPos: 0.022, wGap: 0.25 },
        { sPos: 0.12, wGap: 0.3 },
    ],
    base: [
        { sPos: 0.07, wGap: 0.28 },
        { sPos: 0.20, wGap: 0.32 },
    ],
    text: [
        { sPos: 0.1, wGap: 0.28 },
        { sPos: 0.23, wGap: 0.32 },
    ],
    clickDev: [
        { sPos: 16, wGap: 25.5 },
        { sPos: 26, wGap: 31 },
    ]
}

let doneList = []
let correctNum = 0


const optionLetterList = [
    'Q1_01A', 'Q1_02A', 'Q1_03A'
]

const iconList = [
    'Q1_01', 'Q1_02', 'Q1_03'
]

let timerList = []
const Scene = React.forwardRef(({ nextFunc, clickedFunc, _geo }, ref) => {

    const audioList = useContext(UserContext)
    const parentObject = useRef();

    const iconRefList = [useRef(), useRef(), useRef()]
    const clickRefList = [useRef(), useRef(), useRef()]
    const baseRefList = [useRef(), useRef(), useRef()]
    const imgRefList = [useRef(), useRef(), useRef()]

    const [stepCount, setStepCount] = useState(0)
    const wordPath = ['24', '25', '26']


    useEffect(() => {
        return () => {
            randomList = []
            answerList = []
            doneList = []
            optionType = 0;
            correctNum = 0
        }
    }, [])

    React.useImperativeHandle(ref, () => ({
        startScene: () => {
            audioList.bodyAudio1.src = getAudioPath('questions/Q1', '22')
            audioList.bodyAudio2.src = getAudioPath('questions/Q1', wordPath[answerList[0]])

            setPrimaryAudio(audioList.bodyAudio2)
            setRepeatAudio(audioList.commonAudio1)
            setRepeatType(1)

            timerList[0] = setTimeout(() => {
                audioList.bodyAudio1.play();

                timerList[1] = setTimeout(() => {
                    audioList.bodyAudio2.play();
                    timerList[2] = setTimeout(() => {
                        audioList.commonAudio1.play();
                        startRepeatAudio()
                    }, audioList.bodyAudio2.duration * 1000 + 300);

                }, audioList.bodyAudio1.duration * 1000 + 600);
            }, 2000);
        }
    }))

    const clickFunc = (num) => {
        stopRepeatAudio()
        timerList.map(timer => clearTimeout(timer))

        audioList.bodyAudio2.pause();
        audioList.bodyAudio1.pause();

        audioList.bodyAudio2.currentTime = 0;
        audioList.bodyAudio1.currentTime = 0;

        iconRefList[num].current.setStyle({
            transition: '0.5s',
            transform: 'scale(0.7)'
        })

        setTimeout(() => {
            iconRefList[num].current.setStyle({
                transform: 'scale(1)'
            })
            setTimeout(() => {
                judgeFunc(num)
            }, 150);
        }, 100);
    }

    const fomartFunc = () => {
        setTimeout(() => {
            parentObject.current.className = 'disapear'
            nextFunc()
        }, 1000);
    }

    const getRandomList = () => {

        randomList = []
        answerList = []

        let needLength = optionType == 0 ? 3 : 2;


        while (randomList.length != needLength) {
            let randomNumber = Math.floor(Math.random() * 3);
            if (!doneList.includes(randomNumber)) {
                randomList.push(randomNumber)
                doneList.push(randomNumber)
            }

        }
        while (answerList.length != needLength) {
            let randomNumber = Math.floor(Math.random() * needLength);
            if (!answerList.includes(randomNumber)) {
                answerList.push(randomNumber)
            }
        }


    }

    const judgeFunc = (num) => {
        if (randomList[num] == answerList[correctNum]) {
            parentObject.current.style.pointerEvents = 'none'
            //correct function...
            clickRefList[num].current.style.pointerEvents = 'none'
            iconRefList[num].current.setStyle({
                transition: '0.8s', ...iconMovePosList[optionType][correctNum]
            })
            correctNum++

            if (correctNum < randomList.length) {
                audioList.bodyAudio2.src = getAudioPath('questions/Q1', wordPath[answerList[correctNum]])
                timerList[1] = setTimeout(() => {
                    audioList.bodyAudio2.play();
                    timerList[2] = setTimeout(() => {
                        // audioList.commonAudio1.play()
                    }, audioList.bodyAudio2.duration * 1000 + 300);
                }, 2000);

                setTimeout(() => {
                    parentObject.current.style.pointerEvents = ''
                    imgRefList[correctNum].current.setClass('appear')
                }, 1500);
            }
            if (correctNum == answerList.length) {
                audioList.clapAudio.play();
                setTimeout(() => {
                    clickedFunc(1)

                }, 1000);

                setTimeout(() => {
                    fomartFunc()
                }, 5500);
            }
            else {
                audioList.tingAudio.currentTime = 0
                audioList.tingAudio.play();
                startRepeatAudio();


            }
        }
        else {
            //wrong function...
            audioList.buzzAudio.currentTime = 0;
            audioList.buzzAudio.play();
            setTimeout(() => {
                clickedFunc(0)
            }, 500);
            timerList[1] = setTimeout(() => {
                audioList.bodyAudio2.currentTime = 0;
                audioList.bodyAudio2.play();
            }, 1000);

            startRepeatAudio();
        }

    }

    if (answerList.length == 0)
        getRandomList()

    return (
        <div ref={parentObject}
            style={{
                position: "fixed", width: _geo.width + "px"
                , height: _geo.height + "px",
                left: _geo.left + 'px',
                top: _geo.top + 'px',
            }}
        >

            {
                randomList.map((value, index) =>
                    <BaseImage
                        ref={imgRefList[index]}
                        key={index}

                        scale={0.2}
                        posInfo={{
                            l: 0.08 + 0.32 * index
                            , t: 0.75
                        }}
                        style={{ transform: 'scale(0.9)' }}
                        className={index == 0 ? '' : 'hideObject'}
                        url={"Questions/Q1/" + optionLetterList[answerList[index]] + ".png"}
                    />)}


            {/* icons... */}
            {
                randomList.map((value, index) =>
                    <BaseImage
                        key={index}
                        ref={iconRefList[index]}
                        scale={0.16}
                        posInfo={{
                            l: 0.11 + 0.3 * index
                            , t: 0.17
                        }}
                        url={"Questions/Q1/" + iconList[randomList[index]] + ".png"}
                    />)
            }

            {
                randomList.map((value, index) =>
                    <div
                        ref={clickRefList[index]}
                        key={index}
                        onClick={() => { clickFunc(index) }}
                        style={{
                            position: 'absolute',
                            left: (11
                                + 30 * index) + '%',
                            top: 17 + '%',
                            width: 16 + '%',
                            height: 29 + '%',
                            cursor: 'pointer',
                            borderRadius: '50%',
                        }}>
                    </div>
                )
            }
        </div >
    );
});

export default Scene;
