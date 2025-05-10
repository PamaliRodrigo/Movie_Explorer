import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import MuiChip from '@mui/material/Chip';
import { useTheme } from '@mui/system';


const trending = [
  {
    title: 'Inception',
    description: 'A thief who steals corporate secrets through dream-sharing technology.',
    imageLight: `url("/poster1.jpg")`,
    imageDark: `url("/poster1.jpg")`,
  },
  {
    title: 'The Shawshank Redemption',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption.',
    imageLight: `url("/poster2.jpg")`,
    imageDark: `url("/poster2.jpg")`,
  },
  {
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker emerges, Batman must confront chaos.',
    imageLight: `url("/poster3.jpg")`,
    imageDark: `url("/poster3.jpg")`,
  },
  {
    title: 'Pulp Fiction',
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine.',
    imageLight: `url("/poster4.jpg")`,
    imageDark: `url("/poster4.jpg")`,
  },
  {
    title: 'Fight Club',
    description: 'An insomniac office worker forms an underground fight club.',
    imageLight: `url("/poster5.jpg")`,
    imageDark: `url("/poster5.jpg")`,
  },
  {
    title: 'Forrest Gump',
    description: 'The presidencies of Kennedy and Johnson, Vietnam, Watergate, and other history unfold.',
    imageLight: `url("/poster6.jpg")`,
    imageDark: `url("/poster6.jpg")`,
  },
];

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

function MobileLayout({ selectedItemIndex, handleItemClick, selectedFeature }) {
  if (!trending[selectedItemIndex]) {
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
      <Box sx={{ display: 'flex', gap: 2, overflow: 'hidden' }}>
        {trending.map(({ title }, index) => (
          <Chip
            size="medium"
            key={index}
            label={title}
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
            backgroundImage: 'var(--trending-imageLight)',
            ...theme.applyStyles('dark', {
              backgroundImage: 'var(--trending-imageDark)',
            }),
          })}
          style={{
            '--trending-imageLight': trending[selectedItemIndex].imageLight,
            '--trending-imageDark': trending[selectedItemIndex].imageDark,
          }}
        />
        <Box sx={{ px: 2, pb: 2 }}>
          <Typography gutterBottom sx={{ color: 'text.primary', fontWeight: 'medium' }}>
            {selectedFeature.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
            {selectedFeature.description}
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}

MobileLayout.propTypes = {
  handleItemClick: PropTypes.func.isRequired,
  selectedFeature: PropTypes.shape({
    description: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    imageDark: PropTypes.string.isRequired,
    imageLight: PropTypes.string.isRequired,
  }).isRequired,
  selectedItemIndex: PropTypes.number.isRequired,
};

export default function TrendingMovies() {
  const theme = useTheme();
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);

  return (

    // Trending section
    <>
    <Container
      id="trending-movies"
      sx={{
        pt: { xs: 8, sm: 5 },
        pb: { xs: 8, sm: 12 },
        position: 'relative',
      }}
    >
      <Box
        sx={{
          width: '100%',
          textAlign: { sm: 'center', md: 'center' },
          mb: 10,
        }}
      >
        <Typography component="h2" variant="h4" gutterBottom sx={{ color: 'text.primary' }}>
          Trending Right Now
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
          These films have earned high praise from countless viewers, making them some of the most talked-about picks right now.
        </Typography>
      </Box>

      <Box
        sx={{
          display: { xs: 'none', sm: 'grid' },
          width: '100%',
          gridTemplateColumns: { sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: 3,
        }}
      >
        {trending.map((item, index) => (
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
              sx={(theme) => ({
                position: 'relative',
                pt: '125%',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundImage: 'var(--trending-imageLight)',
                ...theme.applyStyles('dark', {
                  backgroundImage: 'var(--trending-imageDark)',
                }),
              })}
              style={{
                '--trending-imageLight': item.imageLight,
                '--trending-imageDark': item.imageDark,
              }}
            />
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" component="h3" gutterBottom>
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.description}
              </Typography>
            </Box>
          </Card>
        ))}
      </Box>

      <MobileLayout
        selectedItemIndex={selectedItemIndex}
        handleItemClick={(index) => setSelectedItemIndex(index)}
        selectedFeature={trending[selectedItemIndex]}
      />
    </Container>

    {/* Movie Library */}

    <Container
      id="Movie-Library"
      sx={{
        pt: { xs: 8, sm: 5 },
        pb: { xs: 8, sm: 12 },
        position: 'relative',
      }}
    >
      <Box
        sx={{
          width: '100%',
          textAlign: { sm: 'center', md: 'center' },
          mb: 10,
        }}
      >
        <Typography component="h2" variant="h4" gutterBottom sx={{ color: 'text.primary' }}>
          Movie Library
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
          We've handpicked the best movies just for you—carefully curated to bring you the finest in cinema. From timeless classics to the latest blockbusters, every title in our library is chosen with care to match your taste. Whether you're in the mood for a thrilling adventure, heartwarming drama, or a night of laughs, we’ve got something special waiting for you.
        </Typography>
      </Box>

      <Box
        sx={{
          display: { xs: 'none', sm: 'grid' },
          width: '100%',
          gridTemplateColumns: { sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: 3,
        }}
      >
        {trending.map((item, index) => (
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
              sx={(theme) => ({
                position: 'relative',
                pt: '125%',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundImage: 'var(--trending-imageLight)',
                ...theme.applyStyles('dark', {
                  backgroundImage: 'var(--trending-imageDark)',
                }),
              })}
              style={{
                '--trending-imageLight': item.imageLight,
                '--trending-imageDark': item.imageDark,
              }}
            />
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" component="h3" gutterBottom>
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.description}
              </Typography>
            </Box>
          </Card>
        ))}
      </Box>

      <MobileLayout
        selectedItemIndex={selectedItemIndex}
        handleItemClick={(index) => setSelectedItemIndex(index)}
        selectedFeature={trending[selectedItemIndex]}
      />
    </Container>
    </>
  );
}