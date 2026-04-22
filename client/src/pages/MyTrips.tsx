import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, SlidersHorizontal, Trash2, Edit3, Eye, Calendar, SortAsc, DollarSign, ChevronDown, Clock, ArrowUp, Map, Frown, History, Plane, BookOpen } from 'lucide-react';

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

const calculateDays = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays === 1 ? '1 dzień' : `${diffDays} dni`;
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const getBudgetProps = (budget: string | null) => {
    const b = budget?.toLowerCase() || '';
    if (b.includes('niski') || b.includes('tani')) return { label: '$', color: 'bg-green-500' };
    if (b.includes('średni') || b.includes('umiarkowany')) return { label: '$$', color: 'bg-orange-500' };
    return { label: '$$$', color: 'bg-red-600' };
};

const getBudgetWeight = (budget: string | null) => {
    const b = budget?.toLowerCase() || '';
    if (b.includes('niski') || b.includes('tani')) return 1;
    if (b.includes('średni') || b.includes('umiarkowany') || b.includes('medium')) return 2;
    if (b.includes('wysoki') || b.includes('premium')) return 3;
    return 0;
};

const MyTrips = () => {
    const { user } = useAuth();
    const [trips, setTrips] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isSortOpen, setIsSortOpen] = useState(false);
    const [activeSort, setActiveSort] = useState('added');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const [searchTerm, setSearchTerm] = useState('');
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({ skroty: false, kontakt: false });

    const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const response = await api.get('/trips');
                setTrips(response.data);
            } catch (error) {
                console.error("Błąd podczas pobierania podróży", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchTrips();
        } else {
            setIsLoading(false);
        }
    }, [user]);

    const toggleSection = (section: string) => {
        if (window.innerWidth < 768) {
            setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
        }
    };

    const handleSortClick = (type: string) => {
        if (activeSort === type) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setActiveSort(type);
            setSortOrder(type === 'added' ? 'desc' : 'asc');
        }
    };

    const handleDeleteTrip = async (tripId: number, destination: string) => {
        const isConfirmed = window.confirm(`Czy na pewno chcesz bezpowrotnie usunąć swoją podróż do miejsca: ${destination}?`);
        if (!isConfirmed) return;

        try {
            await api.delete(`/trips/${tripId}`);
            setTrips(prevTrips => prevTrips.filter(trip => trip.id !== tripId));
        } catch (error) {
            console.error("Błąd podczas usuwania wycieczki:", error);
            alert("Nie udało się usunąć wycieczki. Spróbuj ponownie za chwilę.");
        }
    };

    const SortButton = ({ type, icon: Icon, label }: { type: string, icon: any, label: string }) => {
        const isActive = activeSort === type;
        return (
            <button
                onClick={() => handleSortClick(type)}
                className={`flex items-center gap-3 px-6 py-2.5 rounded-xl font-sans font-bold transition-all duration-300 ${isActive
                    ? 'bg-blue-500 dark:bg-orange-500 text-white shadow-lg scale-105'
                    : 'bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-black dark:text-white'
                    }`}
            >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
                <div className={`flex items-center transition-all duration-500 ease-in-out ${isActive ? 'opacity-100 w-4' : 'opacity-0 w-0 overflow-hidden'} ${sortOrder === 'desc' ? 'rotate-180' : 'rotate-0'}`}>
                    <ArrowUp className="w-4 h-4" />
                </div>
            </button>
        );
    };

    // ==========================================
    // LOGIKA FILTROWANIA I SORTOWANIA
    // ==========================================

    const upcomingTrips = trips.filter(trip => !trip.isCompleted);
    const completedTrips = trips.filter(trip => trip.isCompleted);
    const currentList = activeTab === 'upcoming' ? upcomingTrips : completedTrips;

    const processedTrips = currentList
        .filter(trip => {
            const dest = trip.destination.toLowerCase();
            const term = searchTerm.toLowerCase();
            return dest.startsWith(term) || dest.includes(` ${term}`);
        })
        .sort((a, b) => {
            let res = 0;
            if (activeSort === 'added') {
                res = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            } else if (activeSort === 'name') {
                res = a.destination.localeCompare(b.destination);
            } else if (activeSort === 'date') {
                res = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
            } else if (activeSort === 'time') {
                const timeA = new Date(a.endDate).getTime() - new Date(a.startDate).getTime();
                const timeB = new Date(b.endDate).getTime() - new Date(b.startDate).getTime();
                res = timeA - timeB;
            } else if (activeSort === 'budget') {
                res = getBudgetWeight(a.budgetLevel) - getBudgetWeight(b.budgetLevel);
            }
            return sortOrder === 'asc' ? res : -res;
        });

    return (
        <div className="flex flex-col min-h-screen w-full">
            <section className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 py-20 lg:py-40 min-h-[calc(100dvh-140px)] lg:min-h-screen relative">
                <RevealOnScroll>
                    <div className="bg-gray-200/80 dark:bg-[#262626]/95 backdrop-blur-lg w-full max-w-4xl lg:max-w-[1500px] lg:min-h-[70vh] p-6 py-10 sm:p-10 lg:p-14 rounded-3xl lg:rounded-[3rem] shadow-2xl dark:shadow-white/10 border border-white/30 dark:border-white/10 relative flex flex-col transition-colors duration-500">
                        <div className="mb-10">
                            <h2 className="text-3xl lg:text-7xl font-black mb-8 text-black dark:text-white tracking-tight text-center transition-colors">
                                Moje zapisane podróże
                            </h2>

                            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="flex items-center w-full md:w-auto">
                                    <div className="relative w-full">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Szukaj przygody..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="bg-white/50 dark:bg-black/20 border-2 border-transparent focus:border-blue-500 dark:focus:border-orange-500 rounded-2xl pl-12 pr-4 py-3 lg:py-4 text-base lg:text-lg focus:outline-none transition-all shadow-inner font-sans w-full md:w-80 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div className="flex bg-white/40 dark:bg-black/20 p-1.5 lg:p-2 rounded-2xl lg:rounded-[2rem] border border-white/20 dark:border-white/5 w-full xl:w-auto">
                                    <button
                                        onClick={() => setActiveTab('upcoming')}
                                        className={`flex-1 xl:flex-none flex items-center justify-center gap-2 py-3 px-4 lg:px-8 rounded-xl lg:rounded-2xl font-black text-sm sm:text-base lg:text-lg transition-all duration-300 ${activeTab === 'upcoming' ? 'bg-[#6584e0] dark:bg-orange-500 text-white shadow-lg scale-105' : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/10'}`}
                                    >
                                        <Plane className="w-5 h-5" /> Nadchodzące ({upcomingTrips.length})
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('completed')}
                                        className={`flex-1 xl:flex-none flex items-center justify-center gap-2 py-3 px-4 lg:px-8 rounded-xl lg:rounded-2xl font-black text-sm sm:text-base lg:text-lg transition-all duration-300 ${activeTab === 'completed' ? 'bg-[#6584e0] dark:bg-orange-500 text-white shadow-lg scale-105' : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/10'}`}
                                    >
                                        <BookOpen className="w-5 h-5" /> Zrealizowane ({completedTrips.length})
                                    </button>
                                </div>

                                <button onClick={() => setIsSortOpen(!isSortOpen)} className={`w-full md:w-auto font-bold py-3 lg:py-4 px-10 text-lg lg:text-xl rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 group ${isSortOpen ? 'bg-blue-600 dark:bg-orange-600 text-white' : 'bg-white dark:bg-white/10 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/20'}`}>
                                    <SlidersHorizontal className={`w-5 h-5 transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
                                    Sortuj wyniki
                                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
                                </button>
                            </div>

                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isSortOpen ? 'max-h-96 md:max-h-40 mt-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="p-4 bg-white/30 dark:bg-black/20 rounded-[2rem] border border-white/20 dark:border-white/5 flex flex-wrap justify-center gap-4">
                                    <SortButton type="added" icon={History} label={activeSort === 'added' && sortOrder === 'asc' ? 'Najstarsze' : 'Najnowsze'} />
                                    <SortButton type="date" icon={Calendar} label="Termin wyjazdu" />
                                    <SortButton type="name" icon={SortAsc} label="Alfabetycznie" />
                                    <SortButton type="budget" icon={DollarSign} label="Według budżetu" />
                                    <SortButton type="time" icon={Clock} label="Czas trwania" />
                                </div>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex-1 flex justify-center items-center py-20">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 dark:border-orange-500"></div>
                            </div>
                        ) : trips.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center">
                                <div className="bg-white/50 dark:bg-black/20 p-8 rounded-full mb-6 border border-white/30 dark:border-white/5 shadow-inner">
                                    <Map className="w-20 h-20 text-blue-500 dark:text-orange-500 opacity-80" />
                                </div>
                                <h3 className="text-3xl lg:text-4xl font-black text-black dark:text-white mb-4">Nic tu jeszcze nie ma!</h3>
                                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md font-medium">
                                    Twoja historia podróży jest pusta. Pora to zmienić i zaplanować wymarzoną wycieczkę z pomocą naszej sztucznej inteligencji.
                                </p>
                                <Link to="/plan" className="bg-[#6584e0] dark:bg-orange-500 hover:bg-blue-600 dark:hover:bg-orange-600 text-white font-black py-4 px-8 text-xl lg:text-2xl rounded-2xl transition-all shadow-xl hover:scale-105 flex items-center gap-3">
                                    Zaplanuj pierwszą podróż <ArrowRight className="w-6 h-6" />
                                </Link>
                            </div>
                        ) : processedTrips.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center">
                                <div className="bg-white/50 dark:bg-black/20 p-8 rounded-full mb-6 border border-white/30 dark:border-white/5 shadow-inner">
                                    <Frown className="w-20 h-20 text-blue-500 dark:text-orange-500 opacity-80" />
                                </div>
                                <h3 className="text-3xl lg:text-4xl font-black text-black dark:text-white mb-4">Brak wyników</h3>
                                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md font-medium">
                                    Nie znaleźliśmy żadnej podróży zaczynającej się na "{searchTerm}".
                                </p>
                                <button onClick={() => setSearchTerm('')} className="bg-blue-500 dark:bg-orange-500 hover:bg-blue-600 dark:hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md">
                                    Wyczyść wyszukiwanie
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="hidden lg:grid grid-cols-[140px_1fr_150px_250px_100px_180px] gap-4 px-10 mb-6 text-black/40 dark:text-white/40 font-bold text-xl uppercase tracking-widest transition-colors">
                                    <div className="text-center">Cel</div>
                                    <div>Miejsce</div>
                                    <div className="text-center">Czas</div>
                                    <div className="text-center">Termin</div>
                                    <div className="text-center">Budżet</div>
                                    <div className="text-right">Akcje</div>
                                </div>

                                <div className="flex-1 flex flex-col gap-5 overflow-y-auto pr-2 max-h-[50vh] lg:max-h-[55vh] custom-scrollbar" style={{ scrollbarWidth: 'thin' }}>
                                    {processedTrips.map((trip) => {
                                        const budget = getBudgetProps(trip.budgetLevel);
                                        return (
                                            <div key={trip.id} className="bg-white/40 dark:bg-black/20 rounded-2xl lg:rounded-full p-6 lg:px-10 lg:py-5 shadow-sm border border-white/20 dark:border-white/5 flex flex-col lg:grid lg:grid-cols-[140px_1fr_150px_250px_100px_180px] items-center gap-4 lg:gap-6 transition-all duration-300 hover:bg-white/60 dark:hover:bg-black/40 hover:scale-[1.01] group">

                                                {trip.countryCode ? (
                                                    <img
                                                        src={`https://flagcdn.com/w160/${trip.countryCode.toLowerCase()}.png`}
                                                        alt={trip.destination}
                                                        className="w-20 h-12 lg:w-24 lg:h-16 object-cover rounded-xl shadow-md border border-black/5 dark:border-white/10 transition-transform group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="w-20 h-12 lg:w-24 lg:h-16 rounded-xl shadow-md border border-black/5 dark:border-white/10 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 dark:from-orange-500 dark:to-red-600 text-white font-black text-2xl transition-transform group-hover:scale-110">
                                                        {trip.destination.charAt(0).toUpperCase()}
                                                    </div>
                                                )}

                                                <div className="text-2xl lg:text-4xl font-black text-black dark:text-white transition-colors text-center lg:text-left">{trip.destination}</div>
                                                <div className="font-sans text-lg lg:text-2xl font-semibold text-gray-700 dark:text-gray-300 text-center transition-colors">{calculateDays(trip.startDate, trip.endDate)}</div>
                                                <div className="font-sans text-sm lg:text-xl font-medium text-gray-600 dark:text-gray-400 text-center transition-colors">
                                                    {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                                                </div>
                                                <div className="flex justify-center">
                                                    <div className={`w-10 h-10 lg:w-14 lg:h-14 flex items-center justify-center rounded-xl lg:rounded-2xl font-sans font-black text-lg lg:text-2xl text-white shadow-lg transition-transform ${budget.color}`}>{budget.label}</div>
                                                </div>
                                                <div className="flex flex-row lg:flex-row gap-3 w-full lg:w-auto justify-center lg:justify-end mt-4 lg:mt-0">
                                                    <Link to={`/trip-result/${trip.id}`} title="Zobacz" className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all shadow-md hover:scale-110"><Eye className="w-5 h-5" /></Link>

                                                    {activeTab === 'upcoming' && (
                                                        <Link
                                                            to={`/trip-result/${trip.id}`}
                                                            state={{ startEditing: true }}
                                                            title="Edytuj"
                                                            className="p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all shadow-md hover:scale-110"
                                                        >
                                                            <Edit3 className="w-5 h-5" />
                                                        </Link>
                                                    )}

                                                    <button
                                                        onClick={() => handleDeleteTrip(trip.id, trip.destination)}
                                                        title="Usuń"
                                                        className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all shadow-md hover:scale-110"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-12 flex justify-center">
                                    <Link to="/plan" className="bg-[#6584e0] dark:bg-orange-500 hover:bg-blue-600 dark:hover:bg-orange-600 text-white font-black py-4 px-8 lg:py-5 lg:px-14 text-lg lg:text-2xl rounded-2xl lg:rounded-[2rem] transition-all shadow-2xl hover:scale-105 flex items-center gap-3 group text-center w-full sm:w-auto justify-center">
                                        Zaplanuj nową podróż
                                        <ArrowRight className="w-6 h-6 lg:w-8 lg:h-8 group-hover:translate-x-2 transition-transform" />
                                    </Link>
                                </div>
                            </>
                        )}
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

export default MyTrips;