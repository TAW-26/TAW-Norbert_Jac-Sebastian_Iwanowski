import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ZoomIn, ZoomOut, Filter, Globe, DollarSign, Calendar, Info, ChevronDown } from 'lucide-react';

import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

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

const continentMap: Record<string, string> = {
    // Europa
    pl: 'Europa', de: 'Europa', fr: 'Europa', it: 'Europa', es: 'Europa', pt: 'Europa', gb: 'Europa',
    ie: 'Europa', nl: 'Europa', be: 'Europa', ch: 'Europa', at: 'Europa', cz: 'Europa', sk: 'Europa',
    hu: 'Europa', gr: 'Europa', se: 'Europa', no: 'Europa', fi: 'Europa', dk: 'Europa', hr: 'Europa',
    ro: 'Europa', bg: 'Europa', si: 'Europa', is: 'Europa',
    // Azja
    cn: 'Azja', jp: 'Azja', kr: 'Azja', in: 'Azja', th: 'Azja', vn: 'Azja', id: 'Azja', my: 'Azja',
    sg: 'Azja', ph: 'Azja', tr: 'Azja', ae: 'Azja', il: 'Azja', sa: 'Azja', lk: 'Azja', mv: 'Azja',
    // Ameryka Północna
    us: 'Ameryka Północna', ca: 'Ameryka Północna', mx: 'Ameryka Północna', cu: 'Ameryka Północna',
    do: 'Ameryka Północna', jm: 'Ameryka Północna', cr: 'Ameryka Północna', pa: 'Ameryka Północna',
    // Ameryka Południowa
    br: 'Ameryka Południowa', ar: 'Ameryka Południowa', co: 'Ameryka Południowa', cl: 'Ameryka Południowa',
    pe: 'Ameryka Południowa', ve: 'Ameryka Południowa', ec: 'Ameryka Południowa', bo: 'Ameryka Południowa',
    // Afryka
    eg: 'Afryka', za: 'Afryka', ma: 'Afryka', dz: 'Afryka', tn: 'Afryka', ke: 'Afryka', tz: 'Afryka',
    gh: 'Afryka', ng: 'Afryka', sn: 'Afryka', mu: 'Afryka', sc: 'Afryka',
    // Australia i Oceania
    au: 'Australia', nz: 'Australia', fj: 'Australia'
};

const getContinent = (code: string | null) => {
    if (!code) return 'Inne';
    return continentMap[code.toLowerCase()] || 'Inne';
};

const budgetOptions = [
    {
        symbol: '$',
        value: 'Tani',
        activeBg: 'bg-green-500 dark:bg-green-500',
        hoverText: 'hover:text-green-500 dark:hover:text-green-400'
    },
    {
        symbol: '$$',
        value: 'Średni',
        activeBg: 'bg-yellow-500 dark:bg-orange-500',
        hoverText: 'hover:text-yellow-500 dark:hover:text-orange-400'
    },
    {
        symbol: '$$$',
        value: 'Wysoki',
        activeBg: 'bg-red-500 dark:bg-red-500',
        hoverText: 'hover:text-red-500 dark:hover:text-red-400'
    }
];

