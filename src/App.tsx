import { useState, useEffect } from "react";

import { Answer } from "./components/answer";
import { Keyboard } from "./components/keyboard";
import { Notes } from "./components/notes";
import { ShareResultButton } from "./components/ShareResultButton";

import { pushedEnterProcess } from "./game_logics/pushedEnterProcess";
import { getTodaysWord } from "./utils/getTodaysWord";
import { makeGameResultText } from "./utils/makeGameResultText";

export const App = (): JSX.Element => {

  // （リスト初期化）
  const initAnswerList: string[][] = new Array(6);
  for (let i = 0; i < 6; i++) {
    initAnswerList[i] = new Array(5).fill("");
  }
  /* 回答欄の文字列 */
  const [answerList, setAnswerList] = useState<string[][]>(initAnswerList);

  /* 回答欄のマッチ状況 */
  // White: 判定していない
  // Black: 文字も位置も無一致
  // Yellow: 文字のみ一致
  // Green: 文字も位置も一致
  const initMatchList: string[][] = new Array(6);
  for (let i = 0; i < 6; i++) {
    initMatchList[i] = new Array(5).fill("White");
  }
  const [ matchList, setMatchList ] = useState<string[][]>(initMatchList);

  /* 回答の判定を行うフラグ */
  // キーボードのEnter入力により更新
  const [judge, setJudge] = useState<boolean>(false);

  /* 正解単語 */
  const [correctAnswer, setCorrectAnswer] = useState<string>("");
  /* 今日が何回目のゲームか */
  const [todaysNo, setTodaysNo] = useState<number>(0);

  /* ラウンド（=現在の行番号+1）*/
  const [round, setRound] = useState<number>(0);
  const [columncnt, setColumncnt] = useState(0);

  // 初回レンダリング時
   useEffect(() => {
    // 本日の単語を取得
    getTodaysWord(setCorrectAnswer, setTodaysNo);
    // ラウンドを1に設定
    setRound(round + 1);
  }, []);

  // Enterを押した際
  useEffect(() => {
      if (!judge) return;

      pushedEnterProcess(correctAnswer, answerList, matchList,round,setMatchList)
          .then((isValid) => {
                /* 単語が妥当でない場合 */
                if (!isValid) {
                alert("データセットに存在しない単語です");
                // 回答欄を1行リセット
                setAnswerList((prevState) =>
                  prevState.map((row, index) =>
                    index === round - 1 ? Array(5).fill("") : row
                  )
                );
                setColumncnt(0);
                } 

                /* 問題ない場合 */
                else {
                  // 次の行へ移行
                  setRound(round + 1);
                  setColumncnt(0);
                }
            });

      setJudge(false);

  }, [judge]);

  return (
    <div className="App" style={appStyle}>
      <Answer
        answerList={answerList}
        matchList={matchList}
      />
      <Keyboard 
        round={round}
        setRound={setRound}
        columncnt={columncnt}
        setColumncnt={setColumncnt}
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
