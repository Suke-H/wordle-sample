import { checkWordValidity } from "./checkWordValidity";
import { checkWordMatch } from "./checkWordMatch";
import { checkClear } from "./checkClear";

export const pushedEnterProcess = async ( 
      judge: boolean, 
      setJudge: React.Dispatch<React.SetStateAction<boolean>>,
      correctAnswer: string,
      answerList: string[][],
      matchList: string[][],
      round: number,
      setRound: React.Dispatch<React.SetStateAction<number>>,
      setMatchList: React.Dispatch<React.SetStateAction<string[][]>>,
  ) => {

    // Enterを押したら
    if (judge === true) {

      // 単語の妥当性判定
      const isValid = await checkWordValidity(answerList, round);
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
 
        // 単語一致判定
        const tmpMatchList = checkWordMatch(correctAnswer, answerList, matchList, round);
        // クリア判定
        checkClear(correctAnswer, answerList, round);
        // スタイル更新
        setMatchList(tmpMatchList);
        // ラウンド更新
        setRound(round + 1);
    }
  }