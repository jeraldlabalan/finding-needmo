import '/src/App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from '/src/components/Landing/Landing.jsx';

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Landing />} />
      </Routes>
    </Router>
  )
}

export default App
