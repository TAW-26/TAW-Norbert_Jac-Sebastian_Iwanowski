import { useState, useEffect, useRef } from 'react';

const RevealOnScroll = ({
    children,
    className = 'w-full flex justify-center',
}: {
    children: React.ReactNode;
    className?: string;
}) => {
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
            { threshold: 0.1 },
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`transition-all duration-[1200ms] ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
            } ${className}`}
        >
            {children}
        </div>
    );
};

export default RevealOnScroll;
