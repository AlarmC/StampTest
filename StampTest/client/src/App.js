import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Main from './pages/Main';
import NoLayout from './layout/NoLayout';
import TestPage from "./pages/TestPage";

function App() {
  
  return(
    <BrowserRouter>
      <Routes>
        <Route path="" element={<NoLayout />}>
          <Route path="/" element={<TestPage />}/>
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App;