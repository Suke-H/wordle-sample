import { checkWordValidity } from "./checkWordValidity";
import { checkWordMatch } from "./checkWordMatch";
import { checkClear } from "./checkClear";

export const pushedEnterProcess = async ( 
      judge: boolean, 
      setJudge: React.Dispatch<React.SetStateAction<boolean>>,
      correctAnswer: string,
      answerList: string[][],
      setAnswerList: React.Dispatch<React.SetStateAction<string[][]>>,
      matchList: string[][],
      round: number,
      setRound: React.Dispatch<React.SetStateAction<number>>,
      setColumncnt: React.Dispatch<React.SetStateAction<number>>,
      setMatchList: React.Dispatch<React.SetStateAction<string[][]>>,
  ) => {

    // Enterを押したら
    if (judge === true) {
      // 単語の妥当性判定
      const isValid = await checkWordValidity(answerList, round);
      if (!isValid)
      {
        alert("データセットに存在しない単語です");
        setAnswerList(prevState =>
          prevState.map((row, index) =>
            index === round-1 ? Array(5).fill("") : row
          )
        );
        setColumncnt(0);
        return;
      }

        // 単語一致判定
        const tmpMatchList = checkWordMatch(correctAnswer, answerList, matchList, round);
        // クリア判定
        checkClear(correctAnswer, answerList, round);
        // スタイル更新
        setMatchList(tmpMatchList);
        // ラウンド更新
        setColumncnt(0);
        setRound(round + 1);

        // フラグを戻す
        setJudge(false);
    }
  }