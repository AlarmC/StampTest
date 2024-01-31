export function getRandomInt(min, max) {
  min = Math.ceil(min); //올림
  max = Math.floor(max); //내림
  return Math.floor(Math.random() * (max - min)) + min; // 최대값은 제외, 최소값은 포함
}

export function ramdomASCII(length) {
  //97-122 사이에 랜덤한 정수 만들기
  let result = "";
  for (let i = 0; i < length; i++) {
    result += String.fromCharCode(getRandomInt(97, 122));
  }
  //아스키 문자를 이용하여 문자로 반화
  return { result };
}

export function ramdomASCIIDate() {
  let random = "";
  let m = "";
  let s = "";
  let n = "";

  const today = new Date();
  const minutes = today.getMinutes();
  const seconds = today.getSeconds();

  const { result } = ramdomASCII(4);

  const num = Math.floor(Math.random() * 100);

  if (num < 10) {
    n = "0" + num;
  } else {
    n = num;
  }

  if (minutes < 10) {
    m = "0" + minutes;
  } else {
    m = minutes;
  }
  if (seconds < 10) {
    s = "0" + seconds;
  } else {
    s = seconds;
  }

  random = result + n + m + s;

  return random;
}
