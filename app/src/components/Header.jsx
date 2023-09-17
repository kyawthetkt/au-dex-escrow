// Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link className="text-white text-2xl font-semibold" to="/">AU Escrow</Link>
      </div>
    </header>
  );
}

export default Header;
