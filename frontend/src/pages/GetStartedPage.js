import React, { useState, useEffect } from 'react';
import { useAuth } from '../behaviors/use-auth';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export default function(props) {
  const auth = useAuth();
  const [ apiKey, setApiKey ] = useState(null); 

  useEffect(() => {
    if (!auth.user) return;
    auth.user.getIdToken()
      .then(idToken => {
        return fetch(process.env.REACT_APP_API + '/add-client', {
          headers: { 'Authorization': `Bearer ${idToken}` }
        })
      })
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log(data);
        setApiKey(data.clientId);
      });
  }, [auth.user]);

  return (
    <Container fluid className="h-75 d-flex flex-column py-5">
      <Row className="justify-content-md-center">
        <Col xl="5" lg="6" md="8">
          <h1 className="mb-5 text-center">Under Construction!</h1>
        </Col>
      </Row>
      <Row><Col>
        Your API key: {apiKey}
      </Col></Row>
    </Container>
  )
}