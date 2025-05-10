import { Route,Routes } from 'react-router-dom';
import SignInCard from './components/SignInCard';
import MarketingPage from './MarketingPage';
import SignInSide from './SignInSide';
import MovieDetails from './MovieDetails';

function App() {

  return (
    <Routes>
      <Route path='/' element={<SignInSide/>}/>
      <Route path='/Home' element={<MarketingPage />}/>
      <Route path='/movies' element={<MovieDetails/>}/>
    </Routes>
  );
}

export default App