const WorldMap = () => {
    const { user } = useAuth();
    const [trips, setTrips] = useState<any[]>([]);

    const [alpha2ToNumeric, setAlpha2ToNumeric] = useState<Record<string, string>>({});

    const [activeFilter, setActiveFilter] = useState('Wszystkie');
    const filterButtons = ['Wszystkie', 'Zwiedzone', 'Planowane'];

    const [activeContinent, setActiveContinent] = useState('Wszystkie');
    const [activeBudget, setActiveBudget] = useState<string | null>(null);
    const [activeYear, setActiveYear] = useState('Dowolny');

    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
        skroty: false,
        kontakt: false
    });

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const response = await api.get('/trips');
                setTrips(response.data);
            } catch (error) {
                console.error("Błąd pobierania podróży", error);
            }
        };
        if (user) fetchTrips();

        fetch('https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/all/all.json')
            .then(res => res.json())
            .then(data => {
                const mapping: Record<string, string> = {};
                data.forEach((country: any) => {
                    mapping[country['alpha-2'].toLowerCase()] = country['country-code'];
                });
                setAlpha2ToNumeric(mapping);
            })
            .catch(err => console.error("Błąd pobierania mapowania ISO:", err));

    }, [user]);

    const toggleSection = (section: string) => {
        if (window.innerWidth < 768) {
            setOpenSections(prev => ({
                ...prev,
                [section]: !prev[section]
            }));
        }
    };

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

    const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

    const availableYears = Array.from(
        new Set(
            trips
                .map(t => t.startDate ? new Date(t.startDate).getFullYear().toString() : null)
                .filter(Boolean) as string[]
        )
    ).sort((a, b) => parseInt(b) - parseInt(a));

    const filteredTrips = trips.filter(trip => {
        if (activeFilter === 'Zwiedzone' && !trip.isCompleted) return false;
        if (activeFilter === 'Planowane' && trip.isCompleted) return false;

        if (activeContinent !== 'Wszystkie') {
            if (getContinent(trip.countryCode) !== activeContinent) return false;
        }

        if (activeBudget && trip.budgetLevel !== activeBudget) return false;

        if (activeYear !== 'Dowolny' && trip.startDate) {
            const tripYear = new Date(trip.startDate).getFullYear().toString();
            if (tripYear !== activeYear) return false;
        }

        return true;
    });

    const completedCountryCodes = new Set(
        filteredTrips.filter(t => t.isCompleted).map(t => t.countryCode ? alpha2ToNumeric[t.countryCode.toLowerCase()] : null).filter(Boolean)
    );

    const plannedCountryCodes = new Set(
        filteredTrips.filter(t => !t.isCompleted).map(t => t.countryCode ? alpha2ToNumeric[t.countryCode.toLowerCase()] : null).filter(Boolean)
    );

    const globalCompleted = trips.filter(t => t.isCompleted);
    const globalUniqueCountries = new Set(globalCompleted.map(t => t.countryCode).filter(Boolean)).size;
    const discoveredPercent = Math.min(100, Math.round((globalUniqueCountries / 195) * 100));

    return (
        <div className="flex flex-col min-h-screen w-full">

            <section className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 py-20 lg:py-40 min-h-[calc(100dvh-140px)] lg:min-h-screen relative">
                <RevealOnScroll>
                    <div className="bg-gray-200/80 dark:bg-[#262626]/95 backdrop-blur-lg w-full max-w-4xl lg:max-w-[1500px] min-h-[75vh] p-6 py-10 sm:p-10 lg:p-12 rounded-3xl lg:rounded-[3rem] shadow-2xl dark:shadow-white/10 border border-white/30 dark:border-white/10 relative flex flex-col transition-colors duration-500">

                        <h2 className="text-3xl lg:text-7xl font-black mb-8 text-black dark:text-white tracking-tight text-center transition-colors">
                            Twoja Mapa Świata
                        </h2>

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
                                <ComposableMap projection="geoMercator" projectionConfig={{ scale: 90 }} width={800} height={400} style={{ width: "100%", height: "100%", outline: "none" }}>
                                    <Geographies geography={geoUrl}>
                                        {({ geographies }) =>
                                            geographies.map((geo) => {
                                                const isCompleted = completedCountryCodes.has(geo.id);
                                                const isPlanned = plannedCountryCodes.has(geo.id);

                                                let fillClass = 'fill-[#E5E7EB] dark:fill-[#333333] hover:fill-[#9CA3AF] dark:hover:fill-[#444444]';

                                                if (isCompleted) {
                                                    fillClass = 'fill-blue-500 dark:fill-orange-500 hover:fill-blue-600 dark:hover:fill-orange-600';
                                                } else if (isPlanned) {
                                                    fillClass = 'fill-emerald-500 dark:fill-emerald-500 hover:fill-emerald-600 dark:hover:fill-emerald-600';
                                                }

                                                return (
                                                    <Geography
                                                        key={geo.rsmKey}
                                                        geography={geo}
                                                        className={`stroke-white dark:stroke-[#1a1a1a] stroke-[0.5px] outline-none transition-colors duration-500 ${fillClass}`}
                                                        style={{
                                                            default: { outline: "none" },
                                                            hover: { outline: "none" },
                                                            pressed: { outline: "none" },
                                                        }}
                                                    />
                                                );
                                            })
                                        }
                                    </Geographies>
                                </ComposableMap>
                            </div>

                            <div className="absolute bottom-4 left-4 lg:bottom-6 lg:left-6 bg-white/90 dark:bg-[#333]/90 backdrop-blur-md border border-gray-200 dark:border-white/10 px-4 py-3 lg:px-6 lg:py-4 rounded-2xl shadow-xl flex flex-col gap-2 pointer-events-none transition-colors">
                                <span className="text-[10px] sm:text-xs lg:text-sm font-black text-black dark:text-white uppercase tracking-wider flex items-center gap-2">
                                    <Globe className="w-3 h-3 lg:w-4 lg:h-4 text-blue-500 dark:text-orange-500" />
                                    Odkryto: {discoveredPercent}% świata
                                </span>
                                <div className="w-32 sm:w-40 lg:w-56 h-2 lg:h-3 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 dark:bg-orange-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)] transition-all duration-1000" style={{ width: `${discoveredPercent}%` }}></div>
                                </div>
                            </div>

                            <div className="absolute bottom-4 right-4 lg:bottom-6 lg:right-6 flex flex-col gap-2 lg:gap-3">
                                <button onClick={zoomIn} className="bg-white dark:bg-[#444] hover:bg-blue-500 dark:hover:bg-orange-500 text-black dark:text-white w-10 h-10 lg:w-14 lg:h-14 flex justify-center items-center rounded-xl lg:rounded-2xl shadow-lg transition-all active:scale-95 group">
                                    <ZoomIn className="w-5 h-5 lg:w-6 lg:h-6 group-hover:scale-110 transition-transform" />
                                </button>
                                <button onClick={zoomOut} className="bg-white dark:bg-[#444] hover:bg-blue-500 dark:hover:bg-orange-500 text-black dark:text-white w-10 h-10 lg:w-14 lg:h-14 flex justify-center items-center rounded-xl lg:rounded-2xl shadow-lg transition-all active:scale-95 group">
                                    <ZoomOut className="w-5 h-5 lg:w-6 lg:h-6 group-hover:scale-110 transition-transform" />
                                </button>
                            </div>
                        </div>

                        <div className="bg-white/40 dark:bg-black/20 rounded-2xl lg:rounded-[2.5rem] p-4 lg:p-10 mt-6 lg:mt-8 shadow-inner border border-white/20 dark:border-white/5 flex flex-col gap-6 lg:gap-8 transition-colors">

                            <div className="flex items-center gap-2 lg:gap-3 justify-center mb-2">
                                <Filter className="w-5 h-5 lg:w-6 lg:h-6 text-blue-500 dark:text-orange-500" />
                                <h3 className="text-xl lg:text-3xl font-black text-black dark:text-white uppercase tracking-tighter text-center">Zaawansowane Filtrowanie</h3>
                            </div>

                            <div className="flex flex-col xl:flex-row items-center justify-center gap-6 lg:gap-10">
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

                                <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-8 border-t xl:border-t-0 xl:border-l border-black/10 dark:border-white/10 pt-6 xl:pt-0 xl:pl-10 w-full xl:w-auto">

                                    <div className="flex flex-col gap-2 min-w-[150px] sm:min-w-[200px]">
                                        <label className="text-[10px] lg:text-sm font-black text-black dark:text-white uppercase opacity-60 flex items-center gap-2">
                                            <Globe className="w-3 h-3" /> Kontynent
                                        </label>
                                        <select
                                            value={activeContinent}
                                            onChange={(e) => setActiveContinent(e.target.value)}
                                            className="bg-white dark:bg-[#333] border-2 border-transparent focus:border-blue-500 dark:focus:border-orange-500 text-gray-700 dark:text-white text-sm lg:text-base rounded-xl px-3 py-2 lg:px-4 lg:py-2.5 font-sans focus:outline-none shadow-sm cursor-pointer transition-all w-full"
                                        >
                                            <option value="Wszystkie">Wszystkie</option>
                                            <option value="Europa">Europa</option>
                                            <option value="Azja">Azja</option>
                                            <option value="Ameryka Północna">Ameryka Północna</option>
                                            <option value="Ameryka Południowa">Ameryka Południowa</option>
                                            <option value="Afryka">Afryka</option>
                                            <option value="Australia">Australia</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] lg:text-sm font-black text-black dark:text-white uppercase opacity-60 flex items-center gap-2">
                                            <DollarSign className="w-3 h-3" /> Budżet
                                        </label>
                                        <div className="flex gap-2">
                                            {budgetOptions.map(option => {
                                                const isActive = activeBudget === option.value;
                                                return (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => setActiveBudget(isActive ? null : option.value)}
                                                        className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-xl font-black text-sm sm:text-lg transition-all shadow-sm ${isActive
                                                            ? `${option.activeBg} text-white scale-110 shadow-lg`
                                                            : `bg-white dark:bg-[#333] text-gray-400 ${option.hoverText}`
                                                            }`}
                                                    >
                                                        {option.symbol}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 min-w-[120px] sm:min-w-[150px]">
                                        <label className="text-[10px] lg:text-sm font-black text-black dark:text-white uppercase opacity-60 flex items-center gap-2">
                                            <Calendar className="w-3 h-3" /> Rok wizyty
                                        </label>
                                        <select
                                            value={activeYear}
                                            onChange={(e) => setActiveYear(e.target.value)}
                                            className="bg-white dark:bg-[#333] border-2 border-transparent focus:border-blue-500 dark:focus:border-orange-500 text-gray-700 dark:text-white text-sm lg:text-base rounded-xl px-3 py-2 lg:px-4 lg:py-2.5 font-sans focus:outline-none shadow-sm cursor-pointer transition-all w-full"
                                        >
                                            <option value="Dowolny">Dowolny</option>
                                            {availableYears.map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 justify-center mt-2 opacity-50">
                                <Info className="w-3 h-3 lg:w-4 lg:h-4 text-black dark:text-white" />
                                <p className="text-[10px] lg:text-xs font-sans font-bold text-black dark:text-white italic text-center">Użyj przycisków wyżej, by wyselekcjonować konkretne podróże na mapie.</p>
                            </div>
                        </div>

                    </div>
                </RevealOnScroll>
            </section>

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