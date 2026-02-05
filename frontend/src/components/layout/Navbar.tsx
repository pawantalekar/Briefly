import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('access_token');
            const userStr = localStorage.getItem('user');
            setIsLoggedIn(!!token);

            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    setIsAdmin(user.role === 'ADMIN');
                } catch (e) {
                    setIsAdmin(false);
                }
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
        window.location.href = '/';
    };

    return (
        <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition">
                            <span className="text-white font-bold text-lg">B</span>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">Briefly</span>
                    </Link>


                    <div className="hidden md:flex items-center space-x-1">
                        <Link to="/" className="px-4 py-2 text-gray-700 hover:text-primary-600 font-medium transition rounded-lg hover:bg-primary-50">
                            Home
                        </Link>
                        <Link to="/categories" className="px-4 py-2 text-gray-700 hover:text-primary-600 font-medium transition rounded-lg hover:bg-primary-50">
                            Categories
                        </Link>
                        <Link to="/about" className="px-4 py-2 text-gray-700 hover:text-primary-600 font-medium transition rounded-lg hover:bg-primary-50">
                            About
                        </Link>
                    </div>


                    <div className="hidden md:flex items-center space-x-3">
                        {isLoggedIn ? (
                            <>
                                <Link to="/dashboard" className="px-4 py-2 text-gray-700 hover:text-primary-600 font-medium transition rounded-lg hover:bg-gray-50">
                                    Dashboard
                                </Link>
                                {isAdmin && (
                                    <Link to="/admin" className="px-4 py-2 text-orange-600 hover:text-orange-700 font-medium transition rounded-lg hover:bg-orange-50 flex items-center space-x-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>Admin</span>
                                    </Link>
                                )}
                                <button onClick={handleLogout} className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition rounded-lg hover:bg-gray-100">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-primary-600 font-medium transition rounded-lg hover:bg-gray-50">
                                    Login
                                </Link>
                                <Link to="/register" className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-primary-700 hover:to-purple-700 transition shadow-sm hover:shadow-md">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>


                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>


                {isOpen && (
                    <div className="md:hidden py-4 space-y-1 border-t border-gray-100">
                        <Link to="/" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg font-medium transition">
                            Home
                        </Link>
                        <Link to="/categories" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg font-medium transition">
                            Categories
                        </Link>
                        <Link to="/about" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg font-medium transition">
                            About
                        </Link>
                        <div className="pt-3 space-y-2 border-t border-gray-100 mt-2">
                            {isLoggedIn ? (
                                <>
                                    <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition">
                                        Dashboard
                                    </Link>
                                    {isAdmin && (
                                        <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 text-orange-600 hover:bg-orange-50 rounded-lg font-medium transition">
                                            Admin Panel
                                        </Link>
                                    )}
                                    <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition text-left">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition text-center">
                                        Login
                                    </Link>
                                    <Link to="/register" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white text-center font-semibold rounded-lg hover:from-primary-700 hover:to-purple-700 transition shadow-sm">
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
