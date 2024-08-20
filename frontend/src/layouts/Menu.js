import React from "react";
import { Link } from 'react-router-dom';

function Menu() {
    
    const toggleSidebar = () => {
        const sidebar = document.querySelector("#sidebar");
        if (sidebar) {
        const coreui = window.coreui;
        if (coreui && coreui.Sidebar) {
            const sidebarInstance = coreui.Sidebar.getInstance(sidebar);
            if (sidebarInstance) {
            sidebarInstance.toggle();
            }
        }
        }
    };

    return (
        <div className="sidebar sidebar-dark sidebar-fixed border-end" id="sidebar">
        <div className="sidebar-header border-bottom">
            <div className="sidebar-brand">
                <span style={{fontWeight: 'bold'}}>MaPRO</span>
            </div>
            <button
            className="btn-close d-lg-none"
            type="button"
            data-coreui-dismiss="offcanvas"
            data-coreui-theme="dark"
            aria-label="Close"
            onClick={toggleSidebar}
            ></button>
        </div>
        <ul className="sidebar-nav" data-coreui="navigation" data-simplebar="">
            <li className="nav-item">
                <Link to="/dashboard" className="nav-link">
                    <i className="fas fa-tachometer-alt nav-icon"></i> Dashboard<span className="badge badge-sm bg-info ms-auto">NEW</span>
                </Link>
            </li>
            <li className="nav-title">Data Master</li>
            <li className="nav-item">
                <Link to="/kategori" className="nav-link">
                    <i className="fas fa-palette nav-icon"></i> Data Kategori
                </Link>
            </li>
            <li className="nav-item">
                <Link to="/project" className="nav-link">
                    <i className="fas fa-palette nav-icon"></i> Data Project
                </Link>
            </li>
            <li className="nav-item">
                <Link to="/user" className="nav-link">
                    <i className="fas fa-user nav-icon"></i> Data User
                </Link>
            </li>
            <li className="nav-title">Components</li>
            <li className="nav-item">
                <Link to="/todo" className="nav-link">
                    <i className="fas fa-calculator nav-icon"></i> MyTodo<span className="badge badge-sm bg-info ms-auto">NEW</span>
                </Link>
            </li>
        </ul>
        <div className="sidebar-footer border-top d-none d-md-flex">
            <button
            className="sidebar-toggler"
            type="button"
            data-coreui-toggle="unfoldable"
            ></button>
        </div>
        </div>
    );
}

export default Menu;