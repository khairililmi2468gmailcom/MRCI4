import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            console.log(data);
            // Redirect or do something with the response
            if (response.ok) {
                // Login berhasil
                Swal.fire({
                    icon: 'success',
                    title: 'Login berhasil',
                    text: 'Anda berhasil login!',
                });
                navigate('/dashboard');
            } else {
                // Login gagal
                Swal.fire({
                    icon: 'error',
                    title: 'Login gagal',
                    text: 'Username atau password salah',
                });
            }
        } catch (error) {
            console.error('Login error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Terjadi kesalahan. Silakan coba lagi.',
            });
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    const isFormValid = username.trim() !== '' && password.trim() !== '';

    return (
        <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card-group d-block d-md-flex row">
                            <div className="card col-md-7 p-4 mb-0">
                                <div className="card-body">
                                    <h1>Login</h1>
                                    <p className="text-body-secondary">Sign In to your account</p>
                                    <div className="input-group mb-3">
                                        <span className="input-group-text">
                                            <i className="fas fa-user"></i>
                                        </span>
                                        <input 
                                            className="form-control" 
                                            type="text" 
                                            placeholder="Username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            onKeyPress={handleKeyPress} // Tambahkan event handler untuk tekanan tombol Enter
                                            autoFocus
                                            required 
                                        />
                                    </div>
                                    <div className="input-group mb-4">
                                        <span className="input-group-text">
                                            <i className="fas fa-lock"></i>
                                        </span>
                                        <input 
                                            className="form-control" 
                                            type="password" 
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onKeyPress={handleKeyPress} // Tambahkan event handler untuk tekanan tombol Enter
                                            required 
                                        />
                                    </div>
                                    <div className="row">
                                        <div className="col-6">
                                            <button 
                                                className="btn btn-primary px-4" 
                                                type="button"
                                                onClick={handleLogin} // Tambahkan event handler untuk klik tombol login
                                                disabled={!isFormValid} // Menonaktifkan tombol jika input tidak lengkap
                                            >
                                                <i className="fas fa-sign-in-alt"></i> Login
                                            </button>
                                        </div>
                                        <div className="col-6 text-end">
                                            <button className="btn btn-link px-0" type="button">Forgot password?</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card col-md-5 text-white bg-primary py-5">
                                <div className="card-body text-center">
                                    <div>
                                        <h2>Sign up</h2>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                        <Link to="/register" className="btn btn-lg btn-outline-light mt-3">Register Now!</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
