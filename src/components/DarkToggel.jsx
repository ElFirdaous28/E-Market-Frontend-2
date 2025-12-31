import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DarkToggel() {
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return storedTheme || (prefersDark ? 'dark' : 'light');
  });

  const toggelTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);


  return (
    <button
      aria-label="Dark Toggel"
      onClick={toggelTheme}
      className="rounded-full cursor-pointer text-textMuted hover:text-primary transition-all ease-in-out"
    >
      {theme === 'light' ? <Moon /> : <Sun />}
    </button>
  );
}
