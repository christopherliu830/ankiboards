import React, { useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';

export default function LoadingContainer(props) {
  return (
    <div className="w-100 h-100 d-flex align-items-center justify-content-center">
      <Spinner animation="border" role="status" {...props}>
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div>
  )
}

export const withLoading = (loaded, options) => Component => (props) => {
  if (!options) options = { onLoad: null, onUnload: null };
  const { onLoad, onUnload, spinnerProps} = options;
  const l = loaded;
  useEffect(() => {
    if (loaded) {
      onLoad && onLoad();
    }
    else {
      onUnload && onUnload();
    }
  }, [l, onLoad, onUnload]);
  const {children, ...noChildren} = props;
  return loaded ? <Component {...props}/> : <Component {...noChildren}><LoadingContainer {...spinnerProps}/></Component>;
}