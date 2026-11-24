import React, { Suspense, lazy, useEffect } from "react";
import { Account, Browse, ListingPage, RequestForm } from "./catalog/Public";
import { Card, Feedback, Photo, useData } from "./catalog/shared";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./catalog/site.css";
const Admin = lazy(() => import("./catalog/Admin"));
const path = window.location.pathname.replace(/\/$/, "") || "/";
const links = [
  ["/apartments", "Apartments"],
  ["/designs", "Construction designs"],
  ["/about", "About"],
  ["/contact", "Contact"],
];
function Home({ settings }: { settings: any }) {
  const featured = useData("/listings?featured=true");
  return (
    <>
      {settings.banner?.value && (
        <p className="banner">{settings.banner.value}</p>
      )}
      <section className="landing">
        <div className="landing-copy">
          <small>Bengaluru, India</small>
          <h1>Architecture &amp; construction</h1>
          <p>
            {settings.hero?.value ||
              "Explore apartments and construction designs with ApexaLith."}
          </p>
          <div className="actions">
            <a className="cta" href="/apartments">
              Explore apartments
            </a>
            <a href="/designs">View designs ↗</a>
          </div>
        </div>
        <div className="hero-photo">
          {settings.hero?.media_id ? (
            <Photo
              id={settings.hero.media_id}
              large
              alt="Studio-selected architectural photograph"
            />
          ) : (
            <img
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1440&q=82"
              alt="Architectural inspiration, a contemporary home with a landscaped courtyard"
              width="1440"
              height="1080"
              fetchPriority="high"
            />
          )}
        </div>
      </section>
      <section>
        <h2>Featured properties &amp; designs</h2>
        {featured.data ? (
          <>
            {featured.data.items.length ? (
              <div className="cards">
                {featured.data.items.map((i) => (
                  <Card key={i.id} item={i} />
                ))}
              </div>
            ) : (
              <p>
                Featured listings will appear here as the studio publishes them.
              </p>
            )}
          </>
        ) : (
          <Feedback error={featured.error} />
        )}
      </section>
      {settings.testimonial?.value && (
        <blockquote>{settings.testimonial.value}</blockquote>
      )}
    </>
  );
}
export default function App() {
  const session = useData("/session"),
    content = useData("/settings");
  const settings = Object.fromEntries(
    (content.data || []).map((x) => [x.key, x]),
  );
  const [, section, slug] = path.split("/"),
    user = session.data?.user;
  useEffect(() => {
    const titles = {
      admin: "Administration",
      account: "My account",
      about: "About the studio",
      contact: "Contact",
      apartments: "Apartments",
      designs: "Construction designs",
      privacy: "Privacy policy",
      terms: "Terms",
    };
    if (titles[section]) document.title = titles[section] + " | ApexaLith";
  }, []);
  let body: React.ReactNode;
  if (path === "/") body = <Home settings={settings} />;
  else if (["apartments", "designs"].includes(section)) {
    const kind = section === "apartments" ? "apartment" : "design";
    body = slug ? (
      <ListingPage kind={kind} slug={slug} user={user} />
    ) : (
      <Browse kind={kind} />
    );
  } else if (section === "admin" || path === "/account")
    body = session.data ? (
      section === "admin" ? (
        <Suspense fallback={<Feedback />}>
          <Admin user={user} />
        </Suspense>
      ) : (
        <Account user={user} />
      )
    ) : (
      <Feedback error={session.error} />
    );
  else if (path === "/about")
    body = (
      <section>
        <h1>About ApexaLith</h1>
        <p className="lead prose">
          {settings.company?.value ||
            "ApexaLith is a construction and real estate company based in Bengaluru, India."}
        </p>
        <a href="/contact">Contact the studio ↗</a>
      </section>
    );
  else if (path === "/contact")
    body = (
      <section className="split">
        <div>
          <h1>Contact the studio</h1>
          <p className="prose">
            {settings.contact?.value || "Bengaluru, India"}
          </p>
        </div>
        <RequestForm user={user} />
      </section>
    );
  else if (path === "/privacy" || path === "/terms")
    body = (
      <section>
        <h1>{path === "/privacy" ? "Privacy policy" : "Terms of use"}</h1>
        <p>Draft awaiting company approval.</p>
        <p>
          {path === "/privacy"
            ? "We collect the contact details and request information you submit so the team can respond. Contact the studio for privacy questions."
            : "Listings are informational. A booking enquiry or site visit request requires confirmation from the company."}
        </p>
      </section>
    );
  else
    body = (
      <section>
        <h1>Page unavailable</h1>
        <a href="/">Return home</a>
      </section>
    );
  return (
    <div className="studio">
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header>
        <a className="brand" href="/">
          ApexaLith
        </a>
        <nav aria-label="Main navigation">
          {links.map(([url, title]) => (
            <a
              key={url}
              href={url}
              aria-current={path === url ? "page" : undefined}
            >
              {title}
            </a>
          ))}
          <a href="/account">{user ? "My account" : "Sign in"}</a>
        </nav>
      </header>
      <main id="main">
        <ErrorBoundary fallbackTitle="ApexaLith">{body}</ErrorBoundary>
      </main>
      <footer>
        <a className="brand" href="/">
          ApexaLith
        </a>
        <nav aria-label="Footer">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          {settings.social?.value && (
            <a href={settings.social.value}>Social profile</a>
          )}
          <a href="/contact">Contact</a>
        </nav>
      </footer>
    </div>
  );
}
