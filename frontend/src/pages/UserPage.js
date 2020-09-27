import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import {withLoading} from '../components/LoadingContainer';
import Heatmap from '../components/Heatmap';

export default function ({ match }) {
  const params = useParams();
  const queryId = params.id;
  const [ userData, setUserData ] = useState(null);

  useEffect(() => {
    fetch(process.env.REACT_APP_API + `/user/${queryId}`)
      .then( response => {
        if (response.ok) return response.json();
      })
      .then(data => {
        setUserData(data);
      })
    .catch(err => console.log(err))
  }, []);

  return ( 
    <Container fluid className="h-100 d-flex flex-column m-5">
      <Row className="mb-2">
        <h1>{userData && userData.username}</h1>
      </Row>
      <Row>
        {userData && <Heatmap calendar={userData.ankiInfo.reviews}/>}
      </Row>
    </Container>
  )
}