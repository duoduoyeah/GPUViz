import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavigationPanel.css';

const NavigationPanel: React.FC = () => {
  return (
    <nav className="navigation-panel">
      <ul>
        <li>
          <NavLink to="/" end activeClassName="active">Gpuviz</NavLink>
        </li>
        <li>
          <NavLink to="/daisen" activeClassName="active">Daisen</NavLink>
        </li>
        <li>
          <NavLink to="/chainsight" activeClassName="active">ChainSight</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavigationPanel;
