import React from "react";
import FormInput from "../FormInput";

import classes from "./Email.module.css";

function Email({ formData, setFormData }) {
  const handleOnChange = (e) => {
    setFormData({ ...formData, email: e.target.value });
  };

  return (
    <FormInput
      className={classes.input}
      type="email"
      placeholder="Email"
      value={formData.email}
      onChange={handleOnChange}
    />
  );
}

export default Email;

//value={formData.email}
//onChange={(event) => setFormData({...formData, email: event.target.value})}
