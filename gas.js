
const activeSpreadSheet = SpreadsheetApp.getActiveSpreadsheet(); // 現在のSpreadSheetを取得
const sheet = activeSpreadSheet.getSheetByName('notion_1'); // シート(SpreadSheetの下のタブ名を指定)

function getNthDowDays(date, dow, ns) {
  var year = date.getFullYear();
  var month = date.getMonth();
  var days = [];

  for (let i = 1; i <= 31; i++){
    const tmpDate = new Date(year, month, i);
    if (month !== tmpDate.getMonth()) break;
    if (dow != tmpDate.getDay()) continue;
    days.push(tmpDate);
  };
  const res = [];

  for (let i = 0; i < ns.length; i++){
    res.push(Utilities.formatDate(days[ns[i]-1], 'Asia/Tokyo', 'yyyy-MM-dd'));
  };
  return res;
};

function insertToDo(token, database_id, title, user) {
  var endpoint = 'https://api.notion.com/v1/pages';
  var notion_version = '2022-06-28';
  var payload = {
    "parent": {
      "type": "database_id",
      "database_id": database_id
    }, 
    "properties": {
      "title": {
        "title": [
          {
            "text": {
              "content": title
            }
          }
        ]
      },
      "担当": {
        "multi_select": [
          {
            "name": user
          }
        ]
      }
    }
  }
  var options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Notion-Version': notion_version,
        'Authorization': 'Bearer ' + token
      },
      payload: JSON.stringify(payload)
    };
  const response = UrlFetchApp.fetch(endpoint, options);
};

function dice_user() {
  var users = ['しゅうほ', 'かりん'];
  const shuffle = ([...array]) => {
    for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  const sample = (array, num) => {
    return shuffle(array).slice(0, num);
  };
  var user = sample(users, 1);
  return user[0];
};

function remindGarbage() {
  var notion_token = sheet.getRange("B1").getValue();
  var todo_dataset_id = sheet.getRange("B2").getValue();

  var date = new Date();
  date.setDate(date.getDate() + 1); //next day
  var date_str = Utilities.formatDate(date, 'Asia/Tokyo', 'yyyy-MM-dd')
  var unburn_days = getNthDowDays(date, 1, [2, 4]);
  console.log(unburn_days);
  if (unburn_days.includes(date_str)) {
    console.log('不燃ごみ');
    insertToDo(notion_token, todo_dataset_id, '不燃ごみ', dice_user());
  } else if ([2, 5].includes(date.getDay())) {
    console.log('可燃ごみ');
    insertToDo(notion_token, todo_dataset_id, '可燃ごみ', dice_user());
  } else if (date.getDay() == 4) {
    console.log('資源ごみ');
    insertToDo(notion_token, todo_dataset_id, '資源ごみ', dice_user());
  };
};

function remindToiletCleaning() {
  var notion_token = sheet.getRange("B1").getValue();
  var todo_dataset_id = sheet.getRange("B2").getValue();

  var date = new Date();
  date.setDate(date.getDate()); //next day
  if (date.getDay() == 6) {
    console.log('トイレ掃除');
    insertToDo(notion_token, todo_dataset_id, 'トイレ掃除', dice_user());
  };
};
