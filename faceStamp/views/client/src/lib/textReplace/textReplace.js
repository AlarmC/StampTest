export const textReplace = (value) => {
  let text = value;

  if (text.indexOf("'") !== -1) {
    text = text.replaceAll("'", "''");
  }
  if (text.indexOf("\\") !== -1) {
    text = text.replaceAll("\\", "\\\\");
  }
  return text;
};
