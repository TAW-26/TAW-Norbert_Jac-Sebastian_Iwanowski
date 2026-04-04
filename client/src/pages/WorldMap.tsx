import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ZoomIn, ZoomOut, Filter, Globe, DollarSign, Calendar, Info, ChevronDown } from 'lucide-react';

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

const WorldMap = () => {
    const [activeFilter, setActiveFilter] = useState('Widok domyślny');
    const [activeBudget, setActiveBudget] = useState<string | null>(null);

    const filterButtons = ['Zwiedzone', 'Planowane', 'Nieodwiedzone', 'Widok domyślny'];

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

    {/* ========================================== */ }
    {/* LOGIKA MAPY (Zoom, Przeciąganie i Limity)  */ }
    {/* ========================================== */ }
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

    const zoomIn = () => setScale(prev => Math.min(prev + 0.5, 4));
    const zoomOut = () => {
        setScale(prev => {
            const newScale = Math.max(prev - 0.5, 1);
            if (newScale === 1) {
                setPosition({ x: 0, y: 0 });
            } else if (containerRef.current) {
                const boundX = (containerRef.current.clientWidth * (newScale - 1)) / 2;
                const boundY = (containerRef.current.clientHeight * (newScale - 1)) / 2;
                setPosition(pos => ({
                    x: clamp(pos.x, -boundX, boundX),
                    y: clamp(pos.y, -boundY, boundY)
                }));
            }
            return newScale;
        });
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (scale === 1) return;
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || scale === 1 || !containerRef.current) return;
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        const boundX = (containerRef.current.clientWidth * (scale - 1)) / 2;
        const boundY = (containerRef.current.clientHeight * (scale - 1)) / 2;
        setPosition({ x: clamp(newX, -boundX, boundX), y: clamp(newY, -boundY, boundY) });
    };

    const handleMouseUp = () => setIsDragging(false);

    const handleTouchStart = (e: React.TouchEvent) => {
        if (scale === 1) return;
        setIsDragging(true);
        const touch = e.touches[0];
        setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging || scale === 1 || !containerRef.current) return;
        const touch = e.touches[0];
        const newX = touch.clientX - dragStart.x;
        const newY = touch.clientY - dragStart.y;
        const boundX = (containerRef.current.clientWidth * (scale - 1)) / 2;
        const boundY = (containerRef.current.clientHeight * (scale - 1)) / 2;
        setPosition({ x: clamp(newX, -boundX, boundX), y: clamp(newY, -boundY, boundY) });
    };

    return (
        <div className="flex flex-col min-h-screen w-full">

            {/* ========================================== */}
            {/* SEKCJA GŁÓWNA - MAPA ŚWIATA                */}
            {/* ========================================== */}
            <section className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 py-20 lg:py-40 min-h-[calc(100dvh-140px)] lg:min-h-screen relative">
                <RevealOnScroll>
                    <div className="bg-gray-200/80 dark:bg-[#262626]/95 backdrop-blur-lg w-full max-w-4xl lg:max-w-[1500px] min-h-[75vh] p-6 py-10 sm:p-10 lg:p-12 rounded-3xl lg:rounded-[3rem] shadow-2xl dark:shadow-white/10 border border-white/30 dark:border-white/10 relative flex flex-col transition-colors duration-500">

                        <h2 className="text-3xl lg:text-7xl font-black mb-8 text-black dark:text-white tracking-tight text-center transition-colors">
                            Twoja Mapa Świata
                        </h2>

                        {/* KONTENER MAPY */}
                        <div
                            ref={containerRef}
                            className="bg-white dark:bg-[#1a1a1a] rounded-2xl lg:rounded-[2.5rem] w-full h-[300px] sm:h-[400px] lg:h-[600px] relative overflow-hidden shadow-inner border-4 border-white/50 dark:border-[#333] select-none transition-colors duration-500 touch-none"
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleMouseUp}
                        >
                            <div
                                className={`w-full h-full origin-center flex items-center justify-center ${scale === 1 ? 'cursor-default' : (isDragging ? 'cursor-grabbing' : 'cursor-grab')}`}
                                style={{
                                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                                    transition: isDragging ? 'none' : 'transform 0.3s ease-out'
                                }}
                            >
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg"
                                    alt="World Map"
                                    className="w-full h-full object-contain opacity-60 dark:opacity-40 dark:invert pointer-events-none transition-all duration-500"
                                    draggable="false"
                                />
                            </div>

                            {/* Pasek postępu */}
                            <div className="absolute bottom-4 left-4 lg:bottom-6 lg:left-6 bg-white/90 dark:bg-[#333]/90 backdrop-blur-md border border-gray-200 dark:border-white/10 px-4 py-3 lg:px-6 lg:py-4 rounded-2xl shadow-xl flex flex-col gap-2 pointer-events-none transition-colors">
                                <span className="text-[10px] sm:text-xs lg:text-sm font-black text-black dark:text-white uppercase tracking-wider flex items-center gap-2">
                                    <Globe className="w-3 h-3 lg:w-4 lg:h-4 text-blue-500 dark:text-orange-500" />
                                    Odkryto: 12% świata
                                </span>
                                <div className="w-32 sm:w-40 lg:w-56 h-2 lg:h-3 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className="w-[12%] h-full bg-green-500 dark:bg-orange-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                </div>
                            </div>

                            {/* Przyciski Zoom */}
                            <div className="absolute bottom-4 right-4 lg:bottom-6 lg:right-6 flex flex-col gap-2 lg:gap-3">
                                <button onClick={zoomIn} className="bg-white dark:bg-[#444] hover:bg-blue-500 dark:hover:bg-orange-500 text-black dark:text-white w-10 h-10 lg:w-14 lg:h-14 flex justify-center items-center rounded-xl lg:rounded-2xl shadow-lg transition-all active:scale-95 group">
                                    <ZoomIn className="w-5 h-5 lg:w-6 lg:h-6 group-hover:scale-110 transition-transform" />
                                </button>
                                <button onClick={zoomOut} className="bg-white dark:bg-[#444] hover:bg-blue-500 dark:hover:bg-orange-500 text-black dark:text-white w-10 h-10 lg:w-14 lg:h-14 flex justify-center items-center rounded-xl lg:rounded-2xl shadow-lg transition-all active:scale-95 group">
                                    <ZoomOut className="w-5 h-5 lg:w-6 lg:h-6 group-hover:scale-110 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {/* PANEL FILTRÓW */}
                        <div className="bg-white/40 dark:bg-black/20 rounded-2xl lg:rounded-[2.5rem] p-4 lg:p-10 mt-6 lg:mt-8 shadow-inner border border-white/20 dark:border-white/5 flex flex-col gap-6 lg:gap-8 transition-colors">

                            <div className="flex items-center gap-2 lg:gap-3 justify-center mb-2">
                                <Filter className="w-5 h-5 lg:w-6 lg:h-6 text-blue-500 dark:text-orange-500" />
                                <h3 className="text-xl lg:text-3xl font-black text-black dark:text-white uppercase tracking-tighter text-center">Zaawansowane Filtrowanie</h3>
                            </div>

                            <div className="flex flex-col xl:flex-row items-center justify-center gap-6 lg:gap-10">

                                {/* Główne statusy */}
                                <div className="flex flex-wrap justify-center gap-2 lg:gap-3">
                                    {filterButtons.map(btn => (
                                        <button
                                            key={btn}
                                            onClick={() => setActiveFilter(btn)}
                                            className={`px-4 py-2 lg:px-6 lg:py-3 rounded-xl font-sans font-bold text-xs sm:text-sm lg:text-lg transition-all shadow-md ${activeFilter === btn ? 'bg-[#6584e0] dark:bg-orange-500 text-white scale-105' : 'bg-white/80 dark:bg-[#333] text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#444]'}`}
                                        >
                                            {btn}
                                        </button>
                                    ))}
                                </div>

                                {/* Selektory i Budżet */}
                                <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-8 border-t xl:border-t-0 xl:border-l border-black/10 dark:border-white/10 pt-6 xl:pt-0 xl:pl-10 w-full xl:w-auto">

                                    {/* Kontynenty */}
                                    <div className="flex flex-col gap-2 min-w-[150px] sm:min-w-[200px]">
                                        <label className="text-[10px] lg:text-sm font-black text-black dark:text-white uppercase opacity-60 flex items-center gap-2">
                                            <Globe className="w-3 h-3" /> Kontynent
                                        </label>
                                        <select className="bg-white dark:bg-[#333] border-2 border-transparent focus:border-blue-500 dark:focus:border-orange-500 text-gray-700 dark:text-white text-sm lg:text-base rounded-xl px-3 py-2 lg:px-4 lg:py-2.5 font-sans focus:outline-none shadow-sm cursor-pointer transition-all w-full">
                                            <option>Wszystkie</option>
                                            <option>Europa</option>
                                            <option>Azja</option>
                                            <option>Ameryka Północna</option>
                                            <option>Ameryka Południowa</option>
                                            <option>Afryka</option>
                                            <option>Australia</option>
                                        </select>
                                    </div>

                                    {/* Budżet */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] lg:text-sm font-black text-black dark:text-white uppercase opacity-60 flex items-center gap-2">
                                            <DollarSign className="w-3 h-3" /> Budżet
                                        </label>
                                        <div className="flex gap-2">
                                            {['$', '$$', '$$$'].map(b => (
                                                <button
                                                    key={b}
                                                    onClick={() => setActiveBudget(b)}
                                                    className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-xl font-black text-sm sm:text-lg transition-all ${activeBudget === b ? 'bg-green-500 dark:bg-orange-500 text-white scale-110 shadow-lg' : 'bg-white dark:bg-[#333] text-gray-400 hover:text-green-500'}`}
                                                >
                                                    {b}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Rok */}
                                    <div className="flex flex-col gap-2 min-w-[120px] sm:min-w-[150px]">
                                        <label className="text-[10px] lg:text-sm font-black text-black dark:text-white uppercase opacity-60 flex items-center gap-2">
                                            <Calendar className="w-3 h-3" /> Rok wizyty
                                        </label>
                                        <select className="bg-white dark:bg-[#333] border-2 border-transparent focus:border-blue-500 dark:focus:border-orange-500 text-gray-700 dark:text-white text-sm lg:text-base rounded-xl px-3 py-2 lg:px-4 lg:py-2.5 font-sans focus:outline-none shadow-sm cursor-pointer transition-all w-full">
                                            <option>Dowolny</option>
                                            <option>2026</option>
                                            <option>2025</option>
                                            <option>2024</option>
                                            <option>2023</option>
                                        </select>
                                    </div>

                                </div>
                            </div>

                            <div className="flex items-center gap-2 justify-center mt-2 opacity-50">
                                <Info className="w-3 h-3 lg:w-4 lg:h-4 text-black dark:text-white" />
                                <p className="text-[10px] lg:text-xs font-sans font-bold text-black dark:text-white italic text-center">Kliknij na kontynent lub użyj filtrów, aby zawęzić listę wyświetlanych punktów.</p>
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

export default WorldMap;