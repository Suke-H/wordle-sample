import React, { useState, useEffect } from "react";
import axios from "axios";

type Props = {
  answerList: string[][];
  judge: boolean;
  setJudge: React.Dispatch<React.SetStateAction<boolean>>;
  correctAnswer: string;
  gameStatus: string;
  setGameStatus: React.Dispatch<React.SetStateAction<string>>;
};

export const Answer = (props: Props) => {
  // 回答のCSSスタイル
  const answerStyle: React.CSSProperties = {
    borderSpacing: "6px 6px",
    display: "flex",
    justifyContent: "center",
    marginBottom: "40px",
    marginTop: "100px",
  };

  /* td要素のCSSスタイル */
  // Whiteスタイル
  const whiteTdStyle: React.CSSProperties = {
    border: "2px solid rgb(217, 217, 217)",
    width: "60px",
    height: "70px",

    fontSize: "30px",
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: "60px",

    // 文字色
    color: "Black", // 背景色Whiteの時のみ

    // 背景色
    backgroundColor: "White",
  };

  // Blackスタイル
  const blackTdStyle = { ...whiteTdStyle };
  blackTdStyle["color"] = "White";
  blackTdStyle["backgroundColor"] = "3a3a3c";

  // Yellowスタイル
  const yellowTdStyle = { ...whiteTdStyle };
  yellowTdStyle["color"] = "White";
  yellowTdStyle["backgroundColor"] = "b59f3b";

  // Greenスタイル
  const greenTdStyle = { ...whiteTdStyle };
  greenTdStyle["color"] = "White";
  greenTdStyle["backgroundColor"] = "538d4e";

  // ラウンド
  const [round, setRound] = useState<number>(0);

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
  // const [ matchList, setMatchList ] = useState<string[][]>(initMatchList);

  // リストの初期化
  const initMatchStyleList: React.CSSProperties[][] = new Array(6);
  for (let i = 0; i < 6; i++) {
    initMatchStyleList[i] = new Array(5).fill(whiteTdStyle);
  }

  // 回答欄のCSSリスト
  // White: 判定していない
  // Black: 文字も位置も無一致
  // Yellow: 文字のみ一致
  // Green: 文字も位置も一致
  const [matchStyleList, setMatchStyleList] =
    useState<React.CSSProperties[][]>(initMatchStyleList);

  // 単語の妥当性判定
  const wordValidityJudgement = async () => {
    const { data } = await axios.post('https://yan5p8s0dg.execute-api.ap-southeast-2.amazonaws.com/WORDLE', 
      {"word": props.answerList[round - 1].join("")},);
    console.log(data);
    if (data.isValid === undefined) {
      return false;
    }

    return data.isValid;
  }

  // 単語一致判定
  const wordMatchJudgement = () => {
    // 一度ディープコピーする
    const tmpMatchStyleList = Array.from(matchStyleList);

    // 1文字ずつ判定
    for (let i = 0; i < 5; i++) {
      // 文字が一致
      if (props.correctAnswer.indexOf(props.answerList[round - 1][i]) !== -1) {
        // 位置も一致(Green)
        if (props.answerList[round - 1][i] === props.correctAnswer[i]) {
          tmpMatchStyleList[round - 1][i] = greenTdStyle;
        }

        // 文字だけ一致(Yellow)
        else {
          tmpMatchStyleList[round - 1][i] = yellowTdStyle;
        }
      }

      // 文字も位置も一致していない(Black)
      else {
        tmpMatchStyleList[round - 1][i] = blackTdStyle;
      }
    }
    return tmpMatchStyleList;
  };

  // クリア判定
  const clearJudgement = () => {
    // 正解が空文字だった場合、alertを出す
    if (props.correctAnswer === ""){
        alert("Server Error: Please reload the page.");
        return;
    }

    // ワードを抽出
    const wordList = [];
    for (let j = 0; j < 5; j++) {
      wordList.push(props.answerList[round - 1][j]);
    }
    const submitWord = wordList.join("");

    if (submitWord == props.correctAnswer) {
      alert("clear!!");
      return "success";
    } else if (round == 6) {
      alert("fail...");
      return "fail";
    }

    return "playing";
  };

  // Appコンポーネントのjudgeが変化した時に呼ばれる
  useEffect(() => {

    const checkProcess = async () => {

      // Enterを押したら
      if (props.judge === true) {

        // 単語の妥当性判定
        const isValid = await wordValidityJudgement();
        if (!isValid)
        {
          alert("データセットに存在しない単語です");
          return;
        }

        // 一度フラグをおろす
        props.setJudge(false);
      }

      // フラグをおろしてからここへ
      else {
        // コンポーネント初期化時にここを通る
        if (round == 0) {
          setRound(round + 1); // ラウンドを1に
          return;
        }

        // ゲーム継続中なら
        if (props.gameStatus == "playing") {
          // 単語一致判定
          const tmpMatchStyleList = wordMatchJudgement();
          // クリア判定
          clearJudgement();
          // スタイル更新
          setMatchStyleList(tmpMatchStyleList);
          // ラウンド更新
          setRound(round + 1);
        }
      }
    }

    checkProcess();

  }, [props.judge]);

  return (
    // mapにより回答table作成
    <div className="Answer">
      <table id="answer" style={answerStyle}>
        <tbody>
          {props.answerList.map((answer, i) => (
            <tr key={i}>
              {answer.map((letter, j) => (
                <td key={j} style={matchStyleList[i][j]}>
                  {letter}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
