import FormLabel from "@mui/material/FormLabel";


export default function FormInputLabel({ 
    inputLabel
}: { inputLabel: string}) {

    return (
        <FormLabel 
        sx={{
            color: "rgba(64, 97, 171, 0.8)"
        }}
        htmlFor={inputLabel} required>
            {inputLabel}
        </FormLabel>
    )
}