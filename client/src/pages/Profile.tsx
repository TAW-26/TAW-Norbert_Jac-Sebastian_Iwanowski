import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User, Shield, BarChart3, Settings, FileText, Camera, Award, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

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

const ProfileRow = ({ label, value, valueBg = "bg-white/50 dark:bg-black/20", centerValue = false }: { label: string, value: string, valueBg?: string, centerValue?: boolean }) => (
    <div className="flex w-full mb-3 lg:mb-4 shadow-sm font-sans text-xs lg:text-base rounded-xl overflow-hidden border border-white/20 dark:border-white/5">
        <div className="bg-[#6584e0] dark:bg-orange-600 text-white font-black px-3 py-2 lg:px-4 lg:py-3 w-[45%] lg:w-[40%] flex items-center transition-colors duration-500">
            {label}
        </div>
        <div className={`${valueBg} text-black dark:text-white font-bold px-3 py-2 lg:px-4 lg:py-3 flex-1 flex items-center transition-colors duration-500 ${centerValue ? 'justify-center' : ''}`}>
            {value}
        </div>
    </div>
);

const Profile = () => {
    const { user, isLoading, updateUser, logout } = useAuth();

    const handleDeleteAccount = async () => {
        const isConfirmed = window.confirm("Czy na pewno chcesz bezpowrotnie usunąć swoje konto i wszystkie zaplanowane podróże? Tej operacji nie można cofnąć.");

        if (!isConfirmed) return;

        try {
            await api.delete('/users/me');
            logout();
        } catch (error) {
            console.error("Błąd usuwania konta", error);
            alert("Wystąpił błąd podczas usuwania konta.");
        }
    };

    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({ skroty: false, kontakt: false });

    const [isEditingPrefs, setIsEditingPrefs] = useState(false);
    const [trips, setTrips] = useState<any[]>([]);
    const [prefForm, setPrefForm] = useState({ pace: '-', interests: '-', diet: '-', transport: '-' });

    const pdfRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState(false);

    const handleExportPDF = async () => {
        if (!pdfRef.current) return;
        setIsExporting(true);

        try {
            const canvas = await html2canvas(pdfRef.current, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL('image/png');

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Travel_Planner_${user?.nickname || 'Profil'}.pdf`);
        } catch (error) {
            console.error("Błąd generowania PDF:", error);
            alert("Wystąpił błąd podczas tworzenia pliku PDF.");
        } finally {
            setIsExporting(false);
        }
    };

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const response = await api.get('/trips');
                setTrips(response.data);
            } catch (error) {
                console.error("Błąd pobierania podróży", error);
            }
        };
        if (user) {
            fetchTrips();
            setPrefForm({
                pace: user.pace || '-',
                interests: user.interests || '-',
                diet: user.diet || '-',
                transport: user.transport || '-'
            });
        }
    }, [user]);

    const savePreferences = async () => {
        try {
            await api.put('/users/preferences', prefForm);
            updateUser(prefForm);
            setIsEditingPrefs(false);
        } catch (error) {
            console.error("Błąd zapisu preferencji", error);
            alert("Wystąpił błąd podczas zapisu preferencji.");
        }
    };

    const completedTrips = trips.filter(t => t.isCompleted);
    const uniqueCountries = new Set(completedTrips.map(t => t.countryCode?.toLowerCase()).filter(Boolean)).size;
    const uniqueCities = new Set(completedTrips.map(t => t.destination?.toLowerCase().trim()).filter(Boolean)).size;

    let longestTripDays = 0;
    completedTrips.forEach(trip => {
        if (trip.startDate && trip.endDate) {
            const diffTime = Math.abs(new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            if (diffDays > longestTripDays) longestTripDays = diffDays;
        }
    });

    const handleInterestToggle = (interest: string) => {
        let current = prefForm.interests === '-' ? [] : prefForm.interests.split(', ');
        if (current.includes(interest)) {
            current = current.filter(i => i !== interest);
        } else if (current.length < 3) {
            current.push(interest);
        }
        setPrefForm({ ...prefForm, interests: current.length > 0 ? current.join(', ') : '-' });
    };

    const renderButtons = (field: 'pace' | 'diet' | 'transport', options: string[]) => (
        <div className="flex flex-wrap gap-2 mt-1">
            {options.map(opt => (
                <button key={opt} onClick={() => setPrefForm({ ...prefForm, [field]: opt })}
                    className={`px-3 py-1.5 lg:px-4 lg:py-2 rounded-xl text-xs lg:text-sm font-bold transition-all shadow-sm ${prefForm[field] === opt ? 'bg-[#6584e0] dark:bg-orange-500 text-white scale-105' : 'bg-white/80 dark:bg-[#333] text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#444]'}`}>
                    {opt}
                </button>
            ))}
        </div>
    );

    const toggleSection = (section: string) => {
        if (window.innerWidth < 768) {
            setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
        }
    };

    const calculateAge = (birthday: string | undefined) => {
        if (!birthday) return '---';
        const birthDate = new Date(birthday);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return '---';
        return new Date(dateString).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Niedozwolony format pliku. Wybierz JPG, PNG lub WEBP.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Plik jest za duży. Maksymalny rozmiar to 5 MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = async () => {
                const canvas = document.createElement('canvas');
                const MAX_SIZE = 800;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_SIZE) {
                        height *= MAX_SIZE / width;
                        width = MAX_SIZE;
                    }
                } else {
                    if (height > MAX_SIZE) {
                        width *= MAX_SIZE / height;
                        height = MAX_SIZE;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                const webpBase64 = canvas.toDataURL('image/webp', 0.8);

                setIsUploading(true);
                try {
                    await api.put('/users/avatar', { avatarUrl: webpBase64 });
                    updateUser({ avatarUrl: webpBase64 });
                } catch (error) {
                    console.error("Błąd podczas aktualizacji zdjęcia", error);
                    alert("Nie udało się zaktualizować zdjęcia profilowego.");
                } finally {
                    setIsUploading(false);
                }
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6584e0] dark:border-orange-500"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-screen text-center p-4">
                <h2 className="text-3xl font-black text-black dark:text-white mb-4">Brak dostępu</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Musisz się zalogować, aby zobaczyć swój profil.</p>
                <Link to="/login" className="bg-[#6584e0] dark:bg-orange-500 text-white font-bold py-3 px-6 rounded-xl hover:opacity-90">Przejdź do logowania</Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen w-full">
            <section className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 py-20 lg:py-40 min-h-[calc(100dvh-140px)] lg:min-h-screen relative transition-all duration-500">
                <RevealOnScroll>
                    <div className="bg-gray-200/80 dark:bg-[#262626]/95 backdrop-blur-lg w-full max-w-6xl lg:max-w-[1500px] min-h-[75vh] p-6 py-10 sm:p-10 lg:p-14 rounded-3xl lg:rounded-[3rem] shadow-2xl dark:shadow-white/10 border border-white/30 dark:border-white/10 relative flex flex-col transition-colors duration-500">

                        <div className={`grid grid-cols-1 ${isEditing || isEditingPrefs ? 'lg:grid-cols-1 place-items-center' : 'lg:grid-cols-3'} gap-6 lg:gap-12 h-full transition-all duration-700 ease-in-out`}>

                            {!isEditingPrefs && (
                                <div className={`bg-white/40 dark:bg-black/20 rounded-3xl lg:rounded-[2.5rem] p-6 lg:p-10 shadow-inner border border-white/20 dark:border-white/5 flex flex-col items-center justify-between transition-all duration-500 hover:scale-[1.01] ${isEditing ? 'w-full max-w-2xl' : 'w-full'}`}>
                                    <div className="w-full flex flex-col items-center">
                                        <div className="flex items-center gap-3 mb-6 lg:mb-8">
                                            <Shield className="w-6 h-6 lg:w-8 lg:h-8 text-blue-500 dark:text-orange-500" />
                                            <h2 className="text-3xl lg:text-5xl font-black text-black dark:text-white tracking-tight">Profil</h2>
                                        </div>

                                        <div className="group relative flex flex-col items-center">
                                            <div className={`w-28 h-28 lg:w-52 lg:h-52 bg-gray-100 dark:bg-[#333] rounded-full shadow-2xl border-4 border-white dark:border-orange-500/30 flex items-center justify-center relative overflow-hidden transition-all duration-500 ${isEditing ? 'ring-4 ring-blue-500 dark:ring-orange-500 ring-offset-4 dark:ring-offset-[#262626]' : 'group-hover:shadow-orange-500/20'} mb-2`}>

                                                {user.avatarUrl ? (
                                                    <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-20 h-20 lg:w-40 lg:h-40 text-black dark:text-white fill-current mt-4 lg:mt-8 opacity-80" />
                                                )}

                                                {isEditing && (
                                                    <>
                                                        <button
                                                            onClick={() => fileInputRef.current?.click()}
                                                            disabled={isUploading}
                                                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white font-bold gap-2 text-sm lg:text-base cursor-pointer backdrop-blur-sm"
                                                        >
                                                            {isUploading ? (
                                                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                                                            ) : (
                                                                <><Camera className="w-6 h-6 lg:w-8 lg:h-8 mb-1" /> Wybierz zdjęcie</>
                                                            )}
                                                        </button>
                                                        <input type="file" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
                                                    </>
                                                )}
                                            </div>

                                            {isEditing && (
                                                <span className="text-[10px] lg:text-xs font-bold text-gray-500 dark:text-gray-400 mt-2 mb-6 text-center">
                                                    JPG, PNG, WEBP | Max 5MB<br />Automatyczna kompresja
                                                </span>
                                            )}
                                            {!isEditing && <div className="mb-6 lg:mb-8"></div>}
                                        </div>

                                        <div className="w-full">
                                            <ProfileRow label="Nick:" value={user.nickname || '---'} />
                                            <ProfileRow label="E-mail:" value={user.email} />
                                            <ProfileRow label="Data ur.:" value={formatDate(user.dateOfBirth)} />
                                            <ProfileRow label="Wiek:" value={`${calculateAge(user.dateOfBirth)} lat`} />
                                            <ProfileRow label="Dołączył(a):" value={formatDate(user.createdAt)} />
                                        </div>
                                    </div>

                                    {isEditing ? (
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="w-full mt-6 lg:mt-8 bg-green-500 hover:bg-green-600 text-white font-black py-3 lg:py-4 rounded-xl lg:rounded-2xl text-lg lg:text-xl shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle2 className="w-5 h-5 lg:w-6 lg:h-6" /> Zakończ edycję
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="w-full mt-6 lg:mt-8 bg-[#6584e0] dark:bg-orange-500 hover:bg-blue-600 dark:hover:bg-orange-600 text-white font-black py-3 lg:py-4 rounded-xl lg:rounded-2xl text-lg lg:text-xl shadow-lg transition-all hover:scale-105 active:scale-95"
                                        >
                                            Edytuj profil
                                        </button>
                                    )}
                                </div>
                            )}

                            {(!isEditing && !isEditingPrefs) && (
                                <>
                                    <div className="bg-white/40 dark:bg-black/20 rounded-3xl lg:rounded-[2.5rem] p-6 lg:p-10 shadow-inner border border-white/20 dark:border-white/5 flex flex-col items-center justify-between transition-all hover:scale-[1.01]">
                                        <div className="w-full flex flex-col items-center">
                                            <div className="flex items-center gap-3 mb-6 lg:mb-8">
                                                <BarChart3 className="w-6 h-6 lg:w-8 lg:h-8 text-blue-500 dark:text-orange-500" />
                                                <h2 className="text-3xl lg:text-5xl font-black text-black dark:text-white tracking-tight">Statystyki</h2>
                                            </div>

                                            <div className="w-full mt-2 lg:mt-4 space-y-4 lg:space-y-6">
                                                <ProfileRow label="Kraje:" value={`${uniqueCountries}`} centerValue={true} />
                                                <ProfileRow label="Miasta:" value={`${uniqueCities}`} centerValue={true} />
                                                <ProfileRow label="Najdłuższa trasa:" value={longestTripDays > 0 ? `${longestTripDays} dni` : '-'} centerValue={true} />
                                            </div>

                                            <Link to="/map" className="mt-6 lg:mt-8 p-4 lg:p-6 bg-blue-500/10 dark:bg-orange-500/10 border border-blue-500/20 dark:border-orange-500/20 rounded-2xl lg:rounded-3xl text-center hover:bg-blue-500/20 dark:hover:bg-orange-500/20 transition-all group w-full">
                                                <Award className="w-8 h-8 lg:w-10 lg:h-10 text-blue-500 dark:text-orange-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                                                <p className="font-sans text-sm lg:text-base font-bold text-black dark:text-white">Zobacz swoje odznaki na mapie świata</p>
                                            </Link>
                                        </div>

                                        <button
                                            onClick={handleExportPDF}
                                            disabled={isExporting}
                                            className={`w-full mt-6 lg:mt-8 bg-gray-800 dark:bg-white dark:text-black text-white font-black py-3 lg:py-4 rounded-xl lg:rounded-2xl text-lg lg:text-xl shadow-lg transition-all flex items-center justify-center gap-2 ${isExporting ? 'opacity-50 cursor-wait' : 'hover:scale-105'}`}
                                        >
                                            {isExporting ? (
                                                <><div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-current"></div> Generowanie...</>
                                            ) : (
                                                <><FileText className="w-5 h-5 lg:w-6 lg:h-6" /> Eksportuj PDF</>
                                            )}
                                        </button>
                                    </div>

                                    <div className="bg-white/40 dark:bg-black/20 rounded-3xl lg:rounded-[2.5rem] p-6 lg:p-10 shadow-inner border border-white/20 dark:border-white/5 flex flex-col items-center justify-between transition-all hover:scale-[1.01]">
                                        <div className="w-full flex flex-col items-center">
                                            <div className="flex items-center gap-3 mb-6 lg:mb-8">
                                                <Settings className="w-6 h-6 lg:w-8 lg:h-8 text-blue-500 dark:text-orange-500" />
                                                <h2 className="text-3xl lg:text-5xl font-black text-black dark:text-white tracking-tight text-center">Preferencje</h2>
                                            </div>

                                            <div className="w-full mt-2 lg:mt-4">
                                                <ProfileRow label="Tempo:" value={user.pace || '-'} />
                                                <ProfileRow label="Pasje:" value={user.interests || '-'} />
                                                <ProfileRow label="Dieta:" value={user.diet || '-'} />
                                                <ProfileRow label="Transport:" value={user.transport || '-'} />
                                            </div>
                                        </div>

                                        <div className="w-full mt-6 lg:mt-8 flex flex-col gap-3 lg:gap-4">
                                            <button onClick={() => setIsEditingPrefs(true)} className="w-full bg-[#6584e0] dark:bg-orange-500 hover:bg-blue-600 dark:hover:bg-orange-600 text-white font-black py-3 lg:py-4 rounded-xl lg:rounded-2xl text-lg lg:text-xl shadow-lg transition-all hover:scale-105">
                                                Zmień preferencje
                                            </button>
                                            <button onClick={handleDeleteAccount} className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-3 lg:py-4 rounded-xl lg:rounded-2xl text-lg lg:text-xl shadow-lg transition-all hover:scale-105 opacity-80 hover:opacity-100">
                                                Usuń konto
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="absolute left-[-9999px] top-[-9999px]">
                                <div ref={pdfRef} className="w-[800px] bg-[#f8fafc] p-12 text-[#000000] font-sans relative overflow-hidden">

                                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#3b82f6] rounded-bl-[100%] opacity-10"></div>
                                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#f97316] rounded-tr-[100%] opacity-10"></div>

                                    <div className="flex justify-between items-end border-b-2 border-[#e5e7eb] pb-6 mb-8 relative z-10">
                                        <div>
                                            <h1 className="text-4xl font-black text-[#6584e0] tracking-tighter">Travel-Planner</h1>
                                            <p className="text-[#6b7280] font-bold mt-1 tracking-widest uppercase text-sm">Osobisty Raport Podróżnika</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[#9ca3af] font-medium text-sm">Data wygenerowania:</p>
                                            <p className="text-[#1f2937] font-bold">{new Date().toLocaleDateString('pl-PL')}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8 bg-[#ffffff] p-6 rounded-3xl border border-[#e5e7eb] mb-8 relative z-10">
                                        <div className="w-28 h-28 bg-[#f3f4f6] rounded-full flex items-center justify-center overflow-hidden border-4 border-[#6584e0]">
                                            {user?.avatarUrl ? (
                                                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <User color="#9ca3af" size={64} />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-3xl font-black text-[#1f2937]">{user?.nickname || 'Podróżnik'}</h2>
                                            <p className="text-[#6b7280] font-medium mb-3">{user?.email}</p>
                                            <div className="flex gap-6 text-sm">
                                                <span className="bg-[#f3f4f6] px-3 py-1 rounded-full font-bold text-[#4b5563]">Wiek: {calculateAge(user?.dateOfBirth)} lat</span>
                                                <span className="bg-[#f3f4f6] px-3 py-1 rounded-full font-bold text-[#4b5563]">Z nami od: {formatDate(user?.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-black text-[#1f2937] mb-4 flex items-center gap-2 relative z-10"><BarChart3 color="#f97316" /> Twoje Osiągnięcia</h3>
                                    <div className="grid grid-cols-3 gap-4 mb-8 relative z-10">
                                        <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#e5e7eb] text-center">
                                            <p className="text-[#6b7280] font-bold text-sm uppercase tracking-wider mb-1">Odkryte Kraje</p>
                                            <p className="text-4xl font-black text-[#6584e0]">{uniqueCountries}</p>
                                        </div>
                                        <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#e5e7eb] text-center">
                                            <p className="text-[#6b7280] font-bold text-sm uppercase tracking-wider mb-1">Zwiedzone Miasta</p>
                                            <p className="text-4xl font-black text-[#6584e0]">{uniqueCities}</p>
                                        </div>
                                        <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#e5e7eb] text-center">
                                            <p className="text-[#6b7280] font-bold text-sm uppercase tracking-wider mb-1">Najdłuższa Trasa</p>
                                            <p className="text-4xl font-black text-[#6584e0]">{longestTripDays > 0 ? `${longestTripDays} dni` : '-'}</p>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-black text-[#1f2937] mb-4 flex items-center gap-2 relative z-10"><Settings color="#f97316" /> Profil Podróżnika</h3>
                                    <div className="bg-[#ffffff] p-6 rounded-3xl border border-[#e5e7eb] grid grid-cols-2 gap-6 relative z-10">
                                        <div>
                                            <p className="text-[#6b7280] font-bold text-xs uppercase tracking-wider mb-1">Tempo zwiedzania</p>
                                            <p className="text-lg font-black text-[#1f2937]">{user?.pace || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[#6b7280] font-bold text-xs uppercase tracking-wider mb-1">Preferowana Dieta</p>
                                            <p className="text-lg font-black text-[#1f2937]">{user?.diet || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[#6b7280] font-bold text-xs uppercase tracking-wider mb-1">Transport na miejscu</p>
                                            <p className="text-lg font-black text-[#1f2937]">{user?.transport || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[#6b7280] font-bold text-xs uppercase tracking-wider mb-1">Główne Pasje</p>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {(user?.interests && user.interests !== '-') ? user.interests.split(', ').map(interest => (
                                                    <span key={interest} className="bg-[#ffedd5] text-[#c2410c] font-bold px-2 py-1 rounded-md text-xs">{interest}</span>
                                                )) : <span className="text-lg font-black text-[#1f2937]">-</span>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-12 pt-6 border-t border-[#e5e7eb] text-center relative z-10">
                                        <p className="text-[#9ca3af] font-bold text-xs">Aplikacja stworzona, by zamieniać marzenia w gotowe plany.</p>
                                        <p className="text-[#d1d5db] font-medium text-xs mt-1">© 2026 Travel-Planner</p>
                                    </div>
                                </div>
                            </div>

                            {isEditingPrefs && (
                                <div className="bg-white/40 dark:bg-black/20 rounded-3xl lg:rounded-[2.5rem] p-6 lg:p-10 shadow-inner border border-white/20 dark:border-white/5 flex flex-col items-center justify-between w-full max-w-3xl transition-all duration-500">
                                    <div className="w-full flex flex-col items-center">
                                        <div className="flex items-center gap-3 mb-6 lg:mb-8">
                                            <Settings className="w-6 h-6 lg:w-8 lg:h-8 text-blue-500 dark:text-orange-500" />
                                            <h2 className="text-3xl lg:text-5xl font-black text-black dark:text-white tracking-tight">Preferencje</h2>
                                        </div>

                                        <div className="w-full flex flex-col gap-6 font-sans">
                                            <div>
                                                <label className="text-sm font-black text-gray-700 dark:text-gray-300 ml-2">Tempo zwiedzania</label>
                                                {renderButtons('pace', ["-", "Spokojne", "Umiarkowane", "Intensywne"])}
                                            </div>
                                            <div>
                                                <label className="text-sm font-black text-gray-700 dark:text-gray-300 ml-2">Dieta na wyjeździe</label>
                                                {renderButtons('diet', ["-", "Brak ograniczeń", "Wegetariańska", "Wegańska", "Bezglutenowa"])}
                                            </div>
                                            <div>
                                                <label className="text-sm font-black text-gray-700 dark:text-gray-300 ml-2">Preferowany transport</label>
                                                {renderButtons('transport', ["-", "Głównie pieszo", "Komunikacja miejska", "Wynajem auta", "Taksówki / Uber"])}
                                            </div>
                                            <div>
                                                <label className="text-sm font-black text-gray-700 dark:text-gray-300 ml-2">Główne pasje (max 3)</label>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {["Historia i Muzea", "Natura i Parki", "Kulinaria", "Aktywny wypoczynek", "Architektura", "Imprezy", "Relaks / SPA"].map(interest => {
                                                        const isSelected = prefForm.interests.includes(interest);
                                                        return (
                                                            <button key={interest} onClick={() => handleInterestToggle(interest)}
                                                                className={`px-3 py-1.5 lg:px-4 lg:py-2 rounded-xl text-xs lg:text-sm font-bold transition-all shadow-sm ${isSelected ? 'bg-blue-500 dark:bg-orange-500 text-white scale-105' : 'bg-white/80 dark:bg-[#333] text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#444]'}`}>
                                                                {interest}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-full flex gap-4 mt-10">
                                            <button onClick={() => setIsEditingPrefs(false)} className="w-1/3 bg-gray-500 hover:bg-gray-600 text-white font-black py-3 lg:py-4 rounded-xl lg:rounded-2xl shadow-lg transition-all">
                                                Anuluj
                                            </button>
                                            <button onClick={savePreferences} className="w-2/3 bg-green-500 hover:bg-green-600 text-white font-black py-3 lg:py-4 rounded-xl lg:rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2">
                                                <CheckCircle2 className="w-5 h-5" /> Zapisz zmiany
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

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
                            <button onClick={() => toggleSection('skroty')} className="flex items-center justify-between w-full md:w-auto text-xl font-black mb-2 transition-colors focus:outline-none">
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
                            <button onClick={() => toggleSection('kontakt')} className="flex items-center justify-between w-full md:w-auto text-xl font-black mb-2 transition-colors focus:outline-none">
                                Pomoc i kontakt
                                <ChevronDown className={`w-5 h-5 ml-2 md:hidden transition-transform duration-300 ${openSections.kontakt ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`flex flex-col items-center md:items-start space-y-4 overflow-hidden transition-all duration-300 ${openSections.kontakt ? 'max-h-96 opacity-100' : 'max-h-0 md:max-h-96 opacity-0 md:opacity-100'}`}>
                                <a href="mailto:kontakt@travel-planner.com" onClick={(e) => e.preventDefault()} className="font-sans text-sm md:text-base font-semibold flex items-center hover:text-blue-500 dark:hover:text-orange-500 transition-colors group">
                                    <img src={iconEmail} alt="Email" className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" /> kontakt@travel-planner.com
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

export default Profile;