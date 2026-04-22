import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { Save, Map as MapIcon, ChevronDown, Loader2, ArrowLeft, Edit3, Trash2, PlusCircle, Check, CheckCircle } from 'lucide-react';
import api from '../services/api';

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

    return <div ref={ref} className={`transition-all duration-[1000ms] ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}>{children}</div>;
};

const TripResult = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();

    const [trip, setTrip] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({ skroty: false, kontakt: false });

    useEffect(() => {
        if (id === 'new') {
            if (location.state && location.state.tripData) {
                setTrip(location.state.tripData);
                setIsLoading(false);
            } else {
                navigate('/plan');
            }
        }
        else if (id) {
            const fetchTrip = async () => {
                try {
                    const response = await api.get(`/trips/${id}`);
                    setTrip(response.data);

                    if (location.state?.startEditing && !response.data.isCompleted) {
                        setIsEditing(true);
                    }
                } catch (error) {
                    console.error("Błąd pobierania:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchTrip();
        }
    }, [id, location, navigate]);

    const handleActivityChange = (dayIndex: number, activityIndex: number, field: string, value: string) => {
        setTrip((prev: any) => {
            const newTrip = { ...prev };
            newTrip.days[dayIndex].activities[activityIndex][field] = value;
            return newTrip;
        });
    };

    const handleRemoveActivity = (dayIndex: number, activityIndex: number) => {
        setTrip((prev: any) => {
            const newTrip = { ...prev };
            newTrip.days[dayIndex].activities.splice(activityIndex, 1);
            return newTrip;
        });
    };

    const handleAddActivity = (dayIndex: number) => {
        setTrip((prev: any) => {
            const newTrip = { ...prev };
            newTrip.days[dayIndex].activities.push({
                startTime: '12:00',
                title: 'Nowy punkt planu',
                location: 'Wpisz miejsce',
                description: 'Krótki opis lub własna notatka'
            });
            return newTrip;
        });
    };

    const handleSaveTrip = async () => {
        setIsSaving(true);
        try {
            if (id === 'new') {
                await api.post('/trips/save-generated', trip);
            } else {
                await api.put(`/trips/${id}`, trip);
            }
            navigate('/trips');
        } catch (error) {
            console.error("Błąd zapisu:", error);
            alert("Nie udało się zapisać wycieczki. Spróbuj ponownie.");
            setIsSaving(false);
        }
    };

    const handleMarkAsCompleted = async () => {
        const confirm = window.confirm("Czy na pewno chcesz oznaczyć tę podróż jako zrealizowaną? Spowoduje to przeniesienie jej do historii i zablokuje możliwość dalszej edycji planu.");
        if (!confirm) return;

        setIsCompleting(true);
        try {
            await api.put(`/trips/${id}/complete`);
            navigate('/trips');
        } catch (error) {
            console.error("Błąd podczas oznaczania jako zrealizowana:", error);
            alert("Wystąpił błąd. Spróbuj ponownie.");
            setIsCompleting(false);
        }
    };

    const toggleSection = (section: string) => {
        if (window.innerWidth < 768) setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen w-full items-center justify-center">
                <Loader2 className="w-16 h-16 text-[#6584e0] dark:text-orange-500 animate-spin mb-4" />
                <p className="text-xl font-bold dark:text-white">Pobieram Twój plan...</p>
            </div>
        );
    }

    if (!trip) return <div className="min-h-screen flex items-center justify-center text-white text-3xl font-black">Brak danych!</div>;

    const daysArray = trip?.days || [];
    const daysCount = daysArray.length;
    let budgetDisplay = "150 - 300 EUR";
    if (trip?.budgetLevel === "Tani" || trip?.budgetLevel === "cheap") budgetDisplay = "50 - 100 EUR";
    if (trip?.budgetLevel === "Wysoki" || trip?.budgetLevel === "expensive") budgetDisplay = "500+ EUR";

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(trip?.endDate);
    endDate.setHours(0, 0, 0, 0);

    const isPastTrip = endDate < today;

    return (
        <div className="flex flex-col min-h-screen w-full">
            <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 py-20 lg:py-40 min-h-[calc(100dvh-140px)] lg:min-h-screen relative transition-all duration-500">
                <RevealOnScroll>
                    <div className="bg-gray-200/80 dark:bg-[#262626]/95 backdrop-blur-lg w-full max-w-4xl lg:max-w-[1600px] lg:min-h-[75vh] p-6 py-10 lg:p-12 xl:p-16 rounded-3xl lg:rounded-[3rem] shadow-2xl dark:shadow-white/10 border border-white/30 dark:border-white/10 relative flex flex-col justify-between transition-colors duration-500">

                        <div className="text-center mb-8 lg:mb-14">
                            {id === 'new' && (
                                <div className="bg-orange-500/20 border border-orange-500 text-orange-600 dark:text-orange-400 font-bold px-6 py-3 rounded-2xl mb-6 inline-flex items-center justify-center gap-3">
                                    <span className="animate-pulse">👁️</span> To jest tylko podgląd. Zapisz plan do bazy, aby odblokować możliwość jego edycji!
                                </div>
                            )}

                            {trip?.isCompleted && (
                                <div className="bg-green-500/20 border border-green-500 text-green-600 dark:text-green-400 font-bold px-6 py-3 rounded-2xl mb-6 inline-flex items-center justify-center gap-3">
                                    <CheckCircle className="w-5 h-5" /> Podróż zrealizowana! (Tryb tylko do odczytu)
                                </div>
                            )}

                            <h2 className="text-3xl lg:text-7xl font-black text-black dark:text-white tracking-tight transition-colors">
                                Twoja przygoda w {trip?.destination || "Nieznanym Miejscu"}
                            </h2>
                            <p className="text-xl lg:text-3xl font-bold mt-4 text-blue-500 dark:text-orange-500">
                                {daysCount} dni pełnych wrażeń.
                            </p>

                            {id !== 'new' && !trip?.isCompleted && (
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className={`mt-6 px-6 py-3 rounded-2xl font-bold shadow-md transition-all flex items-center justify-center gap-2 mx-auto ${isEditing ? 'bg-green-500 text-white' : 'bg-white dark:bg-black/20 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10'
                                        }`}
                                >
                                    {isEditing ? <><Check className="w-5 h-5" /> Gotowe, zapiszmy to</> : <><Edit3 className="w-5 h-5" /> Edytuj plan</>}
                                </button>
                            )}
                        </div>

                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 flex-1 items-stretch">

                            <div className="w-full lg:w-3/5 bg-white/40 dark:bg-black/20 rounded-3xl lg:rounded-[2rem] p-4 sm:p-6 lg:p-8 shadow-inner border border-white/20 dark:border-white/5 flex flex-col max-h-[500px] lg:max-h-[65vh] transition-colors">
                                <div className="flex-1 overflow-y-auto pr-2 lg:pr-4 custom-scrollbar" style={{ scrollbarWidth: 'thin' }}>

                                    {daysArray.length === 0 ? (
                                        <div className="text-center py-10 text-gray-500 dark:text-gray-400 font-bold">
                                            Brak dni do wyświetlenia.
                                        </div>
                                    ) : (
                                        daysArray.map((day: any, dayIdx: number) => (
                                            <div key={day.id || day.dayNumber || dayIdx}>
                                                <div className={`bg-gray-200/90 dark:bg-[#333333]/95 backdrop-blur-md rounded-full py-2 lg:py-3 mb-6 lg:mb-8 shadow-md border border-white/40 dark:border-white/10 sticky top-0 z-10 transition-colors ${(day.dayNumber || dayIdx + 1) > 1 ? 'mt-8' : ''}`}>
                                                    <h3 className="text-lg lg:text-3xl font-black text-center text-black dark:text-white uppercase tracking-wider">📅 DZIEŃ {day.dayNumber || dayIdx + 1}</h3>
                                                </div>
                                                <div className="overflow-x-auto mb-6 lg:mb-8">
                                                    <table className="w-full text-left border-collapse min-w-[450px] lg:min-w-[500px]">
                                                        {(day.dayNumber === 1 || dayIdx === 0) && (
                                                            <thead>
                                                                <tr className="border-b-2 border-gray-400/50 dark:border-gray-600/50 text-base lg:text-2xl text-black dark:text-white">
                                                                    <th className="pb-3 lg:pb-4 font-black w-[15%] pl-2 lg:pl-4">Godz.</th>
                                                                    <th className="pb-3 lg:pb-4 font-black w-[35%]">Atrakcja</th>
                                                                    <th className="pb-3 lg:pb-4 font-black w-[40%] pr-2 lg:pr-4">Opis / Notatka</th>
                                                                    {isEditing && <th className="pb-3 lg:pb-4 font-black w-[10%] text-center">Akcja</th>}
                                                                </tr>
                                                            </thead>
                                                        )}
                                                        <tbody className="font-sans font-semibold text-sm lg:text-base text-gray-800 dark:text-gray-200">
                                                            {(day.activities || []).map((activity: any, actIdx: number) => (
                                                                <tr key={activity.id || actIdx} className={`border-b border-gray-400/20 dark:border-gray-700/30 hover:bg-white/20 dark:hover:bg-white/5 transition-colors ${actIdx % 2 !== 0 ? 'bg-gray-400/5 dark:bg-white/5' : ''}`}>

                                                                    <td className="py-4 lg:py-6 pl-2 lg:pl-4 align-top w-[15%]">
                                                                        {isEditing ? (
                                                                            <input
                                                                                type="time"
                                                                                value={activity.startTime || ''}
                                                                                onChange={(e) => handleActivityChange(dayIdx, actIdx, 'startTime', e.target.value)}
                                                                                className="w-full bg-white dark:bg-[#2a2a2a] text-blue-600 dark:text-orange-400 font-bold border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 outline-none focus:border-blue-500"
                                                                            />
                                                                        ) : (
                                                                            <span className="font-bold text-blue-500 dark:text-orange-500">{activity.startTime || '---'}</span>
                                                                        )}
                                                                    </td>

                                                                    <td className="py-4 lg:py-6 pr-2 lg:pr-4 align-top w-[35%]">
                                                                        {isEditing ? (
                                                                            <div className="flex flex-col gap-2">
                                                                                <input
                                                                                    type="text" value={activity.title || ''}
                                                                                    onChange={(e) => handleActivityChange(dayIdx, actIdx, 'title', e.target.value)}
                                                                                    placeholder="Nazwa miejsca"
                                                                                    className="w-full bg-white dark:bg-[#2a2a2a] font-black border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 outline-none focus:border-blue-500 text-black dark:text-white"
                                                                                />
                                                                                <div className="flex items-center gap-1 text-xs">
                                                                                    📍 <input
                                                                                        type="text" value={activity.location || ''}
                                                                                        onChange={(e) => handleActivityChange(dayIdx, actIdx, 'location', e.target.value)}
                                                                                        placeholder="Lokalizacja"
                                                                                        className="w-full bg-white/50 dark:bg-[#2a2a2a]/50 text-gray-500 dark:text-gray-400 border border-gray-300/50 dark:border-gray-600/50 rounded px-2 py-0.5 outline-none focus:border-blue-500"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            <>
                                                                                <div className="font-black">{activity.title || 'Brak tytułu'}</div>
                                                                                <div className="text-xs text-gray-500 mt-1">📍 {activity.location || '-'}</div>
                                                                            </>
                                                                        )}
                                                                    </td>

                                                                    <td className="py-4 lg:py-6 pr-2 lg:pr-4 align-top w-[40%] text-xs lg:text-sm font-medium">
                                                                        {isEditing ? (
                                                                            <textarea
                                                                                value={activity.description || ''}
                                                                                onChange={(e) => handleActivityChange(dayIdx, actIdx, 'description', e.target.value)}
                                                                                placeholder="Twoja notatka lub opis..."
                                                                                rows={3}
                                                                                className="w-full bg-white dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 outline-none focus:border-blue-500 text-gray-700 dark:text-gray-300 resize-none custom-scrollbar"
                                                                            />
                                                                        ) : (
                                                                            <span className="opacity-80 italic">{activity.description || '-'}</span>
                                                                        )}
                                                                    </td>

                                                                    {isEditing && (
                                                                        <td className="py-4 lg:py-6 align-top text-center w-[10%]">
                                                                            <button
                                                                                onClick={() => handleRemoveActivity(dayIdx, actIdx)}
                                                                                className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-colors"
                                                                                title="Usuń ten punkt"
                                                                            >
                                                                                <Trash2 className="w-5 h-5 mx-auto" />
                                                                            </button>
                                                                        </td>
                                                                    )}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>

                                                    {isEditing && (
                                                        <div className="mt-4 flex justify-center">
                                                            <button
                                                                onClick={() => handleAddActivity(dayIdx)}
                                                                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-blue-600 dark:text-orange-400 bg-blue-100 dark:bg-orange-500/20 hover:bg-blue-200 dark:hover:bg-orange-500/30 rounded-xl transition-colors"
                                                            >
                                                                <PlusCircle className="w-4 h-4" /> Dodaj własny punkt
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="w-full lg:w-2/5 bg-white/40 dark:bg-black/20 rounded-3xl lg:rounded-[2rem] p-6 lg:p-10 shadow-inner border border-white/20 dark:border-white/5 flex flex-col transition-colors">
                                <div className="bg-blue-500 dark:bg-orange-500 rounded-full py-3 lg:py-4 mb-8 lg:mb-10 shadow-lg transition-colors">
                                    <h3 className="text-xl lg:text-3xl font-black text-center text-white uppercase tracking-widest">Raport</h3>
                                </div>
                                <div className="flex-1 flex flex-col justify-center space-y-6 lg:space-y-10">
                                    <div className="flex items-center gap-4 lg:gap-5 group">
                                        <div className="bg-white dark:bg-white/10 p-3 lg:p-4 rounded-2xl shadow-md transition-transform group-hover:scale-110"><span className="text-2xl lg:text-5xl">💰</span></div>
                                        <div>
                                            <p className="text-xs lg:text-sm font-sans font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tighter">Budżet ({trip?.budgetLevel || '-'})</p>
                                            <p className="text-lg lg:text-3xl font-black text-black dark:text-white">{budgetDisplay}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 lg:gap-5 group">
                                        <div className="bg-white dark:bg-white/10 p-3 lg:p-4 rounded-2xl shadow-md transition-transform group-hover:scale-110"><span className="text-2xl lg:text-5xl">👟</span></div>
                                        <div>
                                            <p className="text-xs lg:text-sm font-sans font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tighter">Liczba Atrakcji</p>
                                            <p className="text-lg lg:text-3xl font-black text-black dark:text-white">
                                                {daysArray.reduce((total: number, day: any) => total + (day.activities?.length || 0), 0)} miejsc
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-blue-500/10 dark:bg-orange-500/10 border-l-4 lg:border-l-8 border-blue-500 dark:border-orange-500 p-4 lg:p-6 rounded-r-2xl shadow-sm mt-auto">
                                        <p className="text-blue-600 dark:text-orange-400 font-black text-base lg:text-xl mb-1 flex items-center">
                                            <span className="mr-2">💡</span> Wskazówka
                                        </p>
                                        <p className="font-sans text-xs sm:text-sm lg:text-lg font-bold text-gray-800 dark:text-gray-200 leading-relaxed italic">
                                            {trip?.isCompleted
                                                ? "Twoja podróż jest już zakończona! Masz ją zapisaną jako piękne wspomnienie w swojej historii podróży."
                                                : id === 'new'
                                                    ? "Pamiętaj, że to Twój plan! Po zapisaniu go do bazy, zyskasz możliwość dowolnej edycji godzin, tekstów i dodawania własnych miejsc."
                                                    : isEditing
                                                        ? "Aktualnie edytujesz plan. Możesz zmieniać godziny, nadpisywać teksty lub dodawać własne restauracje!"
                                                        : `"Pamiętaj, że to Twój plan! Możesz go w każdej chwili edytować, dopasowując godziny i miejsca do swojego tempa w ${trip?.destination || 'podróży'}."`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 lg:mt-16 flex flex-col sm:flex-row justify-center items-center gap-4 lg:gap-10">

                            {id === 'new' ? (
                                <button onClick={handleSaveTrip} disabled={isSaving} className={`bg-[#6584e0] dark:bg-orange-500 hover:bg-blue-600 dark:hover:bg-orange-600 text-white font-black py-4 px-6 lg:py-5 lg:px-12 text-lg lg:text-3xl rounded-2xl transition-all shadow-xl hover:scale-105 flex items-center justify-center gap-3 group w-full sm:w-auto ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    {isSaving ? <Loader2 className="w-5 h-5 lg:w-8 lg:h-8 animate-spin" /> : <Save className="w-5 h-5 lg:w-8 lg:h-8 group-hover:animate-bounce" />} Zapisz podróż do bazy!
                                </button>
                            ) : isEditing ? (
                                <button onClick={handleSaveTrip} disabled={isSaving} className={`bg-[#6584e0] dark:bg-orange-500 hover:bg-blue-600 dark:hover:bg-orange-600 text-white font-black py-4 px-6 lg:py-5 lg:px-12 text-lg lg:text-3xl rounded-2xl transition-all shadow-xl hover:scale-105 flex items-center justify-center gap-3 group w-full sm:w-auto ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    {isSaving ? <Loader2 className="w-5 h-5 lg:w-8 lg:h-8 animate-spin" /> : <Save className="w-5 h-5 lg:w-8 lg:h-8 group-hover:animate-bounce" />} Zapisz zmiany w bazie!
                                </button>
                            ) : (
                                <Link to="/trips" className="bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700 text-white font-black py-4 px-6 lg:py-5 lg:px-12 text-lg lg:text-3xl rounded-2xl transition-all shadow-xl hover:scale-105 flex items-center justify-center gap-3 group w-full sm:w-auto">
                                    <ArrowLeft className="w-5 h-5 lg:w-8 lg:h-8 group-hover:-translate-x-2 transition-transform" /> Wróć do listy
                                </Link>
                            )}

                            <Link to="/map" className="bg-green-500 dark:bg-green-600 hover:bg-green-700 text-white font-black py-4 px-6 lg:py-5 lg:px-12 text-lg lg:text-3xl rounded-2xl transition-all shadow-xl hover:scale-105 flex items-center justify-center gap-3 group w-full sm:w-auto">
                                <MapIcon className="w-5 h-5 lg:w-8 lg:h-8 group-hover:rotate-12 transition-transform" /> Pokaż na mapie
                            </Link>

                            {id !== 'new' && isPastTrip && !trip?.isCompleted && !isEditing && (
                                <button
                                    onClick={handleMarkAsCompleted}
                                    disabled={isCompleting}
                                    className="bg-yellow-400 hover:bg-yellow-500 text-black font-black py-4 px-6 lg:py-5 lg:px-12 text-lg lg:text-3xl rounded-2xl transition-all shadow-xl hover:scale-105 flex items-center justify-center gap-3 group w-full sm:w-auto"
                                >
                                    {isCompleting ? <Loader2 className="w-5 h-5 lg:w-8 lg:h-8 animate-spin" /> : <CheckCircle className="w-5 h-5 lg:w-8 lg:h-8 group-hover:scale-110" />}
                                    Podróż zrealizowana! ✅
                                </button>
                            )}

                        </div>

                    </div>
                </RevealOnScroll>
            </div>

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

export default TripResult;