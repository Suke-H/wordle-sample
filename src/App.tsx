import { useState, useEffect } from "react";
import axios from "axios";

import { Answer } from "./components/answer";
import { Keyboard } from "./components/keyboard";
import { Notes } from "./components/notes";

export const App = (): JSX.Element => {
  // 6*5の配列の初期化
  const initAnswerList: string[][] = new Array(6);
  for (let i = 0; i < 6; i++) {
    initAnswerList[i] = new Array(5).fill("");
  }

  // 回答一覧
  // キーボードの文字入力により更新
  const [answerList, setAnswerList] = useState<string[][]>(initAnswerList);

  // 回答の判定を行うフラグ
  // キーボードのEnter入力により更新
  const [judge, setJudge] = useState<boolean>(false);

  // 現在の状態
  // playing: ゲーム中
  // success: 成功
  // fail: 失敗
  const [gameStatus, setGameStatus] = useState<string>("playing");

  // 正解単語
  const [correctAnswer, setCorrectAnswer] = useState<string>("");
  // const [todays_no, setTodaysNo] = useState<number>(0);

  const getTodaysWord = async () => {
    const { data } = await axios.post('https://es5eaffo90.execute-api.ap-southeast-2.amazonaws.com/WORDLE', {});
    if (data.todays_word === undefined) {
      return;
    }
    setCorrectAnswer(data.todays_word);
    // setTodaysNo(data.todays_no);
    console.log(data);
  };

  // 初回レンダリング時にのみ実行
  useEffect(() => {
      getTodaysWord();
  }, []);


  return (
    <div className="App" style={appStyle}>
      <Answer
        answerList={answerList}
        judge={judge}
        setJudge={setJudge}
        correctAnswer={correctAnswer}
        gameStatus={gameStatus}
        setGameStatus={setGameStatus}
      />
      <Keyboard answerList={answerList} setAnswerList={setAnswerList} setJudge={setJudge} />
      <Notes />
    </div>
  );
};

const appStyle: React.CSSProperties = {
  margin: "0 auto",
  width: "100%",
  maxWidth: "600px", // 最大幅を指定する
};
