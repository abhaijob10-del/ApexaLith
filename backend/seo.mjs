import { readFile } from "node:fs/promises";
import path from "node:path";
import { query, run } from "./security.mjs";
const escape = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const paths = [
  "/",
  "/apartments",
  "/designs",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
];
const title = [
  "Architecture & construction in Bengaluru",
  "Apartments",
  "Construction designs",
  "About the studio",
  "Contact",
  "Privacy policy",
  "Terms of use",
];
function root() {
  return new URL(process.env.APP_ORIGIN || "http://127.0.0.1:3000").origin;
}
export function seoRoutes(app) {
  app.get("/robots.txt", (req, res) =>
    res
      .type("text")
      .send(
        "User-agent: *\nDisallow: /admin\nDisallow: /account\nDisallow: /api/\nSitemap: " +
          root() +
          "/sitemap.xml\n",
      ),
  );
  app.get(
    "/sitemap.xml",
    run(async (req, res) => {
      const { rows } = await query(
        "SELECT slug,kind FROM listings WHERE status='published' ORDER BY id LIMIT 49993",
      );
      const urls = [
        ...paths,
        ...rows.map(
          (x) =>
            (x.kind === "apartment" ? "/apartments/" : "/designs/") + x.slug,
        ),
      ];
      res
        .type("application/xml")
        .send(
          '<?xml version="1.0" encoding="utf-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
            urls
              .map((p) => "<url><loc>" + escape(root() + p) + "</loc></url>")
              .join("") +
            "</urlset>",
        );
    }),
  );
}
export function publicDocument(dir) {
  const file = readFile(path.join(dir, "index.html"), "utf8");
  return run(async (req, res) => {
    const p = req.path.replace(/\/$/, "") || "/",
      index = paths.indexOf(p),
      detail = /^\/(apartments|designs)\/([a-z0-9-]+)$/.exec(p);
    let heading = title[index],
      description =
        "Explore apartments and architectural designs from ApexaLith in Bengaluru.",
      record;
    let status = 200;
    if (detail) {
      const { rows } = await query(
        "SELECT title,description FROM listings WHERE kind=$1 AND slug=$2 AND status='published'",
        [detail[1] === "apartments" ? "apartment" : "design", detail[2]],
      );
      record = rows[0];
      if (record) {
        heading = record.title;
        description = record.description.slice(0, 180) || description;
      }
    }
    const personal = ["/admin/login", "/admin/dashboard", "/account"].includes(
      p,
    );
    if (!heading && !personal) {
      status = 404;
      heading = "Page unavailable";
    }
    if (personal || status === 404) res.set("X-Robots-Tag", "noindex");
    const name = (heading || "Account") + " | ApexaLith",
      url = root() + p;
    const schema = record
      ? {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: heading,
          url,
          description,
        }
      : null;
    const tags =
      "<title>" +
      escape(name) +
      '</title><meta name="description" content="' +
      escape(description) +
      '"><meta property="og:title" content="' +
      escape(name) +
      '"><meta property="og:description" content="' +
      escape(description) +
      '"><meta property="og:type" content="website"><meta property="og:url" content="' +
      escape(url) +
      '">' +
      (personal || status === 404
        ? ""
        : '<link rel="canonical" href="' + escape(url) + '">') +
      (schema
        ? '<script type="application/ld+json">' +
          JSON.stringify(schema).replace(/</g, "\\u003c") +
          "</script>"
        : "");
    res
      .status(status)
      .type("html")
      .send((await file).replace(/<title>.*?<\/title>/, () => tags));
  });
}
