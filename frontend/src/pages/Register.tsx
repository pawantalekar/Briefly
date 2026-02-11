import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import PageTransition from '../components/common/PageTransition';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const response = await authService.register(
                formData.name,
                formData.email,
                formData.password
            );
            localStorage.setItem('user', JSON.stringify(response.user));
            window.dispatchEvent(new Event('storage'));
            navigate('/dashboard');
        } catch (err) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageTransition>
            <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] p-8 shadow-sm">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2 font-serif">Join Briefly</h2>
                            <p className="text-[var(--text-secondary)]">Create your account to start writing</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Pawan Patil"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="pawan.patil@gmail.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="••••••••"
                                />
                                <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="flex items-start">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    required
                                    className="h-4 w-4 border-[var(--border-color)] rounded bg-[var(--bg-secondary)] mt-1"
                                />
                                <label htmlFor="terms" className="ml-2 block text-sm text-[var(--text-secondary)]">
                                    I agree to the{' '}
                                    <Link to="/terms" className="text-[var(--text-primary)] hover:underline border-b border-[var(--border-color)]">
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link to="/privacy" className="text-[var(--text-primary)] hover:underline border-b border-[var(--border-color)]">
                                        Privacy Policy
                                    </Link>
                                </label>
                            </div>

                            <button type="submit" disabled={loading} className="w-full btn-primary">
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating account...
                                    </span>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-[var(--border-color)]" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-[var(--bg-primary)] text-[var(--text-secondary)]">Already have an account?</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <Link
                                    to="/login"
                                    className="w-full flex justify-center py-3 px-4 border border-[var(--border-color)] text-sm font-medium text-[var(--text-primary)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] transition uppercase tracking-wider"
                                >
                                    Sign In Instead
                                </Link>
                            </div>
                        </div>

                        <div className="text-center mt-6">
                            <Link to="/" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] uppercase tracking-wide">
                                ← Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default Register;
