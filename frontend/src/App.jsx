import '/src/App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from '/src/components/Landing/Landing.jsx';
import RegisterLogin from './components/RegisterLogin/RegisterLogin';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import Profile from './components/Profile/Profile';

function App() {

  return (
    <Router>
      <Routes>
      <Route path='/header' element={<Header />} />
        <Route path='/' element={<Landing />} />
        <Route path='/registerlogin' element={<RegisterLogin />} />
        <Route path='/home' element={<Home />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </Router>
  )
}

export default App
