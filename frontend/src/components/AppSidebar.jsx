import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { cn } from '../lib/utils.js';
import { Button } from './ui/button.jsx';
import { Separator } from './ui/separator.jsx';
import { LanguageSwitcher } from './LanguageSwitcher.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export const AppSidebar = ({ groups, roleLabel, userName }) => {
  const { logout } = useAuth();
  const { t } = useLanguage();

  return (
    <aside className="flex w-60 shrink-0 flex-col bg-primary px-3 py-5 text-primary-foreground">
      <div className="px-2 pb-1">
        <div className="font-display text-lg font-semibold text-white">{t('appName')}</div>
        <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground/60">
          {t('appTagline')}
        </div>
      </div>
      <div className="lane-divider my-3.5 mx-1" />

      <nav className="flex flex-1 flex-col gap-3 overflow-y-auto">
        {groups.map((group, gi) => (
          <div key={gi}>
            {groups.length > 1 && (
              <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground/50">
                {group.section}
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              {group.links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13.5px] font-medium text-primary-foreground/80 transition-colors hover:bg-white/10 hover:text-white',
                      isActive && 'bg-accent text-white hover:bg-accent'
                    )
                  }
                >
                  <link.icon className="h-4 w-4 shrink-0" />
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <Separator className="my-3 bg-white/15" />
      <div className="px-2">
        <LanguageSwitcher className="mb-3 w-full justify-center border-white/20 bg-transparent text-primary-foreground hover:bg-white/10 hover:text-white" />
        <div className="mb-2 text-[13px]">
          <div className="font-semibold text-white">{userName}</div>
          <div className="text-primary-foreground/60">{roleLabel}</div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-center gap-2 border-white/20 bg-transparent text-primary-foreground hover:bg-white/10 hover:text-white"
          onClick={logout}
        >
          <LogOut className="h-3.5 w-3.5" />
          {t('common.logout')}
        </Button>
      </div>
    </aside>
  );
};
