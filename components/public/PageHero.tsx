export function PageHero({
  kicker,
  title,
  lead,
  children,
}: {
  kicker?: string;
  title: React.ReactNode;
  lead?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div className="container-ml relative pb-16 pt-[calc(var(--header-h)+4.25rem)]">
        {kicker ? <p className="kicker">{kicker}</p> : null}
        <h1 className="display max-w-4xl">{title}</h1>
        {lead ? <p className="lead mt-5 text-white/75">{lead}</p> : null}
        {children ? <div className="mt-8 flex flex-wrap gap-3">{children}</div> : null}
      </div>
    </section>
  );
}
