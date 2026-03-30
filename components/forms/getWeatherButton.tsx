"use client";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { JSX } from "react";

type GetWeatherButtonProps = {
    getWeather: () => Promise<void>;
}

export default function GetWeatherButton({ getWeather }: GetWeatherButtonProps): JSX.Element {

    return (
        <Button 
        onClick={getWeather}
        type="button" 
        color="primary" 
        variant="contained"
        size="medium"
        >
            <Typography
            variant="button"
            color="textPrimary"
            fontFamily={"system-ui"}
            >
                Request Weather Report
            </Typography>
        </Button> 
    )
}