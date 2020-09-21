import React, { useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'crypto-js';

export default function() {
  const [ userInfo, updateUserInfo ] = useState({
    uname: '',
    pword: '',
    remember: false,
  })
  const [ success, setSuccess ] = useState(null);
  const [ errorMsg, setErrorMsg ] = useState('');

  const generateStateVariable = () => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    array = array.map(x => possible.charCodeAt(x % possible.length));
    const randomState = String.fromCharCode.apply(null, array);
  }

  const handleInfoChange = obj => {
    updateUserInfo({
      ...userInfo,
      ...obj,
    });
  }

  const handleSubmit = e => {
    const { uname, pword } = userInfo;

    e.preventDefault();
    fetch(process.env.REACT_APP_API + 'login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({username: uname, password: pword}),
    }).then(response => {
      console.log(response);
      if (response.status === 404) {
        setErrorMsg("The user with the supplied username and password was not found.");
        throw new Error("User Not Found!")
      }
      setSuccess(true);
    })
    .then(data => console.log(data))
    .catch(error => console.log(error));
  }

  if (success) return <Redirect to="/"/>
  return (
    <Container fluid className="h-75 d-flex flex-column justify-content-center p-5">
      <Row className="justify-content-center">
        <Col style={{maxWidth: '400px'}} className="bg-light p-5">
          <h1 className="text-center mb-5">Sign In</h1>
          <Form onSubmit={handleSubmit}>
            {errorMsg && <Form.Text className="text-danger mb-1">{errorMsg}</Form.Text>}
            <Form.Group>
              <Form.Label>Email/Username</Form.Label>
              <Form.Control type="text" placeholder="penguin2squishy@gmail.com" value={userInfo.uname} onChange={e => handleInfoChange({uname: e.target.value})}/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="penguin1902" value={userInfo.pword} onChange={e => handleInfoChange({pword: e.target.value})}/>
            </Form.Group>
            <Form.Group>
              <Form.Check type="checkbox" value={userInfo.remember} label="Remember me" onChange={e => handleInfoChange({remember: e.target.value})}/>
            </Form.Group>
            <Button type="submit" block onClick={handleSubmit}>Submit</Button>
            <Form.Text>...or <Link to="/signup">sign up</Link></Form.Text>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}