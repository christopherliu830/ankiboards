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
      fetch(process.env.REACT_APP_API, {
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

  const handleSubmit = useCallback(async e => {
    e.preventDefault();
    const token = await auth.user.getIdToken(true);
    fetch(process.env.REACT_APP_API + '/profile-name', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`,
      }, 
      body: await new URLSearchParams({username: username}).toString(),
    });
    auth.user.updateProfile({
      displayName: username,
    })
    .then(() => console.log('success', auth.user.displayName))
    .catch(err => console.log(err));
  });

  return (
    <Container 
      fluid 
      className="h-100 d-flex flex-column my-5"
      {...props}
    >
      <Row className="mb-2">
        <Col>
          <Form>
            <Form.Text>Cards studied: </Form.Text>
            <Form.Group>
              <Form.Control 
                type="text" 
                placeholder={"ass"}
                value={username} 
                onChange={e => setUsername(e.target.value)}
              />
            </Form.Group>
            <Button onClick={handleSubmit}>click me</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
export default ProfileSettingsPage;