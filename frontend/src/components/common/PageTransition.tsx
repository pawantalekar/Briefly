import { type ReactNode, useEffect, useState } from 'react';

interface PageTransitionProps {
    children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 10);

        return () => {
            clearTimeout(timer);
            setIsVisible(false);
        };
    }, []);

    return (
        <div
            className={`transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
        >
            {children}
        </div>
    );
};

export default PageTransition;
