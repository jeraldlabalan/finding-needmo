import '/src/App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from '/src/components/Landing/Landing.jsx';
import RegisterLogin from './components/RegisterLogin/RegisterLogin';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import Profile from './components/Profile/Profile';
import AccountSettings from './components/AccountSettings/AccountSettings';
import SearchResults from './components/SearchResults/SearchResults';
import ViewContent from './components/ViewContent/ViewContent';
import SearchHistory from './components/SearchHistory/SearchHistory';
import ContentManagement from './components/ContentManagement/ContentManagement';

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
        <Route path='/account-settings' element={<AccountSettings />} />
        <Route path='/search-results' element={<SearchResults />} />
        <Route path='/view-content' element={<ViewContent />} />
        <Route path='/search-history' element={<SearchHistory />} />
        <Route path='/content-management' element={<ContentManagement />} />
      </Routes>
    </Router>
  )
}

export default App
