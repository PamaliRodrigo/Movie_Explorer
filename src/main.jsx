import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App';
import SignInCard from './components/SignInCard';
import SignInSide from './SignInSide';
import Content from './components/Content';
import AppTheme from './shared-theme/AppTheme';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppTheme>
    <SignInSide></SignInSide>
    </AppTheme>
  </StrictMode>,
)
