import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  AvatarGroup,
  Pagination,
  CircularProgress,
  styled
} from '@mui/material';


// TMDB API Constants
const API_KEY = '536bf1b102f1ad7b92eb4e41eae3d40e'; // You'll need to replace this with your actual API key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w200';

// Article/Movie Card Component
const StyledArticleCard = styled(Card)(({ theme, focused }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  height: '100%',
  padding: theme.spacing(2),
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  outline: focused ? '2px solid' : 'none',
  outlineColor: focused ? theme.palette.primary.main : 'transparent',
  outlineOffset: focused ? theme.spacing(0.5) : 0,
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
    cursor: 'pointer',
  },
}));

const ArticleTitle = styled(Typography)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(1),
  '& .hover-arrow': {
    visibility: 'hidden',
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    opacity: 0.7,
  },
  '& .hover-underline': {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 0,
    height: '1px',
    backgroundColor: 'currentColor',
    opacity: 0.3,
    transition: 'width 300ms',
  },
  '&:hover': {
    '& .hover-arrow': {
      visibility: 'visible',
    },
    '& .hover-underline': {
      width: '100%',
    },
  },
}));

const DescriptionText = styled(Typography)({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const CreditsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 'auto',
  color: theme.palette.text.secondary,
  fontSize: theme.typography.caption.fontSize,
}));

const PeopleContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});

const StyledAvatarGroup = styled(AvatarGroup)(({ theme }) => ({
  marginRight: theme.spacing(1),
  '& .MuiAvatar-root': {
    width: theme.spacing(3),
    height: theme.spacing(3),
    border: `2px solid ${theme.palette.background.paper}`,
  },
}));

function ArticleCard({ article, index, focusedIndex, onFocus, onBlur }) {
  const focused = focusedIndex === index;
  
  return (
    <StyledArticleCard 
      focused={focused}
      onFocus={() => onFocus(index)}
      onBlur={onBlur}
      tabIndex={0}
    >
      <Chip 
        label={article.tag} 
        size="small" 
        color="default" 
        sx={{ alignSelf: 'flex-start' }}
      />
      
      <ArticleTitle variant="h6" component="h3">
        {article.title}
        <span className="hover-arrow">→</span>
        <span className="hover-underline"></span>
      </ArticleTitle>
      
      <DescriptionText variant="body2" color="text.secondary">
        {article.description || 'No description available'}
      </DescriptionText>

      <CreditsContainer>
        <PeopleContainer>
          <StyledAvatarGroup max={3}>
            {article.credits.slice(0, 3).map((person, index) => (
              <Avatar
                key={index}
                alt={person.name}
                src={person.profile_path ? `${IMG_BASE_URL}${person.profile_path}` : '/api/placeholder/24/24'}
              />
            ))}
          </StyledAvatarGroup>
          {article.credits.map(person => person.name).join(', ')}
        </PeopleContainer>
        <span>{article.credits[0]?.releaseDate || formatDate(article.release_date || article.first_air_date)}</span>
      </CreditsContainer>
    </StyledArticleCard>
  );
}

function formatDate(dateString) {
  if (!dateString) return 'Unknown date';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function Latest() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [focusedCardIndex, setFocusedCardIndex] = useState(null);

  const handleFocus = (index) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const getMediaTag = (movie) => {
    if (movie.media_type) return movie.media_type.charAt(0).toUpperCase() + movie.media_type.slice(1);
    if (movie.first_air_date) return 'TV';
    return 'Movie';
  };

  const fetchMovieCredits = async (id, mediaType) => {
    try {
      const endpoint = mediaType === 'tv' 
        ? `${BASE_URL}/tv/${id}/credits?api_key=${API_KEY}` 
        : `${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`;
      
      const response = await fetch(endpoint);
      const data = await response.json();
      
      let keyPeople = [];
      if (mediaType === 'movie') {
        keyPeople = data.crew.filter(person => person.job === 'Director').slice(0, 2);
      } else {
        keyPeople = data.crew.filter(person => person.job === 'Creator' || person.job === 'Executive Producer').slice(0, 2);
      }
      
      if (keyPeople.length === 0 && data.cast && data.cast.length > 0) {
        keyPeople = data.cast.slice(0, 2);
      }
      
      return keyPeople;
    } catch (error) {
      console.error('Error fetching credits:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${BASE_URL}/trending/all/week?api_key=${API_KEY}&page=${page}`
        );
        const data = await response.json();
        
        if (data.results) {
          const moviesWithCredits = await Promise.all(
            data.results.slice(0, 10).map(async (item) => {
              const credits = await fetchMovieCredits(item.id, item.media_type);
              const formattedDate = item.release_date || item.first_air_date;
              
              credits.forEach(person => {
                person.releaseDate = formatDate(formattedDate);
              });
              
              return {
                ...item,
                credits: credits.length > 0 ? credits : [{ name: 'Unknown', profile_path: null, releaseDate: formatDate(formattedDate) }],
                tag: getMediaTag(item),
                title: item.title || item.name,
                description: item.overview,
              };
            })
          );
          
          setMovies(moviesWithCredits);
          setTotalPages(Math.min(data.total_pages, 10));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, [page]);

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', px: 4 }}>
      <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 'bold' }}>
        Latest
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: { xs: 2, md: 4 },
            my: 4
          }}>
            {movies.map((movie, index) => (
              <Box key={index}>
                <ArticleCard 
                  article={movie}
                  index={index}
                  focusedIndex={focusedCardIndex}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </Box>
            ))}
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
            <Pagination 
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              sx={{
                '& .MuiPaginationItem-root': {
                  minWidth: 32,
                  height: 32,
                },
              }}
            />
          </Box>
        </>
      )}
    </Box>
  );
}