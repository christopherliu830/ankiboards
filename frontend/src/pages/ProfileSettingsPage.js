import React, { useEffect, useState, useCallback } from 'react';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import { useAuth } from '../behaviors/use-auth';
import Heatmap from '../components/Heatmap';
import EditableField from '../components/EditableField';
import changeDisplayname from '../util/change-displayname';

function ProfileSettingsPage(props) {
  const auth = useAuth();
  const [ ankiData , setAnkiData ] = useState();
  const [ loading, setLoading ] = useState();
  const [ displayName, setDisplayName ] = useState('');

  const handleSync = useCallback(() => {
    const testAction = {
      action: 'getReviews',
      version: 6
    };
    console.log(process.env.REACT_APP_ANKI_API);
    fetch(process.env.REACT_APP_ANKI_API, {
      method: 'POST',
      body: JSON.stringify(testAction),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setAnkiData(data.result);
      })
      .catch(err => console.log(err))
  })

  useEffect(() => {
    if (!auth.user) return;
    auth.user.getIdToken()
    .then(token => { 
      return fetch(process.env.REACT_APP_API + '/profile-info', {
        headers: {
          'Authorization' : `Bearer ${token}`,
        }
      })
    })
    .then(response => { return response.json(); })
    .then(data => {
      console.log(data);
      setAnkiData(data.reviews)
    });
  }, [auth.user]);

  useEffect(() => { if (auth.user) setDisplayName(auth.user.displayName) }, [auth.user]);

  const handleEdit = async val => {
    const token = await auth.user.getIdToken();
    const response = await changeDisplayname(val, token);
    console.log(await response.json());
  }

  return (
    <Container 
      fluid="md"
      className="my-5"
      {...props}
    >
      <Row className="mb-2">
        <Col>
          {auth.user && <EditableField viewProps={{className:"h1"}} value={displayName} onSave={handleEdit}/>}
        </Col>
      </Row>
      <Row className="mb-2">
        <Col>
          {ankiData && <Heatmap calendar={ankiData}/>}
        </Col>
      </Row>
    </Container>
  );
}
export default ProfileSettingsPage;