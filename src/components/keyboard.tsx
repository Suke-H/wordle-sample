import React, { useState, useEffect } from "react";
import axios from "axios";

type appProps = {
  answerList: string[][];
  setAnswerList: React.Dispatch<React.SetStateAction<string[][]>>;
  setJudge: React.Dispatch<React.SetStateAction<boolean>>;
};

type Props = {
  rowcnt: number;
  setColumncnt: React.Dispatch<React.SetStateAction<number>>;
  columncnt: number;
  setRowcnt: React.Dispatch<React.SetStateAction<number>>;
  answerList: string[][],
  setAnswerList: React.Dispatch<React.SetStateAction<string[][]>>;
  keyLayout: string[];
  setJudge: React.Dispatch<React.SetStateAction<boolean>>;
};

const KeyboardRow = (props: Props) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const updateDimensions = () => {
    setWindowWidth(window.innerWidth);
  };
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const updateAnswer = (
    prevState: string[][],
    letter: string,
    row: number,
    column: number
  ) => {
    const tmpList = Array.from(prevState);
    tmpList[row][column] = letter;

    return tmpList;
  };

  // 単語の妥当性判定
  const wordValidityJudgement = async () => {
    const { data } = await axios.post('https://yan5p8s0dg.execute-api.ap-southeast-2.amazonaws.com/WORDLE', 
      {"word": props.answerList[props.rowcnt].join("")});
    console.log(data);
    if (data.isValid === undefined) {
      return false;
    }

    return data.isValid;
  }

  const handleClick = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const letter = event.currentTarget.value;

    // Enter入力
    if (letter == "Enter") {
      // 文字数不足
      if (props.columncnt < 5) {
        alert("文字数が足りません");
      }

      // 単語の妥当性判定
      const isValid = await wordValidityJudgement();
      if (!isValid)
      {
        alert("データセットに存在しない単語です");
        props.setAnswerList(prevState =>
          prevState.map((row, index) =>
            index === props.rowcnt ? Array(5).fill("") : row
          )
        );

        props.setColumncnt(0);

      }

      // 5文字入力した状態
      else {
        // フラグ送信（正解判定の依頼）
        props.setJudge(true);
        // 列数リセット
        props.setColumncnt(0);
        // 次の行へ移行
        props.setRowcnt((prev) => prev + 1);
      }
    }

    // Delete入力
    else if (letter == "Delete") {
      // 1文字以上入力
      if (props.columncnt > 0) {
        props.setAnswerList((prevState) =>
          updateAnswer(prevState, "", props.rowcnt, props.columncnt - 1)
        );
        props.setColumncnt((prev) => prev - 1);
      }
    }

    // アルファベット入力
    else if (props.columncnt < 5) {
      props.setAnswerList((prevState) =>
        updateAnswer(prevState, letter, props.rowcnt, props.columncnt)
      );
      props.setColumncnt((prev) => prev + 1);
    }
  };

  // キーボードのCSSスタイル
  const keyboardStyle: React.CSSProperties = {
    borderSpacing: windowWidth < 600 ? "3px 3px" : "6px 6px",
    display: "flex",
    justifyContent: "center",
  };

  // ボタンのCSSスタイル
  const buttonStyle: React.CSSProperties = {
    backgroundColor: "rgb(217, 217, 217)",
    borderRadius: "4px",
    border: "none",
    width: windowWidth < 600 ? "30px" : "45px",
    height: windowWidth < 600 ? "45px" : "60px",
    fontSize: windowWidth < 600 ? "10px" : "13px",
    fontWeight: "bold",
    cursor: "pointer",
  };

  // EnterとDeleteのCSSスタイル
  // buttonStyleとの差分のみ記述
    const enterAndDeleteButtonStyle: React.CSSProperties = {
        ...buttonStyle,
        width: windowWidth < 600 ? "50px" : "70px",
    };

  return (
    // mapによりキーボードtable作成
    <table id="keyboard-row" style={keyboardStyle}>
      <tbody>
        <tr>
          {props.keyLayout.map((key, i) => (
            <td id="alphabet-key" key={i}>
              {/* EnterとDeleteのときのみstyleを変更 */}
              <button value={key} onClick={handleClick} 
                        style={key == "Enter" || key == "Delete" ? enterAndDeleteButtonStyle : buttonStyle}>
                {key}
              </button>
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

export const Keyboard = (props: appProps) => {
  const upKeyLayout: string[] = [
    "Q",
    "W",
    "E",
    "R",
    "T",
    "Y",
    "U",
    "I",
    "O",
    "P",
  ];
  const middleKeyLayout: string[] = [
    "A",
    "S",
    "D",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
  ];
  const downKeyLayout: string[] = [
    "Enter",
    "Z",
    "X",
    "C",
    "V",
    "B",
    "N",
    "M",
    "Delete",
  ];

  const [rowcnt, setRowcnt] = useState(0);
  const [columncnt, setColumncnt] = useState(0);

  return (
    <div className="Keyboard">
      <KeyboardRow
        rowcnt={rowcnt}
        setRowcnt={setRowcnt}
        columncnt={columncnt}
        setColumncnt={setColumncnt}
        answerList={props.answerList}
        setAnswerList={props.setAnswerList}
        keyLayout={upKeyLayout}
        setJudge={props.setJudge}
      />
      <KeyboardRow
        rowcnt={rowcnt}
        setRowcnt={setRowcnt}
        columncnt={columncnt}
        setColumncnt={setColumncnt}
        answerList={props.answerList}
        setAnswerList={props.setAnswerList}
        keyLayout={middleKeyLayout}
        setJudge={props.setJudge}
      />
      <KeyboardRow
        rowcnt={rowcnt}
        setRowcnt={setRowcnt}
        columncnt={columncnt}
        setColumncnt={setColumncnt}
        answerList={props.answerList}
        setAnswerList={props.setAnswerList}
        keyLayout={downKeyLayout}
        setJudge={props.setJudge}
      />
    </div>
  );
};
