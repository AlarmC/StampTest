import CryptoJS from "crypto-js";

export const encrypt = (data, key) => {
  //암호화 함수
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
};

export const decrypt = (text, key) => {
  //복호화 함수
  try {
    const bytes = CryptoJS.AES.decrypt(text, key);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (err) {
    // console.log(err);
    return;
  }
};

export const encryptNum = (data) => {
  //암호화 함수
  let text = data.toString();
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(text),
    "num"
  ).toString();

  let result = encrypted.toString();

  return encodeURIComponent(result);
};

export const decryptNum = (text) => {
  //복호화 함수
  const bytes = CryptoJS.AES.decrypt(text, "num");
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
