import React, { useEffect, useState } from 'react';
import { Link, useHistory, Route, Switch, useLocation } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Cookies from 'js-cookie';
import { useAuth } from '../behaviors/use-auth';

export default function({userId, onLogout}) {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const auth = useAuth();

  const handleSignOut = e => {
    e.preventDefault();
    auth.signout();
    history.push('/');
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow">
      <Navbar.Brand as={Link} to="/">Ankiboards</Navbar.Brand>
      <Nav 
        className="mr-auto flex-row" 
        style={{fontSize: '1.25rem'}} 
        activeKey={history.location.pathname} 
      >
        <Nav.Item>
          <Nav.Link as={Link} to="/about" eventKey="/about">About</Nav.Link>
        </Nav.Item>
      </Nav>
      <Navbar.Collapse className="justify-content-end">
        { auth.user ? 
          <div>
            <Navbar.Text>Signed in as: <Link to="/profile" className="text-light mr-2">{auth.user.displayName}</Link></Navbar.Text>
            <Button variant="primary" href="/" onClick={handleSignOut}>Logout</Button>
          </div> :
          <>
            <Link to="/login"><Button className="mx-1" variant="outline-primary">Sign in</Button></Link>
            <Link to="/signup"><Button className="mx-1" variant="outline-light">Sign up</Button></Link>
          </>
        }
      </Navbar.Collapse>
    </Navbar>
  )
}