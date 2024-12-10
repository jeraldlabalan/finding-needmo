import '/src/App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from '/src/components/Landing/Landing.jsx';
import RegisterLogin from './components/RegisterLogin/RegisterLogin';

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/registerlogin' element={<RegisterLogin />} />
      </Routes>
    </Router>
  )
}

export default App
