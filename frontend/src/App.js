import React, { useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Kategori from './components/Kategori';
import Project from './components/Project';
import User from './components/User';
import Todo from './components/Todo';
import Otoritas from './components/Otoritas';
import Modul from './components/Modul';
import SubModul from './components/SubModul';
import Task from './components/Task';
import TaskSub from './components/TaskSub';

const App = () => {
    useEffect(() => {
        const setScroll = () => {
            window.onscroll = () => {
                console.log("scrole r", window.scrollY);
                window.scrollY > 12 && localStorage.setItem("scroll_position", window.scrollY);
            };
        }
        let pos = localStorage.getItem("scroll_position");
        window.scrollTo(0, pos);
        window.addEventListener('scroll', setScroll);
        // Membersihkan event listener saat komponen dilepas
        return () => {
            window.removeEventListener('scroll', setScroll);
        };
    }, []);

    return (
        <Router onUpdate={() => window.scrollTo(0, 190)}>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/kategori" element={<Kategori />} />
                <Route path="/project" element={<Project />} />
                <Route path="/user" element={<User />} />
                <Route path="/todo" element={<Todo />} />
                <Route path="/todo/otoritas/:id" element={<Otoritas />} />
                <Route path="/todo/otoritas/modul/:id" element={<Modul />} />
                <Route path="/todo/otoritas/modul/sub/:id" element={<SubModul />} />
                <Route path="/todo/otoritas/modul/sub/task/:id" element={<TaskSub />} />
                <Route path="/todo/otoritas/modul/task/:id" element={<Task />} />
            </Routes>
        </Router>
    );
};

export default App;
