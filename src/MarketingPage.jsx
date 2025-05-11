import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../src/shared-theme/AppTheme';
import AppAppBar from './components/AppAppBar';
import Hero from './components/Hero';
import LogoCollection from './components/LogoCollection';
import Footer from './components/Footer';

export default function MarketingPage(props) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Hero />
      <div>
        <LogoCollection />
        <Footer />
      </div>
    </AppTheme>
  );
}