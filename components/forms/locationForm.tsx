import { GetWeatherHook } from '@/lib/types';
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
    getInput: GetWeatherHook["getInput"]
      getWeather: () => Promise<void>;
}

export default function LocationForm({
    getInput,
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
        getInput={getInput}
        stateProperty="city"
        placeholderText="type the city here..."
        />
      </FormGrid>
      <FormGrid size={{ xs: 6 }}>
        <FormInputLabel inputLabel='state' />
          <FormInput 
          getInput={getInput}
        stateProperty="state"
        placeholderText="type the state here..."
          />
      </FormGrid>
      <FormGrid size={{ xs: 6 }}>
        <FormInputLabel inputLabel='Zipcode/Postal code' />
        <FormInput 
        getInput={getInput}
        stateProperty="zip"
        placeholderText="type the zip/postal code here..."
        />
      </FormGrid>
    </Grid>
  );
}
