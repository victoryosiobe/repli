  //Start algorithm here!
  var text = document.getElementById('text')
  var text2 = document.getElementById('text2')
  var btn = document.getElementById('btn')
  var theChoosen = document.getElementById('typeOption')
  btn.addEventListener('click', async () => {
    if (/^\s*$/.test(textValue) === false && /^\s*$/.test(textValue2) === false) {
      var textValue = text.value
      var textValue2 = text2.value
      if (textValue.length > 0 && textValue2.length > 0) {
        var originText = textValue
        originText = originText.trim()
        var nextData = text2.value
        nextData = nextData.trim()
        var sentence1 = originText
        var sentence2 = nextData
        // Remove punctuation and convert sentences to lowercase
        sentence1 = sentence1.replace(/[^\w\s]/g, '').toLowerCase();
        sentence2 = sentence2.replace(/[^\w\s]/g, '').toLowerCase();
        if (theChoosen.value == 1) {
          howClose(sentence1, sentence2)
        }
        else if (theChoosen.value == 2) {
          calculateStringSimilarity(sentence1, sentence2)
        }
        else if (theChoosen.value == 3) {
          isVerbatim(sentence1, sentence2)
        }
        else if (theChoosen.value == 4) {
          uniqueCheck(sentence1, sentence2)
        }
      }
    }
  })

  function calculateStringSimilarity(sentence1, sentence2) {
    try {

      // Split sentences into words
      const words1 = sentence1.split(/\s+/);
      const words2 = sentence2.split(/\s+/);
      const matchWords = words1.filter(eachword => { console.log(words2.includes(eachword)); return words2.includes(eachword) })
      // alert(matchWords)
      // Calculate the similarity score based on the length of common words
      var similarity = (matchWords.length / Math.max(words1.length, words2.length)) * 100;
      var additional
      var matchCount
      matchCount = matchWords.length
      if (matchCount !== 0) {
        if (matchCount < 30) {
          additional = ' and few matches were found.'
        }
        else {
          additional = ' and matches found were much.'
        }
      }
      else {
        additional = ' .'
      }
      alert(`Match percentage: ${similarity}%` + additional)
      //  console.log(`Matches: ${commonWords}`)
      // text2.value = ''
    }
    catch (err) {
      alert('I\'m so sorry, I couldn\'t process that. Something when wrong. ' + err)
      text2.value = sentence2
      text.value = sentence1
    }
  }

  function isVerbatim(sen1, sen2) {
    if (sen1 === sen2) {
      alert('Yes, they are absolutely the same.')
    }
    else {
      alert('Nope, they are not the same.')
    }
  }

  function uniqueCheck(sentence1, sentence2) { //this doesn't repeat words in both sentence when matching
    //since this checks uniquely, it will not be suitable for 1 word check, eg highlight vs high, not good. just words alone.
    // Split sentences into words
    const words1 = sentence1.split(/\s+/);
    const words2 = sentence2.split(/\s+/);
    // Calculate the intersection of unique words between the two sentences
    const uniqueWords1 = new Set(words1);
    const uniqueWords2 = new Set(words2);
    const commonWords = [...uniqueWords1].filter(word => uniqueWords2.has(word));

    // Calculate the similarity score based on the length of common words
    const similarity = (commonWords.length / Math.max(words1.length, words2.length)) * 100;
    alert(`Uniquely, they are ${similarity}% in similarity.`)
  }

  function howClose(sen1, sen2) {

    /*Work here*/



    // if (similarity === 100) {
    //   alert('So close that they are the same. A clear 100%.')
    // }
    // else {
    //   alert(`They are ${similarity}% close.`)
    // }
  }