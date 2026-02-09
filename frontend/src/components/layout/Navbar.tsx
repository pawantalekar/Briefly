import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('access_token');
            setIsLoggedIn(!!token);

            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                setIsAdmin(user.role === 'ADMIN');
            } else {
                setIsAdmin(false);
            }
        };
        checkAuth();
        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setIsAdmin(false);
        window.location.href = '/';
    };

    return (
        <nav className="bg-[var(--bg-primary)] border-b border-[var(--border-color)] sticky top-0 z-50 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo Area */}
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden p-2 -ml-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <Link to="/" className="text-2xl font-serif font-black tracking-tighter text-[var(--text-primary)] px-2">
                            BRIEFLY.
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wide">
                        <Link to="/" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">HOME</Link>
                        <Link to="/categories" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">MARKETS</Link>
                        <Link to="/about" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">ABOUT</Link>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>

                        <div className="h-4 w-px bg-[var(--border-color)] mx-2"></div>

                        {isLoggedIn ? (
                            <div className="flex items-center space-x-4">
                                <Link to="/dashboard" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm font-medium tracking-wide">
                                    MY ACCOUNT
                                </Link>
                                {isAdmin && (
                                    <Link to="/admin" className="text-primary-600 hover:text-primary-700 text-sm font-medium tracking-wide">
                                        ADMIN
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="text-[var(--text-secondary)] hover:text-red-600 text-sm font-medium tracking-wide transition-colors"
                                >
                                    LOGOUT
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm font-medium tracking-wide">
                                    SIGN IN
                                </Link>
                                <Link to="/register" className="btn-primary">
                                    SUBSCRIBE
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t border-[var(--border-color)] bg-[var(--bg-primary)]">
                    <div className="px-4 py-4 space-y-3">
                        <Link to="/" className="block text-[var(--text-primary)] font-medium" onClick={() => setIsOpen(false)}>Home</Link>
                        <Link to="/categories" className="block text-[var(--text-primary)] font-medium" onClick={() => setIsOpen(false)}>Markets</Link>
                        <Link to="/about" className="block text-[var(--text-primary)] font-medium" onClick={() => setIsOpen(false)}>About</Link>
                        {isLoggedIn && (
                            <>
                                <hr className="border-[var(--border-color)]" />
                                <Link to="/dashboard" className="block text-[var(--text-primary)] font-medium" onClick={() => setIsOpen(false)}>My Account</Link>
                                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-left text-[var(--text-secondary)]">Sign Out</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
