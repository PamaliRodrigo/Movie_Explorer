import * as React from 'react';
import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import HistoryIcon from '@mui/icons-material/History';
import Badge from '@mui/material/Badge';
import axios from 'axios';
import HeroAlt from './HeroAlt';

const TMDB_API_KEY = '536bf1b102f1ad7b92eb4e41eae3d40e';
const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
const BASE_BACKDROP_URL = 'https://image.tmdb.org/t/p/original';

// TMDB genre IDs mapped to genre names
const GENRE_MAP = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
};

// Local storage keys
const LAST_SEARCH_KEY = 'lastSearchedMovie';
const FAVORITES_KEY = 'favoriteMovies';

// Styled components
const StyledMovieCard = styled(Card)(({ theme }) => ({
  display: 'grid',
  flexDirection: 'row',
  padding: 0,
  height: '100%',
  maxHeight: '300px',
  maxWidth: '300px', 
  alignContent: 'center',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  backgroundColor: (theme.vars || theme).palette.background.paper,
  '&:hover': {
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transform: 'translateY(-4px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  '&:focus-visible': {
    outline: '2px solid',
    outlineColor: 'hsla(210, 98%, 48%, 0.5)',
    outlineOffset: '2px',
  },
}));

const StyledCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  padding: 12,
  flexGrow: 1,
  '&:last-child': {
    paddingBottom: 12,
  },
});

const StyledOverviewText = styled(Typography)({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2, // Reduced to 2 lines for more compact display
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  lineHeight: 1.4,
  fontSize: '0.8rem',
});

const StyledFilterChips = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: 12,
  padding: '16px 0',
  overflowX: 'auto',
  '&::-webkit-scrollbar': {
    height: 4,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.divider,
    borderRadius: 4,
  },
}));

const StyledDialogImage = styled(CardMedia)({
  height: 300,
  objectPosition: 'top',
});

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
}));

// Movie Credits component displaying cast members and release date
function MovieCredits({ cast = [], releaseDate }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        borderTop: '1px solid',
        borderColor: 'divider',
        minHeight: '40px',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', maxWidth: '70%' }}>
        <AvatarGroup 
          max={2} 
          sx={{ 
            '& .MuiAvatar-root': { 
              width: 24, 
              height: 24, 
              border: '1px solid white',
              fontSize: '0.7rem'
            } 
          }}
        >
          {cast.slice(0, 2).map((member, index) => (
            <Avatar
              key={index}
              alt={member.name}
              src={member.profile_path ? `${BASE_IMAGE_URL}${member.profile_path}` : undefined}
            />
          ))}
        </AvatarGroup>
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'text.secondary', 
            fontWeight: 'medium',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {cast.slice(0, 2).map((member) => member.name).join(', ')}
        </Typography>
      </Box>
      <Typography 
        variant="caption" 
        sx={{ 
          fontSize: '0.7rem',
          color: 'text.secondary'
        }}
      >
        {releaseDate}
      </Typography>
    </Box>
  );
}

