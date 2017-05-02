/** the conjugate returns a conjugate verb, but it should be checked for tense, past tense will take present tense verb and then add something to the the verb, and then add an additional letter after **/

/** Additional Functions **/
// reference: http://www.programminginkorean.com/programming/hangul-in-unicode/composing-syllables-in-unicode/
// input: hangul character
// output: returns an array of components that make up the given hangul
// ex: breakdown('린') outputs [5,20,4]
const breakdown = (input) => {
  let total = parseInt(input.charCodeAt(0).toString(16), 16);

  const letterArray = [];
  total -= 44032;
  const initialValue = Math.floor(total / 588);
  letterArray.push(initialValue);
  total -= (588 * initialValue);
  const medialValue = Math.floor(total / 28);
  letterArray.push(medialValue);
  const finalValue = total - (28 * medialValue);
  if (finalValue > 0) {
    letterArray.push(finalValue);
  }
  return letterArray;
};

// input: array of 2 or 3 numbers representing modern jamo (components) that make up a hangul syllable
// output: a hangul character
const combineSymbols = (input) => {
  let unicodeTotal = (input[0] * 588) + (input[1] * 28) + 44032;
  if (input.length === 3) {
    unicodeTotal += input[2];
  }
  return String.fromCharCode(unicodeTotal);
};

class Korean {

  conjugate (word, info) {
  // Format for rulesObject: { tense: 'present', formal: 'true/false', wordType: 'adjective/verb'}
  // TODO: test if word is verb, return to avoid switch

    switch (info.tense) {
      case 'present':
        return this.doPresent(word);
      case 'past':
        return this.doPast(word);
      case 'future':
        return this.doFuture(word);
      case 'PresentContinuous':
        return this.doPresentContinuous(word);
      default:
        return 'Could not find any rules for conjugation';
    }
  }

  doPresent (word) {
    const wordLength = word.length;
    let conjugate = '';
    // if the ending is 'ha' then convert to 'hae'
    if (word[wordLength - 2] === '하') {
      conjugate = word.slice(0, wordLength - 2);
      return conjugate.concat('해');
    } else if (word[wordLength - 2] === '앉' || word[wordLength - 2] === '솟' || word[wordLength - 2] === '닫') {
      conjugate = word.slice(0, wordLength - 1);
      return conjugate.concat('아')
    } else if (word[wordLength - 2] === '르') {
      const stem = breakdown(word.slice(0, wordLength - 2));
      stem.push(8); // ㄹ
      const newSyllable = combineSymbols(stem);
      switch (stem[stem.length - 2]) {
        case 0:
        case 8:
          // ㅏ and ㅗ are followed by 라
          return newSyllable.concat('라');
        default:
          // other vowels are followed by 러
          return newSyllable.concat('러');
      }
    } else {
      /** breakdown the word to find out the 2nd to last character's letter **/
      const brokeWord = breakdown(word[wordLength - 2]);
      const brokeLength = brokeWord.length;
      const syllableEnd = brokeWord[brokeLength - 1];
      const stemWord = word.slice(0, wordLength - 2);
      let newSyllable = brokeWord.slice(0, brokeLength - 1);

      switch (syllableEnd) {
        case 0:
        case 1:
        case 4:
          // if last letter is ㅏ leave alone
          return word.slice(0, wordLength - 1);
        case 7:
          // replace with: ㄹ (9)
          newSyllable.push(8);
          newSyllable = combineSymbols(newSyllable);
          return (stemWord + newSyllable).concat('어');
        case 8:
          // replace with: ㅘ (9)
          // concat back to word
          newSyllable.push(9);
          newSyllable = combineSymbols(newSyllable);
          return stemWord + newSyllable;
        case 18:
          // vowel ㅡ replace with ㅓ (4)
          newSyllable.push(4);
          newSyllable = combineSymbols(newSyllable);
          if (wordLength <= 2) {
            return newSyllable;
          }
          return stemWord + newSyllable;
        case 13:
          // 13 (ㅜ) convert to 14 (ㅝ)
          newSyllable.push(14);
          newSyllable = combineSymbols(newSyllable);
          if (wordLength <= 2) {
            return newSyllable;
          }
          return stemWord + newSyllable;
        case 20:
          // vowel ㅣ replace with ㅕ(6)
          newSyllable.push(6);
          newSyllable = combineSymbols(newSyllable);
          if (wordLength <= 2) {
            return newSyllable;
          }
          return stemWord + newSyllable;
        default:
          // if consonant
          conjugate = word.slice(0, wordLength - 1);
          return conjugate.concat('어');
      }
    } // end of first else
  } // end of presentWord function

  doPresentContinuous (word) {
    return `${word.substring(0, word.length - 1)}고있어`;
  }

  doPast (word) {
    console.info(word);
    // stuff for past tense
  }

  doFuture (word) {
    const stem = breakdown(word.slice(0, -1));
    if (stem.length < 3) {
      stem.push(8);
      return `${combineSymbols(stem)} 거야`;
    }
    if (stem[stem.length - 1] === 17) {
      stem.pop();
      return `${combineSymbols(stem)}울 거야`;
    } else if (stem[stem.length - 1] === 8) {
      return `${combineSymbols(stem)} 거야`;
    }
    return `${combineSymbols(stem)}을 거야`;
  }
} // end for class

export { Korean };
