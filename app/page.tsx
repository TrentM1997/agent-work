"use client";
import { useGetWeather } from "@/lib/hooks/useGetWeather";
import Stack from "@mui/material/Stack";
import LocationForm from "@/components/forms/locationForm";
import Container from "@mui/material/Container";
import RenderAgentMessage from "@/components/pipelines/renderAgentMessage";

export default function Home() {
  const { getWeather, results, getCityInput, getStateInput, getZipInput } =
    useGetWeather();

  return (
    <Container
      sx={{
        backgroundColor: "rgba(11, 15, 20, 1)",
        height: "100%",
        width: "100%",
        flexGrow: 1,
      }}
    >
      <Stack direction={"column"} alignItems={"center"}>
        <LocationForm
          getCityInput={getCityInput}
          getStateInput={getStateInput}
          getZipInput={getZipInput}
          getWeather={getWeather}
        />
      </Stack>

      <Stack
        direction={"row"}
        alignItems={"start"}
        justifyContent={"start"}
        sx={{
          border: 1,
          borderColor: "rgba(4, 59, 92, 0.5)",
          borderRadius: 2,
          padding: 2,
          minHeight: "400px",
          minWidth: "500px",
          marginTop: 8,
        }}
      >
          <RenderAgentMessage results={results} />
      </Stack>
    </Container>
  );
}
