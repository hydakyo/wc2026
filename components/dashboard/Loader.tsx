"use client";
import React from 'react';
import '../../styles/Loader.css';

interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message = 'Đang tải dữ liệu...' }) => {
  return (
    <div className="loader-container">
      <div className="loader-spinner"></div>
      <p className="loader-text">{message}</p>
    </div>
  );
};

export default Loader;


