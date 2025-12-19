import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, User } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar glass-panel">
            <div className="container nav-container">
                <div className="logo">
                    Money<span style={{ color: 'var(--accent-primary)' }}>Manager</span>
                </div>
                <ul className="nav-links">
                    <li>
                        <NavLink to="/transactions" className={({ isActive }) => isActive ? 'active' : ''}>
                            <Receipt size={20} />
                            <span>Transactions</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/analytics" className={({ isActive }) => isActive ? 'active' : ''}>
                            <LayoutDashboard size={20} />
                            <span>Analytics</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>
                            <User size={20} />
                            <span>Profile</span>
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
