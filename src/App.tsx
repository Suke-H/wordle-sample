import { useState, useEffect } from "react";
import axios from "axios";

import { Answer } from "./components/answer";
import { Keyboard } from "./components/keyboard";
import { Notes } from "./components/notes";
import { ShareResultButton } from "./components/ShareResultButton";

export const App = (): JSX.Element => {
  // 6*5の配列の初期化
  const initAnswerList: string[][] = new Array(6);
  for (let i = 0; i < 6; i++) {
    initAnswerList[i] = new Array(5).fill("");
  }

  // 回答一覧
  // キーボードの文字入力により更新
  const [answerList, setAnswerList] = useState<string[][]>(initAnswerList);

  // リストの初期化
  const initMatchList: string[][] = new Array(6);
  for (let i = 0; i < 6; i++) {
    initMatchList[i] = new Array(5).fill("White");
  }

  // 回答欄のCSSリスト
  // White: 判定していない
  // Black: 文字も位置も無一致
  // Yellow: 文字のみ一致
  // Green: 文字も位置も一致
  const [ matchList, setMatchList ] = useState<string[][]>(initMatchList);

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
  const [todays_no, setTodaysNo] = useState<number>(0);

  const getTodaysWord = async () => {
    const { data } = await axios.post('https://es5eaffo90.execute-api.ap-southeast-2.amazonaws.com/WORDLE', {});
    if (data.todays_word === undefined) {
      return;
    }
    setCorrectAnswer(data.todays_word);
    setTodaysNo(data.todays_no);
    console.log(data);
  };

  // 初回レンダリング時にのみ実行
  useEffect(() => {
      getTodaysWord();
  }, []);

  const convertAnswerMatchToEmojis = (matchList: string[][]): string => {
    const emojiList = matchList.map((row) => {
      return row.map((match) => {
        if (match === "Black") {
          return "⬛";
        } else if (match === "Yellow") {
          return "🟨";
        } else if (match === "Green") {
          return "🟩";
        } else {
          return "";
        }
      }).join(""); // 各行の絵文字を結合
    }).filter(row => row.length > 0); // 空の行を除外
    return emojiList.join("\n"); // 空でない行のみを改行で結合
    
  }

  const makeResultText = () => {
      const hashtag = "#MyWordleProject_" + todays_no;
      const emojis = convertAnswerMatchToEmojis(matchList);
      const notes = "*An unofficial Wordle learning project.";
      const url = "https://kakutory.com/game_pages/MyWordleProject"
      
      return hashtag + "\n" + emojis + "\n\n" + notes + "\n" + url;
  }

  return (
    <div className="App" style={appStyle}>
      <Answer
        answerList={answerList}
        matchList={matchList}
        setMatchList={setMatchList}
        judge={judge}
        setJudge={setJudge}
        correctAnswer={correctAnswer}
        gameStatus={gameStatus}
        setGameStatus={setGameStatus}
      />
      <Keyboard 
        answerList={answerList} 
        setAnswerList={setAnswerList} 
        setJudge={setJudge} 
      />
      <ShareResultButton 
        resultText={makeResultText()}
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
