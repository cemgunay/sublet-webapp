import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

function FormDropdownField({ label, options, name, value, onChange }) {

  return (
    <FormControl fullWidth>
      <InputLabel id={label}>{label}</InputLabel>
      <Select
        labelId={label}
        id={name}
        value={value}
        onChange={onChange}
        label={label}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default FormDropdownField;
