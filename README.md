Reelify – Discover Your Favorite Films


## 📽️ Overview

Reelify is a modern web application that allows users to search for movies, view details, and discover trending films. Built with React and Material UI, this application fetches real-time data from The Movie Database (TMDb) API to provide users with a seamless movie discovery experience.

## ✨ Features

### Core Features
- **User Authentication** - Simple login interface with username and password
- **Search Functionality** - Find movies easily with a responsive search bar
- **Movie Grid** - Browse movie posters with title, release year, Film Credits and rating information
- **Detailed View** - Click on any movie to see comprehensive details including overview, genre, cast, and trailer links
- **Trending Movies** - Discover what's popular with the trending movies section
- **Theme Toggle** - Switch between light and dark modes for comfortable viewing

### Additional Features
- **Favorite Movies** - Save your favorite movies for quick access later
- **Search History** - Your last searched movies are stored for convenience
- **Responsive Design** - Optimized viewing experience across all devices
- **YouTube Trailers** - Watch movie trailers directly within the app

## 🛠️ Tech Stack

- **Frontend Framework**: React (Vite)
- **UI Library**: Material UI (MUI)
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Routing**: React Router
- **Deployment**: Vercel

## 📁 Project Structure

```
📦Reelify
 ┣ 📦public
 ┃ ┣ 📜grid.jpg
 ┃ ┣ 📜logo.png
 ┃ ┣ 📜pixar.webp
 ┃ ┣ 📜poster1.jpg - poster6.jpg
 ┃ ┣ 📜terms.txt
 ┃ 
 ┗ 📦src
   ┣ 📂assets
   ┃ 
   ┣ 📂components
   ┃ ┣ 📜AppAppBar.jsx 
   ┃ ┣ 📜Content.jsx 
   ┃ ┣ 📜CustomIcons.jsx 
   ┃ ┣ 📜Features.jsx 
   ┃ ┣ 📜Footer.jsx 
   ┃ ┣ 📜ForgotPassword.jsx 
   ┃ ┣ 📜Hero.jsx 
   ┃ ┣ 📜HeroAlt.jsx 
   ┃ ┣ 📜Latest.jsx 
   ┃ ┣ 📜LogoCollection.jsx 
   ┃ ┣ 📜MainContent.jsx 
   ┃ ┗ 📜SignInCard.jsx
   ┣ 📂shared-theme
   ┃ ┣ 📂customizations
   ┃ ┃ ┣ 📜dataDisplay.jsx
   ┃ ┃ ┣ 📜feedback.jsx
   ┃ ┃ ┣ 📜inputs.jsx
   ┃ ┃ ┣ 📜navigation.jsx
   ┃ ┃ ┗ 📜surfaces.jsx
   ┃ ┣ 📜AppTheme.jsx 
   ┃ ┣ 📜ColorModeIconDropdown.jsx 
   ┃ ┣ 📜ColorModeSelect.jsx 
   ┃ ┗ 📜themePrimitives.jsx 
   ┣ 📜App.jsx 
   ┣ 📜main.jsx 
   ┣ 📜MarketingPage.jsx
   ┣ 📜MovieDetails.jsx 
   ┣ 📜SignInSide.jsx 
   ┗ 📜Testimonals.jsx 
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/PamaliRodrigo/Movie_Explorer.git
   cd movie-explorer
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the root directory and add your TMDb API key:
   ```
   TMDB_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## 🔑 API Usage

This application uses The Movie Database (TMDb) API. To use the API:

1. Register for an account at [TMDb](https://www.themoviedb.org/signup)
2. Request an API key from your account settings
3. Add the API key to your `.env` file as shown above

API endpoints used:
 path='/' - For Sign in page
 path='/home' - Landing page
 path='/movies' - Movie Library
 path='/explore' - Trending Films

## 👨‍💻 Development Notes

### State Management
- React Context API is used for global state management
- Local storage is utilized for persisting user preferences and favorite movies

### Authentication
- For the purpose of this demo, authentication is mocked


### Responsive Design
- The app follows mobile-first design principles
- Material UI components ensure consistent styling across devices

## 🌐 Deployment

The application is deployed using Vercel :

1. Create an account on [Vercel](https://vercel.com) 
2. Connect your repository
3. Configure environment variables (TMDB_API_KEY)
4. Deploy

## 🧪 Future Enhancements

- User registration and profile management
- Social sharing capabilities
- Advanced filtering by genre, year, rating
- Personalized movie recommendations
- Watchlist functionality
- User reviews and ratings

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🌟 Acknowledgements

- [The Movie Database (TMDb)](https://www.themoviedb.org/) for providing the API
- [Material UI](https://mui.com/) for the component library
- [Vite](https://vitejs.dev/) for the blazing fast build tool
- [React](https://reactjs.org/) for the frontend library

---

Developed by Pamali Rodrigo for LoonsLab 
LinkedIn : www.linkedin.com/in/pamali-buwanaja-42a181209 