// Detailed Movie Dialog Component
function MovieDetailsDialog({ open, onClose, movie, favorites, onToggleFavorite }) {
  const [trailerUrl, setTrailerUrl] = useState('');
  const isFavorite = favorites.some(fav => fav.id === movie?.id);

  useEffect(() => {
    // Fetch trailer when dialog opens
    if (open && movie) {
      fetchTrailer(movie.id);
    }
  }, [open, movie]);

  const fetchTrailer = async (movieId) => {
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`
      );
      
      const trailers = res.data.results.filter(
        video => video.type === 'Trailer' && video.site === 'YouTube'
      );
      
      if (trailers.length > 0) {
        setTrailerUrl(`https://www.youtube.com/watch?v=${trailers[0].key}`);
      } else {
        setTrailerUrl('');
      }
    } catch (error) {
      console.error('Error fetching trailer:', error);
      setTrailerUrl('');
    }
  };

  if (!movie) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      scroll="paper"
      aria-labelledby="movie-dialog-title"
    >
      <DialogTitle id="movie-dialog-title" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="h2">
          {movie.title} 
          <Typography component="span" color="text.secondary" sx={{ ml: 1 }}>
            ({movie.release_date ? movie.release_date.split('-')[0] : 'N/A'})
          </Typography>
        </Typography>
        <Box>
          <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
            <IconButton 
              onClick={() => onToggleFavorite(movie)}
              color={isFavorite ? "error" : "default"}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Tooltip>
          <IconButton onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <StyledDialogImage
        component="img"
        alt={movie.title}
        image={movie.backdrop_path
          ? `${BASE_BACKDROP_URL}${movie.backdrop_path}`
          : (movie.poster_path
            ? `${BASE_IMAGE_URL}${movie.poster_path}`
            : 'https://via.placeholder.com/1280x720?text=No+Image')}
      />
      
      <StyledDialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>Overview</Typography>
            <Typography variant="body1" paragraph>
              {movie.overview || 'No overview available.'}
            </Typography>
            
            {trailerUrl && (
              <Button 
                variant="outlined" 
                startIcon={<PlayCircleOutlineIcon />}
                href={trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ mt: 2 }}
              >
                Watch Trailer
              </Button>
            )}
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Details</Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Release Date</Typography>
              <Typography variant="body2">
                {movie.release_date 
                  ? new Date(movie.release_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : 'Unknown'}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Rating</Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                ★ {movie.vote_average?.toFixed(1) || 'N/A'} ({movie.vote_count || 0} votes)
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Genres</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                {movie.genreNames?.map((genre, index) => (
                  <Chip 
                    key={index} 
                    label={genre} 
                    size="small" 
                    variant="outlined" 
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))}
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>Cast</Typography>
            <Grid container spacing={1}>
              {movie.credits?.cast?.slice(0, 8).map((actor) => (
                <Grid item xs={6} sm={3} md={3} key={actor.id} sx={{ textAlign: 'center' }}>
                  <Avatar
                    alt={actor.name}
                    src={actor.profile_path ? `${BASE_IMAGE_URL}${actor.profile_path}` : undefined}
                    sx={{ width: 64, height: 64, mx: 'auto', mb: 1 }}
                  />
                  <Typography variant="subtitle2" noWrap>{actor.name}</Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {actor.character}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </StyledDialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// History Dialog Component
function SearchHistoryDialog({ open, onClose, lastSearchedMovie, onSelectMovie }) {
  const handleSelect = () => {
    if (lastSearchedMovie) {
      onSelectMovie(lastSearchedMovie);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Recent Search</DialogTitle>
      <DialogContent>
        {lastSearchedMovie ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
            <Avatar
              src={lastSearchedMovie.poster_path ? `${BASE_IMAGE_URL}${lastSearchedMovie.poster_path}` : undefined}
              variant="rounded"
              sx={{ width: 60, height: 80 }}
            />
            <Box>
              <Typography variant="subtitle1">{lastSearchedMovie.title}</Typography>
              <Typography variant="caption" color="text.secondary">
                {lastSearchedMovie.release_date ? new Date(lastSearchedMovie.release_date).getFullYear() : 'N/A'}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Typography>No recent searches found</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSelect} disabled={!lastSearchedMovie} color="primary">
          View Details
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Favorites Dialog Component
function FavoritesDialog({ open, onClose, favorites, onSelectMovie, onRemoveFavorite }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>My Favorites</DialogTitle>
      <DialogContent>
        {favorites.length > 0 ? (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {favorites.map((movie) => (
              <Grid item xs={12} key={movie.id}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    p: 1,
                    borderRadius: 1,
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <Avatar
                    src={movie.poster_path ? `${BASE_IMAGE_URL}${movie.poster_path}` : undefined}
                    variant="rounded"
                    sx={{ width: 60, height: 80 }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1">{movie.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'} • 
                      {movie.genreNames?.slice(0, 2).join(', ')}
                    </Typography>
                  </Box>
                  <Box>
                    <Tooltip title="View details">
                      <IconButton onClick={() => {
                        onSelectMovie(movie);
                        onClose();
                      }}>
                        <PlayCircleOutlineIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remove from favorites">
                      <IconButton onClick={() => onRemoveFavorite(movie)} color="error">
                        <CloseIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography sx={{ py: 3, textAlign: 'center' }}>
            You haven't added any favorites yet
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

// Main content component
export default function MainContent() {
  const [focusedCardIndex, setFocusedCardIndex] = useState(null);
  const [allMovies, setAllMovies] = useState([]); // Store all fetched movies
  const [filteredMovies, setFilteredMovies] = useState([]); // Store filtered movies
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [genres, setGenres] = useState([]); // Store genre data from API
  
  // New state for enhanced features
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [lastSearchedMovie, setLastSearchedMovie] = useState(null);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [favoritesDialogOpen, setFavoritesDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Load favorites and last search from local storage
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
      
      const storedLastSearch = localStorage.getItem(LAST_SEARCH_KEY);
      if (storedLastSearch) {
        setLastSearchedMovie(JSON.parse(storedLastSearch));
      }
    } catch (error) {
      console.error('Error loading data from local storage:', error);
    }
  }, []);

  // Fetch genres on component mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}`
        );
        setGenres(res.data.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  // Fetch popular movies on component mount
  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}`
        );
        
        // Get extended info for each movie including credits
        const moviesWithDetails = await Promise.all(
          res.data.results.slice(0, 12).map(async (movie) => {
            try {
              // Fetch credits
              const creditsRes = await axios.get(
                `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${TMDB_API_KEY}`
              );
              
              // Add readable genre names to the movie object
              const genreNames = movie.genre_ids.map(id => GENRE_MAP[id] || 'Unknown');
              
              return { 
                ...movie, 
                credits: creditsRes.data,
                genreNames: genreNames
              };
            } catch (error) {
              console.error(`Error fetching details for movie ${movie.id}:`, error);
              return { 
                ...movie, 
                credits: { cast: [] },
                genreNames: movie.genre_ids.map(id => GENRE_MAP[id] || 'Unknown')
              };
            }
          })
        );
        
        setAllMovies(moviesWithDetails);
        setFilteredMovies(moviesWithDetails); // Initially show all movies
        setLoading(false);
      } catch (error) {
        console.error('Error fetching popular movies:', error);
        setLoading(false);
      }
    };

    fetchPopularMovies();
  }, []);

  // Update filtered movies when activeFilter changes
  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredMovies(allMovies);
    } else {
      const filtered = allMovies.filter(movie => {
        // Match genre ids with the selected filter
        return movie.genreNames.includes(activeFilter);
      });
      setFilteredMovies(filtered);
    }
  }, [activeFilter, allMovies]);

  const handleSearchResults = async (searchResults) => {
    // Get extended info for search results
    const resultsWithDetails = await Promise.all(
      searchResults.slice(0, 12).map(async (movie) => {
        try {
          const creditsRes = await axios.get(
            `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${TMDB_API_KEY}`
          );
          
          // Add readable genre names
          const genreNames = movie.genre_ids.map(id => GENRE_MAP[id] || 'Unknown');
          
          return { 
            ...movie, 
            credits: creditsRes.data,
            genreNames: genreNames
          };
        } catch (error) {
          console.error(`Error fetching credits for movie ${movie.id}:`, error);
          return { 
            ...movie, 
            credits: { cast: [] },
            genreNames: movie.genre_ids.map(id => GENRE_MAP[id] || 'Unknown')
          };
        }
      })
    );
    
    setAllMovies(resultsWithDetails);
    
    // Apply current filter to search results
    if (activeFilter === 'All') {
      setFilteredMovies(resultsWithDetails);
    } else {
      const filtered = resultsWithDetails.filter(movie => 
        movie.genreNames.includes(activeFilter)
      );
      setFilteredMovies(filtered);
    }
    
    // If there's at least one result, save the first result as last searched movie
    if (resultsWithDetails.length > 0) {
      const movieToSave = resultsWithDetails[0];
      setLastSearchedMovie(movieToSave);
      
      // Save to local storage
      try {
        localStorage.setItem(LAST_SEARCH_KEY, JSON.stringify(movieToSave));
      } catch (error) {
        console.error('Error saving to local storage:', error);
      }
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleFocus = (index) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  // Get primary genre for a movie to display in the UI
  const getPrimaryGenre = (movie) => {
    if (!movie.genre_ids || movie.genre_ids.length === 0) return 'Unknown';
    return GENRE_MAP[movie.genre_ids[0]] || 'Unknown';
  };

  // Handle movie selection for detail view
  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setDialogOpen(true);
  };

  // Toggle favorite status of a movie
  const handleToggleFavorite = (movie) => {
    const isFavorite = favorites.some(fav => fav.id === movie.id);
    
    if (isFavorite) {
      // Remove from favorites
      const updatedFavorites = favorites.filter(fav => fav.id !== movie.id);
      setFavorites(updatedFavorites);
      setSnackbarMessage(`"${movie.title}" removed from favorites`);
      
      // Update local storage
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
      } catch (error) {
        console.error('Error saving to local storage:', error);
      }
    } else {
      // Add to favorites
      const updatedFavorites = [...favorites, movie];
      setFavorites(updatedFavorites);
      setSnackbarMessage(`"${movie.title}" added to favorites`);
      
      // Update local storage
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
      } catch (error) {
        console.error('Error saving to local storage:', error);
      }
    }
    
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Typography variant="h6" color="text.secondary">Loading movies...</Typography>
      </Box>
    );
  }

  const filters = [
    { label: 'All categories', value: 'All' },
    { label: 'Action', value: 'Action' },
    { label: 'Comedy', value: 'Comedy' },
    { label: 'Drama', value: 'Drama' },
    { label: 'Sci-Fi', value: 'Sci-Fi' },
    { label: 'Horror', value: 'Horror' },
    { label: 'Romance', value: 'Romance' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Hero with search */}
      <HeroAlt onSearch={handleSearchResults} />
      
      {/* Action buttons */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Tooltip title="Last search">
          <Button
            variant="outlined"
            startIcon={<HistoryIcon />}
            onClick={() => setHistoryDialogOpen(true)}
            disabled={!lastSearchedMovie}
          >
            Recent
          </Button>
        </Tooltip>
        
        <Tooltip title="View favorites">
          <Badge badgeContent={favorites.length} color="error" max={99}>
            <Button
              variant="outlined"
              startIcon={<FavoriteIcon />}
              onClick={() => setFavoritesDialogOpen(true)}
            >
              Favorites
            </Button>
          </Badge>
        </Tooltip>
      </Box>
      
      {/* Filter chips */}
      <StyledFilterChips>
        {filters.map((filter) => (
          <Chip
            key={filter.value}
            size="medium"
            label={filter.label}
            onClick={() => handleFilterChange(filter.value)}
            color={activeFilter === filter.value ? 'primary' : 'default'}
            variant={activeFilter === filter.value ? 'filled' : 'outlined'}
          />
        ))}
      </StyledFilterChips>
      
      {/* Results count */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="h2">
          {filteredMovies.length > 0 
            ? `Showing ${filteredMovies.length} ${activeFilter !== 'All' ? activeFilter : ''} results` 
            : `No ${activeFilter !== 'All' ? activeFilter : ''} movies found`}
        </Typography>
      </Box>
      
      {/* Movie grid - Compact arrangement with 3-4 cards per row */}
      <Grid container spacing={3} justifyContent="center">
        {filteredMovies.map((movie, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
            <StyledMovieCard
              variant="outlined"
              onFocus={() => handleFocus(index)}
              onBlur={handleBlur}
              onClick={() => handleMovieSelect(movie)}
              tabIndex={0}
              className={focusedCardIndex === index ? 'Mui-focused' : ''}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  alt={movie.title}
                  image={movie.poster_path
                    ? `${BASE_IMAGE_URL}${movie.poster_path}`
                    : 'https://via.placeholder.com/500x750?text=No+Poster'}
                  sx={{
                    width: '100%',
                    height: 200, 
                    objectFit: 'cover',
                    overflow: 'hidden',
                    display: 'block',
                  }}
                />
                {/* Favorite indicator */}
                {favorites.some(fav => fav.id === movie.id) && (
                  <FavoriteIcon 
                    sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8, 
                      color: 'error.main',
                      filter: 'drop-shadow(0px 0px 2px rgba(0,0,0,0.5))'
                    }} 
                  />
                )}
              </Box>
              <StyledCardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="caption" color="primary" sx={{ fontSize: '0.7rem' }}>
                    {getPrimaryGenre(movie)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    ★ {movie.vote_average?.toFixed(1) || 'N/A'}
                  </Typography>
                </Box>
                <Typography 
                  variant="subtitle2" 
                  component="h3" 
                  sx={{ 
                    fontWeight: 'bold',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {movie.title}
                </Typography>
                <StyledOverviewText variant="body2" color="text.secondary">
                  {movie.overview}
                </StyledOverviewText>
              </StyledCardContent>
              <MovieCredits 
                cast={movie.credits?.cast || []} 
                releaseDate={formatDate(movie.release_date)}
              />
            </StyledMovieCard>
          </Grid>
        ))}
        
        {filteredMovies.length === 0 && (
          <Grid item xs={12}>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                justifyContent: 'center',
                padding: 4,
                textAlign: 'center'
              }}
            >
              <Typography variant="h6" gutterBottom>No movies found</Typography>
              <Typography variant="body2" color="text.secondary">
                {activeFilter !== 'All'
                  ? `Try changing the filter or search for different movies`
                  : `Try searching for different movies`}
              </Typography>
              <Button 
                variant="outlined" 
                sx={{ mt: 2 }}
                onClick={() => setActiveFilter('All')}
                disabled={activeFilter === 'All'}
              >
                Show all movies
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
      
      {/* Movie Detail Dialog */}
      <MovieDetailsDialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        movie={selectedMovie} 
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
      />
      
      {/* History Dialog */}
      <SearchHistoryDialog
        open={historyDialogOpen}
        onClose={() => setHistoryDialogOpen(false)}
        lastSearchedMovie={lastSearchedMovie}
        onSelectMovie={handleMovieSelect}
      />
      
      {/* Favorites Dialog */}
      <FavoritesDialog
        open={favoritesDialogOpen}
        onClose={() => setFavoritesDialogOpen(false)}
        favorites={favorites}
        onSelectMovie={handleMovieSelect}
        onRemoveFavorite={handleToggleFavorite}
      />
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseSnackbar}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
}