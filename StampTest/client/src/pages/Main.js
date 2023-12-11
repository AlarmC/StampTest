import React, { useState, useEffect } from 'react';
import logo from '../logo.svg';
import '../App.css';

function Main() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch('/api/message')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    console.log(message);
  }, [message])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {message}
        </p>
      </header>
    </div>
  );
}

export default Main;