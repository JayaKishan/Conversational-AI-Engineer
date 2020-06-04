fetch('assets/norvig.txt')
  .then(response => response.text())
  .then(text => repWord(text))

function repWord(text) {
    var wordsArray = splitByWords(text);
    var wordsMap = createWordMap(wordsArray);
    var finalWordsArray = sortByCount(wordsMap);

      sendWord(finalWordsArray);
}

function sendWord(finalWordsArray) {
    var numList = [];
    finalWordsArray.forEach(myFunc);

    function myFunc(i, e) {
      // console.log(i)
      numList.push(i.name)
    }
    numList.slice(0,11).forEach(eachName);

    function eachName(i,e) {
      console.log('Words',i);
      var http = new XMLHttpRequest();
      var url = 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20170610T055246Z.0f11bdc42e7b693a.eefbde961e10106a4efa7d852287caa49ecc68cf&lang=en-ru&text='+i;
      var params = i;
      http.open('POST', url, true);

      http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

      http.onreadystatechange = function() {
          if(http.readyState == 4 && http.status == 200) {
              var finalResult = JSON.parse(http.responseText);
              finalResult.def.forEach(finalResultFunc);
              function finalResultFunc(i, e) {
                // console.log(i);
                text = i.text;
                pos = i.pos;
                console.log("text",text)
                console.log("POS", pos)
                i.tr.forEach(posFetch);
                function posFetch(i,e){
                  // console.log(i)
                  if (i.mean != undefined) {
                    i.mean.forEach(meanFetch);
                  function meanFetch(i,e){
                    console.log('Means',i)
                  }
                  }
                }
              }
          }
      }
      http.send(params);
    }
  }

function sortByCount (wordsMap) {

  var finalWordsArray = [];
  finalWordsArray = Object.keys(wordsMap).map(function(key) {
    return {
      name: key,
      total: wordsMap[key]
    };
  });

  finalWordsArray.sort(function(a, b) {
    return b.total - a.total;
  });

  return finalWordsArray;

}

function splitByWords (text) {
  var wordsArray = text.split(/\s+/);
  return wordsArray;
}

function createWordMap (wordsArray) {

  var wordsMap = {};
  wordsArray.forEach(function (key) {
    if (wordsMap.hasOwnProperty(key)) {
      wordsMap[key]++;
    } else {
      wordsMap[key] = 1;
    }
  });

  return wordsMap;

}
