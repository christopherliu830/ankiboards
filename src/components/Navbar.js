import React from 'react';
import { Link, useHistory, Route, Switch, useLocation } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Cookies from 'js-cookie';

export default function({userId, onLogout}) {
  const history = useHistory();

  const handleSignOut = e => {
    e.preventDefault();
    if (Cookies.get('header.payload')) Cookies.remove('header.payload');
    onLogout();
    history.push('/');
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow">
      <Navbar.Brand as={Link} to="/">Ankiboards</Navbar.Brand>
      <Nav 
        className="mr-auto" 
        style={{fontSize: '1.25rem'}} 
        activeKey={history.location.pathname} 
      >
        <Nav.Item>
          <Nav.Link as={Link} to="/profile" eventKey="/profile">Profile</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/test" eventKey="/test">Profile</Nav.Link>
        </Nav.Item>
      </Nav>
      <Navbar.Collapse className="justify-content-end">
        { userId ? 
          <div>
            <Navbar.Text>Signed in as: <span className="text-light mr-2">{userId}</span></Navbar.Text>
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