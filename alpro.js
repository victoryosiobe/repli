let w
if (typeof(Worker) !== "undefined") {
  //Supported
  w = new Worker('w.js');
} else {
  alert("Sorry! No Web Worker support... Functions May Break.")
}


//Start algorithm here!
const text = document.getElementById('text')
const text2 = document.getElementById('text2')
const btn = document.getElementById('btn')
const mode = document.getElementById('typeOption')
let textV, textV2
btn.addEventListener('click', () => {
  showLoader()
  let theChoosen = parseInt(mode.value) //it could update before click
  textV = text.value
  textV2 = text2.value
  if (/^\s*$/.test(textV) === false && /^\s*$/.test(textV2) === false) {
    if (textV.length > 0 && textV2.length > 0) {
      // Remove punctuation and convert sentences to lowercase
      const sentence1 = textV.replace(/[^\w\d\s]/g, ' $& ').toLowerCase().trim();
      const sentence2 = textV2.replace(/[^\w\d\s]/g, ' $& ').toLowerCase().trim();
      if (theChoosen === 1) {
        howClose(sentence1, sentence2)
      }
      else if (theChoosen === 2) {
        calculateStringSimilarity(sentence1, sentence2)
      }
      else if (theChoosen === 3) {
        isVerbatim(sentence1, sentence2)
      }
      else if (theChoosen === 4) {
        uniqueCheck(sentence1, sentence2)
      }
    }
  } else alert("For Processing, You Must Fill The 2 TextArea. Empty Spaces Or Characters Will Fail To Process.")
  hideLoader()
})

function calculateStringSimilarity(sentence1, sentence2) {
  w.addEventListener('message', msgHand)

  function msgHand(e) {
    alert(e.data);
    w.removeEventListener('message', msgHand)
  }
  w.postMessage({ first: sentence1, second: sentence2, type: "calculateStringSimilarity" })
}

function isVerbatim(sen1, sen2) {
  if (sen1 === sen2) {
    alert('Yes, they are absolutely the same.')
  }
  else {
    alert('Nope, they are not the same.')
  }
}

function uniqueCheck(sentence1, sentence2) {
  w.addEventListener('message', msgHand)

  function msgHand(e) {
    alert(e.data);
    w.removeEventListener('message', msgHand)
  }
  w.postMessage({ first: sentence1, second: sentence2, type: "uniqueCheck" })
}

function howClose(sen1, sen2) {

  alert("Sorry, Not available.")
}

function showLoader() {
  document.querySelector('.overlay').style.display = 'flex';
}

function hideLoader() {
  document.querySelector('.overlay').style.display = 'none';
}