import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronDown, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import api from '../services/api';

import iconFacebook from '../assets/icons/icon-facebook.png';
import iconInstagram from '../assets/icons/icon-instagram.png';
import iconX from '../assets/icons/icon-x.png';
import iconEmail from '../assets/icons/icon-email.png';

const RevealOnScroll = ({ children, className = "w-full flex justify-center" }: { children: React.ReactNode, className?: string }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`transition-all duration-[1200ms] ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
                } ${className}`}
        >
            {children}
        </div>
    );
};

const PlanTrip = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [destination, setDestination] = useState('Rzym');
    const [budget, setBudget] = useState('medium');
    const [preferences, setPreferences] = useState<string[]>([]);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 3);

    const [startDate, setStartDate] = useState(tomorrow.toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(dayAfterTomorrow.toISOString().split('T')[0]);

    const [isGenerating, setIsGenerating] = useState(false);

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

    const togglePreference = (pref: string) => {
        setPreferences(prev =>
            prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
        );
    };

    const handleGenerateTrip = async () => {
        if (!destination.trim()) {
            alert("Proszę podać cel podróży!");
            return;
        }

        if (new Date(endDate) < new Date(startDate)) {
            alert("Data powrotu nie może być wcześniejsza niż data wyjazdu!");
            return;
        }

        setIsGenerating(true);

        try {
            const response = await api.post('/trips/generate', {
                destination,
                startDate,
                endDate,
                budgetLevel: budget,
                preferences,
                userPace: user?.pace,
                userInterests: user?.interests,
                userDiet: user?.diet,
                userTransport: user?.transport
            });

            navigate('/trip-result/new', { state: { tripData: response.data } });
        } catch (error) {
            console.error("Błąd podczas generowania podróży:", error);
            alert("Wystąpił błąd podczas komunikacji z AI. Spróbuj ponownie za chwilę.");
            setIsGenerating(false);
        }
    };

    const diffTime = Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime());
    const calculatedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return (
        <div className="flex flex-col min-h-screen w-full overflow-hidden relative">

            {isGenerating && (
                <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col justify-center items-center p-6 text-center">
                    <Loader2 className="w-16 h-16 lg:w-24 lg:h-24 text-[#6584e0] dark:text-orange-500 animate-spin mb-8" />
                    <h2 className="text-3xl lg:text-5xl font-black text-white mb-4 animate-pulse">
                        Magia AI w toku...
                    </h2>
                    <p className="text-lg lg:text-2xl font-medium text-gray-300 max-w-xl">
                        Przeszukujemy bazę atrakcji, analizujemy logistykę i układamy dla Ciebie idealny plan na każdy dzień.
                        <br /><span className="text-sm mt-4 block text-gray-500">To zajmie kilkanaście sekund. Proszę nie odświeżać strony.</span>
                    </p>
                </div>
            )}

            <section className="scroll-mt-20 lg:scroll-mt-32 min-h-[calc(100dvh-140px)] flex justify-center items-center px-4 sm:px-8 py-20 lg:py-40 relative">
                <RevealOnScroll>
                    <div className="bg-gray-200/80 dark:bg-[#262626]/95 backdrop-blur-lg w-full max-w-4xl lg:max-w-[1400px] lg:min-h-[65vh] flex flex-col justify-center p-8 py-16 lg:p-24 rounded-3xl lg:rounded-[3rem] shadow-2xl dark:shadow-white/10 border border-white/30 dark:border-white/10 relative transition-colors duration-500 overflow-visible">

                        <h2 className="text-3xl lg:text-8xl font-black mb-8 lg:mb-16 text-black dark:text-white tracking-tight text-center transition-colors duration-500 relative z-10">
                            Podaj dane podróży.
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 flex-1 w-full relative z-10">

                            {/* KARTA 1: Cel podróży */}
                            <div className="bg-white/40 dark:bg-black/20 rounded-3xl p-6 lg:p-8 flex flex-col items-center text-center shadow-inner border border-white/40 dark:border-white/5 justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-white/5">
                                <div className="w-full">
                                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-black mb-4 text-black dark:text-white transition-colors duration-500">Gdzie chcesz dzisiaj polecieć?</h3>
                                    <input
                                        type="text"
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                        className="bg-white dark:bg-[#333333] border-2 border-transparent focus:border-blue-500 dark:focus:border-orange-500 rounded-xl px-4 py-3 text-lg lg:text-2xl font-bold focus:outline-none transition-colors duration-300 shadow-sm font-sans w-full text-center text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                        placeholder="Np. Paryż"
                                    />
                                </div>
                                <p className="font-sans text-sm md:text-base lg:text-lg font-medium text-gray-700 dark:text-gray-300 mt-6 lg:mt-8 transition-colors duration-500">
                                    Wpisz miasto lub kraj, który chcesz odkryć (np. Paryż, Islandia).
                                </p>
                            </div>

                            <div className="bg-white/40 dark:bg-black/20 rounded-3xl p-6 lg:p-8 flex flex-col items-center text-center shadow-inner border border-white/40 dark:border-white/5 justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-white/5">
                                <div className="w-full flex flex-col items-center">
                                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-black mb-2 text-black dark:text-white transition-colors duration-500 flex flex-col items-center justify-center gap-2">
                                        Kiedy jedziesz?
                                        <span className="text-sm bg-blue-500 dark:bg-orange-500 text-white px-3 py-1 rounded-full font-bold shadow-md">Dni: {calculatedDays}</span>
                                    </h3>

                                    <div className="flex flex-col gap-4 w-full mt-2">
                                        <div className="text-left w-full">
                                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 pl-1">Wyjazd</label>
                                            <input
                                                type="date"
                                                value={startDate}
                                                //min={new Date().toISOString().split('T')[0]} // Blokada dat z przeszłości
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className="w-full bg-white dark:bg-[#333333] border-2 border-transparent focus:border-blue-500 dark:focus:border-orange-500 rounded-xl px-3 py-2 text-base font-bold outline-none transition-all shadow-sm text-black dark:text-white cursor-pointer"
                                            />
                                        </div>
                                        <div className="text-left w-full">
                                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 pl-1">Powrót</label>
                                            <input
                                                type="date"
                                                value={endDate}
                                                min={startDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                className="w-full bg-white dark:bg-[#333333] border-2 border-transparent focus:border-blue-500 dark:focus:border-orange-500 rounded-xl px-3 py-2 text-base font-bold outline-none transition-all shadow-sm text-black dark:text-white cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <p className="font-sans text-sm md:text-base lg:text-lg font-medium text-gray-700 dark:text-gray-300 mt-4 transition-colors duration-500">
                                    Wybierz datę wyjazdu i powrotu. AI uwzględni sezon.
                                </p>
                            </div>

                            {/* KARTA 3: Budżet */}
                            <div className="bg-white/40 dark:bg-black/20 rounded-3xl p-6 lg:p-8 flex flex-col items-center text-center shadow-inner border border-white/40 dark:border-white/5 justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-white/5">
                                <div className="w-full">
                                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-black mb-6 text-black dark:text-white transition-colors duration-500">Twój budżet.</h3>
                                    <div className="flex space-x-3 lg:space-x-4 justify-center mt-4">
                                        <button onClick={() => setBudget('Tani')} className={`w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center rounded-xl lg:rounded-2xl font-sans font-black text-xl lg:text-3xl transition-all duration-300 ${budget === 'Tani' ? 'bg-green-500 text-white scale-110 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-white dark:bg-[#333333] text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 shadow-sm'}`}>$</button>
                                        <button onClick={() => setBudget('Średni')} className={`w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center rounded-xl lg:rounded-2xl font-sans font-black text-xl lg:text-3xl transition-all duration-300 ${budget === 'Średni' || budget === 'medium' ? 'bg-orange-500 text-white scale-110 shadow-[0_0_15px_rgba(249,115,22,0.5)]' : 'bg-white dark:bg-[#333333] text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 shadow-sm'}`}>$$</button>
                                        <button onClick={() => setBudget('Wysoki')} className={`w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center rounded-xl lg:rounded-2xl font-sans font-black text-xl lg:text-3xl transition-all duration-300 ${budget === 'Wysoki' ? 'bg-red-500 text-white scale-110 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-white dark:bg-[#333333] text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 shadow-sm'}`}>$$$</button>
                                    </div>
                                </div>
                                <p className="font-sans text-sm md:text-base lg:text-lg font-medium text-gray-700 dark:text-gray-300 mt-6 lg:mt-8 transition-colors duration-500">
                                    Dopasujemy atrakcje do Twojego portfela.
                                </p>
                            </div>

                            {/* KARTA 4: Preferencje */}
                            <div className="bg-white/40 dark:bg-black/20 rounded-3xl p-6 lg:p-8 flex flex-col items-center text-center shadow-inner border border-white/40 dark:border-white/5 justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-white/5">
                                <div className="w-full">
                                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-black mb-6 text-black dark:text-white transition-colors duration-500">Twoje pasje.</h3>
                                    <div className="flex flex-wrap justify-center gap-2 lg:gap-3">
                                        {['Muzea', 'Natura', 'Imprezy', 'Jedzenie', 'Relaks'].map(pref => (
                                            <button key={pref} onClick={() => togglePreference(pref)} className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-full font-sans text-xs lg:text-base font-bold transition-all duration-300 shadow-sm ${preferences.includes(pref) ? 'bg-[#6584e0] dark:bg-orange-500 text-white scale-105' : 'bg-white dark:bg-[#333333] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                                {pref}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <p className="font-sans text-sm md:text-base lg:text-lg font-medium text-gray-700 dark:text-gray-300 mt-6 lg:mt-8 transition-colors duration-500">
                                    Wybierz co lubisz, a AI stworzy unikalną trasę dla Ciebie.
                                </p>
                            </div>

                        </div>

                        <div className="mt-12 lg:mt-16 flex justify-center relative z-10">
                            <button
                                onClick={handleGenerateTrip}
                                disabled={isGenerating}
                                className={`bg-[#6584e0] dark:bg-orange-500 hover:bg-blue-600 dark:hover:bg-orange-600 text-white font-bold py-4 lg:py-6 px-8 sm:px-12 lg:px-32 text-xl sm:text-2xl lg:text-4xl rounded-2xl transition-all duration-300 shadow-xl dark:shadow-white/10 w-full sm:w-auto ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
                            >
                                {isGenerating ? 'Planowanie...' : 'Generuj moją podróż ✨'}
                            </button>
                        </div>

                    </div>
                </RevealOnScroll>
            </section>

            <footer className="mx-4 sm:mx-8 pt-12 pb-6 px-6 sm:px-12 lg:px-24 bg-gray-200/80 dark:bg-[#262626]/95 backdrop-blur-md shadow-[0_-10px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_-10px_30px_rgba(255,255,255,0.05)] border border-white/30 dark:border-white/10 border-b-0 rounded-t-3xl lg:rounded-t-[3rem] text-black dark:text-white z-10 relative transition-colors duration-500">
                <div className="max-w-[1400px] mx-auto w-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8 mb-12 text-center md:text-left">
                        <div className="space-y-4 flex flex-col items-center md:items-start">
                            <h3 className="text-3xl font-black text-blue-500 dark:text-orange-500 transition-colors duration-500">Travel-Planner</h3>
                            <p className="font-sans text-sm md:text-base lg:text-lg font-medium text-gray-700 dark:text-gray-300 max-w-xs transition-colors duration-500">
                                Twój osobisty, inteligentny asystent podróży. Zamieniamy marzenia w gotowe plany.
                            </p>
                        </div>
                        <div className="flex flex-col items-center md:items-start space-y-4">
                            <button onClick={() => toggleSection('skroty')} className="flex items-center justify-between w-full md:w-auto text-xl font-black mb-2 transition-colors focus:outline-none">
                                Na skróty <ChevronDown className={`w-5 h-5 ml-2 md:hidden transition-transform duration-300 ${openSections.skroty ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`flex flex-col space-y-4 overflow-hidden transition-all duration-300 ${openSections.skroty ? 'max-h-96 opacity-100' : 'max-h-0 md:max-h-96 opacity-0 md:opacity-100'}`}>
                                <Link to="/plan" className="font-sans text-sm md:text-base font-semibold hover:text-blue-500 dark:hover:text-orange-500 transition-colors">Zaplanuj podróż</Link>
                                <Link to="/trips" className="font-sans text-sm md:text-base font-semibold hover:text-blue-500 dark:hover:text-orange-500 transition-colors">Moje podróże</Link>
                                <Link to="/map" className="font-sans text-sm md:text-base font-semibold hover:text-blue-500 dark:hover:text-orange-500 transition-colors">Mapa świata</Link>
                                <Link to="/profile" className="font-sans text-sm md:text-base font-semibold hover:text-blue-500 dark:hover:text-orange-500 transition-colors">Twój profil</Link>
                            </div>
                        </div>
                        <div className="flex flex-col items-center md:items-start space-y-4">
                            <button onClick={() => toggleSection('kontakt')} className="flex items-center justify-between w-full md:w-auto text-xl font-black mb-2 transition-colors focus:outline-none">
                                Pomoc i kontakt <ChevronDown className={`w-5 h-5 ml-2 md:hidden transition-transform duration-300 ${openSections.kontakt ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`flex flex-col items-center md:items-start space-y-4 overflow-hidden transition-all duration-300 ${openSections.kontakt ? 'max-h-96 opacity-100' : 'max-h-0 md:max-h-96 opacity-0 md:opacity-100'}`}>
                                <a href="mailto:kontakt@travel-planner.com" onClick={(e) => e.preventDefault()} className="font-sans text-sm md:text-base font-semibold flex items-center hover:text-blue-500 dark:hover:text-orange-500 transition-colors group">
                                    <img src={iconEmail} alt="Email" className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                                    kontakt@travel-planner.com
                                </a>
                                <div className="flex space-x-4 pt-2">
                                    <a href="#" onClick={(e) => e.preventDefault()} className="flex justify-center items-center p-2 bg-white/50 dark:bg-white/10 rounded-full hover:bg-blue-500 dark:hover:bg-orange-500 hover:scale-110 transition-all shadow-sm duration-300"><img src={iconInstagram} alt="Instagram" className="w-5 h-5 lg:w-6 lg:h-6" /></a>
                                    <a href="#" onClick={(e) => e.preventDefault()} className="flex justify-center items-center p-2 bg-white/50 dark:bg-white/10 rounded-full hover:bg-blue-500 dark:hover:bg-orange-500 hover:scale-110 transition-all shadow-sm duration-300"><img src={iconFacebook} alt="Facebook" className="w-5 h-5 lg:w-6 lg:h-6" /></a>
                                    <a href="#" onClick={(e) => e.preventDefault()} className="flex justify-center items-center p-2 bg-white/50 dark:bg-white/10 rounded-full hover:bg-blue-500 dark:hover:bg-orange-500 hover:scale-110 transition-all shadow-sm duration-300"><img src={iconX} alt="X (Twitter)" className="w-5 h-5 lg:w-6 lg:h-6" /></a>
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

export default PlanTrip;