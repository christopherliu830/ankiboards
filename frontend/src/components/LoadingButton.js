import React from 'react';
import Button from 'react-bootstrap/Button';
import { withLoading } from './LoadingContainer';

function LoadingButton(props) {
  const { loaded, onLoad, onUnload, ...otherProps} = props;
  const options = {
    spinnerProps: {
      as:'span',
      size:'sm',
      role:'status',
    }
  }
  const LoadedButton = withLoading(loaded, options)(Button);
  return <LoadedButton {...otherProps} disabled={!loaded}/>;
}

export default LoadingButton;