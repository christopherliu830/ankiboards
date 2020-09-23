import React, { useEffect, useState, useRef } from 'react';
import { Link, useHistory, Route, Switch, useLocation } from 'react-router-dom';
import { HomePage, LoginPage, SignUpPage, ProfileSettingsPage, UserPage } from './pages';
// import Navbar from 'react-bootstrap/Navbar';
import Navbar from './components/Navbar';
import Cookies from 'js-cookie';
import './App.css';

function App() {
  const [userId, setUserId] = useState(null);
  const location = useLocation();

  const handleSignOut = e => {
    e.preventDefault();
    if (Cookies.get('header.payload')) Cookies.remove('header.payload');
    setUserId(null);
  }

  return (
    <div className="d-flex flex-column h-100 align-content-stretch">
      <Navbar userId={userId} onLogout={() => setUserId(null)}/>
      <Switch>
        <Route path='/' exact><HomePage/></Route>
        <Route path='/login'><LoginPage/></Route>
        <Route path='/signup'><SignUpPage/></Route>
        <Route path='/profile'><></></Route> {/* Under Construction! */}
        <Route path='/user/:id'><UserPage/></Route>
      </Switch>
    </div>
  )
}

export default App;
