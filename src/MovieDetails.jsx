import { Divider } from "@mui/material";
import Features from "./components/Features";
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../src/shared-theme/AppTheme';
import AppAppBar from './components/AppAppBar';
import Footer from './components/Footer';
import HeroAlt from './components/HeroAlt'

function MovieDetails(props){
    return(
    <AppTheme {...props}>
    <CssBaseline enableColorScheme />
    <AppAppBar />
    
   <div>
        <Features />
        <Divider />
        <Footer />
      </div>
    </AppTheme>
    );
}

export default MovieDetails;