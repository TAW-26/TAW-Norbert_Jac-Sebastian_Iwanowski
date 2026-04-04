import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Save, Map as MapIcon, ChevronDown } from 'lucide-react';

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

const TripResult = () => {
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

    return (
        <div className="flex flex-col min-h-screen w-full">

            {/* ========================================== */}
            {/* SEKCJA GŁÓWNA - WYNIK PLANOWANIA           */}
            {/* ========================================== */}
            <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 py-20 lg:py-40 min-h-[calc(100dvh-140px)] lg:min-h-screen relative transition-all duration-500">
                <RevealOnScroll>
                    <div className="bg-gray-200/80 dark:bg-[#262626]/95 backdrop-blur-lg w-full max-w-4xl lg:max-w-[1600px] lg:min-h-[75vh] p-6 py-10 lg:p-12 xl:p-16 rounded-3xl lg:rounded-[3rem] shadow-2xl dark:shadow-white/10 border border-white/30 dark:border-white/10 relative flex flex-col justify-between transition-colors duration-500">

                        <h2 className="text-3xl lg:text-7xl font-black mb-8 lg:mb-14 text-black dark:text-white tracking-tight text-center transition-colors">
                            Twoja przygoda w Rzymie: <span className="text-blue-500 dark:text-orange-500">2 dni</span> historii i smaku.
                        </h2>

                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 flex-1 items-stretch">

                            {/* ========================================== */}
                            {/* LEWA KOLUMNA - HARMONOGRAM (Scrollowana)   */}
                            {/* ========================================== */}
                            <div className="w-full lg:w-3/5 bg-white/40 dark:bg-black/20 rounded-3xl lg:rounded-[2rem] p-4 sm:p-6 lg:p-8 shadow-inner border border-white/20 dark:border-white/5 flex flex-col max-h-[500px] lg:max-h-[60vh] transition-colors">

                                <div className="flex-1 overflow-y-auto pr-2 lg:pr-4 custom-scrollbar" style={{ scrollbarWidth: 'thin' }}>

                                    {/* --- DZIEŃ 1 --- */}
                                    <div className="bg-gray-200/90 dark:bg-[#333333]/95 backdrop-blur-md rounded-full py-2 lg:py-3 mb-6 lg:mb-8 shadow-md border border-white/40 dark:border-white/10 sticky top-0 z-10 transition-colors">
                                        <h3 className="text-lg lg:text-3xl font-black text-center text-black dark:text-white uppercase tracking-wider">
                                            📅 DZIEŃ 1: Serce Starożytności
                                        </h3>
                                    </div>

                                    <div className="overflow-x-auto mb-10 lg:mb-12">
                                        <table className="w-full text-left border-collapse min-w-[400px] lg:min-w-[500px]">
                                            <thead>
                                                <tr className="border-b-2 border-gray-400/50 dark:border-gray-600/50 text-lg lg:text-2xl text-black dark:text-white">
                                                    <th className="pb-3 lg:pb-4 font-black w-1/6 pl-2 lg:pl-4">Godz.</th>
                                                    <th className="pb-3 lg:pb-4 font-black w-2/5">Atrakcja</th>
                                                    <th className="pb-3 lg:pb-4 font-black w-auto pr-2 lg:pr-4">Opis AI</th>
                                                </tr>
                                            </thead>
                                            <tbody className="font-sans font-semibold text-sm lg:text-lg text-gray-800 dark:text-gray-200">
                                                <tr className="border-b border-gray-400/20 dark:border-gray-700/30 hover:bg-white/20 dark:hover:bg-white/5 transition-colors">
                                                    <td className="py-4 lg:py-6 pl-2 lg:pl-4 align-top font-bold text-blue-500 dark:text-orange-500">09:00</td>
                                                    <td className="py-4 lg:py-6 pr-2 lg:pr-4 align-top">Śniadanie u Sant' Eustachio</td>
                                                    <td className="py-4 lg:py-6 pr-2 lg:pr-4 text-xs lg:text-base font-medium opacity-80 italic">Zacznij jak lokalny mieszkaniec od legendarnego espresso i chrupiącego cornetto.</td>
                                                </tr>
                                                <tr className="border-b border-gray-400/20 dark:border-gray-700/30 bg-gray-400/5 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/5 transition-colors">
                                                    <td className="py-4 lg:py-6 pl-2 lg:pl-4 align-top font-bold text-blue-500 dark:text-orange-500">10:30</td>
                                                    <td className="py-4 lg:py-6 pr-2 lg:pr-4 align-top">Koloseum i Forum Romanum</td>
                                                    <td className="py-4 lg:py-6 pr-2 lg:pr-4 text-xs lg:text-base font-medium opacity-80 italic">Zwiedzanie z przewodnikiem. Rezerwacja obowiązkowa! Unikniesz kolejek.</td>
                                                </tr>
                                                <tr className="border-b border-gray-400/20 dark:border-gray-700/30 hover:bg-white/20 dark:hover:bg-white/5 transition-colors">
                                                    <td className="py-4 lg:py-6 pl-2 lg:pl-4 align-top font-bold text-blue-500 dark:text-orange-500">13:30</td>
                                                    <td className="py-4 lg:py-6 pr-2 lg:pr-4 align-top">Lunch w Monti</td>
                                                    <td className="py-4 lg:py-6 pr-2 lg:pr-4 text-xs lg:text-base font-medium opacity-80 italic">Spróbuj autentycznej Cacio e Pepe w małej, rodzinnej trattorii.</td>
                                                </tr>
                                                <tr className="border-b border-gray-400/20 dark:border-gray-700/30 bg-gray-400/5 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/5 transition-colors">
                                                    <td className="py-4 lg:py-6 pl-2 lg:pl-4 align-top font-bold text-blue-500 dark:text-orange-500">15:30</td>
                                                    <td className="py-4 lg:py-6 pr-2 lg:pr-4 align-top">Fontanna di Trevi</td>
                                                    <td className="py-4 lg:py-6 pr-2 lg:pr-4 text-xs lg:text-base font-medium opacity-80 italic">Czas na zdjęcie i wrzucenie monety (powrót do Rzymu gwarantowany!).</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* --- DZIEŃ 2 --- */}
                                    <div className="bg-gray-200/90 dark:bg-[#333333]/95 backdrop-blur-md rounded-full py-2 lg:py-3 mb-6 lg:mb-8 shadow-md border border-white/40 dark:border-white/10 sticky top-0 z-10 transition-colors mt-8">
                                        <h3 className="text-lg lg:text-3xl font-black text-center text-black dark:text-white uppercase tracking-wider">
                                            📅 DZIEŃ 2: Skarby Watykanu
                                        </h3>
                                    </div>

                                    <div className="overflow-x-auto mb-4">
                                        <table className="w-full text-left border-collapse min-w-[400px] lg:min-w-[500px]">
                                            <tbody className="font-sans font-semibold text-sm lg:text-lg text-gray-800 dark:text-gray-200">
                                                <tr className="border-b border-gray-400/20 dark:border-gray-700/30 hover:bg-white/20 dark:hover:bg-white/5 transition-colors">
                                                    <td className="py-4 lg:py-6 pl-2 lg:pl-4 align-top font-bold text-blue-500 dark:text-orange-500 w-1/6">09:00</td>
                                                    <td className="py-4 lg:py-6 pr-2 lg:pr-4 align-top w-2/5">Muzea Watykańskie</td>
                                                    <td className="py-4 lg:py-6 pr-2 lg:pr-4 text-xs lg:text-base font-medium opacity-80 italic">Największe dzieła Michała Anioła. Rezerwuj online!</td>
                                                </tr>
                                                <tr className="border-b border-gray-400/20 dark:border-gray-700/30 bg-gray-400/5 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/5 transition-colors">
                                                    <td className="py-4 lg:py-6 pl-2 lg:pl-4 align-top font-bold text-blue-500 dark:text-orange-500 w-1/6">15:30</td>
                                                    <td className="py-4 lg:py-6 pr-2 lg:pr-4 align-top w-2/5">Zamek św. Anioła</td>
                                                    <td className="py-4 lg:py-6 pr-2 lg:pr-4 text-xs lg:text-base font-medium opacity-80 italic">Spacer wzdłuż rzeki Tyber z widokiem na Watykan.</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                </div>
                            </div>

                            {/* ========================================== */}
                            {/* PRAWA KOLUMNA - PODSUMOWANIE               */}
                            {/* ========================================== */}
                            <div className="w-full lg:w-2/5 bg-white/40 dark:bg-black/20 rounded-3xl lg:rounded-[2rem] p-6 lg:p-10 shadow-inner border border-white/20 dark:border-white/5 flex flex-col transition-colors">

                                <div className="bg-blue-500 dark:bg-orange-500 rounded-full py-3 lg:py-4 mb-8 lg:mb-10 shadow-lg transition-colors">
                                    <h3 className="text-xl lg:text-3xl font-black text-center text-white uppercase tracking-widest">
                                        Twój Raport
                                    </h3>
                                </div>

                                <div className="flex-1 flex flex-col justify-center space-y-6 lg:space-y-10">

                                    <div className="flex items-center gap-4 lg:gap-5 group">
                                        <div className="bg-white dark:bg-white/10 p-3 lg:p-4 rounded-2xl shadow-md transition-transform group-hover:scale-110">
                                            <span className="text-2xl lg:text-5xl">💰</span>
                                        </div>
                                        <div>
                                            <p className="text-xs lg:text-sm font-sans font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tighter">Szacowany koszt</p>
                                            <p className="text-lg lg:text-3xl font-black text-black dark:text-white">120 - 150 EUR</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 lg:gap-5 group">
                                        <div className="bg-white dark:bg-white/10 p-3 lg:p-4 rounded-2xl shadow-md transition-transform group-hover:scale-110">
                                            <span className="text-2xl lg:text-5xl">👟</span>
                                        </div>
                                        <div>
                                            <p className="text-xs lg:text-sm font-sans font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tighter">Dystans pieszo</p>
                                            <p className="text-lg lg:text-3xl font-black text-black dark:text-white">Ok. 12 km</p>
                                        </div>
                                    </div>

                                    <div className="bg-blue-500/10 dark:bg-orange-500/10 border-l-4 lg:border-l-8 border-blue-500 dark:border-orange-500 p-4 lg:p-6 rounded-r-2xl shadow-sm">
                                        <p className="text-blue-600 dark:text-orange-400 font-black text-base lg:text-xl mb-1 flex items-center">
                                            <span className="mr-2">💡</span> Wskazówka AI:
                                        </p>
                                        <p className="font-sans text-xs sm:text-sm lg:text-lg font-bold text-gray-800 dark:text-gray-200 leading-relaxed italic">
                                            "W Rzymie woda z fontann ulicznych (nasoni) jest zdatna do picia i darmowa - weź własną butelkę!"
                                        </p>
                                    </div>

                                </div>
                            </div>

                        </div>

                        {/* ========================================== */}
                        {/* DOLNE PRZYCISKI AKCJI                      */}
                        {/* ========================================== */}
                        <div className="mt-8 lg:mt-16 flex flex-col sm:flex-row justify-center gap-4 lg:gap-10">
                            <Link
                                to="/trips"
                                className="bg-[#6584e0] dark:bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-6 lg:py-5 lg:px-12 text-lg lg:text-3xl rounded-2xl transition-all shadow-xl hover:scale-105 flex items-center justify-center gap-3 group w-full sm:w-auto"
                            >
                                <Save className="w-5 h-5 lg:w-8 lg:h-8 group-hover:animate-bounce" />
                                Zapisz podróż
                            </Link>
                            <Link
                                to="/map"
                                className="bg-green-500 dark:bg-green-600 hover:bg-green-700 text-white font-black py-4 px-6 lg:py-5 lg:px-12 text-lg lg:text-3xl rounded-2xl transition-all shadow-xl hover:scale-105 flex items-center justify-center gap-3 group w-full sm:w-auto"
                            >
                                <MapIcon className="w-5 h-5 lg:w-8 lg:h-8 group-hover:rotate-12 transition-transform" />
                                Pokaż na mapie
                            </Link>
                        </div>

                    </div>
                </RevealOnScroll>
            </div>

            {/* ========================================== */}
            {/* STOPKA (Footer)                            */}
            {/* ========================================== */}
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
                    <div className="font-sans w-full border-t border-gray-400/30 dark:border-gray-600/50 pt-6 flex flex-col md:flex-row justify-between items-center text-sm lg:text-base font-medium text-gray-600 dark:text-gray-400 space-y-4 md:space-y-0 transition-colors duration-500 pb-4">
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

export default TripResult;