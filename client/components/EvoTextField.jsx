import React from "react";

import FormControl from "@material-ui/core/FormControl/FormControl";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Input from "@material-ui/core/Input/Input";
import FormHelperText from "@material-ui/core/FormHelperText/FormHelperText";

export const EvoTextField = ({type, name, label, value, onChange, error, ...props}) => (
  <FormControl error={!!error} {...props}>
    <InputLabel htmlFor={name}>{label}</InputLabel>
    <Input id={name} type={(type)?type:"text"} name={name} value={value} onChange={onChange}/>
    <FormHelperText id={name + '-error'}>{error}</FormHelperText>
  </FormControl>
);

export default EvoTextField;