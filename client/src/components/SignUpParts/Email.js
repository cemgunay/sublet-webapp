import React from "react";

import classes from "./SignUpParts.module.css";

function Email({ formData, setFormData }) {

  console.log(formData.email)

  const handleOnChange = (e) => {
    setFormData({...formData, email: e.target.value})
  }

  return (
    <div className={classes.emailform}>
        <input
          className={classes.email}
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleOnChange}
        />
    </div>
  );
}

export default Email;

//value={formData.email}
//onChange={(event) => setFormData({...formData, email: event.target.value})}