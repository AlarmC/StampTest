export function getTextTotal(str, maxByte) {
  let byte = 0;
  let maxLen = 0;

  // if (byte >= maxByte) {
  //   return;
  // }
  for (let i = 0; i < str.length; i++) {
    if (byte < maxByte) {
      byte++;

      if (byte <= maxByte) maxLen += 1;
    }
  }

  return { byte, maxLen };
}

export function textOverCut(text, maxByte) {
  let changeText = text;

  const { byte, maxLen } = getTextTotal(text, maxByte);

  if (byte >= maxByte) {
    changeText = text.substr(0, maxLen);
  }
  return changeText;
}
