// テンプレコード
/**
 * ウェブアプリのURLにアクセスした際，index.htmlを返します．
 * @returns {HtmlTemplate} index.htmlの内容
 */
function doGet() {
  const fileName = "index";
  return HtmlService.createTemplateFromFile(fileName).evaluate();
}

/**
 * コードエディタ内のHTMLファイルからHTMLの部分要素を返します．
 * @param {string} filename コードエディタ内のHTMLファイル名（拡張子不要）
 * @returns {HtmlOutput} 指定されたHTMLファイルの部分要素
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// 自作コード
/**
 * 存在するデータ範囲内で乱数値を返す関数
 * @returns {int} 1以上コンテンツが含まれている最後の行の位置以下の乱数値
 */
function getRnd() {
  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
  }

  let id = getRandomIntInclusive(1, getMaxRowCount());

  return id;
}

/**
 * アクティブシートのコンテンツが含まれている最後の行の位置を返します．
 * @returns {int} コンテンツが含まれている最後の行の位置
 */
function getMaxRowCount() {
  return SpreadsheetApp.getActiveSheet().getLastRow();
}

/**
 *
 * @param {int} id 出題する問題ID
 * @returns {[id, string]} 出題する問題のIDと問題文
 */
function getQuizDescription(id) {
  let sheet = SpreadsheetApp.getActiveSheet();

  return [id, sheet.getRange(id, 2).getValue()];
}

/**
 * 問題の選択肢を4つ返します．
 * @param {int} id 正解選択肢の問題ID
 * @returns {[[string, int]]} 4つの選択肢とその問題IDを含む配列
 */
function getQuizOptions(id) {
  let sheet = SpreadsheetApp.getActiveSheet();
  let optionsList = [[sheet.getRange(id, 1).getValue(), id]];

  // 間違った選択肢を3つ追加する
  let count = 0;
  while (count < 3) {
    let tmpNum = getRnd();
    let newOption = [sheet.getRange(tmpNum, 1).getValue(), tmpNum];

    // 比較条件が複数あるため，includesメソッドではなくsomeメソッドを用いる必要がある
    let some = optionsList.some(
      (o) => o[0] === newOption[0] && o[1] === newOption[1]
    );

    // リストに含まれていない値であればリストに追加する
    if (!some) {
      optionsList.push(newOption);
      count++;
    }
  }

  // リストの並び替え
  arrayShuffle(optionsList);

  return optionsList;
}

/**
 * 渡された配列の要素の順番をシャッフルします．
 * @param {[]} array シャッフルしたい配列
 * @returns {[]} シャッフルした配列（参照渡しなので元変数の参照をしても良い）
 */
function arrayShuffle(array) {
  for (let i = array.length - 1; 0 < i; i--) {
    // 0〜(i+1)の範囲で値を取得
    let r = Math.floor(Math.random() * (i + 1));

    // 要素の並び替えを実行
    let tmp = array[i];
    array[i] = array[r];
    array[r] = tmp;
  }
  return array;
}
