import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/system';

//just some random logos to show collaborations
const whiteLogos = [
  'https://logowik.com/content/uploads/images/pixar-animation-studios4926.logowik.com.webp',
  'https://toppng.com/uploads/preview/walt-disney-logo-transparent-11662026459ljuftu4zbc.png',
  'https://tse4.mm.bing.net/th/id/OIP.8Y-waX5xV-GUb-PWPMLo7wHaGc?rs=1&pid=ImgDetMain',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/61f12e891fa22f89efd7477a_TerraLight.svg',
  'https://brandslogos.com/wp-content/uploads/images/large/dreamworks-animation-logo-black-and-white.png',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f5caa77bf7d69fb78792e_Ankara-white.svg',
];

const darkLogos = [
  'https://tse3.mm.bing.net/th/id/OIP.EvBqy8khjScfFbVfXhxs9AHaFj?rs=1&pid=ImgDetMain',
  'https://tse2.mm.bing.net/th/id/OIP.vEZqJsZ_pMYW5dzVs_TmaQHaE8?pid=ImgDet&w=474&h=316&rs=1',
  'https://th.bing.com/th/id/R.af0e740cc1323528657b0bf01b233769?rik=V2ZJI87eJBNMkA&pid=ImgRaw&r=0',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/61f12e911fa22f2203d7514c_TerraDark.svg',
  'https://tse3.mm.bing.net/th/id/OIP.A4W4RwJlaC7noTM9lnen6QHaJ4?rs=1&pid=ImgDetMain',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f5ca4e548b0deb1041c33_Ankara-black.svg',
];

const logoStyle = {
  width: '100px',
  height: '80px',
  margin: '0 32px',
  opacity: 0.7,
};

export default function LogoCollection() {
  const theme = useTheme();
  const logos = theme.palette.mode === 'light' ? darkLogos : whiteLogos;

  return (
    <Box id="logoCollection" sx={{ py: 4 }}>
      <Typography
        component="p"
        variant="subtitle2"
        align="center"
        sx={{ color: 'text.secondary' }}
      >
        Collaborated with the best companies
      </Typography>
      <Grid container sx={{ justifyContent: 'center', mt: 0.5, opacity: 0.6 }}>
        {logos.map((logo, index) => (
          <Grid key={index}>
            <img
              src={logo}
              alt={`Fake company number ${index + 1}`}
              style={logoStyle}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}