import { GetWeatherHook, GetTargetValueField } from "@/lib/types";
import OutlinedInput from "@mui/material/OutlinedInput";

type FormInputProps = {
    getInput: GetWeatherHook["getInput"],
    stateProperty: GetTargetValueField 
}

export default function FormInput({
    getInput,
    stateProperty
}: FormInputProps) {

    return (
        <OutlinedInput
        autoComplete="off"
        onChange={(e) => getInput(e, stateProperty)}
        sx={{
          border: 1,
          borderColor: "rgba(4, 59, 92, 0.5)",
          borderRadius: 1.5,
          color: "rgba(255, 255, 255, 0.8)"
        }}
          id="zip"
          name="zip"
          type="zip"
          placeholder="12345"
          required
          size="small"
        />
    )
}