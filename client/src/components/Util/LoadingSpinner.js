// LoadingSpinner.js

import React from 'react';
import { ClipLoader } from 'react-spinners';

function withLoadingSpinner(WrappedComponent) {
  return function WithSpinner(props) {
    const { isLoading, ...otherProps } = props;

    return isLoading ? (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ClipLoader />
      </div>
    ) : (
      <WrappedComponent {...otherProps} />
    );
  };
}

export default withLoadingSpinner;
