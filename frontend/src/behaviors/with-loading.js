import React, { useEffect } from 'react';
import Loader from '../components/Loader';

const defaultSpinnerProps = {
  as:'span',
  size:'sm',
  role:'status',
}

const defaultOptions = {
  onLoad: null,
  onUnload: null,
  spinnerProps: defaultSpinnerProps,
}
export const withLoading = (loaded, options) => Component => React.forwardRef((props, ref) => {
  const { ...otherProps} = props;

  if (!options) options = defaultOptions;
  let { onLoad, onUnload, spinnerProps} = options;
  if (!spinnerProps) spinnerProps = defaultSpinnerProps;
  const l = loaded;

  useEffect(() => {
    if (loaded) {
      onLoad && onLoad();
    }
    else {
      onUnload && onUnload();
    }
  }, [l, onLoad, onUnload]);

  const {children, ...noChildren} = otherProps;

  return (
    loaded ? 
    <Component ref={ref} {...props}/> : 
    <Component ref={ref} {...noChildren}><Loader {...spinnerProps}/></Component>
  );
});
