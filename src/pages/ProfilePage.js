import React, { useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';

export default function(props) {
  const [ user, setProfileInfo ] = useState(null);

  useEffect(() => {
    fetch(process.env.REACT_APP_API + '/profile', {
      credentials: 'include',
    }).then(response => {
      if (response.ok) return response.json();
    }).then(data => {
      console.log(data);
      setProfileInfo(data);
    })
  }, []);

  if (!user) return (
    <Container fluid className="h-100 d-flex flex-column align-items-center justify-content-center">
      <Row>
        <Col>
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </Col>
      </Row>
    </Container>
  )

  return (
    <Container fluid className="h-100 d-flex flex-column m-5">
      <Row className="mb-2">
        <h1>{user.username}</h1>
      </Row>
      <Row>
        <h4>Cards studied: {user.ankiInfo.cardsStudied}</h4>
      </Row>
    </Container>
  );
}