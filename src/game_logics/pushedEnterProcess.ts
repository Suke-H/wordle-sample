import { checkWordValidity } from "./checkWordValidity";
import { checkWordMatch } from "./checkWordMatch";
import { checkClear } from "./checkClear";

export const pushedEnterProcess = async ( 
      correctAnswer: string,
      answerList: string[][],
      matchList: string[][],
      round: number,
      setMatchList: React.Dispatch<React.SetStateAction<string[][]>>,
  ) : Promise<boolean> => {

    // 単語の妥当性判定
    const isValid = await checkWordValidity(answerList, round);
    if (!isValid) return false;

    // 単語一致判定
    const tmpMatchList = checkWordMatch(correctAnswer, answerList, matchList, round);
    // クリア判定
    checkClear(correctAnswer, answerList, round);
    
    // スタイル更新
    setMatchList(tmpMatchList);
  
    return true;
  }