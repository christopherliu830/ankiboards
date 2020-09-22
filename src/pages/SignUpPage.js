import React, { useState, useCallback } from 'react';
import { Redirect, Link, useHistory } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Collapse from 'react-bootstrap/Collapse';
import LoadingButton from '../components/LoadingButton';
import FormField from '../components/FormField';
import { useAuth } from '../behaviors/use-auth';

export default function() {
  const usernamePair = useState({
    id: 'username', 
    label: 'Username',
    placeholder: "penguinman",
    value: '', 
    error: '',
    type: 'text',
  });
  const emailPair = useState({
    id: 'email',
    label: 'Email',
    placeholder: "penguin2squishy@gmail.com",
    value: '', 
    error: '',
    type: 'text'
  });
  const pwordPair = useState({
    id: 'password', 
    label: 'Password',
    value: '', 
    error: '',
    placeholder: 'password',
    type: 'password'
  });
  const secondPwordPair = useState({
    id: 'secondPassword', 
    label: 'Re-enter Password',
    value: '', 
    error: '',
    placeholder: 'password',
    type: 'password'
  });
  const username = usernamePair[0];
  const email = emailPair[0];
  const pword = pwordPair[0];
  const secondPword = secondPwordPair[0];

  const history = useHistory();
  const [ loading, setLoading ] = useState(false);
  const auth = useAuth();

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    auth.signup(email.value, pword.value)
      .then(user => {
        console.log('firebase account created...');
        user.updateProfile({ displayName: username.value, });
        signupRequest(user);
      })
      .then(() => history.push('/'))
      .catch(err => {
        switch(err.code) {
          case 'auth/invalid-email':
          case 'auth/email-already-in-use':
            emailPair[1]({...email, error: err.message});
            break;
          case 'auth/weak-password':
            pwordPair[1]({...pword, error: err.message});
            break;
        }
      })
      .then(() => {
        setLoading(false);
      });
  }

  const signupRequest = async user => {
    const params = new URLSearchParams({
      firebaseUid: user.uid,
      username: username.value,
    });
    const str = params.toString();
    console.log(str);
    return fetch(process.env.REACT_APP_API + '/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: str,
    })
    .catch(async err => {
      const j = await err.json();
      console.log(j);
    })
    .then(data => console.log(data));
  }

  return (
    <Container fluid className="h-75 d-flex flex-column justify-content-center p-5">
      <Row className="justify-content-center">
        <Col style={{maxWidth: '400px'}} className="bg-light p-5">
          <h1 className="text-center mb-5">Sign Up</h1>
          <Form onSubmit={handleSubmit}>
            { [usernamePair, emailPair, pwordPair, secondPwordPair].map(pair => {
              const {id, error, value, ...others} = pair[0];
              return <FormField
                key={id}
                value={value}
                {...others}
                errorMessage={error}
                onChange={e => {
                  pair[1]({...pair[0], value: e.target.value, error: ''});
                }}
              />
            })}
            <LoadingButton loaded={!loading} type="submit" block onClick={handleSubmit}>Submit</LoadingButton>
            <Form.Text>...or <Link to="/login">log in</Link></Form.Text>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}