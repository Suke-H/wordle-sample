import { useState } from 'react';

import { Answer } from './components/answer';
import { Keyboard } from './components/keyboard';
import { Notes } from './components/notes';

export const App = (): JSX.Element =>{
    // 6*5の配列の初期化
    const initAnswerList: string[][] = new Array(6);
    for (let i=0; i<6; i++){
        initAnswerList[i] = new Array(5).fill("");
    }

    // 回答一覧
    // キーボードの文字入力により更新
    const [ answerList, setAnswerList ] = useState<string[][]>(initAnswerList);

    // 回答の判定を行うフラグ
    // キーボードのEnter入力により更新
    const [ judge, setJudge ] = useState<boolean>(false);

    // 現在の状態
    // playing: ゲーム中
    // success: 成功
    // fail: 失敗
    const [ gameStatus, setGameStatus ] = useState<string>("playing");

    // 正解単語
    const [ answerWord ] = useState<string>("SUPER");

    return (
        <div className="App">

            <Answer 
                answerList={answerList}
                judge={judge}
                setJudge={setJudge}
                answerWord={answerWord}
                gameStatus={gameStatus}
                setGameStatus={setGameStatus}
            />
            <Keyboard 
                setAnswerList={setAnswerList}
                setJudge={setJudge}
            />
            <Notes/>

        </div>
    );
}
