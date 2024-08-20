import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                // Registrasi berhasil
                Swal.fire({
                    icon: 'success',
                    title: 'Registrasi Berhasil',
                    text: 'Anda telah berhasil mendaftar!',
                });
                // Kosongkan input setelah berhasil registrasi
                setUsername('');
                setPassword('');
            } else {
                // Registrasi gagal
                Swal.fire({
                    icon: 'error',
                    title: 'Registrasi Gagal',
                    text: 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.',
                });
            }
        } catch (error) {
            console.error('Registrasi error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Terjadi kesalahan. Silakan coba lagi.',
            });
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleRegister();
        }
    };

    return (
        <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card-group d-block d-md-flex row">
                            <div className="card col-md-7 p-4 mb-0">
                                <div className="card-body">
                                    <h1>Register</h1>
                                    <p className="text-body-secondary">Create your account</p>
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
                                            onKeyPress={handleKeyPress} // Tambahkan event listener di sini
                                            autoFocus
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
                                            onKeyPress={handleKeyPress} // Tambahkan event listener di sini
                                        />
                                    </div>
                                    <div className="row">
                                        <div className="col-6">
                                            <button 
                                                className="btn btn-primary px-4" 
                                                type="button"
                                                onClick={handleRegister}
                                            >
                                                <i className="fas fa-user-plus"></i> Register
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
                                        <h2>Login</h2>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                        <Link to="/" className="btn btn-lg btn-outline-light mt-3">Login Now!</Link>
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

export default Register;