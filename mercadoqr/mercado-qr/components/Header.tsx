
import React from 'react';
import { BackIcon } from './Icons';

interface HeaderProps {
    title: string;
    onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onBack }) => {
    return (
        <header className="sticky top-0 bg-mercado-blue text-white p-4 shadow-md z-10 flex items-center">
            {onBack && (
                <button onClick={onBack} className="mr-4 p-2 rounded-full hover:bg-mercado-blue-light transition-colors">
                    <BackIcon />
                </button>
            )}
            <h1 className="text-xl font-bold truncate">{title}</h1>
        </header>
    );
};

export default Header;
