import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Sun, Moon, User, Menu, X } from 'lucide-react';

import logoLight from './assets/logo-light.svg';
import logoDark from './assets/logo-dark.svg';

import Home from './pages/Home';
import Auth from './pages/Auth';
import PlanTrip from './pages/PlanTrip';
import TripResult from './pages/TripResult';
import MyTrips from './pages/MyTrips';
import WorldMap from './pages/WorldMap';
import Profile from './pages/Profile';

import { useAuth } from './context/AuthContext';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);

  const { user, logout } = useAuth();

  const closeMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.backgroundColor = '#0a0a0a';
      document.body.style.backgroundColor = '#0a0a0a';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.backgroundColor = '#f3f4f6';
      document.body.style.backgroundColor = '#f3f4f6';
    }

    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', isDarkMode ? '#0a0a0a' : '#f3f4f6');
  }, [isDarkMode]);

  const getUserNickname = () => {
    if (!user) return '';
    if (user.nickname) return user.nickname;
    if (user.email) return user.email.split('@')[0];
    return '';
  };

  return (
    <Router>
      <div
        className="min-h-screen flex flex-col relative font-['Jockey_One'] transition-colors duration-500"
        style={{ backgroundColor: isDarkMode ? '#0a0a0a' : '#f3f4f6' }}
      >
        <div className="fixed top-0 left-0 right-0 h-16 sm:h-24 lg:h-32 bg-gradient-to-b from-[#f3f4f6] via-[#f3f4f6]/80 to-transparent dark:from-[#0a0a0a] dark:via-[#0a0a0a]/80 dark:to-transparent z-40 pointer-events-none transition-colors duration-500"></div>

        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          onClick={closeMenu}
        />

        <header className="sticky top-4 sm:top-6 lg:top-8 z-50 mx-4 sm:mx-8 mt-4 sm:mt-6 lg:mt-8">

          <nav className={`flex justify-between items-center w-full p-3 sm:p-5 lg:p-4 xl:p-5 2xl:p-6 px-4 sm:px-8 lg:px-6 xl:px-8 2xl:px-10 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_30px_rgba(255,255,255,0.05)] border rounded-2xl lg:rounded-[2rem] relative transition-colors duration-500 ${isDarkMode ? 'bg-[#262626]/95 border-white/10' : 'bg-white/40 border-white/30'
            }`}>

            <Link
              to="/"
              onClick={() => {
                closeMenu();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:scale-105 transition-transform duration-300 shrink-0 relative z-10"
            >
              <img src={logoLight} alt="Logo" className="h-10 sm:h-12 lg:h-12 xl:h-16 2xl:h-24 w-auto block dark:hidden transition-all duration-300" />
              <img src={logoDark} alt="Logo" className="h-10 sm:h-12 lg:h-12 xl:h-16 2xl:h-24 w-auto hidden dark:block transition-all duration-300" />
            </Link>

            {user && (
              <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 space-x-2 xl:space-x-4 2xl:space-x-8 w-auto">
                <Link to="/plan" className={`whitespace-nowrap text-xs lg:text-base xl:text-lg 2xl:text-2xl px-3 lg:px-5 xl:px-7 2xl:px-10 py-2 lg:py-3 xl:py-3.5 2xl:py-5 rounded-lg lg:rounded-xl 2xl:rounded-2xl shadow-sm dark:shadow-white/10 hover:scale-105 transition-all duration-300 ${isDarkMode ? 'bg-white/5 text-white hover:bg-white/20 hover:text-orange-400' : 'bg-white/50 text-black hover:bg-white hover:text-blue-600'}`}>Zaplanuj podróż</Link>
                <Link to="/trips" className={`whitespace-nowrap text-xs lg:text-base xl:text-lg 2xl:text-2xl px-3 lg:px-5 xl:px-7 2xl:px-10 py-2 lg:py-3 xl:py-3.5 2xl:py-5 rounded-lg lg:rounded-xl 2xl:rounded-2xl shadow-sm dark:shadow-white/10 hover:scale-105 transition-all duration-300 ${isDarkMode ? 'bg-white/5 text-white hover:bg-white/20 hover:text-orange-400' : 'bg-white/50 text-black hover:bg-white hover:text-blue-600'}`}>Moje podróże</Link>
                <Link to="/map" className={`whitespace-nowrap text-xs lg:text-base xl:text-lg 2xl:text-2xl px-3 lg:px-5 xl:px-7 2xl:px-10 py-2 lg:py-3 xl:py-3.5 2xl:py-5 rounded-lg lg:rounded-xl 2xl:rounded-2xl shadow-sm dark:shadow-white/10 hover:scale-105 transition-all duration-300 ${isDarkMode ? 'bg-white/5 text-white hover:bg-white/20 hover:text-orange-400' : 'bg-white/50 text-black hover:bg-white hover:text-blue-600'}`}>Mapa świata</Link>
              </div>
            )}

            <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-3 xl:space-x-5 2xl:space-x-8 relative z-10 shrink-0">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`hidden lg:flex justify-center items-center p-2 lg:p-2.5 xl:p-3.5 2xl:p-5 rounded-full shadow-sm dark:shadow-white/10 hover:scale-110 transition-all duration-300 cursor-pointer ${isDarkMode ? 'bg-transparent text-white hover:text-orange-400' : 'bg-white/50 text-black hover:bg-white hover:text-blue-600'}`}
              >
                {isDarkMode ? <Moon className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-10 2xl:h-10 transition-all duration-300" /> : <Sun className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-10 2xl:h-10 transition-all duration-300" />}
              </button>

              <div className={`hidden lg:flex items-center space-x-2 lg:space-x-3 xl:space-x-4 2xl:space-x-6 px-2 lg:px-4 xl:px-5 2xl:px-8 py-1.5 lg:py-2 xl:py-2.5 2xl:py-4 rounded-full shadow-sm dark:shadow-white/10 hover:shadow-md transition-all duration-300 ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-white/50 hover:bg-white'}`}>
                {user ? (
                  <>
                    <div className="flex flex-col items-end">
                      <Link to="/profile" className={`whitespace-nowrap text-xs sm:text-sm lg:text-sm xl:text-xl 2xl:text-2xl leading-tight transition-colors ${isDarkMode ? 'text-white hover:text-orange-400' : 'text-black hover:text-blue-600'}`}>
                        Hi {getUserNickname()}!
                      </Link>
                      <button onClick={logout} className="whitespace-nowrap text-[8px] sm:text-[10px] lg:text-[10px] xl:text-xs 2xl:text-base uppercase font-sans font-bold bg-red-600 hover:bg-red-700 text-white px-1.5 lg:px-2.5 xl:px-4 2xl:px-6 py-0.5 lg:py-1 xl:py-1.5 2xl:py-2 rounded lg:rounded-md transition-all duration-300 mt-0.5 lg:mt-1 shadow-sm cursor-pointer">
                        Wyloguj
                      </button>
                    </div>
                    {user.avatarUrl ? (
                      <Link to="/profile" className={`w-8 h-8 lg:w-10 lg:h-10 xl:w-14 xl:h-14 2xl:w-18 2xl:h-18 rounded-full hover:scale-110 transition-all duration-300 shadow-md flex justify-center items-center overflow-hidden border-2 ${isDarkMode ? 'border-orange-500' : 'border-blue-600'}`}>
                        <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                      </Link>
                    ) : (
                      <Link to="/profile" className={`p-1 sm:p-1.5 lg:p-2 xl:p-2.5 2xl:p-4 rounded-full hover:scale-110 transition-all duration-300 shadow-md flex justify-center items-center ${isDarkMode ? 'bg-white text-black hover:bg-orange-400 hover:text-white' : 'bg-black text-white hover:bg-blue-600'}`}>
                        <User className="w-4 h-4 lg:w-5 lg:h-5 xl:w-7 xl:h-7 2xl:w-9 2xl:h-9 transition-all duration-300" />
                      </Link>
                    )}
                  </>
                ) : (
                  <Link to="/login" className={`whitespace-nowrap font-bold text-xs lg:text-base xl:text-lg 2xl:text-2xl px-2 lg:px-4 xl:px-6 py-1 lg:py-2 rounded-lg transition-colors ${isDarkMode ? 'text-white hover:text-orange-400' : 'text-black hover:text-blue-600'}`}>
                    Zaloguj / Rejestracja
                  </Link>
                )}
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden p-2 rounded-md shadow-sm dark:shadow-white/10 hover:scale-105 transition-all duration-300 cursor-pointer ${isDarkMode ? 'bg-white/10 text-white hover:text-orange-400' : 'bg-white/80 text-black hover:bg-white hover:text-blue-600'}`}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </nav>

          <div className={`lg:hidden absolute top-full mt-4 left-0 right-0 backdrop-blur-xl border rounded-2xl shadow-2xl dark:shadow-white/10 p-4 flex flex-col space-y-3 z-50 transition-all duration-300 origin-top ${isMobileMenuOpen ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'} ${isDarkMode ? 'bg-[#262626]/95 border-white/10' : 'bg-white/90 border-white/50'}`}>

            <div className={`flex items-center justify-between p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
              {user ? (
                <>
                  <div className="flex items-center space-x-3">
                    {user.avatarUrl ? (
                      <Link to="/profile" onClick={closeMenu} className={`w-10 h-10 rounded-full shadow-md overflow-hidden border-2 flex justify-center items-center ${isDarkMode ? 'border-orange-500' : 'border-blue-600'}`}>
                        <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                      </Link>
                    ) : (
                      <Link to="/profile" onClick={closeMenu} className={`p-2 rounded-full shadow-md flex justify-center items-center ${isDarkMode ? 'bg-white text-black' : 'bg-white/5'}`}>
                        <User className="w-5 h-5 border-black text-black dark:text-white" />
                      </Link>
                    )}
                    <Link to="/profile" onClick={closeMenu} className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-black'}`}>Hi {getUserNickname()}!</Link>
                  </div>
                  <button onClick={() => { logout(); closeMenu(); }} className="text-xs uppercase font-sans font-bold bg-red-600 text-white px-3 py-2 rounded-lg shadow-sm cursor-pointer">Wyloguj</button>
                </>
              ) : (
                <div className="flex justify-center w-full">
                  <Link to="/login" onClick={closeMenu} className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-black'}`}>Zaloguj / Rejestracja</Link>
                </div>
              )}
            </div>

            {user && (
              <>
                <Link onClick={closeMenu} to="/plan" className={`text-center py-3 rounded-xl shadow-sm dark:shadow-white/10 hover:scale-[1.02] transition-all duration-300 ${isDarkMode ? 'bg-white/10 text-white hover:text-orange-400' : 'bg-white/60 text-black hover:bg-white hover:text-blue-600'}`}>✈️ Zaplanuj podróż</Link>
                <Link onClick={closeMenu} to="/trips" className={`text-center py-3 rounded-xl shadow-sm dark:shadow-white/10 hover:scale-[1.02] transition-all duration-300 ${isDarkMode ? 'bg-white/10 text-white hover:text-orange-400' : 'bg-white/60 text-black hover:bg-white hover:text-blue-600'}`}>🧳 Moje podróże</Link>
                <Link onClick={closeMenu} to="/map" className={`text-center py-3 rounded-xl shadow-sm dark:shadow-white/10 hover:scale-[1.02] transition-all duration-300 ${isDarkMode ? 'bg-white/10 text-white hover:text-orange-400' : 'bg-white/60 text-black hover:bg-white hover:text-blue-600'}`}>🌍 Mapa świata</Link>
              </>
            )}

            <hr className={`my-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`} />

            <button onClick={() => { setIsDarkMode(!isDarkMode); closeMenu(); }} className={`flex justify-center items-center text-center py-3 rounded-xl shadow-sm dark:shadow-white/10 hover:scale-[1.02] transition-all duration-300 ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-800 text-white hover:bg-black'}`}>
              {isDarkMode ? <><Sun className="w-5 h-5 mr-2" /> Jasny motyw</> : <><Moon className="w-5 h-5 mr-2" /> Ciemny motyw</>}
            </button>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/plan" element={<PlanTrip />} />
          <Route path="/trip-result/:id" element={<TripResult />} />
          <Route path="/trips" element={<MyTrips />} />
          <Route path="/map" element={<WorldMap />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;