export const saveGameDataInLocal = (todaysNo: number, answerList: string[][]) => {
    const gameData = {
        todaysNo: todaysNo.toString(),
        answerList: answerList
    };

    console.log("save!!", gameData);

    localStorage.setItem('gameData', JSON.stringify(gameData));
  }

  export const loadGameDataInLocal = (todaysNo: number): string[][] => {
    const json_data = localStorage.getItem('gameData');

    // ローカルストレージにデータがある場合
    if (json_data) {
        const data = JSON.parse(json_data);

        // 本日のお題番号が一致している場合
        if (data.todaysNo === todaysNo.toString()) {
            console.log("load!!", data);
            return data.answerList;
        }
    }

    // ローカルストレージにデータがない場合 | 本日のお題番号が一致していない場合
    console.log("load failed...");
    const initAnswerList: string[][] = new Array(6);
    for (let i = 0; i < 6; i++) {
      initAnswerList[i] = new Array(5).fill("");
    }
    return initAnswerList;
  }

    export const resetGameDataInLocal = () => {
        console.log("reset!!");
        localStorage.removeItem('gameData');
    }
  