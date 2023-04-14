import React from 'react'

import classes from './ProgressBar.module.css'

function ProgressBar({ progress }) {
  return (
    <div
      className="progress-bar-container"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '5px',
        zIndex: 1,
      }}
    >
      <div
        className="progress-bar"
        style={{
          width: `${progress}%`,
          backgroundColor: 'blue',
          height: '100%',
        }}
      ></div>
    </div>
  );
}

export default ProgressBar