import React, { useEffect, useState } from 'react';
import { Link, useHistory, Route, Switch, useLocation } from 'react-router-dom';
import { HomePage, LoginPage, SignUpPage, ProfilePage } from './pages';
// import Navbar from 'react-bootstrap/Navbar';
import Navbar from './components/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import './App.css';


function App() {
  const [userId, setUserId] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (!userId) {
      const token = Cookies.get('header.payload');
      console.log(token);
      const decoded = jwt.decode(token + '.'); // Add period for empty signature
      if (decoded) setUserId(decoded.payload.username); 
    }
  }, [userId, location])

  const handleSignOut = e => {
    e.preventDefault();
    if (Cookies.get('header.payload')) Cookies.remove('header.payload');
    setUserId(null);
  }

  return (
    <div className="d-flex flex-column h-100 align-content-stretch">
      <Navbar userId={userId} onLogout={() => setUserId(null)}/>
      <Switch>
        <Route path='/' component={HomePage} exact/>
        <Route path='/login' component={LoginPage}/>
        <Route path='/signup' component={SignUpPage}/>
        <Route path='/profile' component={ProfilePage}/>
      </Switch>
    </div>
  )
}

export default App;
