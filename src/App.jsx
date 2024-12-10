import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Landing from './components/Landing/Landing';

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/landing' element={<Landing />} />
      </Routes>
    </Router>
  )
}

export default App
