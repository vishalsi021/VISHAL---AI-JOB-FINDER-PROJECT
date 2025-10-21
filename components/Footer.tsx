
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="text-center py-6 text-gray-500 text-sm mt-auto">
      <p>&copy; {new Date().getFullYear()} Vital Skill Indicator. All rights reserved.</p>
      <p className="mt-1">Powered by Google Gemini</p>
    </footer>
  );
};