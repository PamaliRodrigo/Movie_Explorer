import { Route,Routes } from 'react-router-dom';
import MarketingPage from './MarketingPage';
import SignInSide from './SignInSide';
import MovieDetails from './MovieDetails';
import Testimonals from './Testimonals';

function App() {

  return (
    <Routes>
      <Route path='/' element={<SignInSide/>}/>
      <Route path='/home' element={<MarketingPage />}/>
      <Route path='/movies' element={<Testimonals/>}/>
      <Route path='/explore' element={<MovieDetails/>}/>
    </Routes>
  );
}

export default App
