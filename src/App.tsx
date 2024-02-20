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

  // ラウンド
  const [round, setRound] = useState<number>(0);

  // 単語の妥当性判定
  const wordValidityJudgement = async () => {
    const { data } = await axios.post('https://yan5p8s0dg.execute-api.ap-southeast-2.amazonaws.com/WORDLE', 
      {"word": answerList[round - 1].join("")},);
    console.log(data);
    if (data.isValid === undefined) {
      return false;
    }

    return data.isValid;
  }

  // 単語一致判定
  const wordMatchJudgement = (): string[][] => {
    // 一度ディープコピーする
    const tmpMatchList = Array.from(matchList);

    // 1文字ずつ判定
    for (let i = 0; i < 5; i++) {
      // 文字が一致
      if (correctAnswer.indexOf(answerList[round - 1][i]) !== -1) {
        // 位置も一致(Green)
        if (answerList[round - 1][i] === correctAnswer[i]) {
          tmpMatchList[round - 1][i] = "Green";
        }

        // 文字だけ一致(Yellow)
        else {
          tmpMatchList[round - 1][i] = "Yellow";
        }
      }

      // 文字も位置も一致していない(Black)
      else {
        tmpMatchList[round - 1][i] = "Black";
      }
    }
    return tmpMatchList;
  };

  // クリア判定
  const clearJudgement = () => {
    // 正解が空文字だった場合はサーバーエラー
    if (correctAnswer === ""){
        alert("Server Error: Please reload the page.");
        return;
    }

    // ワードを抽出
    const wordList = [];
    for (let j = 0; j < 5; j++) {
      wordList.push(answerList[round - 1][j]);
    }
    const submitWord = wordList.join("");

    if (submitWord == correctAnswer) {
      alert("clear!!");
    } else if (round == 6) {
      alert(correctAnswer);
    }

  };

  // Appコンポーネントのjudgeが変化した時に呼ばれる
  useEffect(() => {

    const checkProcess = async () => {

      // Enterを押したら
      if (judge === true) {

        // 単語の妥当性判定
        const isValid = await wordValidityJudgement();
        if (!isValid)
        {
          alert("データセットに存在しない単語です");
          return;
        }

        // 一度フラグをおろす
        setJudge(false);
      }

      // フラグをおろしてからここへ
      else {
        // コンポーネント初期化時にここを通る
        if (round == 0) {
          setRound(round + 1); // ラウンドを1に
          return;
        }
          // 単語一致判定
          const tmpMatchList = wordMatchJudgement();
          // クリア判定
          clearJudgement();
          // スタイル更新
          // setMatchStyleList(tmpMatchStyleList);
          setMatchList(tmpMatchList);
          // ラウンド更新
          setRound(round + 1);
      }
    }

    checkProcess();

  }, [judge]);

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
