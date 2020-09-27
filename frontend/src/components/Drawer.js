import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import Switch from 'react-switch';

export function Drawer(props) {
  const { header, ...otherProps } = props;
  const [ save, setSave ] = useState(false);

  const handleClick = e => {
    e.stopPropagation();
    setSave(!save);
  }

  return (
    <Accordion className="my-4">
      <Card> 
        <Accordion.Toggle as={Card.Header} eventKey="0">
          <div className="d-flex flex-row justify-content-between">
            <h5>{header}</h5>
          </div>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          <Card.Body {...otherProps} />
        </Accordion.Collapse>
      </Card>
    </Accordion>
  )
}