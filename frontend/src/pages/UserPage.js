import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import {withLoading} from '../components/LoadingContainer';
import Heatmap from '../components/Heatmap';
import ByHourGraph from '../components/ByHourGraph';
import { getProfileData } from '../util/apicalls';

export default function ({ match }) {
  const params = useParams();
  const queryId = params.id;
  const [ userData, setUserData ] = useState(null);

  useEffect(() => {
    getProfileData(queryId).then(data => setUserData(data));
  }, [queryId]);

  const UsernameCol = withLoading(userData, {left: true})(Col)

  return ( 
    <Container fluid className="h-100 mx-auto my-5">
      <Row className="m-2">
        <UsernameCol>
        <h1>{userData && `${userData.username} - ${userData.reviewsLogged} Reviews Logged`}</h1>
        </UsernameCol>
      </Row>
      <Row>
        <Col>
          <Heatmap className="m-5 shadow rounded bg-light" userId={queryId}/> 
          <ByHourGraph className="m-5 shadow rounded bg-light" userId={queryId}/>
        </Col>
      </Row>
    </Container>
  )
}