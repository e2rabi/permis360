import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useAppData } from '../context/AppContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Button } from '../components/ui/button.jsx';
import { cn } from '../lib/utils.js';
import { LanguageSwitcher } from '../components/LanguageSwitcher.jsx';

const Login = () => {
  const [role, setRole] = useState('manager');
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const { loginAsManager, loginAsStudent } = useAuth();
  const { state } = useAppData();
  const { t, dir } = useLanguage();
  const navigate = useNavigate();

  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const handleContinue = () => {
    if (role === 'manager') {
      loginAsManager();
      navigate('/manager', { replace: true });
    } else if (selectedStudentId) {
      loginAsStudent(selectedStudentId);
      navigate('/student', { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-5">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-xl border bg-card shadow-sm md:grid-cols-[1.1fr_1.4fr]">
        <div className="hidden flex-col justify-between bg-primary p-9 text-primary-foreground md:flex">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-primary-foreground/60">
              {t('appName')}
            </div>
            <div className="lane-divider my-4" />
            <h1 className="font-display text-3xl font-semibold leading-snug text-white">
              {t('login.heroTitle')}
            </h1>
          </div>
          <p className="text-sm text-primary-foreground/70">{t('login.heroBody')}</p>
        </div>

        <div className="flex flex-col gap-5 p-8 md:p-9">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-semibold">{t('login.signIn')}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t('login.chooseMode')}</p>
            </div>
            <LanguageSwitcher />
          </div>

          <div className="flex gap-1 rounded-md bg-secondary p-1">
            <button
              className={cn(
                'flex-1 rounded px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors',
                role === 'manager' && 'bg-card text-primary shadow-sm'
              )}
              onClick={() => setRole('manager')}
            >
              {t('login.asManager')}
            </button>
            <button
              className={cn(
                'flex-1 rounded px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors',
                role === 'student' && 'bg-card text-primary shadow-sm'
              )}
              onClick={() => setRole('student')}
            >
              {t('login.asStudent')}
            </button>
          </div>

          {role === 'student' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground">{t('login.pickProfile')}</label>
              <div className="flex max-h-56 flex-col gap-1 overflow-y-auto rounded-md border p-1.5">
                {state.students.map((s) => (
                  <div
                    key={s.id}
                    className={cn(
                      'flex cursor-pointer items-center justify-between rounded px-3 py-2 text-sm transition-colors hover:bg-secondary',
                      selectedStudentId === s.id && 'bg-primary-soft'
                    )}
                    onClick={() => setSelectedStudentId(s.id)}
                  >
                    <span>{s.name}</span>
                    <span className="font-mono text-xs text-muted-foreground">{s.cin}</span>
                  </div>
                ))}
              </div>
              <span className="text-[11.5px] text-muted-foreground">{t('login.pickHint')}</span>
            </div>
          )}

          <Button
            variant="accent"
            size="lg"
            className="justify-center"
            disabled={role === 'student' && !selectedStudentId}
            onClick={handleContinue}
          >
            {t('login.continueBtn')}
            <ArrowIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
