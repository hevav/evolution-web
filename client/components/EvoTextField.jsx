import React from "react";

import TextField from "@material-ui/core/TextField";

export const EvoTextField = ({type, name, error,  value, onChange, ...props}) => (
  <TextField
    {...props}
    id={name}
    name={name}
    type={(type)?type:"text"}
    error={!!error}
    onChange={onChange}
    helperText={error}
    margin='normal'
  />
);

export default EvoTextField;