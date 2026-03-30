import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import { JSX } from 'react';

export default function AgentRunErrorAlert({ error }: { error: string}): JSX.Element {
  return (
    <Stack sx={{ width: '100%', position: "fixed", bottom: 12 }} spacing={2}>
      <Alert severity="error">
        <AlertTitle>Agent Run Error</AlertTitle>
        {error}
      </Alert>
    </Stack>
  );
}

