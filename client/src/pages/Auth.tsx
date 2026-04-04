import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn, ChevronDown } from 'lucide-react';

import authBanner from '../assets/auth-banner.webp';

import iconFacebook from '../assets/icons/icon-facebook.png';
import iconInstagram from '../assets/icons/icon-instagram.png';
import iconX from '../assets/icons/icon-x.png';
import iconEmail from '../assets/icons/icon-email.png';

const RevealOnScroll = ({ children, className = "w-full flex justify-center" }: { children: React.ReactNode, className?: string }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, { threshold: 0.1 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className={`transition-all duration-[1000ms] ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}>
            {children}
        </div>
    );
};

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
        skroty: false,
        kontakt: false
    });

    const toggleSection = (section: string) => {
        if (window.innerWidth < 768) {
            setOpenSections(prev => ({
                ...prev,
                [section]: !prev[section]
            }));
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setShowPassword(false);
        setShowConfirmPassword(false);
    };

    return (
        <div className="flex flex-col min-h-screen w-full overflow-hidden">

            {/* SEKCJA GŁÓWNA - FORMULARZ */}
            <section className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 py-20 lg:py-40 min-h-[calc(100dvh-140px)] lg:min-h-screen relative transition-all duration-500">
                <RevealOnScroll>
                    <div className="bg-gray-200/80 dark:bg-[#262626]/95 backdrop-blur-lg w-full max-w-4xl lg:max-w-[1400px] lg:min-h-[65vh] rounded-3xl lg:rounded-[3rem] shadow-2xl dark:shadow-white/10 border border-white/30 dark:border-white/10 relative overflow-hidden flex flex-col lg:flex-row transition-colors duration-500">

                        {/* ========================================== */}
                        {/* WARSTWA ZDJĘCIA (DESKTOP)                  */}
                        {/* ========================================== */}
                        <div
                            className={`hidden lg:flex absolute top-0 bottom-0 w-1/2 z-20 transition-transform duration-700 ease-in-out p-6 ${isLogin ? 'translate-x-0' : 'translate-x-full'
                                }`}
                        >
                            <div className="w-full h-full rounded-[2.5rem] overflow-hidden shadow-inner border border-white/20 dark:border-white/5 relative">
                                <img
                                    src={authBanner}
                                    alt="Podróż"
                                    className="w-full h-full object-cover opacity-90 dark:opacity-80 transition-opacity duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-12 text-white">
                                    <p className="text-3xl font-black leading-tight">
                                        {isLogin ? "Twoja kolejna przygoda \n zaczyna się tutaj." : "Zrób pierwszy krok \n w stronę nowej przygody."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ========================================== */}
                        {/* KONTENER FORMULARZY                        */}
                        {/* ========================================== */}
                        <div className="relative w-full grid grid-cols-1 lg:grid-cols-2 min-h-[680px] sm:min-h-[720px] lg:min-h-[70vh]">

                            {/* --- FORMULARZ REJESTRACJI --- */}
                            <div className={`absolute lg:relative inset-0 w-full flex flex-col justify-center p-6 py-10 sm:p-10 lg:p-16 xl:p-20 transition-all duration-500 ease-in-out bg-transparent ${!isLogin
                                ? 'opacity-100 translate-y-0 z-10'
                                : 'opacity-0 -translate-y-4 lg:translate-y-0 z-0 pointer-events-none'
                                }`}>
                                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-2 lg:mb-4 text-black dark:text-white tracking-tight text-center lg:text-left transition-colors">
                                    Stwórz konto
                                </h2>
                                <p className="text-base sm:text-lg lg:text-xl font-sans font-medium text-gray-700 dark:text-gray-300 mb-8 lg:mb-10 text-center lg:text-left transition-colors">
                                    Stwórz konto, aby zacząć planować swoje przygody.
                                </p>

                                <form className="flex flex-col w-full max-w-md lg:max-w-lg mx-auto lg:mx-0" onSubmit={(e) => e.preventDefault()}>

                                    <div className="flex flex-col mb-4">
                                        <label className="text-base sm:text-lg lg:text-xl font-black mb-2 text-black dark:text-white ml-1 flex items-center gap-2">
                                            <Mail className="w-4 h-4 lg:w-5 lg:h-5 text-blue-500 dark:text-orange-500" /> E-mail
                                        </label>
                                        <input type="email" placeholder="twoj@email.com" className="bg-white/50 dark:bg-black/20 border-2 border-transparent focus:border-blue-500 dark:focus:border-orange-500 rounded-xl lg:rounded-2xl px-4 lg:px-6 py-3 lg:py-4 text-lg lg:text-xl focus:outline-none transition-all shadow-inner font-sans dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />
                                    </div>

                                    <div className="flex flex-col mb-4">
                                        <label className="text-base sm:text-lg lg:text-xl font-black mb-2 text-black dark:text-white ml-1 flex items-center gap-2">
                                            <Lock className="w-4 h-4 lg:w-5 lg:h-5 text-blue-500 dark:text-orange-500" /> Hasło
                                        </label>
                                        <div className="relative flex items-center">
                                            <input type={showPassword ? "text" : "password"} placeholder="••••••••" className="bg-white/50 dark:bg-black/20 border-2 border-transparent focus:border-blue-500 dark:focus:border-orange-500 rounded-xl lg:rounded-2xl pl-4 lg:pl-6 pr-12 lg:pr-16 py-3 lg:py-4 text-lg lg:text-xl focus:outline-none transition-all shadow-inner w-full font-sans dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 lg:right-4 text-gray-500 hover:text-blue-500 dark:hover:text-orange-500 transition-colors p-2">
                                                {showPassword ? <EyeOff className="w-5 h-5 lg:w-6 lg:h-6" /> : <Eye className="w-5 h-5 lg:w-6 lg:h-6" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col mb-6 lg:mb-8">
                                        <label className="text-base sm:text-lg lg:text-xl font-black mb-2 text-black dark:text-white ml-1 flex items-center gap-2">
                                            <Lock className="w-4 h-4 lg:w-5 lg:h-5 text-blue-500 dark:text-orange-500" /> Powtórz hasło
                                        </label>
                                        <div className="relative flex items-center">
                                            <input type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" className="bg-white/50 dark:bg-black/20 border-2 border-transparent focus:border-blue-500 dark:focus:border-orange-500 rounded-xl lg:rounded-2xl pl-4 lg:pl-6 pr-12 lg:pr-16 py-3 lg:py-4 text-lg lg:text-xl focus:outline-none transition-all shadow-inner w-full font-sans dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />
                                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 lg:right-4 text-gray-500 hover:text-blue-500 dark:hover:text-orange-500 transition-colors p-2">
                                                {showConfirmPassword ? <EyeOff className="w-5 h-5 lg:w-6 lg:h-6" /> : <Eye className="w-5 h-5 lg:w-6 lg:h-6" />}
                                            </button>
                                        </div>
                                    </div>

                                    <button type="submit" className="w-full bg-[#6584e0] dark:bg-orange-500 hover:bg-blue-600 dark:hover:bg-orange-600 text-white font-black py-4 lg:py-5 text-xl sm:text-2xl lg:text-3xl rounded-xl lg:rounded-2xl transition-all shadow-xl hover:scale-[1.02] flex items-center justify-center gap-3 active:scale-95">Dalej</button>

                                    <div className="flex items-start space-x-3 mt-4 ml-1">
                                        <input type="checkbox" id="terms" className="w-4 h-4 lg:w-5 lg:h-5 mt-1 accent-[#6584e0] dark:accent-orange-500 cursor-pointer" />
                                        <label htmlFor="terms" className="text-xs sm:text-sm lg:text-base font-bold text-gray-700 dark:text-gray-300 cursor-pointer leading-tight">Akceptuję regulamin i politykę prywatności</label>
                                    </div>

                                    <div className="mt-6 lg:mt-8 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                                        <span className="text-lg sm:text-xl lg:text-2xl font-bold text-black dark:text-white">
                                            Masz już konto?
                                        </span>
                                        <button type="button" onClick={toggleMode} className="text-lg sm:text-xl lg:text-2xl font-bold text-[#6584e0] dark:text-orange-500 hover:underline transition">
                                            Zaloguj się
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* --- FORMULARZ LOGOWANIA --- */}
                            <div className={`absolute lg:relative inset-0 w-full flex flex-col justify-center p-6 py-10 sm:p-10 lg:p-16 xl:p-20 transition-all duration-500 ease-in-out bg-transparent ${isLogin
                                ? 'opacity-100 translate-y-0 z-10'
                                : 'opacity-0 translate-y-4 lg:translate-y-0 z-0 pointer-events-none'
                                }`}>
                                <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-2 lg:mb-4 text-black dark:text-white tracking-tight text-center lg:text-left transition-colors">Witaj z powrotem!</h2>
                                <p className="text-base sm:text-lg lg:text-xl font-sans font-medium text-gray-700 dark:text-gray-300 mb-8 lg:mb-10 text-center lg:text-left transition-colors">Zaloguj się, aby zarządzać swoimi podróżami.</p>

                                <form className="flex flex-col w-full max-w-md lg:max-w-lg mx-auto lg:mx-0" onSubmit={(e) => e.preventDefault()}>
                                    <div className="flex flex-col mb-4 lg:mb-6">
                                        <label className="text-base sm:text-lg lg:text-xl font-black mb-2 text-black dark:text-white ml-1 flex items-center gap-2"><Mail className="w-4 h-4 lg:w-5 lg:h-5 text-blue-500 dark:text-orange-500" /> E-mail</label>
                                        <input type="email" placeholder="twoj@email.com" className="bg-white/50 dark:bg-black/20 border-2 border-transparent focus:border-blue-500 dark:focus:border-orange-500 rounded-xl lg:rounded-2xl px-4 lg:px-6 py-3 lg:py-4 text-lg lg:text-xl focus:outline-none transition-all shadow-inner font-sans dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />
                                    </div>

                                    <div className="flex flex-col mb-2">
                                        <label className="text-base sm:text-lg lg:text-xl font-black mb-2 text-black dark:text-white ml-1 flex items-center gap-2"><Lock className="w-4 h-4 lg:w-5 lg:h-5 text-blue-500 dark:text-orange-500" /> Hasło</label>
                                        <div className="relative flex items-center">
                                            <input type={showPassword ? "text" : "password"} placeholder="••••••••" className="bg-white/50 dark:bg-black/20 border-2 border-transparent focus:border-blue-500 dark:focus:border-orange-500 rounded-xl lg:rounded-2xl pl-4 lg:pl-6 pr-12 lg:pr-16 py-3 lg:py-4 text-lg lg:text-xl focus:outline-none transition-all shadow-inner w-full font-sans dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 lg:right-4 text-gray-500 hover:text-blue-500 dark:hover:text-orange-500 transition-colors p-2">
                                                {showPassword ? <EyeOff className="w-5 h-5 lg:w-6 lg:h-6" /> : <Eye className="w-5 h-5 lg:w-6 lg:h-6" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 lg:mb-10 px-1 mt-2 gap-4 sm:gap-0">
                                        <div className="flex items-center space-x-2 lg:space-x-3 w-full sm:w-auto justify-center sm:justify-start">
                                            <input type="checkbox" id="rememberMe" className="w-4 h-4 lg:w-5 lg:h-5 accent-blue-500 dark:accent-orange-500 cursor-pointer" />
                                            <label htmlFor="rememberMe" className="text-xs sm:text-sm lg:text-base font-bold text-gray-700 dark:text-gray-300 cursor-pointer">Zapamiętaj mnie</label>
                                        </div>
                                        <a href="#" className="text-xs sm:text-sm lg:text-base font-bold text-blue-500 dark:text-orange-500 hover:underline transition w-full sm:w-auto text-center sm:text-right">Nie pamiętasz hasła?</a>
                                    </div>

                                    <button type="submit" className="w-full bg-[#6584e0] dark:bg-orange-500 hover:bg-blue-600 dark:hover:bg-orange-600 text-white font-black py-4 lg:py-5 text-xl sm:text-2xl lg:text-3xl rounded-xl lg:rounded-2xl transition-all shadow-xl hover:scale-[1.02] flex items-center justify-center gap-3 active:scale-95">
                                        <LogIn className="w-6 h-6 lg:w-8 lg:h-8" /> Zaloguj się
                                    </button>

                                    <div className="mt-8 lg:mt-10 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                                        <span className="text-lg lg:text-xl font-sans font-bold text-gray-700 dark:text-gray-300 transition-colors">
                                            Nie masz jeszcze konta?
                                        </span>
                                        <button type="button" onClick={toggleMode} className="text-lg lg:text-xl font-sans font-bold text-blue-500 dark:text-orange-500 hover:underline transition">
                                            Zarejestruj się!
                                        </button>
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>
                </RevealOnScroll>
            </section>

            {/* ========================================== */}
            {/* STOPKA (Footer)                            */}
            {/* ========================================== */}
            <footer className="mx-4 sm:mx-8 pt-12 pb-6 px-6 sm:px-12 lg:px-24 bg-gray-200/80 dark:bg-[#262626]/95 backdrop-blur-md shadow-[0_-10px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_-10px_30px_rgba(255,255,255,0.05)] border border-white/30 dark:border-white/10 border-b-0 rounded-t-3xl lg:rounded-t-[3rem] text-black dark:text-white z-10 relative transition-colors duration-500">
                <div className="max-w-[1400px] mx-auto w-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8 mb-12 text-center md:text-left">
                        <div className="space-y-4 flex flex-col items-center md:items-start">
                            <h3 className="text-3xl font-black text-blue-500 dark:text-orange-500 transition-colors duration-500">Travel-Planner</h3>
                            <p className="font-sans text-sm md:text-base lg:text-lg font-medium text-gray-700 dark:text-gray-300 max-w-xs transition-colors duration-500">Twój osobisty, inteligentny asystent podróży. Zamieniamy marzenia w gotowe plany.</p>
                        </div>

                        <div className="flex flex-col items-center md:items-start space-y-4">
                            <button
                                onClick={() => toggleSection('skroty')}
                                className="flex items-center justify-between w-full md:w-auto text-xl font-black mb-2 transition-colors focus:outline-none"
                            >
                                Na skróty
                                <ChevronDown className={`w-5 h-5 ml-2 md:hidden transition-transform duration-300 ${openSections.skroty ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`flex flex-col space-y-4 overflow-hidden transition-all duration-300 ${openSections.skroty ? 'max-h-96 opacity-100' : 'max-h-0 md:max-h-96 opacity-0 md:opacity-100'}`}>
                                <Link to="/plan" className="font-sans text-sm md:text-base font-semibold hover:text-blue-500 dark:hover:text-orange-500 transition-colors">Zaplanuj podróż</Link>
                                <Link to="/trips" className="font-sans text-sm md:text-base font-semibold hover:text-blue-500 dark:hover:text-orange-500 transition-colors">Moje podróże</Link>
                                <Link to="/map" className="font-sans text-sm md:text-base font-semibold hover:text-blue-500 dark:hover:text-orange-500 transition-colors">Mapa świata</Link>
                                <Link to="/profile" className="font-sans text-sm md:text-base font-semibold hover:text-blue-500 dark:hover:text-orange-500 transition-colors">Twój profil</Link>
                            </div>
                        </div>

                        <div className="flex flex-col items-center md:items-start space-y-4">
                            <button
                                onClick={() => toggleSection('kontakt')}
                                className="flex items-center justify-between w-full md:w-auto text-xl font-black mb-2 transition-colors focus:outline-none"
                            >
                                Pomoc i kontakt
                                <ChevronDown className={`w-5 h-5 ml-2 md:hidden transition-transform duration-300 ${openSections.kontakt ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`flex flex-col items-center md:items-start space-y-4 overflow-hidden transition-all duration-300 ${openSections.kontakt ? 'max-h-96 opacity-100' : 'max-h-0 md:max-h-96 opacity-0 md:opacity-100'}`}>
                                <a href="mailto:kontakt@travel-planner.com" onClick={(e) => e.preventDefault()} className="font-sans text-sm md:text-base font-semibold flex items-center hover:text-blue-500 dark:hover:text-orange-500 transition-colors group">
                                    <img src={iconEmail} alt="Email" className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                                    kontakt@travel-planner.com
                                </a>
                                <div className="flex space-x-4 pt-2">
                                    <a href="#" onClick={(e) => e.preventDefault()} className="flex justify-center items-center p-2 bg-white/50 dark:bg-white/10 rounded-full hover:bg-blue-500 dark:hover:bg-orange-500 hover:scale-110 transition-all shadow-sm duration-300">
                                        <img src={iconInstagram} alt="Instagram" className="w-5 h-5 lg:w-6 lg:h-6" />
                                    </a>
                                    <a href="#" onClick={(e) => e.preventDefault()} className="flex justify-center items-center p-2 bg-white/50 dark:bg-white/10 rounded-full hover:bg-blue-500 dark:hover:bg-orange-500 hover:scale-110 transition-all shadow-sm duration-300">
                                        <img src={iconFacebook} alt="Facebook" className="w-5 h-5 lg:w-6 lg:h-6" />
                                    </a>
                                    <a href="#" onClick={(e) => e.preventDefault()} className="flex justify-center items-center p-2 bg-white/50 dark:bg-white/10 rounded-full hover:bg-blue-500 dark:hover:bg-orange-500 hover:scale-110 transition-all shadow-sm duration-300">
                                        <img src={iconX} alt="X (Twitter)" className="w-5 h-5 lg:w-6 lg:h-6" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="font-sans w-full border-t border-gray-400/30 dark:border-gray-600/50 pt-6 flex flex-col md:flex-row justify-between items-center text-xs sm:text-sm lg:text-base font-medium text-gray-600 dark:text-gray-400 space-y-4 md:space-y-0 transition-colors duration-500 pb-4">
                        <p>© 2026 Travel-Planner. Wszelkie prawa zastrzeżone.</p>
                        <div className="flex space-x-6">
                            <Link to="#" onClick={(e) => e.preventDefault()} className="font-semibold hover:text-black dark:hover:text-white transition-colors">Regulamin</Link>
                            <Link to="#" onClick={(e) => e.preventDefault()} className="font-semibold hover:text-black dark:hover:text-white transition-colors">Polityka prywatności</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Auth;