import { Link } from 'react-router-dom';
import {
  ArrowRight, ArrowLeft, School, UsersRound, CalendarDays,
  ClipboardList, CreditCard, Bell, BookOpen, Gamepad2, GraduationCap,
  BarChart3, Sparkles,
} from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import { Card } from '../components/ui/card.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { LanguageSwitcher } from '../components/LanguageSwitcher.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { cn } from '../lib/utils.js';

const managerIcons = [School, UsersRound, CalendarDays, ClipboardList, CreditCard, Bell];
const studentIcons = [BookOpen, CalendarDays, Gamepad2, GraduationCap, BarChart3, Bell];

const Landing = () => {
  const { auth } = useAuth();
  const { t, dir } = useLanguage();
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const dashboardPath = auth ? (auth.role === 'manager' ? '/manager' : '/student') : '/login';

  const managerKeys = ['schools', 'instructors', 'sessions', 'enrollments', 'payments', 'notifications'];
  const studentKeys = ['courses', 'schedule', 'simulator', 'examQuiz', 'grades', 'notifications'];

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b bg-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5">
          <div className="font-display text-lg font-semibold text-primary">{t('appName')}</div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">{t('landing.navFeatures')}</a>
            <a href="#managers" className="hover:text-foreground">{t('landing.navManagers')}</a>
            <a href="#students" className="hover:text-foreground">{t('landing.navStudents')}</a>
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button asChild size="sm" variant="outline">
              <Link to={dashboardPath}>{auth ? t('landing.goToDashboard') : t('landing.signIn')}</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
        <div>
          <Badge variant="accent" className="mb-4">{t('landing.heroKicker')}</Badge>
          <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl md:text-[2.6rem]">
            {t('landing.heroTitle')}
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t('landing.heroSubtitle')}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" variant="accent">
              <Link to={dashboardPath}>
                {auth ? t('landing.goToDashboard') : t('landing.heroCtaPrimary')}
                <ArrowIcon className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#features">{t('landing.heroCtaSecondary')}</a>
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { value: '6', label: t('landing.statCategories') },
              { value: '30', label: t('landing.statQuestions') },
              { value: '2', label: t('landing.statLanguages') },
              { value: t('landing.statSimulatorValue'), label: t('landing.statSimulator') },
            ].map((s, i) => (
              <div key={i}>
                <div className="font-display text-2xl font-semibold text-primary">{s.value}</div>
                <div className="mt-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <Card className="overflow-hidden shadow-md">
          <div className="flex items-center gap-1.5 border-b bg-secondary/60 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive/50" />
            <span className="h-2.5 w-2.5 rounded-full bg-accent/50" />
            <span className="h-2.5 w-2.5 rounded-full bg-success/50" />
            <span className="ms-2 text-xs font-medium text-muted-foreground">{t('landing.heroPreviewTitle')}</span>
          </div>
          <div className="space-y-4 p-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('landing.heroPreviewSub')}</div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { v: '3', l: 'Courses' },
                { v: '3', l: 'Students' },
                { v: '2/3', l: 'Cars' },
              ].map((s, i) => (
                <div key={i} className="rounded-md border p-3">
                  <div className="font-display text-xl font-semibold text-primary">{s.v}</div>
                  <div className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
            <div className="rounded-md border p-3">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold">
                <Gamepad2 className="h-3.5 w-3.5 text-accent" /> Driving Simulator
              </div>
              <div className="h-16 rounded bg-gradient-to-b from-sky-200 to-amber-100" />
            </div>
            <div className="flex items-center justify-between rounded-md border p-3 text-xs">
              <span className="flex items-center gap-2 font-semibold"><GraduationCap className="h-3.5 w-3.5 text-accent" /> Code Exam Quiz</span>
              <Badge variant="success">25/30</Badge>
            </div>
          </div>
        </Card>
      </section>

      {/* Manager features */}
      <section id="managers" className="border-t bg-secondary/30 py-16">
        <div className="mx-auto max-w-6xl px-6" id="features">
          <Badge variant="primary" className="mb-3">{t('landing.managerSectionKicker')}</Badge>
          <h2 className="max-w-xl font-display text-2xl font-semibold sm:text-3xl">{t('landing.managerSectionTitle')}</h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">{t('landing.managerSectionSubtitle')}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {managerKeys.map((key, i) => {
              const Icon = managerIcons[i];
              return (
                <Card key={key} className="p-5">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-primary-soft text-primary">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-sm font-semibold">{t(`landing.managerFeatures.${key}.title`)}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{t(`landing.managerFeatures.${key}.desc`)}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Student features */}
      <section id="students" className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <Badge variant="accent" className="mb-3">{t('landing.studentSectionKicker')}</Badge>
          <h2 className="max-w-xl font-display text-2xl font-semibold sm:text-3xl">{t('landing.studentSectionTitle')}</h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">{t('landing.studentSectionSubtitle')}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {studentKeys.map((key, i) => {
              const Icon = studentIcons[i];
              const badge = t(`landing.studentFeatures.${key}.badge`);
              const hasBadge = badge && badge !== `landing.studentFeatures.${key}.badge`;
              return (
                <Card key={key} className={cn('p-5', hasBadge && 'border-accent')}>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent-soft text-accent">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    {hasBadge && <Badge variant="accent">{badge}</Badge>}
                  </div>
                  <h3 className="text-sm font-semibold">{t(`landing.studentFeatures.${key}.title`)}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{t(`landing.studentFeatures.${key}.desc`)}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="border-t bg-primary py-16 text-primary-foreground">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center">
          <Sparkles className="h-6 w-6 text-accent" />
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">{t('landing.ctaTitle')}</h2>
          <p className="max-w-md text-sm text-primary-foreground/75">{t('landing.ctaSubtitle')}</p>
          <Button asChild size="lg" variant="accent" className="mt-2">
            <Link to={dashboardPath}>
              {t('landing.ctaButton')}
              <ArrowIcon className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center sm:flex-row sm:justify-between sm:text-start">
          <div>
            <div className="font-display text-base font-semibold text-primary">{t('appName')}</div>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">{t('landing.footerTagline')}</p>
          </div>
          <div className="flex flex-col items-center gap-2 text-xs sm:items-end">
            <div className="flex gap-4">
              <Link to="/login" className="font-medium text-primary hover:underline">{t('landing.footerManagerLink')}</Link>
              <Link to="/login" className="font-medium text-primary hover:underline">{t('landing.footerStudentLink')}</Link>
            </div>
            <span className="text-muted-foreground">{t('landing.footerRights')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
