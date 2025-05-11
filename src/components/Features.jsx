import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import MuiChip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

// Styled chip component
const Chip = styled(MuiChip)(({ theme }) => ({
  variants: [
    {
      props: ({ selected }) => !!selected,
      style: {
        background: 'linear-gradient(to bottom right, hsl(210, 98%, 48%), hsl(210, 98%, 35%))',
        color: 'hsl(0, 0%, 100%)',
        borderColor: (theme.vars || theme).palette.primary.light,
        '& .MuiChip-label': {
          color: 'hsl(0, 0%, 100%)',
        },
        ...theme.applyStyles('dark', {
          borderColor: (theme.vars || theme).palette.primary.dark,
        }),
      },
    },
  ],
}));

// TabPanel component for category switching
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`movie-tabpanel-${index}`}
      aria-labelledby={`movie-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `movie-tab-${index}`,
    'aria-controls': `movie-tabpanel-${index}`,
  };
}

// Mobile layout component
function MobileLayout({ movies, selectedItemIndex, handleItemClick, selectedMovie }) {
  if (!movies || movies.length === 0 || !selectedMovie) {
    return null;
  }

  return (
    <Box
      sx={{
        display: { xs: 'flex', sm: 'none' },
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, overflow: 'auto', pb: 1 }}>
        {movies.map((movie, index) => (
          <Chip
            size="medium"
            key={index}
            label={movie.title}
            onClick={() => handleItemClick(index)}
            selected={selectedItemIndex === index}
          />
        ))}
      </Box>
      <Card variant="outlined">
        <Box
          sx={(theme) => ({
            mb: 2,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: 250,
            backgroundImage: `url(https://image.tmdb.org/t/p/w500${selectedMovie.poster_path})`,
          })}
        />
        <Box sx={{ px: 2, pb: 2 }}>
          <Typography gutterBottom sx={{ color: 'text.primary', fontWeight: 'medium' }}>
            {selectedMovie.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
            {selectedMovie.overview}
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}

MobileLayout.propTypes = {
  handleItemClick: PropTypes.func.isRequired,
  selectedMovie: PropTypes.shape({
    overview: PropTypes.string,
    title: PropTypes.string,
    poster_path: PropTypes.string,
  }),
  selectedItemIndex: PropTypes.number.isRequired,
  movies: PropTypes.array.isRequired,
};


function MovieGrid({ movies }) {
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: { xs: 'none', sm: 'grid' },
        width: '100%',
        gridTemplateColumns: { sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
        gap: 3,
        mt:5
      }}
    >
      {movies.map((movie, index) => (
        <Card
          key={index}
          variant="outlined"
          sx={{
            height: '100%',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'scale(1.03)',
              boxShadow: 6,
            },
          }}
        >
          <Box
            sx={{
              position: 'relative',
              pt: '150%',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundImage: movie.poster_path 
                ? `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`
                : 'linear-gradient(to bottom right, #808080, #404040)',
            }}
          />
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              {movie.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {movie.overview.length > 120 ? `${movie.overview.substring(0, 120)}...` : movie.overview}
            </Typography>
          </Box>
        </Card>
      ))}
    </Box>
  );
}

MovieGrid.propTypes = {
  movies: PropTypes.array.isRequired,
};


export default function MovieShowcase() {
  const [tabValue, setTabValue] = React.useState(0);
  const [trendingMovies, setTrendingMovies] = React.useState([]);
  const [latestMovies, setLatestMovies] = React.useState([]);
  const [topPickMovies, setTopPickMovies] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  

  const [selectedTrendingIndex, setSelectedTrendingIndex] = React.useState(0);
  const [selectedLatestIndex, setSelectedLatestIndex] = React.useState(0);
  const [selectedTopPickIndex, setSelectedTopPickIndex] = React.useState(0);

  
  const API_KEY =import.meta.env.VITE_API_KEY;
  const API_BASE_URL =import.meta.env.VITE_BASE_URL;


  React.useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch trending movies
        const trendingResponse = await fetch(
          `${API_BASE_URL}/trending/movie/week?api_key=${API_KEY}`
        );
        const trendingData = await trendingResponse.json();
        
        // Fetch latest movies
        const latestResponse = await fetch(
          `${API_BASE_URL}/movie/now_playing?api_key=${API_KEY}`
        );
        const latestData = await latestResponse.json();
        
        
        const topPicksResponse = await fetch(
          `${API_BASE_URL}/movie/top_rated?api_key=${API_KEY}`
        );
        const topPicksData = await topPicksResponse.json();
        
        setTrendingMovies(trendingData.results.slice(0, 8));
        setLatestMovies(latestData.results.slice(0, 8));
        setTopPickMovies(topPicksData.results.slice(0, 8));
      } catch (err) {
        setError('Failed to fetch movies. Please try again later.');
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovies();
  }, [API_KEY]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Render loading state
  if (loading) {
    return (
      <Container
        sx={{
          pt: { xs: 10, sm: 12 }, 
          pb: { xs: 8, sm: 12 },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  // Render error state
  if (error) {
    return (
      <Container
        sx={{
          pt: { xs: 10, sm: 12 }, 
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container
      id="movie-showcase"
      sx={{
        pt: { xs: 10, sm: 12 }, 
        pb: { xs: 8, sm: 12 },
        position: 'relative',
        mt:15
      }}
    >
      <Box
        sx={{
          width: '100%',
          textAlign: { sm: 'left', md: 'center' },
          mb: 4,
          
        }}
      >
        <Typography component="h1" variant="h1" gutterBottom sx={{ color: 'primary.main',textAlign:'center' }}>
          Movie Showcase
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 6 ,textAlign:'center'}}>
          Discover the best films across different categories, powered by TMDb
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="movie categories tabs"
        >
          <Tab label="Trending Right Now" {...a11yProps(0)} />
          <Tab label="Latest Releases" {...a11yProps(1)} />
          <Tab label="Top Picks For You" {...a11yProps(2)} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <MovieGrid movies={trendingMovies} />
        <MobileLayout
          movies={trendingMovies}
          selectedItemIndex={selectedTrendingIndex}
          handleItemClick={(index) => setSelectedTrendingIndex(index)}
          selectedMovie={trendingMovies[selectedTrendingIndex]}
        />
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <MovieGrid movies={latestMovies} />
        <MobileLayout
          movies={latestMovies}
          selectedItemIndex={selectedLatestIndex}
          handleItemClick={(index) => setSelectedLatestIndex(index)}
          selectedMovie={latestMovies[selectedLatestIndex]}
        />
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        <MovieGrid movies={topPickMovies} />
        <MobileLayout
          movies={topPickMovies}
          selectedItemIndex={selectedTopPickIndex}
          handleItemClick={(index) => setSelectedTopPickIndex(index)}
          selectedMovie={topPickMovies[selectedTopPickIndex]}
        />
      </TabPanel>
    </Container>
  );
}