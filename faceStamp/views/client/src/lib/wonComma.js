export function wonComma(value) {
  let splitNum = `${value}`.split(".")[0];
  let stringNum = `${splitNum}`;
  return stringNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
