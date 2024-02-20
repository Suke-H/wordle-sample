import { useState, useEffect } from "react";

import { Answer } from "./components/answer";
import { Keyboard } from "./components/keyboard";
import { Notes } from "./components/notes";
import { ShareResultButton } from "./components/ShareResultButton";

import { pushedEnterProcess } from "./game_logics/pushedEnterProcess";
import { getTodaysWord } from "./utils/getTodaysWord";
import { makeGameResultText } from "./utils/makeGameResultText";

export const App = (): JSX.Element => {
  
  // 回答欄の文字列
  const initAnswerList: string[][] = new Array(6);
  for (let i = 0; i < 6; i++) {
    initAnswerList[i] = new Array(5).fill("");
  }
  const [answerList, setAnswerList] = useState<string[][]>(initAnswerList);

  // 回答欄のマッチ状況
  // White: 判定していない
  // Black: 文字も位置も無一致
  // Yellow: 文字のみ一致
  // Green: 文字も位置も一致
  const initMatchList: string[][] = new Array(6);
  for (let i = 0; i < 6; i++) {
    initMatchList[i] = new Array(5).fill("White");
  }
  const [ matchList, setMatchList ] = useState<string[][]>(initMatchList);

  // 回答の判定を行うフラグ
  // キーボードのEnter入力により更新
  const [judge, setJudge] = useState<boolean>(false);

  // 正解単語
  const [correctAnswer, setCorrectAnswer] = useState<string>("");
  // 今日が何回目のゲームか
  const [todaysNo, setTodaysNo] = useState<number>(0);

  // ラウンド（=現在の行番号+1）
  const [round, setRound] = useState<number>(0);

  // 初回レンダリング時にのみ実行
   useEffect(() => {
    getTodaysWord(setCorrectAnswer, setTodaysNo);
    setRound(round + 1);
  }, []);

  // Enterを押した際
  useEffect(() => {
    pushedEnterProcess(
      judge, 
      setJudge,
      correctAnswer,
      answerList,
      matchList,
      round,
      setRound,
      setMatchList
    );
  }, [judge]);

  return (
    <div className="App" style={appStyle}>
      <Answer
        answerList={answerList}
        matchList={matchList}
      />
      <Keyboard 
        answerList={answerList} 
        setAnswerList={setAnswerList} 
        setJudge={setJudge} 
      />
      <ShareResultButton 
        resultText={makeGameResultText(matchList, todaysNo)}
      />
      <Notes />
    </div>
  );
};

const appStyle: React.CSSProperties = {
  margin: "0 auto",
  width: "100%",
  maxWidth: "600px", // 最大幅を指定する
};
