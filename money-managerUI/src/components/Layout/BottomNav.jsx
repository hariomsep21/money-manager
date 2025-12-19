import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, BarChart3, Wallet, Notebook } from 'lucide-react';
import './BottomNav.css';

const BottomNav = () => {
    return (
        <nav className="bottom-nav">
            <NavLink to="/transactions" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <LayoutGrid size={24} />
                <span>Trans.</span>
            </NavLink>
            <NavLink to="/analytics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <BarChart3 size={24} />
                <span>Stats</span>
            </NavLink>
            <NavLink to="/notes" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Notebook size={24} />
                <span>Notes</span>
            </NavLink>
            <NavLink to="/accounts" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Wallet size={24} />
                <span>Accounts</span>
            </NavLink>
        </nav>
    );
};

export default BottomNav;
