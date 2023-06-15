// テンプレコード
function getTable() {
  return SpreadsheetApp.getActiveSheet().getDataRange().getValues();
}

function doGet() {
  // 先につくった HTML のファイル名を入れます。template.html なのであれば template。.html は抜いてください
  const fileName = "index";
  return HtmlService.createTemplateFromFile(fileName).evaluate();
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function printTable() {
  console.log(getTable());
}

// 自作コード

// 存在するデータの範囲内で乱数を返す関数
// 問題IDを乱数で決める
// return 1からシート最終行までの乱数を返す
function getRnd() {
  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
  }

  let id = getRandomIntInclusive(1, getMaxRowCount());

  return id;
}

function getMaxRowCount() {
  return SpreadsheetApp.getActiveSheet().getLastRow();
}

// 問題文を返す
// 諸都合により，idと連結して返す
function getQuizDescription(id) {
  let sheet = SpreadsheetApp.getActiveSheet();

  return [id, sheet.getRange(id, 2).getValue()];
}

// 問題の選択肢を返す(ボタン生成用)
function getQuizOptions(id) {
  let sheet = SpreadsheetApp.getActiveSheet();
  let optionsList = [[sheet.getRange(id, 1).getValue(), id]];

  let count = 0;
  while (count < 3) {
    let tmpNum = getRnd();
    let newOption = [sheet.getRange(tmpNum, 1).getValue(), tmpNum];

    let some = optionsList.some(o => o[0] === newOption[0] && o[1] === newOption[1]);

    if (!some) {
      optionsList.push(newOption);
      count++;
    }
  }

  // リストの並び替え
  arrayShuffle(optionsList);

  return optionsList;
}

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
