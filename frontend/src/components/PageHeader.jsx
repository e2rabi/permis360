export const PageHeader = ({ title, subtitle, action }) => (
  <header className="flex flex-col gap-3 border-b bg-card px-6 py-5 sm:flex-row sm:items-center sm:justify-between md:px-8">
    <div>
      <h1 className="text-xl font-display font-semibold sm:text-2xl">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
    {action}
  </header>
);
