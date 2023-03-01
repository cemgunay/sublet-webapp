import React, { useState } from "react";

import classes from "./FormInput.module.css";

function FormInput(props) {

  const [focused, setFocused] = useState('false');

  const handleFocus = (e) => {
    setFocused('true');
  };

  return (
    <div className={classes.inputDiv}>
      <input
        className={classes.input}
        name={props.name}
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        ref={props.innerRef}
        onFocus={props.onFocus}
        onBlur={handleFocus}
        focused={focused}
        pattern={props.pattern}
        required
      />
      <span className={classes.errorMessage}>{props.errorMessage}</span>
      {props.text ? <span className={classes.text}>{props.text}</span> : null}
    </div>
  );
}

export default FormInput;

//{props.text ? <span className={props.classNameSpan}>{props.text}</span> : null}
