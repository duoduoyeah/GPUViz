import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavigationPanel.css';

const NavigationPanel: React.FC = () => {
  return (
    <nav className="navigation-panel">
      <ul>
        <li>
          <NavLink
            to="/"
            end
            className={({ isActive }) => isActive ? "active" : undefined}
          >Config</NavLink>
        </li>
        <li>
          <NavLink
            to="/gpuviz"
            className={({ isActive }) => isActive ? "active" : undefined}
          >Gpuviz</NavLink>
        </li>
        <li>
          <NavLink
            to="/daisen"
            className={({ isActive }) => isActive ? "active" : undefined}
          >Daisen</NavLink>
        </li>
        <li>
          <NavLink
            to="/chainsight"
            className={({ isActive }) => isActive ? "active" : undefined}
          >ChainSight</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavigationPanel;
