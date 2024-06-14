// Event listener for incoming messages from the main thread
self.addEventListener('message', function(e) {
  const first = e.data.first
  const second = e.data.second
  const type = e.data.type
  let res

  if (type === "calculateStringSimilarity") res = calculateStringSimilarity(first, second)
  if (type === "uniqueCheck") res = uniqueCheck(first, second)
  self.postMessage(res);
}, false);

function calculateStringSimilarity(sentence1, sentence2) {
  try {
    // Split sentences into words
    let words1 = sentence1.split(/\s+/);
    let words2 = sentence2.split(/\s+/);
    const textDeterMin = charOrWords(words1, words2)
    words1 = textDeterMin[0]
    words2 = textDeterMin[1]

    const pos = positionAppend(words1, words2)
    words1 = pos[0]
    words2 = pos[1]
    const words2Copy = words2.slice() //copy

    const est = words1.map(word => {
      if (words2Copy.filter(word2 => word2[0] === (word[0])).length > 0) {
        //words2Copy.shift() //reduce the array on every iteration, so we don't run unnecessary 
        const mALen = words2.length
        let inRangeRep = false
        for (let i of words2) {
          const range = Math.round(slowIncrease(mALen, 2)) //Math.log to slow to rate ratio grows with text length
          const inRangeBool = !((Math.abs(i[1] - word[1]) > range)) //Math.log to slow to rate ratio grows with text length
          let arrInrange, wordsInRange
          if ((range !== 0 || !(range < 1)) && inRangeBool && (i[0] === word[0])) {
            arrInrange = extractRangeBothDirections(words2, word[1], range) //extract array in range
            wordsInRange = removeSecondElement(arrInrange) //filter down to words in range
          } else continue
          if (wordsInRange.includes(word[0])) inRangeRep = true
          //  console.log(arrInrange, word[0], range)
          break
        }
        if (inRangeRep) return 1
        else return 1 / 2 //if loop runs out without returns, this is default
      }
      else {
        //  words2Copy.shift() //reduce the array on every iteration, so we don't run unnecessary 
        return 0
      }
    })
    const similarity = (est.reduce((acc, v) => acc + v, 0) / Math.max(words1.length, words2.length)) * 100
    // Calculate the similarity score based on the length of common words
    let message
    if (!(similarity < 1)) {
      if (similarity < 30) {
        message = `Stats estimate: ${similarity}%. Similarity is very low and few matches were found.`
      }
      else {
        message = `Stats estimate: ${similarity}%. Similarity is high and a lot of matches were found.`
      }
    }
    else {
      message = "There's very little, or no similarity in both text"
    }
    return message
    //  console.log(`Matches: ${commonWords}`)
    // text2.value = ''
  }
  catch (err) {
    throw new Error('I\'m so sorry, I couldn\'t process that. Something when wrong. ' + err)
  }
}

function uniqueCheck(sentence1, sentence2) { //this doesn't repeat words in both sentence when matching
  //since this checks uniquely, it will not be suitable for 1 word check, eg highlight vs high, not good. just words alone.
  // Split sentences into words
  let words1 = sentence1.split(/\s+/);
  let words2 = sentence2.split(/\s+/);
  const textDeterMin = charOrWords(words1, words2)
  words1 = textDeterMin[0]
  words2 = textDeterMin[1]
  // Calculate the intersection of unique words between the two sentences
  const uniqueWords1 = new Set(words1);
  const uniqueWords2 = new Set(words2);
  const commonWords = [...uniqueWords1].filter(word => uniqueWords2.has(word));

  // Calculate the similarity score based on the length of common words
  const similarity = (commonWords.length / Math.max(words1.length, words2.length)) * 100;
  return `Uniquely, they are ${similarity}% in similarity.`
}

function charOrWords(x, y) {
  if (x.length < 2 && y.length < 2) {
    x = x.toString().split('')
    y = y.toString().split('')
    return [x, y]
  } else return [x, y]
}

function positionAppend(x, y) {
  x = x.map((v, i) => [v, i])
  y = y.map((v, i) => [v, i])
  return [x, y]
}

function extractRangeBothDirections(arr, index, range) {
  range += 1 //range typically extracts exclusive, so i'm adding 1 to make it somewhat inclusive
  if (range === 1) { //lowest would be zero, + 1 as above
    return [arr[index]];
  }
  // Calculate the starting index for backward extraction
  const startIndexBackward = Math.max(0, index - range + 1);

  // Calculate the ending index for forward extraction
  const endIndexForward = Math.min(arr.length, index + range);

  // Extract elements backward from startIndexBackward to index (inclusive)
  const backwardPart = arr.slice(startIndexBackward, index + 1);

  // Extract elements forward from index + 1 to endIndexForward (exclusive)
  const forwardPart = arr.slice(index + 1, endIndexForward);

  // Concatenate backward and forward parts into a single array
  return [...backwardPart, ...forwardPart];
}

function removeSecondElement(arr) {
  // Iterate through each sub-array in the main array
  for (let i = 0; i < arr.length; i++) {
    // Check if the sub-array has at least two elements
    if (arr[i].length >= 2) {
      // Remove the second element from the sub-array
      arr[i].splice(1, 1);
    }
  }
  return arr.flat();
}

function slowIncrease(number, base) {
  return Math.log(number) / Math.log(base);
}