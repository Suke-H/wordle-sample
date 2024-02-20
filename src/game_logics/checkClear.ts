// クリア判定
export const checkClear = ( correctAnswer: string, answerList: string[][], round: number ) => {
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