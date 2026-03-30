import type { JSX } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { WeatherResultsType } from '@/lib/hooks/useGetWeather';

export default function SimpleBackdrop({ status}: { status: WeatherResultsType["status"]}): JSX.Element {

  return (
    <div>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={(status === "pending")}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}