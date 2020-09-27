import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import './Loader.css';

export default function LoadingVisual(props) {
  return (
    <div className="loader">
        <Spinner animation="border" role="status" {...props}>
        <span className="sr-only">Loading...</span>
        </Spinner>
    </div>
  )
}