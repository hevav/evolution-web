import React from "react";

import FormControl from "@material-ui/core/FormControl/FormControl";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Input from "@material-ui/core/Input/Input";
import FormHelperText from "@material-ui/core/FormHelperText/FormHelperText";
import TextField from "@material-ui/core/TextField";

export const EvoTextField = ({type, name, error,  value, onChange, ...props}) => (
  <TextField
    {...props}
    id={name}
    name={name}
    type={(type)?type:"text"}
    error={!!error}
    helperText={error}
    margin='normal'
  />
);

export default EvoTextField;