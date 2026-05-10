import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

import iconFacebook from '../assets/icons/icon-facebook.png';
import iconInstagram from '../assets/icons/icon-instagram.png';
import iconX from '../assets/icons/icon-x.png';
import iconEmail from '../assets/icons/icon-email.png';

const Footer = () => {
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
        skroty: false,
        kontakt: false,
    });

    const toggleSection = (section: string) => {
        if (window.innerWidth < 768) {
            setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
        }
    };

    return (
        <footer className="mx-4 sm:mx-8 pt-12 pb-6 px-6 sm:px-12 lg:px-24 bg-gray-200/80 dark:bg-[#262626]/95 backdrop-blur-md shadow-[0_-10px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_-10px_30px_rgba(255,255,255,0.05)] border border-white/30 dark:border-white/10 border-b-0 rounded-t-3xl lg:rounded-t-[3rem] text-black dark:text-white z-10 relative transition-colors duration-500">
            <div className="max-w-[1400px] mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8 mb-12 text-center md:text-left">
                    <div className="space-y-4 flex flex-col items-center md:items-start">
                        <h3 className="text-3xl font-black text-blue-500 dark:text-orange-500 transition-colors duration-500">
                            Travel-Planner
                        </h3>
                        <p className="font-sans text-sm md:text-base lg:text-lg font-medium text-gray-700 dark:text-gray-300 max-w-xs transition-colors duration-500">
                            Twój osobisty, inteligentny asystent podróży. Zamieniamy marzenia w gotowe plany.
                        </p>
                    </div>
                    <div className="flex flex-col items-center md:items-start space-y-4">
                        <button
                            onClick={() => toggleSection('skroty')}
                            className="flex items-center justify-between w-full md:w-auto text-xl font-black mb-2 transition-colors focus:outline-none"
                        >
                            Na skróty{' '}
                            <ChevronDown
                                className={`w-5 h-5 ml-2 md:hidden transition-transform duration-300 ${openSections.skroty ? 'rotate-180' : ''}`}
                            />
                        </button>
                        <div
                            className={`flex flex-col space-y-4 overflow-hidden transition-all duration-300 ${openSections.skroty ? 'max-h-96 opacity-100' : 'max-h-0 md:max-h-96 opacity-0 md:opacity-100'}`}
                        >
                            <Link
                                to="/plan"
                                className="font-sans text-sm md:text-base font-semibold hover:text-blue-500 dark:hover:text-orange-500 transition-colors"
                            >
                                Zaplanuj podróż
                            </Link>
                            <Link
                                to="/trips"
                                className="font-sans text-sm md:text-base font-semibold hover:text-blue-500 dark:hover:text-orange-500 transition-colors"
                            >
                                Moje podróże
                            </Link>
                            <Link
                                to="/map"
                                className="font-sans text-sm md:text-base font-semibold hover:text-blue-500 dark:hover:text-orange-500 transition-colors"
                            >
                                Mapa świata
                            </Link>
                            <Link
                                to="/profile"
                                className="font-sans text-sm md:text-base font-semibold hover:text-blue-500 dark:hover:text-orange-500 transition-colors"
                            >
                                Twój profil
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-col items-center md:items-start space-y-4">
                        <button
                            onClick={() => toggleSection('kontakt')}
                            className="flex items-center justify-between w-full md:w-auto text-xl font-black mb-2 transition-colors focus:outline-none"
                        >
                            Pomoc i kontakt{' '}
                            <ChevronDown
                                className={`w-5 h-5 ml-2 md:hidden transition-transform duration-300 ${openSections.kontakt ? 'rotate-180' : ''}`}
                            />
                        </button>
                        <div
                            className={`flex flex-col items-center md:items-start space-y-4 overflow-hidden transition-all duration-300 ${openSections.kontakt ? 'max-h-96 opacity-100' : 'max-h-0 md:max-h-96 opacity-0 md:opacity-100'}`}
                        >
                            <a
                                href="mailto:kontakt@travel-planner.com"
                                onClick={(e) => e.preventDefault()}
                                className="font-sans text-sm md:text-base font-semibold flex items-center hover:text-blue-500 dark:hover:text-orange-500 transition-colors group"
                            >
                                <img
                                    src={iconEmail}
                                    alt="Email"
                                    className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform"
                                />
                                kontakt@travel-planner.com
                            </a>
                            <div className="flex space-x-4 pt-2">
                                <a
                                    href="#"
                                    onClick={(e) => e.preventDefault()}
                                    className="flex justify-center items-center p-2 bg-white/50 dark:bg-white/10 rounded-full hover:bg-blue-500 dark:hover:bg-orange-500 hover:scale-110 transition-all shadow-sm duration-300"
                                >
                                    <img src={iconInstagram} alt="Instagram" className="w-5 h-5 lg:w-6 lg:h-6" />
                                </a>
                                <a
                                    href="#"
                                    onClick={(e) => e.preventDefault()}
                                    className="flex justify-center items-center p-2 bg-white/50 dark:bg-white/10 rounded-full hover:bg-blue-500 dark:hover:bg-orange-500 hover:scale-110 transition-all shadow-sm duration-300"
                                >
                                    <img src={iconFacebook} alt="Facebook" className="w-5 h-5 lg:w-6 lg:h-6" />
                                </a>
                                <a
                                    href="#"
                                    onClick={(e) => e.preventDefault()}
                                    className="flex justify-center items-center p-2 bg-white/50 dark:bg-white/10 rounded-full hover:bg-blue-500 dark:hover:bg-orange-500 hover:scale-110 transition-all shadow-sm duration-300"
                                >
                                    <img src={iconX} alt="X (Twitter)" className="w-5 h-5 lg:w-6 lg:h-6" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="font-sans w-full border-t border-gray-400/30 dark:border-gray-600/50 pt-6 flex flex-col md:flex-row justify-between items-center text-xs sm:text-sm lg:text-base font-medium text-gray-600 dark:text-gray-400 space-y-4 md:space-y-0 transition-colors duration-500 pb-4">
                    <p>© 2026 Travel-Planner. Wszelkie prawa zastrzeżone.</p>
                    <div className="flex space-x-6">
                        <Link
                            to="#"
                            onClick={(e) => e.preventDefault()}
                            className="font-semibold hover:text-black dark:hover:text-white transition-colors"
                        >
                            Regulamin
                        </Link>
                        <Link
                            to="#"
                            onClick={(e) => e.preventDefault()}
                            className="font-semibold hover:text-black dark:hover:text-white transition-colors"
                        >
                            Polityka prywatności
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
