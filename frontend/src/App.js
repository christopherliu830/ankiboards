import React from 'react';
import {Route, Switch } from 'react-router-dom';
import * as pages from './pages';
import Navbar from './components/Navbar';
import './App.css';

function App() {

  return (
    <div className="d-flex flex-column h-100 align-content-stretch">
      <Navbar/>
      <Switch>
        <Route path='/' exact><pages.HomePage/></Route>
        <Route path='/login'><pages.LoginPage/></Route>
        <Route path='/signup'><pages.SignUpPage/></Route>
        <Route path='/profile'><pages.ProfileSettingsPage/></Route> 
        <Route path='/about'><pages.AboutPage/></Route>
        {/* <Route path='/get-started'><pages.GetStartedPage/></Route> */}
        <Route path='/oauth'><pages.OAuthPage/></Route>
        <Route path='/user/:id'><pages.UserPage/></Route>
      </Switch>
    </div>
  )
}

export default App;
