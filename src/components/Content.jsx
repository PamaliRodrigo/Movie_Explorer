import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { SitemarkIcon } from './CustomIcons';

const items = [
  {
    icon: <MovieFilterIcon sx={{ color: 'text.secondary' }} />,
    title: 'Seamless Entertainment',
    description:
      'Our platform adapts to your viewing preferences, making movie discovery and ticket booking effortless and enjoyable.',
  },
  {
    icon: <AccessTimeIcon sx={{ color: 'text.secondary' }} />,
    title: 'Reliable Access',
    description:
      'Enjoy uninterrupted movie nights with a dependable system that ensures your bookings, payments, and schedules are always secure.',
  },
  {
    icon: <ThumbUpAltRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Intuitive Experience',
    description:
      'Navigate with ease—from finding showtimes to picking the perfect seat—our interface is designed for smooth, stress-free interaction.',
  },
  {
    icon: <AutoFixHighRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Cutting-Edge Features',
    description:
      'Stay ahead with features that set new standards, addressing your evolving needs better than the rest.',
  },
];

function Content() {
  return (
    <Stack
      sx={{ flexDirection: 'column', alignSelf: 'center', gap: 4, maxWidth: 450 }}
    >
      <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
        <SitemarkIcon />
      </Box>
      {items.map((item, index) => (
        <Stack key={index} direction="row" sx={{ gap: 2 }}>
          {item.icon}
          <div>
            <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </div>
        </Stack>
      ))}
    </Stack>
  );
}

export default Content