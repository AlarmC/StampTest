const NowDate = () => {
  let today = new Date();

  let year = today.getFullYear();
  let month = ("0" + (today.getMonth() + 1)).slice(-2);
  let day = ("0" + today.getDate()).slice(-2);

  let dateString = year + "-" + month + "-" + day + " 00:00:00"

  return dateString;
};

export default NowDate;
