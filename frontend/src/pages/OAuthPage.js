import React, { useState, useCallback, useEffect } from 'react';
import { useHistory, useRouteMatch, Route, Router } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import LoadingButton from '../components/LoadingButton';
import FormField from '../components/FormField';
import { useAuth } from '../behaviors/use-auth';
import { withLoading } from '../behaviors/with-loading';
import qs from 'qs';

export default function(props) {
  const [ loading, setLoading ] = useState();
  const [ pageLoaded, setPageLoaded ] = useState(false);
  const [ success, setSuccess ] = useState(false);
  const auth = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (auth.user) setPageLoaded(true);
    else if (auth.user === false) history.push(`/login?goBack=true`); // null means we don't know if they are signed in
  }, [auth.user])

  const sendClientData = async () => {
    let clientData = {}
    const token = await auth.user.getIdToken();
    const response = await fetch(process.env.REACT_APP_API + '/add-client', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    const post = await fetch('http://localhost:9091', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    if (!post.ok) throw Error("Getting Client Data failed")
    else return data;
  }

  const handleSubmit = async e => {
    e.preventDefault();
    const reqQuery = qs.parse(history.location.search, { ignoreQueryPrefix: true});

    setLoading(true);
    const data = await sendClientData();

    const params = new URLSearchParams({
      client_id: data.clientId,
      response_type: 'code',
      state: reqQuery.state,
      redirectUri: reqQuery.redirect,
    }).toString();
    console.log(params);


    auth.user.getIdToken()
      .then(token => {
        return fetch(process.env.REACT_APP_API + '/oauth/authorize', {
          method: 'POST',
          headers: { 
            'Authorization' : `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params,
        })
      })
      .then(response => {
        return response.text();
      })
      .then(data => {
        if (data === 'Success') setSuccess(true);
        setLoading(false);
      })
      .catch(err => console.log(err));
  };

  const LogInForm = () => {
    return <Form>
      <p className="text-center">Authorize app to upload data to Ankiboards?</p>
      <LoadingButton loaded={!loading} block onClick={handleSubmit}>Authorize</LoadingButton>
    </Form>
  }
  const SuccessForm = () => {
    return <Form>
      <p className="text-center">Success! You may now close the window.</p>
    </Form>
  }
  const LoadingDiv = withLoading(pageLoaded)("div")

  return (
    <>
    <Container fluid className="h-75 d-flex flex-column justify-content-center p-5">
      <Row className="justify-content-center">
        <Col style={{maxWidth: '400px'}} className="bg-light p-5">
          <h1 className="text-center mb-5">Authorization</h1>
          <LoadingDiv> 
            { success ? <SuccessForm/> : <LogInForm/> }
          </LoadingDiv>
        </Col>
      </Row>
    </Container>
    </>
  )
}