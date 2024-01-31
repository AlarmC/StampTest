import { useEffect, useState } from "react";

export default function UseFetch(url, sendData) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendData),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setData(data);
      });
  }, [url]);

  return data;
}
