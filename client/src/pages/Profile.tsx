import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User, Shield, BarChart3, Settings, FileText, Camera, Award, ChevronDown } from 'lucide-react';

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

            {/* SEKCJA GŁÓWNA */}
            <section className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 py-20 lg:py-40 min-h-[calc(100dvh-140px)] lg:min-h-screen relative transition-all duration-500">
                <RevealOnScroll>
                    <div className="bg-gray-200/80 dark:bg-[#262626]/95 backdrop-blur-lg w-full max-w-6xl lg:max-w-[1500px] min-h-[75vh] p-6 py-10 sm:p-10 lg:p-14 rounded-3xl lg:rounded-[3rem] shadow-2xl dark:shadow-white/10 border border-white/30 dark:border-white/10 relative flex flex-col transition-colors duration-500">

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12 h-full">

                            {/* KOLUMNA 1: TWOJE DANE */}
                            <div className="bg-white/40 dark:bg-black/20 rounded-3xl lg:rounded-[2.5rem] p-6 lg:p-10 shadow-inner border border-white/20 dark:border-white/5 flex flex-col items-center justify-between transition-all hover:scale-[1.01]">
                                <div className="w-full flex flex-col items-center">
                                    <div className="flex items-center gap-3 mb-6 lg:mb-8">
                                        <Shield className="w-6 h-6 lg:w-8 lg:h-8 text-blue-500 dark:text-orange-500" />
                                        <h2 className="text-3xl lg:text-5xl font-black text-black dark:text-white tracking-tight">Profil</h2>
                                    </div>

                                    {/* Awatar z ramką */}
                                    <div className="group relative">
                                        <div className="w-28 h-28 lg:w-52 lg:h-52 bg-gray-100 dark:bg-[#333] rounded-full shadow-2xl border-4 border-white dark:border-orange-500/30 flex items-center justify-center mb-8 lg:mb-10 relative overflow-hidden transition-all duration-500 group-hover:shadow-orange-500/20">
                                            <User className="w-20 h-20 lg:w-40 lg:h-40 text-black dark:text-white fill-current mt-4 lg:mt-8 opacity-80" />
                                            <button className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold gap-2 text-sm lg:text-base">
                                                <Camera className="w-5 h-5 lg:w-6 lg:h-6" /> Zmień
                                            </button>
                                        </div>
                                    </div>

                                    <div className="w-full">
                                        <ProfileRow label="Imię:" value="User" />
                                        <ProfileRow label="E-mail:" value="user123@example.pl" />
                                        <ProfileRow label="Data dołączenia:" value="01.04.2026" />
                                        <ProfileRow label="Ranga:" value="Obieżyświat" />
                                    </div>
                                </div>

                                <button className="w-full mt-6 lg:mt-8 bg-[#6584e0] dark:bg-orange-500 hover:bg-blue-600 dark:hover:bg-orange-600 text-white font-black py-3 lg:py-4 rounded-xl lg:rounded-2xl text-lg lg:text-xl shadow-lg transition-all hover:scale-105 active:scale-95">
                                    Edytuj profil
                                </button>
                            </div>

                            {/* KOLUMNA 2: OSIĄGNIĘCIA */}
                            <div className="bg-white/40 dark:bg-black/20 rounded-3xl lg:rounded-[2.5rem] p-6 lg:p-10 shadow-inner border border-white/20 dark:border-white/5 flex flex-col items-center justify-between transition-all hover:scale-[1.01]">
                                <div className="w-full flex flex-col items-center">
                                    <div className="flex items-center gap-3 mb-6 lg:mb-8">
                                        <BarChart3 className="w-6 h-6 lg:w-8 lg:h-8 text-blue-500 dark:text-orange-500" />
                                        <h2 className="text-3xl lg:text-5xl font-black text-black dark:text-white tracking-tight">Statystyki</h2>
                                    </div>

                                    <div className="w-full mt-2 lg:mt-4 space-y-4 lg:space-y-6">
                                        <ProfileRow label="Kraje:" value="24" centerValue={true} />
                                        <ProfileRow label="Miasta:" value="38" centerValue={true} />
                                        <ProfileRow label="Kilometry:" value="12 450 km" centerValue={true} />
                                        <ProfileRow label="Najdłuższa trasa:" value="14 dni" centerValue={true} />
                                    </div>

                                    {/* Mały odnośnik do mapy */}
                                    <Link to="/map" className="mt-6 lg:mt-8 p-4 lg:p-6 bg-blue-500/10 dark:bg-orange-500/10 border border-blue-500/20 dark:border-orange-500/20 rounded-2xl lg:rounded-3xl text-center hover:bg-blue-500/20 dark:hover:bg-orange-500/20 transition-all group w-full">
                                        <Award className="w-8 h-8 lg:w-10 lg:h-10 text-blue-500 dark:text-orange-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                                        <p className="font-sans text-sm lg:text-base font-bold text-black dark:text-white">Zobacz swoje odznaki na mapie świata</p>
                                    </Link>
                                </div>

                                <button className="w-full mt-6 lg:mt-8 bg-gray-800 dark:bg-white dark:text-black text-white font-black py-3 lg:py-4 rounded-xl lg:rounded-2xl text-lg lg:text-xl shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2">
                                    <FileText className="w-5 h-5 lg:w-6 lg:h-6" /> Eksportuj PDF
                                </button>
                            </div>

                            {/* KOLUMNA 3: USTAWIENIA AI */}
                            <div className="bg-white/40 dark:bg-black/20 rounded-3xl lg:rounded-[2.5rem] p-6 lg:p-10 shadow-inner border border-white/20 dark:border-white/5 flex flex-col items-center justify-between transition-all hover:scale-[1.01]">
                                <div className="w-full flex flex-col items-center">
                                    <div className="flex items-center gap-3 mb-6 lg:mb-8">
                                        <Settings className="w-6 h-6 lg:w-8 lg:h-8 text-blue-500 dark:text-orange-500" />
                                        <h2 className="text-3xl lg:text-5xl font-black text-black dark:text-white tracking-tight text-center">Preferencje</h2>
                                    </div>

                                    <div className="w-full mt-2 lg:mt-4">
                                        <ProfileRow label="Tempo:" value="Intensywne" />
                                        <ProfileRow label="Pasje:" value="Fotografia, Historia" />
                                        <ProfileRow label="Budżet:" value="$$$" valueBg="bg-red-500 text-white" centerValue={true} />
                                        <ProfileRow label="Dieta:" value="Wegetariańska" />
                                        <ProfileRow label="Transport:" value="Pociągi & Pieszo" />
                                    </div>
                                </div>

                                <div className="w-full mt-6 lg:mt-8 flex flex-col gap-3 lg:gap-4">
                                    <button className="w-full bg-[#6584e0] dark:bg-orange-500 hover:bg-blue-600 dark:hover:bg-orange-600 text-white font-black py-3 lg:py-4 rounded-xl lg:rounded-2xl text-lg lg:text-xl shadow-lg transition-all hover:scale-105">
                                        Zmień preferencje
                                    </button>
                                    <button className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-3 lg:py-4 rounded-xl lg:rounded-2xl text-lg lg:text-xl shadow-lg transition-all hover:scale-105 opacity-80 hover:opacity-100">
                                        Usuń konto
                                    </button>
                                </div>
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

export default Profile;