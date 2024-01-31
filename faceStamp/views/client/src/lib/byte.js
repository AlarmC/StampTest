// export function getTextTotalByte(str, maxByte) {
//   let totalByte = 0;
//   let maxLen = 0;
//   // escape 함수로 인코딩 하여 한글인지 영문인지 체크,
//   // length 4보다 큰경우 한글로 체크하여 byte를 2 증가
//   const isKorean = (char) => escape(char).length > 4;

//   [...str].forEach((oneChar, i) => {
//     if (isKorean(oneChar)) {
//       totalByte += 2;
//     } else {
//       totalByte += 1;
//     }

//     if (totalByte <= maxByte) maxLen += 1;
//   });

//   return { totalByte, maxLen };
// }

// export function textByteOverCut(text, maxByte) {
//   let changeText = text;
//   console.log(changeText);
//   const { totalByte, maxLen } = getTextTotalByte(text, maxByte);

//   if (totalByte > maxByte) {
//     changeText = text.substr(0, maxLen);
//   }
//   return changeText;
// }
export function getTextTotalByte(str, maxByte) {
  let byte = 0;
  let maxLen = 0;

  // if (byte >= maxByte) {
  //   return;
  // }
  for (let i = 0; i < str.length; i++) {
    if (byte < maxByte) {
      if (/[\sa-zA-Z0-9`~!@#$%^&*()_+-={}\[\];':",./<>?]/.test(str[i])) {
        byte++;
      } else {
        byte = byte + 2;
      }
      if (byte <= maxByte) maxLen += 1;
    }
  }

  return { byte, maxLen };
}

export function textByteOverCut(text, maxByte) {
  let changeText = text;

  const { byte, maxLen } = getTextTotalByte(text, maxByte);

  if (byte >= maxByte) {
    changeText = text.substr(0, maxLen);
  }
  return changeText;
}

export function onlyGetTextTotalByte(str, maxByte) {
  let byte = 0;
  let maxLen = 0;

  // if (byte >= maxByte) {
  //   return;
  // }
  for (let i = 0; i < str.length; i++) {
    if (byte < maxByte) {
      if (/^[a-z|A-Z]+$/.test(str[i])) {
        byte++;
      } else if (/^[ㄱ-ㅎ|가-힣]+$/.test(str[i])) {
        byte = byte + 2;
      } else {
        byte = byte + 0;
      }

      if (byte <= maxByte) maxLen += 1;
    }
  }

  return { byte, maxLen };
}

export function onlytextByteOverCut(text, maxByte) {
  let changeText = text;

  const { byte, maxLen } = onlyGetTextTotalByte(text, maxByte);

  if (byte >= maxByte) {
    changeText = text.substr(0, maxLen);
  }
  return changeText;
}
