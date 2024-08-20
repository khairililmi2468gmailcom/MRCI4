import React from "react";

function Header() {

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
        
        <header className="header header-sticky p-0 mb-4">
        <div className="container-fluid border-bottom px-4">
            <button
            className="header-toggler"
            type="button"
            onClick={toggleSidebar}
            style={{ marginInlineStart: "-14px" }}
            >
            <i className="icon icon-lg fas fa-list"></i>
            </button>
            <ul className="header-nav d-none d-lg-flex">
            <li className="nav-item">
                <a className="nav-link" href="#">
                Dashboard
                </a>
            </li>
            <li className="nav-item">
                <a className="nav-link" href="#">
                Users
                </a>
            </li>
            <li className="nav-item">
                <a className="nav-link" href="#">
                Settings
                </a>
            </li>
            </ul>
            <ul className="header-nav ms-auto">
            <li className="nav-item">
                <a className="nav-link" href="#">
                <i className="icon icon-lg fas fa-bell"></i>
                </a>
            </li>
            <li className="nav-item">
                <a className="nav-link" href="#">
                <i className="icon icon-lg fas fa-list"></i>
                </a>
            </li>
            <li className="nav-item">
                <a className="nav-link" href="#">
                <i className="icon icon-lg fas fa-envelope-open"></i>
                </a>
            </li>
            </ul>
            <ul className="header-nav">
            <li className="nav-item py-1">
                <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
            </li>
            <li className="nav-item dropdown">
                <button
                className="btn btn-link nav-link py-2 px-2 d-flex align-items-center"
                type="button"
                aria-expanded="false"
                data-coreui-toggle="dropdown"
                >
                <i className="icon icon-lg fas fa-adjust"></i>
                </button>
                <ul
                className="dropdown-menu dropdown-menu-end"
                style={{'--cui-dropdown-min-width': '8rem'}}
                >
                <li>
                    <button
                    className="dropdown-item d-flex align-items-center"
                    type="button"
                    data-coreui-theme-value="light"
                    >
                    <i className="icon me-3 fas fa-sun"></i>
                    Light
                    </button>
                </li>
                <li>
                    <button
                    className="dropdown-item d-flex align-items-center"
                    type="button"
                    data-coreui-theme-value="dark"
                    >
                    <i className="icon me-3 fas fa-moon"></i>
                    Dark
                    </button>
                </li>
                <li>
                    <button
                    className="dropdown-item d-flex align-items-center active"
                    type="button"
                    data-coreui-theme-value="auto"
                    >
                    <i className="icon me-3 fas fa-adjust"></i>
                    Auto
                    </button>
                </li>
                </ul>
            </li>
            <li className="nav-item py-1">
                <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
            </li>
            <li className="nav-item dropdown">
                <a
                className="nav-link py-0 pe-0"
                data-coreui-toggle="dropdown"
                href="#"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
                >
                <div className="avatar avatar-md">
                    <img
                    className="avatar-img"
                    src="assets/img/avatars/8.jpg"
                    alt="user@email.com"
                    />
                </div>
                </a>
                <div className="dropdown-menu dropdown-menu-end pt-0">
                <div className="dropdown-header bg-body-tertiary text-body-secondary fw-semibold rounded-top mb-2">
                    Account
                </div>
                <a className="dropdown-item" href="#">
                    <i className="icon me-2 fas fa-bell"></i> Updates<span className="badge badge-sm bg-info ms-2">42</span>
                </a>
                <a className="dropdown-item" href="#">
                    <i className="icon me-2 fas fa-envelope-open"></i> Messages<span className="badge badge-sm bg-success ms-2">42</span>
                </a>
                <a className="dropdown-item" href="#">
                    <i className="icon me-2 fas fa-tasks"></i> Tasks<span className="badge badge-sm bg-danger ms-2">42</span>
                </a>
                <a className="dropdown-item" href="#">
                    <i className="icon me-2 fas fa-comment"></i> Comments<span className="badge badge-sm bg-warning ms-2">42</span>
                </a>
                <div className="dropdown-header bg-body-tertiary text-body-secondary fw-semibold my-2">
                    <div className="fw-semibold">Settings</div>
                </div>
                <a className="dropdown-item" href="#">
                    <i className="icon me-2 fas fa-user"></i> Profile
                </a>
                <a className="dropdown-item" href="#">
                    <i className="icon me-2 fas fa-cog"></i> Settings
                </a>
                <a className="dropdown-item" href="#">
                    <i className="icon me-2 fas fa-credit-card"></i> Payments<span className="badge badge-sm bg-secondary ms-2">42</span>
                </a>
                <a className="dropdown-item" href="#">
                    <i className="icon me-2 fas fa-file"></i> Projects<span className="badge badge-sm bg-primary ms-2">42</span>
                </a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="#">
                    <i className="icon me-2 fas fa-lock"></i> Lock Account
                </a>
                <a className="dropdown-item" href="#">
                    <i className="icon me-2 fas fa-sign-out-alt"></i> Logout
                </a>
                </div>
            </li>
            </ul>
        </div>
        </header>
    );
}

export default Header;
