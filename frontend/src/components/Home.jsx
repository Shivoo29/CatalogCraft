import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ArrowRightIcon, BoltIcon, ChartBarSquareIcon, SparklesIcon } from "@heroicons/react/24/outline";
import heroVisual from "../assets/Gemini_Generated_Image_5le7ip5le7ip5le7.png";
import step1 from "../assets/step1.jpg";
import step2 from "../assets/step2.jpg";
import step3 from "../assets/step3.jpg";
import workflow from "../assets/workflow.jpg";

function Home() {
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const response = await axios.get(`${url}/catalogue/get-all`);
        setCatalogs(response.data || []);
      } catch (error) {
        console.error("Error fetching home catalogues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogs();
  }, [url]);

  const topCategories = useMemo(() => {
    const counts = {};
    catalogs.forEach((catalog) => {
      const key =
        typeof catalog?.category === "object"
          ? catalog?.category?.category
          : catalog?.category;
      if (!key) return;
      counts[key] = (counts[key] || 0) + 1;
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [catalogs]);

  const metrics = [
    { label: "Imported SKUs", value: `${catalogs.length}+` },
    { label: "Live categories", value: `${topCategories.length || 4}` },
    { label: "Faster launch", value: "10x" },
    { label: "Premium UX", value: "24/7" },
  ];

  const features = [
    {
      title: "Catalog digitization at enterprise speed",
      body: "Standardize titles, descriptions, pricing, and media into one polished product surface.",
      icon: BoltIcon,
      className: "md:col-span-2",
    },
    {
      title: "Investor-ready product storytelling",
      body: "Move from raw data to a storefront that looks credible in demos, screenshots, and board decks.",
      icon: SparklesIcon,
      className: "",
    },
    {
      title: "Operational clarity",
      body: "Create a premium front-end for product teams, sellers, and catalog ops without sacrificing scale.",
      icon: ChartBarSquareIcon,
      className: "",
    },
  ];

  const landingShowcase = [
    {
      title: "Premium seller onboarding",
      body: "Guide teams from scattered product inputs into a structured luxury storefront.",
      image: step1,
      className: "md:col-span-2",
    },
    {
      title: "One-click digitization",
      body: "Upload, enrich, and standardize product data faster with cleaner workflows.",
      image: step2,
      className: "",
    },
    {
      title: "Operational control",
      body: "Track catalog quality, content consistency, and presentation across the platform.",
      image: step3,
      className: "",
    },
    {
      title: "Investor-ready storyboards",
      body: "Use high-quality visual storytelling on the landing page while the live catalog powers discovery deeper in the product.",
      image: workflow,
      className: "md:col-span-2",
    },
  ];

  return (
    <div className="lux-shell pb-16">
      <div className="lux-container pt-10">
        <section className="lux-grid md:grid-cols-[1.25fr_0.85fr]">
          <div className="lux-panel-highlight p-8 md:p-10">
            <span className="lux-chip">Premium commerce infrastructure</span>
            <h1 className="lux-heading mt-6 max-w-3xl">
              A dark-luxury catalog platform for modern product companies.
            </h1>
            <p className="lux-subheading mt-6 max-w-2xl">
              CatalogCraft turns fragmented product data into a premium storefront
              and structured operating layer for sellers, commerce teams, and demos
              that need to impress instantly.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/catalogs" className="lux-button-primary">
                Explore products
              </Link>
              <Link to="/signup" className="lux-button-secondary">
                Book a walkthrough
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-[22px] border border-white/10 bg-black/15 p-4">
                  <p className="lux-metric">{metric.value}</p>
                  <p className="mt-1 text-sm text-slate-400">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lux-grid">
            <div className="lux-panel p-6">
              <p className="text-sm uppercase tracking-[0.26em] text-slate-500">
                Why it feels premium
              </p>
              <div className="mt-4 space-y-4 text-sm leading-7 text-slate-300">
                <p>Dark-luxury surfaces, strong hierarchy, sharp spacing, and product-first storytelling.</p>
                <p>Designed to work as both a polished company site and a modern ecommerce experience.</p>
              </div>
            </div>
            <div className="lux-panel-soft p-6">
              <div className="mb-5 overflow-hidden rounded-[22px] border border-white/10 bg-black/30">
                <div className="aspect-[16/10] w-full">
                  <img
                    src={heroVisual}
                    alt="CatalogCraft premium platform preview"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
              <p className="text-sm uppercase tracking-[0.26em] text-slate-500">
                Top categories
              </p>
              <div className="mt-5 space-y-3">
                {topCategories.map(([name, count]) => (
                  <div key={name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <span className="text-sm font-medium text-slate-200">{name}</span>
                    <span className="text-sm text-red-300">{count} items</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 lux-grid md:grid-cols-3">
          {features.map(({ title, body, icon: Icon, className }) => (
            <div key={title} className={`lux-panel p-6 ${className}`}>
              <div className="mb-5 inline-flex rounded-2xl border border-red-800/25 bg-red-900/20 p-3">
                <Icon className="h-6 w-6 text-red-300" />
              </div>
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{body}</p>
            </div>
          ))}
        </section>

        <section className="mt-20">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="lux-chip">Visual showcase</span>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
                Curated visuals for the landing page. Real products deeper in the journey.
              </h2>
            </div>
            <Link to="/catalogs" className="inline-flex items-center gap-2 text-sm font-medium text-[#ff5a1f]">
              Explore live catalogue
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {landingShowcase.map((item) => (
              <div
                key={item.title}
                className={`lux-panel overflow-hidden p-4 ${item.className}`}
              >
                <div className="overflow-hidden rounded-[24px] border border-white/10 bg-black/30">
                  <div className="relative aspect-[16/9] w-full max-h-[340px]">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-contain"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(127,29,29,0.25),transparent_55%),linear-gradient(180deg,rgba(0,0,0,0.2),rgba(0,0,0,0.55))]" />
                  </div>
                </div>
                <div className="px-2 pb-2 pt-5">
                  <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 lux-panel p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.26em] text-slate-500">
                  Live catalogue
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white md:text-3xl">
                  The landing page stays curated. The product catalogue stays real.
                </h3>
              </div>
              <Link to="/catalogs" className="lux-button-primary">
                Browse live products
              </Link>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
              This gives you the best of both worlds: strong first-impression visuals
              for investors and a real data-driven commerce experience once someone
              enters the catalog.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
