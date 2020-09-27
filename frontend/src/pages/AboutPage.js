import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function() {

  return (
    <Container fluid className="h-75 d-flex flex-column p-5">
      <Row className="justify-content-md-center">
        <Col xl="5" lg="6" md="8">
          <h1 className="mb-5">About</h1>
          <span>
              <h3 className="mt-5 mb-3"> Bio </h3> 
              Ankiboards was created by Christopher Liu, a computer science student at New York University, with an interest in East Asian languages
              and programming languages. Chris has been coding since 2011 and studying Japanese with Anki since 2017. 
              You can contact Chris at <a href="mailto:christopherliu830@gmail.com">his email</a>.

              <h3 className="mt-5 mb-3"> AnkiBoards </h3> 
              Ankiboards is an easy way for users to share, log, and analyze their progress with Anki. It's also useful to compare how hard you work
              compared to your two friends also using Anki.
              <br/><br/>
              It employs the following technologies:
              <ul>
                <li>Express for the backend API.</li>
                <li>Firebase for user storage and authentication.</li>
                <li>React and Bootstrap for the frontend app and styling.</li>
                <li>MongoDB for the database.</li>
              </ul>
              Many thanks to: 
              <ul>
                <li><a href="https://apps.ankiweb.net/">Anki</a> for the help throughout the college years.</li>
                <li><a href="https://github.com/glutanimate/review-heatmap">Glutanimate</a> for Anki Heatmap, the source of inspiration.</li>
              </ul>
          </span>
        </Col>
      </Row>
    </Container>
  )
}