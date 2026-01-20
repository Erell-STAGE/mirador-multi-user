import { Grid, TextField } from "@mui/material";
import { ChangeEventHandler } from "react";

interface IFieldFormProps {
  label: string;
  value: string;
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onFocus?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  type?: string;
  placeholder: string;
  name: string;
}

export const FieldForm = ({
  label,
  value,
  onChange,
  onFocus,
  type = "text",
  placeholder,
  name,
}: IFieldFormProps) => {
  return (
    <Grid item>
      <TextField
        label={label}
        inputProps={{
          maxLength: 255,
        }}
        variant="outlined"
        fullWidth
        type={type}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        placeholder={placeholder}
        name={name}
      />
    </Grid>
  );
};
