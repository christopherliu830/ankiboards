import React from 'react';
import { Link, useHistory} from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../behaviors/use-auth';

export default function() {
  const history = useHistory();
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
          <Nav.Link as={Link} to="/me" eventKey="/me">My Page</Nav.Link>
          <Nav.Link as={Link} to="/about" eventKey="/about">About</Nav.Link>
        </Nav.Item>
      </Nav>
      <div className="justify-content-end">
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
      </div>
    </Navbar>
  )
}