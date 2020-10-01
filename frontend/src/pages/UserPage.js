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
  const [ isLoaded, setIsLoaded ] = useState(false);
  const [ userData, setUserData ] = useState({ankiInfo: {}, username: ''});

  useEffect(() => {
    fetch(process.env.REACT_APP_API + `/user/${queryId}`)
      .then( response => {
        if (response.ok) return response.json();
      })
      .then(data => {
        console.log(data);
        setUserData(data);
        setIsLoaded(true);
      })
    .catch(err => console.log(err))
  }, []);

  const LoadingContainer = withLoading(isLoaded)(Container);

  return ( 
    <LoadingContainer fluid className="h-100 mx-auto my-5">
      <Row className="m-2">
        <Col>
        <h1>{userData && userData.username}</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          {userData.ankiInfo.heatmap ? 
            <Heatmap calendar={userData.ankiInfo.heatmap}/> :
            <h3>{userData.username} has not synced any reviews!</h3>
          }
        </Col>
      </Row>
    </LoadingContainer>
  )
}