export function PageHero({
  kicker,
  title,
  lead,
  tone = "sun",
}: {
  kicker: string;
  title: string;
  lead: string;
  tone?: "sun" | "blush" | "leaf" | "blue" | "red";
}) {
  const bg = {
    sun: "background-yellow",
    blush: "background-red-light",
    leaf: "background-green color-white",
    blue: "background-blue color-white",
    red: "background-red",
  }[tone];

  return (
    <section className={`page-hero ${bg}`}>
      <p className="f-a-16-120">{kicker}</p>
      <h1 className="title f-al-96-100">{title}</h1>
      <p className="lead f-a-20-120">{lead}</p>
    </section>
  );
}
