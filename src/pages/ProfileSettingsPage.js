import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { withLoading } from '../components/LoadingContainer';
import { useAuth } from '../behaviors/use-auth';

function ProfileSettingsPage(props) {
  const auth = useAuth();
  const [ loaded, s ] = useState(true);

  const Component = withLoading(loaded)(() => (
    <Container 
      fluid 
      className="h-100 d-flex flex-column m-5"
      {...props}
    >
      <Row className="mb-2">
        <Col>
          <Form>
            <Form.Text>Cards studied: </Form.Text>
          </Form>
        </Col>
      </Row>
    </Container>
  ));
  return <Component/>
}
export default ProfileSettingsPage;