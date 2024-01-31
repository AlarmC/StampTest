// export function CommonFetch(url, data, result) {
//   // let fetchValue = '';
//   console.log(url);
//   console.log(data);
//   fetch(url, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json;charset=utf-8',
//     },
//     body: JSON.stringify(data),
//   })
//     .then((res) => {
//       return res.json();
//     })
//     .then((res) => {
//       //   console.log(res);
//       result(res);
//       //   fetchValue = res;
//     });

//   //   return fetchValue;
// }

export function CommonFetch(url, data, result) {
  let fetchValue = "";
  // console.log(url);
  // console.log(data);
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      // console.log(res);
      result(res);
      // fetchValue = res;
    });

  // return fetchValue;
}
