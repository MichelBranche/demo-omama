import { Cta } from "@/components/Cta";

export default function NotFound() {
  return (
    <section className="page-hero background-yellow">
      <p className="f-a-16-120">404</p>
      <h1 className="title f-al-96-100">Pagina non trovata.</h1>
      <Cta href="/" className="s-30">
        Torna in home
      </Cta>
    </section>
  );
}
