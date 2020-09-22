import React from 'react';
import Form from 'react-bootstrap/Form';
import Collapse from 'react-bootstrap/Collapse';

export default function FormField(props) {
  const { 
    id, 
    label, 
    type, 
    placeholder, 
    value, 
    isInvalid, 
    onChange, 
    errorMessage,
    ...otherProps
  } = props;
  return (
    <Form.Group {...otherProps} controlId={`form-${id}`}>
      <Form.Label>{label}</Form.Label>
      <Form.Control 
        type={type}
        placeholder={placeholder} 
        value={value} 
        isInvalid={errorMessage}
        onChange={onChange}
      />
      <Collapse in={errorMessage !== ''}>
        <Form.Text className="text-danger m-0 p-0">
          {errorMessage}
        </Form.Text>
      </Collapse>
    </Form.Group>
  );
}