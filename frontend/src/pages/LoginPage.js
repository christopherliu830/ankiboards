import React, { useState, useCallback } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import LoadingButton from '../components/LoadingButton';
import FormField from '../components/FormField';
import { useAuth } from '../behaviors/use-auth';

export default function() {
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
  const email = emailPair[0];
  const pword = pwordPair[0];

  const [ loading, setLoading ] = useState(null);
  const auth = useAuth();
  const history = useHistory();
  const params = useParams();

  const handleSubmit = useCallback(e => {
    e.preventDefault();
    setLoading(true);
    auth.signin(email.value, pword.value)
    .then(() => history.push(`/${params.redirect}`))
    .catch(err => {
      console.log(err);
      switch(err.code) {
        case 'auth/invalid-email':
          emailPair[1]({...email, error: err.message});
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
            { [emailPair, pwordPair].map(pair => {
              const {id, error, value, ...others} = pair[0];
              return <FormField
                key={id}
                {...others}
                errorMessage={error}
                onChange={e => { pair[1]({...pair[0], value: e.target.value, error: ''}) }}
              />
            })}
            <div className="my-5"></div>
            <LoadingButton loaded={!loading} type="submit" block onClick={handleSubmit}>Submit</LoadingButton>
            <Form.Text>...or <Link to="/signup">sign up</Link></Form.Text>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}