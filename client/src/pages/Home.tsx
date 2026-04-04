import { useState, useEffect, useRef } from 'react';
import { ArrowDown, ArrowUp, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

import homeBanner1 from '../assets/home-banner-1.webp';
import homeBanner2 from '../assets/home-banner-2.webp';
import homeBanner3 from '../assets/home-banner-3.webp';

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

const Home = () => {
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

    const scrollTo = (id: string) => {
        if (id === 'top') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    return (
        <div className="flex flex-col w-full overflow-hidden">

            {/* ========================================== */}
            {/* SEKCJA 1: POWITALNA (Hero)                   */}
            {/* ========================================== */}
            <section id="hero-section" className="scroll-mt-20 lg:scroll-mt-32 min-h-[calc(100dvh-140px)] flex justify-center items-center px-4 sm:px-8 py-20 lg:py-32 relative">
                <RevealOnScroll>
                    <div className="bg-gray-200/80 dark:bg-[#262626]/95 backdrop-blur-lg w-full max-w-4xl lg:max-w-[1400px] lg:min-h-[65vh] flex flex-col justify-center p-8 py-16 lg:p-24 pb-24 lg:pb-24 rounded-3xl lg:rounded-[3rem] shadow-2xl dark:shadow-white/10 text-center border border-white/30 dark:border-white/10 relative transition-colors duration-500 overflow-visible">
                        <h1 className="text-3xl lg:text-8xl font-black mb-6 lg:mb-12 text-black dark:text-white tracking-tight leading-[1.1] transition-colors duration-500 relative z-10">
                            Odkrywaj świat z <span className="text-blue-500 dark:text-orange-500 transition-colors duration-500">Travel-Planner</span>.
                        </h1>
                        <p className="font-sans text-sm md:text-lg lg:text-2xl xl:text-3xl text-black dark:text-gray-200 font-medium max-w-5xl mx-auto leading-relaxed transition-colors duration-500 relative z-10">
                            Projektujemy Twoje wspomnienia, zanim jeszcze wyruszysz w drogę. <br className="hidden lg:block" />
                            <span className="text-blue-500 dark:text-orange-500 font-bold transition-colors duration-500">Travel-Planner</span> to unikalne połączenie generatora AI, osobistego archiwum wycieczek i interaktywnej mapy Twoich podbojów. Jedno kliknięcie dzieli Cię od Twojej kolejnej wielkiej przygody.
                        </p>
                        <button
                            onClick={() => scrollTo('info-section')}
                            className="absolute -bottom-6 lg:-bottom-10 left-1/2 -translate-x-1/2 bg-white/60 dark:bg-[#333333] backdrop-blur-md p-2 lg:p-4 rounded-full cursor-pointer hover:bg-white/90 dark:hover:bg-[#444444] hover:scale-110 transition-all shadow-xl dark:shadow-white/20 border border-white/50 dark:border-white/10 z-30 duration-500"
                        >
                            <ArrowDown className="w-5 h-5 lg:w-8 lg:h-8 text-black dark:text-white transition-colors duration-500" />
                        </button>
                    </div>
                </RevealOnScroll>
            </section>

            {/* ========================================== */}
            {/* SEKCJA 2: INTELIGENTNE PLANOWANIE          */}
            {/* ========================================== */}
            <section id="info-section" className="scroll-mt-20 lg:scroll-mt-32 min-h-[calc(100dvh-140px)] flex justify-center items-center px-4 sm:px-8 py-20 lg:py-32 relative">
                <RevealOnScroll>
                    <div className="bg-gray-200/80 dark:bg-[#262626]/95 backdrop-blur-lg w-full max-w-4xl lg:max-w-[1400px] lg:min-h-[65vh] p-8 py-16 lg:p-24 pb-24 lg:pb-24 rounded-3xl lg:rounded-[3rem] shadow-2xl dark:shadow-white/10 border border-white/30 dark:border-white/10 relative flex flex-col lg:flex-row gap-8 lg:gap-16 lg:items-center transition-colors duration-500 overflow-visible">

                        <button
                            onClick={() => scrollTo('top')}
                            className="absolute -top-6 lg:-top-10 left-1/2 -translate-x-1/2 bg-white/60 dark:bg-[#333333] backdrop-blur-md p-2 lg:p-4 rounded-full cursor-pointer hover:bg-white/90 dark:hover:bg-[#444444] hover:scale-110 transition-all shadow-xl dark:shadow-white/20 border border-white/50 dark:border-white/10 z-30 duration-500"
                        >
                            <ArrowUp className="w-5 h-5 lg:w-8 lg:h-8 text-black dark:text-white transition-colors duration-500" />
                        </button>

                        <div className="absolute lg:relative inset-0 lg:inset-auto w-full lg:w-1/2 h-full lg:h-[500px] xl:h-[600px] z-0 lg:z-10 opacity-15 lg:opacity-100 transition-all duration-500 rounded-3xl lg:rounded-[2rem] overflow-hidden">
                            <img src={homeBanner1} alt="Planowanie podróży" className="w-full h-full object-cover shadow-inner" />
                            <div className="lg:hidden absolute inset-0 bg-gradient-to-b from-transparent via-gray-200/40 dark:via-black/40 to-gray-200 dark:to-[#262626]"></div>
                        </div>

                        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center sm:items-start text-center sm:text-left relative z-10">
                            <h2 className="text-3xl lg:text-8xl font-black mb-4 lg:mb-10 text-black dark:text-white leading-[1.1] tracking-tight transition-colors duration-500">
                                Inteligentne <br /> planowanie podróży.
                            </h2>
                            <p className="font-sans text-sm md:text-lg lg:text-xl xl:text-2xl font-medium text-black dark:text-gray-200 leading-relaxed transition-colors duration-500">
                                Zapomnij o żmudnym przeszukiwaniu blogów i przewodników. Nasz generator oparty na najnowszych modelach AI stworzy dla Ciebie kompletny plan dnia, uwzględniając Twój budżet, tempo zwiedzania i pasje. Ty podajesz kierunek, <span className="text-blue-500 dark:text-orange-500 font-bold transition-colors duration-500">Travel-Planner</span> zajmuje się resztą.
                            </p>
                        </div>

                        <button
                            onClick={() => scrollTo('archive-section')}
                            className="absolute -bottom-6 lg:-bottom-10 left-1/2 -translate-x-1/2 bg-white/60 dark:bg-[#333333] backdrop-blur-md p-2 lg:p-4 rounded-full cursor-pointer hover:bg-white/90 dark:hover:bg-[#444444] hover:scale-110 transition-all shadow-xl dark:shadow-white/20 border border-white/50 dark:border-white/10 z-30 duration-500"
                        >
                            <ArrowDown className="w-5 h-5 lg:w-8 lg:h-8 text-black dark:text-white transition-colors duration-500" />
                        </button>
                    </div>
                </RevealOnScroll>
            </section>

            {/* ========================================== */}
            {/* SEKCJA 3: TWOJE ARCHIWUM                     */}
            {/* ========================================== */}
            <section id="archive-section" className="scroll-mt-20 lg:scroll-mt-32 min-h-[calc(100dvh-140px)] flex justify-center items-center px-4 sm:px-8 py-20 lg:py-32 relative">
                <RevealOnScroll>
                    <div className="bg-gray-200/80 dark:bg-[#262626]/95 backdrop-blur-lg w-full max-w-4xl lg:max-w-[1400px] lg:min-h-[65vh] p-8 py-16 lg:p-24 pb-24 lg:pb-24 rounded-3xl lg:rounded-[3rem] shadow-2xl dark:shadow-white/10 border border-white/30 dark:border-white/10 relative flex flex-col-reverse lg:flex-row gap-8 lg:gap-16 lg:items-center transition-colors duration-500 overflow-visible">

                        <button
                            onClick={() => scrollTo('info-section')}
                            className="absolute -top-6 lg:-top-10 left-1/2 -translate-x-1/2 bg-white/60 dark:bg-[#333333] backdrop-blur-md p-2 lg:p-4 rounded-full cursor-pointer hover:bg-white/90 dark:hover:bg-[#444444] hover:scale-110 transition-all shadow-xl dark:shadow-white/20 border border-white/50 dark:border-white/10 z-30 duration-500"
                        >
                            <ArrowUp className="w-5 h-5 lg:w-8 lg:h-8 text-black dark:text-white transition-colors duration-500" />
                        </button>

                        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-end text-center lg:text-right relative z-10">
                            <h2 className="text-3xl lg:text-8xl font-black mb-4 lg:mb-10 text-black dark:text-white leading-[1.1] tracking-tight transition-colors duration-500">
                                Twoje plany <br /> zawsze pod ręką.
                            </h2>
                            <p className="font-sans text-sm md:text-lg lg:text-xl xl:text-2xl font-medium text-black dark:text-gray-200 max-w-[700px] transition-colors duration-500">
                                Wszystkie wygenerowane trasy są bezpiecznie zapisywane w Twoim osobistym archiwum. Możesz do nich wracać w dowolnym momencie, edytować punkty podróży lub usuwać te, które już zrealizowałeś. Twoja historia podróży w jednym, uporządkowanym miejscu.
                            </p>
                        </div>

                        <div className="absolute lg:relative inset-0 lg:inset-auto w-full lg:w-1/2 h-full lg:h-[500px] xl:h-[600px] z-0 lg:z-10 opacity-15 lg:opacity-100 transition-all duration-500 rounded-3xl lg:rounded-[2rem] overflow-hidden">
                            <img src={homeBanner2} alt="Archiwum podróży" className="w-full h-full object-cover shadow-inner" />
                            <div className="lg:hidden absolute inset-0 bg-gradient-to-b from-transparent via-gray-200/40 dark:via-black/40 to-gray-200 dark:to-[#262626]"></div>
                        </div>

                        <button
                            onClick={() => scrollTo('map-section')}
                            className="absolute -bottom-6 lg:-bottom-10 left-1/2 -translate-x-1/2 bg-white/60 dark:bg-[#333333] backdrop-blur-md p-2 lg:p-4 rounded-full cursor-pointer hover:bg-white/90 dark:hover:bg-[#444444] hover:scale-110 transition-all shadow-xl dark:shadow-white/20 border border-white/50 dark:border-white/10 z-30 duration-500"
                        >
                            <ArrowDown className="w-5 h-5 lg:w-8 lg:h-8 text-black dark:text-white transition-colors duration-500" />
                        </button>
                    </div>
                </RevealOnScroll>
            </section>

            {/* ========================================== */}
            {/* SEKCJA 4: MAPA ŚWIATA                        */}
            {/* ========================================== */}
            <section id="map-section" className="scroll-mt-20 lg:scroll-mt-32 min-h-[calc(100dvh-140px)] flex justify-center items-center px-4 sm:px-8 py-20 lg:py-32 relative">
                <RevealOnScroll>
                    <div className="bg-gray-200/80 dark:bg-[#262626]/95 backdrop-blur-lg w-full max-w-4xl lg:max-w-[1400px] lg:min-h-[65vh] p-8 py-16 lg:p-24 pb-24 lg:pb-24 rounded-3xl lg:rounded-[3rem] shadow-2xl dark:shadow-white/10 border border-white/30 dark:border-white/10 relative flex flex-col lg:flex-row gap-8 lg:gap-16 lg:items-center transition-colors duration-500 overflow-visible">

                        <button
                            onClick={() => scrollTo('archive-section')}
                            className="absolute -top-6 lg:-top-10 left-1/2 -translate-x-1/2 bg-white/60 dark:bg-[#333333] backdrop-blur-md p-2 lg:p-4 rounded-full cursor-pointer hover:bg-white/90 dark:hover:bg-[#444444] hover:scale-110 transition-all shadow-xl dark:shadow-white/20 border border-white/50 dark:border-white/10 z-30 duration-500"
                        >
                            <ArrowUp className="w-5 h-5 lg:w-8 lg:h-8 text-black dark:text-white transition-colors duration-500" />
                        </button>

                        <div className="absolute lg:relative inset-0 lg:inset-auto w-full lg:w-1/2 h-full lg:h-[500px] xl:h-[600px] z-0 lg:z-10 opacity-15 lg:opacity-100 transition-all duration-500 rounded-3xl lg:rounded-[2rem] overflow-hidden">
                            <img src={homeBanner3} alt="Mapa świata" className="w-full h-full object-cover shadow-inner" />
                            <div className="lg:hidden absolute inset-0 bg-gradient-to-b from-transparent via-gray-200/40 dark:via-black/40 to-gray-200 dark:to-[#262626]"></div>
                        </div>

                        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center sm:items-start text-center sm:text-left relative z-10">
                            <h2 className="text-3xl lg:text-8xl font-black mb-4 lg:mb-10 text-black dark:text-white leading-[1.1] tracking-tight transition-colors duration-500">
                                Zaznacz swoją <br /> obecność na globie.
                            </h2>
                            <p className="font-sans text-sm md:text-lg lg:text-xl xl:text-2xl font-medium text-black dark:text-gray-200 mb-8 lg:mb-14 leading-relaxed transition-colors duration-500">
                                Każdy zaplanowany wyjazd to nowy punkt na Twojej interaktywnej mapie świata. Obserwuj, jak Twoja osobista mapa zapełnia się kolorami w miarę odkrywania kolejnych państw i miast. Zamień listę marzeń w realną galerię podbojów.
                            </p>
                        </div>

                        <button
                            onClick={() => scrollTo('cta-section')}
                            className="absolute -bottom-6 lg:-bottom-10 left-1/2 -translate-x-1/2 bg-white/60 dark:bg-[#333333] backdrop-blur-md p-2 lg:p-4 rounded-full cursor-pointer hover:bg-white/90 dark:hover:bg-[#444444] hover:scale-110 transition-all shadow-xl dark:shadow-white/20 border border-white/50 dark:border-white/10 z-30 duration-500"
                        >
                            <ArrowDown className="w-5 h-5 lg:w-8 lg:h-8 text-black dark:text-white transition-colors duration-500" />
                        </button>
                    </div>
                </RevealOnScroll>
            </section>

            {/* ========================================== */}
            {/* SEKCJA 5: ZAREJESTRUJ SIĘ (Call to Action)   */}
            {/* ========================================== */}
            <section id="cta-section" className="scroll-mt-20 lg:scroll-mt-32 min-h-[calc(100dvh-140px)] flex justify-center items-center px-4 sm:px-8 py-20 lg:py-32 relative">
                <RevealOnScroll>
                    <div className="bg-gray-200/80 dark:bg-[#262626]/95 backdrop-blur-lg w-full max-w-4xl lg:max-w-[1400px] lg:min-h-[65vh] flex flex-col justify-center p-8 py-16 lg:p-24 pb-24 lg:pb-24 rounded-3xl lg:rounded-[3rem] shadow-2xl dark:shadow-white/10 text-center border border-white/30 dark:border-white/10 relative transition-colors duration-500 overflow-visible">

                        <button
                            onClick={() => scrollTo('map-section')}
                            className="absolute -top-6 lg:-top-10 left-1/2 -translate-x-1/2 bg-white/60 dark:bg-[#333333] backdrop-blur-md p-2 lg:p-4 rounded-full cursor-pointer hover:bg-white/90 dark:hover:bg-[#444444] hover:scale-110 transition-all shadow-xl dark:shadow-white/20 border border-white/50 dark:border-white/10 z-30 duration-500"
                        >
                            <ArrowUp className="w-5 h-5 lg:w-8 lg:h-8 text-black dark:text-white transition-colors duration-500" />
                        </button>

                        <h2 className="text-3xl lg:text-8xl font-black mb-6 lg:mb-12 text-black dark:text-white leading-[1.1] tracking-tight transition-colors duration-500">
                            Gotowy na swoją pierwszą inteligentną podróż?
                        </h2>
                        <p className="font-sans text-sm md:text-lg lg:text-2xl xl:text-3xl font-medium text-black dark:text-gray-200 mb-8 lg:mb-16 leading-relaxed max-w-6xl mx-auto transition-colors duration-500">
                            Dołącz do społeczności <span className="text-blue-500 dark:text-orange-500 font-bold transition-colors duration-500">Travel-Planner</span> i przestań tracić czas na planowanie. Zaloguj się, aby odblokować pełną moc generatora AI, zapisywać swoje trasy w prywatnym archiwum i budować własną interaktywną mapę świata. Wszystko, czego potrzebujesz do idealnego wyjazdu, czeka na Ciebie w jednym miejscu.
                        </p>

                        <div>
                            <Link
                                to="/profile"
                                className="inline-block w-full sm:w-auto text-center bg-[#6584e0] dark:bg-orange-500 hover:bg-blue-600 dark:hover:bg-orange-600 text-white font-bold py-5 lg:py-8 px-12 lg:px-24 text-xl lg:text-4xl rounded-2xl transition-all shadow-xl dark:shadow-white/20 duration-300"
                            >
                                Zarejestruj się za darmo
                            </Link>
                        </div>
                    </div>
                </RevealOnScroll>
            </section>

            {/* ========================================== */}
            {/* STOPKA (Footer)                              */}
            {/* ========================================== */}
            <footer className="mx-4 sm:mx-8 mt-16 sm:mt-24 pt-12 pb-6 px-6 sm:px-12 lg:px-24 bg-gray-200/80 dark:bg-[#262626]/95 backdrop-blur-md shadow-[0_-10px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_-10px_30px_rgba(255,255,255,0.05)] border border-white/30 dark:border-white/10 border-b-0 rounded-t-3xl lg:rounded-t-[3rem] text-black dark:text-white z-10 relative transition-colors duration-500">
                <div className="max-w-[1400px] mx-auto w-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8 mb-12 text-center md:text-left">
                        <div className="space-y-4 flex flex-col items-center md:items-start">
                            <h3 className="text-3xl font-black text-blue-500 dark:text-orange-500 transition-colors duration-500">Travel-Planner</h3>
                            <p className="font-sans text-base md:text-lg font-medium text-gray-700 dark:text-gray-300 max-w-xs transition-colors duration-500">
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
                                <Link to="/plan" className="font-sans font-semibold hover:text-blue-500 dark:hover:text-orange-500 transition-colors">Zaplanuj podróż</Link>
                                <Link to="/trips" className="font-sans font-semibold hover:text-blue-500 dark:hover:text-orange-500 transition-colors">Moje podróże</Link>
                                <Link to="/map" className="font-sans font-semibold hover:text-blue-500 dark:hover:text-orange-500 transition-colors">Mapa świata</Link>
                                <Link to="/profile" className="font-sans font-semibold hover:text-blue-500 dark:hover:text-orange-500 transition-colors">Twój profil</Link>
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
                                <a href="mailto:kontakt@travel-planner.com" onClick={(e) => e.preventDefault()} className="font-sans font-semibold flex items-center hover:text-blue-500 dark:hover:text-orange-500 transition-colors group">
                                    <img src={iconEmail} alt="Email" className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                                    kontakt@travel-planner.com
                                </a>
                                <div className="flex space-x-4 pt-2">
                                    <a href="#" onClick={(e) => e.preventDefault()} className="flex justify-center items-center p-2 bg-white/50 dark:bg-white/10 rounded-full hover:bg-blue-500 dark:hover:bg-orange-500 hover:scale-110 transition-all shadow-sm duration-300">
                                        <img src={iconInstagram} alt="Instagram" className="w-6 h-6" />
                                    </a>
                                    <a href="#" onClick={(e) => e.preventDefault()} className="flex justify-center items-center p-2 bg-white/50 dark:bg-white/10 rounded-full hover:bg-blue-500 dark:hover:bg-orange-500 hover:scale-110 transition-all shadow-sm duration-300">
                                        <img src={iconFacebook} alt="Facebook" className="w-6 h-6" />
                                    </a>
                                    <a href="#" onClick={(e) => e.preventDefault()} className="flex justify-center items-center p-2 bg-white/50 dark:bg-white/10 rounded-full hover:bg-blue-500 dark:hover:bg-orange-500 hover:scale-110 transition-all shadow-sm duration-300">
                                        <img src={iconX} alt="X (Twitter)" className="w-6 h-6" />
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

export default Home;