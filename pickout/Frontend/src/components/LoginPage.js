import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, LogIn, UserPlus, Eye, EyeOff, ArrowRight } from 'lucide-react';

function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                const response = await authAPI.login({
                    username: formData.username,
                    password: formData.password
                });
                login(response.data.user);
            } else {
                if (!formData.email) {
                    setError('Email is required');
                    setLoading(false);
                    return;
                }
                const response = await authAPI.register(formData);
                login(response.data.user);
            }
        } catch (err) {
            try {
                const parsed = JSON.parse(err.message);
                setError(parsed.error || 'Something went wrong');
            } catch {
                setError(err.message || 'Something went wrong');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            {/* Background decoration */}
            <div className="login-bg-orb login-bg-orb-1"></div>
            <div className="login-bg-orb login-bg-orb-2"></div>
            <div className="login-bg-orb login-bg-orb-3"></div>

            <div className="login-container">
                {/* Left Panel - Branding */}
                <div className="login-brand-panel">
                    <div className="login-brand-content">
                        <div className="login-logo">
                            <GraduationCap size={48} />
                        </div>
                        <h1>PickOut</h1>
                        <p>Streamline student skills tracking, eligibility matching, and placement management — all in one platform.</p>
                        <div className="login-features">
                            <div className="login-feature-item">
                                <span className="login-feature-dot"></span>
                                <span>Skill Management</span>
                            </div>
                            <div className="login-feature-item">
                                <span className="login-feature-dot"></span>
                                <span>Student Registry</span>
                            </div>
                            <div className="login-feature-item">
                                <span className="login-feature-dot"></span>
                                <span>Eligibility Matching</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Form */}
                <div className="login-form-panel">
                    <div className="login-form-content">
                        <div className="login-form-header">
                            <h2>{isLogin ? 'Welcome back' : 'Create account'}</h2>
                            <p>{isLogin ? 'Enter your credentials to continue' : 'Get started with PickOut today'}</p>
                        </div>

                        {error && (
                            <div className="login-error">
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="login-input-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Enter your username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    autoComplete="username"
                                />
                            </div>

                            {!isLogin && (
                                <div className="login-input-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                            )}

                            <div className="login-input-group">
                                <label>Password</label>
                                <div className="login-password-wrapper">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        autoComplete={isLogin ? "current-password" : "new-password"}
                                    />
                                    <button
                                        type="button"
                                        className="login-eye-btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="login-submit-btn"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="login-spinner"></span>
                                ) : (
                                    <>
                                        {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                                        {isLogin ? 'Sign In' : 'Create Account'}
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="login-switch">
                            <span>{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
                            <button onClick={() => { setIsLogin(!isLogin); setError(''); }}>
                                {isLogin ? 'Sign Up' : 'Sign In'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
