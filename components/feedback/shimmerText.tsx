import { Typography, keyframes, styled } from '@mui/material';

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const ShimmerTypography = styled(Typography)(({ theme }) => ({
  display: 'inline-block',
  background: `linear-gradient(
    90deg, 
    rgba(255, 255, 255, 0.2) 25%, 
    rgba(255, 255, 255, 0.8) 50%, 
    rgba(255, 255, 255, 0.2) 75%
  )`,
  backgroundSize: '200% auto',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: `${shimmer} 2s linear infinite`,
}));

export default function ShimmerText() {
  return <ShimmerTypography variant="body1">Retrieving weather report...</ShimmerTypography>;
}