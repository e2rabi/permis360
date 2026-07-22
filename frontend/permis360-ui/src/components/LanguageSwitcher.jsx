import { Languages } from 'lucide-react';
import { Button } from './ui/button.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export const LanguageSwitcher = ({ className }) => {
  const { lang, toggleLanguage } = useLanguage();
  return (
    <Button variant="outline" size="sm" onClick={toggleLanguage} className={className}>
      <Languages className="h-3.5 w-3.5" />
      {lang === 'en' ? 'العربية' : 'English'}
    </Button>
  );
};
