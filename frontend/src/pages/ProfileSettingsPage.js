import React, { useEffect, useState, useCallback } from 'react';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { withLoading } from '../components/LoadingContainer';
import { useAuth } from '../behaviors/use-auth';

function ProfileSettingsPage(props) {
  const auth = useAuth();
  const [ username, setUsername ] = useState('');

  const fetchProfileData = useCallback(async () => {
    const token = await auth.user.getIdToken(true);
    return (
      fetch(process.env.REACT_APP_API + '/profile', {
        headers: {
          'Authorization' : `Bearer ${token}`,
        }
      }).then(response => response.text())
        .then(data => console.log(data))
        .catch(err => console.log(err))
    );
  });

  useEffect(() => {
    console.log('?')
    if (auth.user) {
      setUsername(auth.displayName ? auth.displayName : '');
      fetchProfileData();
    }
  }, [auth.user])

  const handleSync = useCallback(() => {
    const testAction = {
      action: 'deckNames',
      version: 6
    };
    console.log(process.env.REACT_APP_ANKI_API);
    fetch(process.env.REACT_APP_ANKI_API, {
      method: 'POST',
      body: JSON.stringify(testAction),
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(err => console.log(err))
  })

  return (
    <Container 
      fluid 
      className="h-100 d-flex flex-column my-5"
      {...props}
    >
      <Row className="mb-2">
        <Col>
          <Form inline>
            <Form.Text>Sync your Anki data: </Form.Text>
            <Button onClick={handleSync}>click me</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
export default ProfileSettingsPage;