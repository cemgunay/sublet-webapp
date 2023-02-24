import React from "react";

import classes from "./SignUpParts.module.css";

function Email({ formData, setFormData }) {

  console.log(formData.email)

  return (
    <div className={classes.emailform}>
        <input
          className={classes.email}
          type="text"
          placeholder="Email"
          value={formData.email}
          onChange={(event) => setFormData({...formData, email: event.target.value})}
        />
    </div>
  );
}

export default Email;

//value={formData.email}
//onChange={(event) => setFormData({...formData, email: event.target.value})}