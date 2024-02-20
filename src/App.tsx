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
	const initAnswerList: string[][] = new Array(3);
	for (let i = 0; i < 3; i++) {
		initAnswerList[i] = new Array(7).fill("");
	}
	// MY
	initAnswerList[0][0] = "M";
	initAnswerList[0][1] = "Y";
	// WORDLE
	initAnswerList[1][0] = "W";
	initAnswerList[1][1] = "O";
	initAnswerList[1][2] = "R";
	initAnswerList[1][3] = "D";
	initAnswerList[1][4] = "L";
	initAnswerList[1][5] = "E";
	// PROJECT
	initAnswerList[2][0] = "P";
	initAnswerList[2][1] = "R";
	initAnswerList[2][2] = "O";
	initAnswerList[2][3] = "J";
	initAnswerList[2][4] = "E";
	initAnswerList[2][5] = "C";
	initAnswerList[2][6] = "T";
	
	const initMatchList: string[][] = new Array(3);
	for (let i = 0; i < 3; i++) {
		initMatchList[i] = new Array(7).fill("White");
	}
	// MY
	initMatchList[0][0] = "Yellow";
	initMatchList[0][1] = "Yellow";
	// WORDLE
	initMatchList[1][0] = "Green";
	initMatchList[1][1] = "Green";
	initMatchList[1][2] = "Green";
	initMatchList[1][3] = "Green";
	initMatchList[1][4] = "Green";
	initMatchList[1][5] = "Green";
	// PROJECT
	initMatchList[2][0] = "Black";
	initMatchList[2][1] = "Black";
	initMatchList[2][2] = "Black";
	initMatchList[2][3] = "Black";
	initMatchList[2][4] = "Black";
	initMatchList[2][5] = "Black";
	initMatchList[2][6] = "Black";

	/* State */
	const [answerList, setAnswerList] = useState<string[][]>(initAnswerList); // 回答欄の文字列
	const [ matchList, setMatchList ] = useState<string[][]>(initMatchList); // 回答欄のマッチ状況(White/Black/Yellow/Grren)
	const [judge, setJudge] = useState<boolean>(false); // Enterを押したか
	const [correctAnswer, setCorrectAnswer] = useState<string>(""); // 今日の単語
	const [todaysNo, setTodaysNo] = useState<number>(0); // 今日が何回目か
	const [round, setRound] = useState<number>(0); // ラウンド(現在の行番号+1)
	const [columncnt, setColumncnt] = useState(0); // 現在の列番号

	// 初回レンダリング時
	useEffect(() => {
		// 今日の単語を取得
		getTodaysWord(setCorrectAnswer, setTodaysNo);
		setRound(round + 1); // ラウンドを1にセット
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
                setColumncnt(0); // 列番号を0にリセット
                } 

                /* 問題ない場合 */
                else {
					setRound(round + 1); // 次の行へ移行
					setColumncnt(0); // 列番号を0にリセット
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
