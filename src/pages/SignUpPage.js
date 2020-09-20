import React, { useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function() {
  const [ userInfo, updateUserInfo ] = useState({
    uname: '',
    email: '',
    pword: '',
    reEnterPword: '',
  })
  const [ success, setSuccess ] = useState(null);
  const [ errors, setErrorMsg ] = useState({
    uname: '',
    email: '',
    pword: '',
    reEnterPword: '',
  });

  const handleInfoChange = obj => {
    updateUserInfo({
      ...userInfo,
      ...obj,
    });
  }

  const handleSubmit = e => {
    e.preventDefault();
    if (userInfo.pword !== userInfo.reEnterPword) {
      setErrorMsg({reEnterPword: "Your passwords don't match!"});
      return;
    }
    setErrorMsg({
      uname: '',
      email: '',
      pword: '',
      reEnterPword: '',
    });

    const { uname, email, pword } = userInfo;
    fetch(process.env.REACT_APP_API + '/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({username: uname, email: email, password: pword}),
    }).then(response => {
      console.log(response);
      if (response.status === 404) {
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
          <h1 className="text-center mb-5">Sign Up</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="penguin2squishy" 
                value={userInfo.uname} 
                onChange={e => handleInfoChange({uname: e.target.value})}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control type="text" 
                placeholder="penguin2squishy@gmail.com" 
                value={userInfo.email} 
                onChange={e => handleInfoChange({email: e.target.value})}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" 
                placeholder="penguin1902" 
                value={userInfo.pword} 
                onChange={e => handleInfoChange({pword: e.target.value})}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Re-enter password</Form.Label>
              <Form.Control type="password" 
                placeholder="penguin1902" 
                value={userInfo.reEnterPword} 
                onChange={e => handleInfoChange({reEnterPword: e.target.value})}
              />
              {errors.reEnterPword && <Form.Text className="text-danger">{errors.reEnterPword}</Form.Text>}
            </Form.Group>
            <Button type="submit" block onClick={handleSubmit}>Submit</Button>
            <Form.Text>...or <Link to="/login">log in</Link></Form.Text>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}