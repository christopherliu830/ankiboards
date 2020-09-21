import React, { useState, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Collapse from 'react-bootstrap/Collapse';
import LoadingButton from '../components/LoadingButton';
import { useAuth } from '../behaviors/use-auth';

export default function() {
  const [ userInfo, updateUserInfo ] = useState({
    uname: { 
      id: 'email', 
      label: 'Email Address',
      placeholder: "penguin2squishy@gmail.com",
      value: '', 
      error: '',
      type: 'text',
    },
    pword: { 
      id: 'password', 
      label: 'Password',
      value: '', 
      error: '',
      placeholder: 'password',
      type: 'password'
    },
    remember: { value: false, error: ''},
  })
  const [ loading, setLoading ] = useState(null);
  const [ errorMsg, setErrorMsg ] = useState('');
  const auth = useAuth();
  const history = useHistory();

  const {uname, pword, remember} = userInfo;


  const handleError = useCallback((field, val) => {
    field.error = val;
    const state = {...userInfo}; 
    updateUserInfo(state);
  }, [updateUserInfo]);

  const handleInfoChange = useCallback((field, val) => {
    field.value = val;
    const state = {...userInfo};
    updateUserInfo(state);
    handleError(field, '');
  }, [updateUserInfo, handleError])

  const handleSubmit = useCallback(e => {
    e.preventDefault();
    console.log(userInfo);
    setLoading(true);
    auth.signin(userInfo.uname.value, userInfo.pword.value)
    .then(() => history.push('/'))
    .catch(err => {
      console.log(err);
      switch(err.code) {
        case 'auth/invalid-email':
          console.log('handling');
          handleError(uname, err.message);
          break;
      }
      setLoading(false);
    })
  });


  return (
    <Container fluid className="h-75 d-flex flex-column justify-content-center p-5">
      <Row className="justify-content-center">
        <Col style={{maxWidth: '400px'}} className="bg-light p-5">
          <h1 className="text-center mb-5">Sign In</h1>
          <Form onSubmit={handleSubmit}>
            {errorMsg && <Form.Text className="text-danger mb-1">{errorMsg}</Form.Text>}
            { [uname, pword].map(item => (
              <Form.Group key={item.id} controlId={`form-${item.id}`}>
                <Form.Label>{item.label}</Form.Label>
                <Form.Control 
                  type={item.type}
                  placeholder={item.placeholder} 
                  value={item.value} 
                  isInvalid={item.error}
                  onChange={e => handleInfoChange(item, e.target.value)}
                />
                <Collapse in={item.error}>
                  <Form.Text className="text-muted m-0 p-0">
                    {item.error}
                  </Form.Text>
                </Collapse>
              </Form.Group>
            ))}
            <Form.Group>
              <Form.Check 
                type="checkbox" 
                value={remember} 
                label="Remember me" 
                onChange={e => handleInfoChange('remember', e.target.value)}
              />
            </Form.Group>
            <LoadingButton loaded={!loading} type="submit" block onClick={handleSubmit}>Submit</LoadingButton>
            <Form.Text>...or <Link to="/signup">sign up</Link></Form.Text>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}