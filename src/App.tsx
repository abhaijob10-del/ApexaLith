import React, { Suspense, lazy, useEffect } from "react";
import { useRef, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
} from "lucide-react";
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
function Navigation({ signedIn }: { signedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  return (
    <header
      className="site-header"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          trigger.current?.focus();
        }
      }}
    >
      <a className="brand" href="/" aria-label="ApexaLith home">
        ApexaLith<span aria-hidden="true">.</span>
      </a>
      <button
        ref={trigger}
        type="button"
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="primary-nav"
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <X size={18} aria-hidden="true" />
        ) : (
          <Menu size={18} aria-hidden="true" />
        )}{" "}
        Menu
      </button>
      <nav id="primary-nav" data-open={open} aria-label="Main navigation">
        {links.map(([url, title]) => (
          <a
            key={url}
            href={url}
            aria-current={path === url ? "page" : undefined}
          >
            {title}
          </a>
        ))}
        <a
          className="account-link"
          href="/account"
          aria-current={path === "/account" ? "page" : undefined}
        >
          {signedIn ? "My account" : "Sign in"}{" "}
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </nav>
    </header>
  );
}

function Home({ settings }: { settings: any }) {
  const featured = useData("/listings?featured=true");
  return (
    <>
      {settings.banner?.value && (
        <p className="banner">{settings.banner.value}</p>
      )}
      <section className="landing">
        <div className="landing-copy">
          <small className="eyebrow">Bengaluru, India</small>
          <h1>Architecture &amp; construction</h1>
          <p>
            {settings.hero?.value ||
              "Explore apartments and construction designs with ApexaLith."}
          </p>
          <div className="actions">
            <a className="cta" href="/apartments">
              Explore apartments <ArrowUpRight size={19} aria-hidden="true" />
            </a>
            <a className="text-link" href="/designs">
              View designs <ArrowRight size={17} aria-hidden="true" />
            </a>
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
      <section className="collection" aria-labelledby="collection-heading">
        <div className="section-heading">
          <h2 id="collection-heading">Properties &amp; designs</h2>
          <ArrowDownRight aria-hidden="true" className="section-arrow" />
        </div>
        {featured.data ? (
          <>
            {featured.data.items.length ? (
              <div className="cards">
                {featured.data.items.map((i) => (
                  <Card key={i.id} item={i} />
                ))}
              </div>
            ) : null}
          </>
        ) : (
          <Feedback error={featured.error} />
        )}
        <div className="collection-links">
          <a href="/apartments">
            <span>
              <strong>Apartments</strong>
              <small>Search by location, size and availability</small>
            </span>
            <ArrowUpRight aria-hidden="true" />
          </a>
          <a href="/designs">
            <span>
              <strong>Construction designs</strong>
              <small>Explore the design catalogue</small>
            </span>
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
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
      <Navigation signedIn={Boolean(user)} />
      <main
        id="main"
        className={section === "admin" ? "admin-main" : undefined}
        tabIndex={-1}
      >
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
