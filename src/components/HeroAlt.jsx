import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import visuallyHidden from '@mui/utils/visuallyHidden';
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import axios from 'axios';

const TMDB_API_KEY = '536bf1b102f1ad7b92eb4e41eae3d40e';

export default function Hero({onSearch}) {

   const [query, setQuery] = useState('');

  const handleSearch = async () => {
    if (!query) return;
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
      );
      onSearch(res.data.results);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: '100%',
        backgroundRepeat: 'no-repeat',
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
        ...theme.applyStyles('dark', {
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
        }),
      })}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 14, sm: 20 },
        }}
      >
        <Stack
          spacing={2}
          useFlexGap
          sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' },
          mb: 4, }}
        >
          <Typography
            variant="h1"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              fontSize: 'clamp(3rem, 10vw, 3.5rem)',
              color: 'primary.main'
            }}
          >
            &nbsp;Movie Library&nbsp;
          </Typography>
          <Typography
            sx={{
              textAlign: 'center',
              color: 'text.primary',
              width: { sm: '100%', md: '80%' },
            }}
          >
            Explore Best Movies in the whole world.Experience the joy of finding the best movies of all time.Enter what you desire and let us bring up the whole cinema world for you
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            useFlexGap
            sx={{ pt: 2, width: { xs: '100%', sm: '350px' } }}
          >
            <InputLabel htmlFor="search-hero" sx={visuallyHidden}>
              Search
            </InputLabel>
            <TextField
              id="search-hero"
              hiddenLabel
              size="small"
              variant="outlined"
              aria-label="Search Your favourite movie"
              placeholder="Movie Name here"
              fullWidth
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              slotProps={{
                htmlInput: {
                  autoComplete: 'off',
                  'aria-label': 'Search Your favourite movie',
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              size="small"
              sx={{ minWidth: 'fit-content' }}
              onClick={handleSearch}
            >
              Search here
            </Button>
          </Stack>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            useFlexGap
            sx={{ pt: 2, width: { xs: '100%', sm: '350px' } }}
          >
        </Stack>
        </Stack>
      </Container>
    </Box>
  );
}