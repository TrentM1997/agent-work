import { GetWeatherHook } from '@/lib/hooks/useGetWeather';
import { styled } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import FormInput from './formInput';
import FormInputLabel from './formInputLabel';
import GetWeatherButton from './getWeatherButton';

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

type LocationFormProps = {
    getCityInput: GetWeatherHook["getCityInput"],
    getStateInput: GetWeatherHook["getStateInput"],
    getZipInput: GetWeatherHook["getZipInput"],
      getWeather: () => Promise<void>;
}

export default function LocationForm({
    getCityInput,
    getStateInput,
    getZipInput,
    getWeather
 }: LocationFormProps) {
  return (
    <Grid sx={{
        marginTop: 4,
        maxWidth: "1200px",
    }} container spacing={3}>

      <FormGrid size={{ xs: 6 }}>
        <FormInputLabel inputLabel='city' />
        <FormInput 
        getInput={getCityInput}
        />
      </FormGrid>
      <FormGrid size={{ xs: 6 }}>
        <FormInputLabel inputLabel='state' />
          <FormInput 
          getInput={getStateInput}
          />
      </FormGrid>
      <FormGrid size={{ xs: 6 }}>
        <FormInputLabel inputLabel='Zipcode/Postal code' />
        <FormInput 
        getInput={getZipInput}
        />
      </FormGrid>
      
      <FormGrid size={{ xs: 12 }}>
        <FormControlLabel
        sx={{
            color: "rgba(64, 97, 171, 0.8)"
        }}
          control={<Checkbox name="saveAddress" value="yes" />}
          label="Use this address for payment details"
        />
      </FormGrid>
      <GetWeatherButton getWeather={getWeather} />
    </Grid>
  );
}
