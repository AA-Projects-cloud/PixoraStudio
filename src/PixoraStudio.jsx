import { useState, useEffect, useRef } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  :root {
    --primary: #5c00d3;
    --primary-light: #7c22f5;
    --primary-glow: rgba(92,0,211,0.18);
    --accent: #f0c030;
    --accent2: #ff6b6b;
    --bg: #09070f;
    --bg2: #110d1e;
    --bg3: #1a1230;
    --surface: rgba(255,255,255,0.04);
    --surface2: rgba(255,255,255,0.08);
    --border: rgba(255,255,255,0.08);
    --text: #f0eaff;
    --text-muted: #8b80a8;
    --text-dim: #5c5278;
    --radius: 18px;
    --radius-sm: 10px;
    --transition: 0.35s cubic-bezier(0.4,0,0.2,1);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    overflow-x: hidden;
    cursor: none;
  }

  .px-cursor {
    position: fixed;
    width: 12px; height: 12px;
    background: var(--primary-light);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%,-50%);
    transition: transform 0.1s, width 0.25s, height 0.25s, background 0.25s;
    mix-blend-mode: screen;
  }
  .px-cursor-ring {
    position: fixed;
    width: 36px; height: 36px;
    border: 1.5px solid rgba(124,34,245,0.5);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    transform: translate(-50%,-50%);
    transition: transform 0.18s ease, width 0.3s, height 0.3s, border-color 0.3s;
  }
  .px-cursor.hovered { width: 20px; height: 20px; background: var(--accent); }
  .px-cursor-ring.hovered { width: 52px; height: 52px; border-color: var(--accent); }

  .px-noise-overlay {
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 9997;
    opacity: 0.6;
  }

  /* NAVBAR */
  .px-nav {
    position: fixed; top: 0; left: 0; right: 0;
    z-index: 100;
    padding: 20px 48px;
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(9,7,15,0.7);
    backdrop-filter: blur(24px);
    border-bottom: 1px solid var(--border);
    transition: padding var(--transition);
  }
  .px-nav.scrolled { padding: 14px 48px; }
  .px-nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; cursor: pointer; }
  .px-logo-mark {
    width: 38px; height: 38px;
    background: linear-gradient(135deg, var(--primary), var(--primary-light));
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 18px;
    color: #fff; box-shadow: 0 0 20px var(--primary-glow);
  }
  .px-logo-text { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 17px; letter-spacing: 0.05em; color: var(--text); }
  .px-logo-text span { color: var(--primary-light); }
  .px-nav-links { display: flex; align-items: center; gap: 36px; }
  .px-nav-links a {
    color: var(--text-muted); text-decoration: none; font-size: 14px;
    font-weight: 500; letter-spacing: 0.02em; transition: color var(--transition);
    position: relative;
  }
  .px-nav-links a::after {
    content:''; position:absolute; bottom:-4px; left:0; right:100%;
    height:1px; background: var(--primary-light); transition: right 0.3s ease;
  }
  .px-nav-links a:hover { color: var(--text); }
  .px-nav-links a:hover::after { right: 0; }
  .px-nav-cta {
    background: linear-gradient(135deg, var(--primary), var(--primary-light)) !important;
    color: #fff !important; padding: 10px 24px; border-radius: 100px;
    font-size: 13px !important; font-weight: 600 !important; letter-spacing: 0.04em;
    box-shadow: 0 0 24px var(--primary-glow);
    transition: box-shadow var(--transition), transform var(--transition) !important;
  }
  .px-nav-cta::after { display: none !important; }
  .px-nav-cta:hover { box-shadow: 0 0 40px rgba(92,0,211,0.4) !important; transform: translateY(-1px); }
  .px-hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; background: none; border: none; padding: 4px; }
  .px-hamburger span { width: 24px; height: 2px; background: var(--text); border-radius: 2px; display: block; transition: var(--transition); }

  /* MOBILE NAV */
  .px-mobile-nav {
    position: fixed; inset: 0;
    background: rgba(9,7,15,0.97); backdrop-filter: blur(20px);
    z-index: 99; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 32px;
    transform: translateX(100%); transition: transform var(--transition);
  }
  .px-mobile-nav.open { transform: translateX(0); }
  .px-mobile-nav a { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 700; color: var(--text-muted); text-decoration: none; transition: color var(--transition); }
  .px-mobile-nav a:hover { color: var(--primary-light); }
  .px-mobile-nav-close { position: absolute; top: 24px; right: 24px; background: none; border: none; color: var(--text); font-size: 28px; cursor: pointer; }

  /* HERO */
  .px-hero {
    min-height: 100vh; display: flex; align-items: center;
    padding: 120px 48px 80px; position: relative; overflow: hidden;
  }
  .px-hero-bg {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 80% 60% at 60% 50%, rgba(92,0,211,0.12) 0%, transparent 70%),
                radial-gradient(ellipse 40% 40% at 20% 80%, rgba(124,34,245,0.06) 0%, transparent 60%);
  }
  .px-hero-grid {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse at center, black 20%, transparent 80%);
  }
  .px-orb { position: absolute; border-radius: 50%; filter: blur(80px); animation: px-float 8s ease-in-out infinite; }
  .px-orb-1 { width: 500px; height: 500px; background: rgba(92,0,211,0.15); top: -100px; right: -100px; }
  .px-orb-2 { width: 300px; height: 300px; background: rgba(240,192,48,0.06); bottom: 0; left: 10%; animation-delay: -3s; }
  @keyframes px-float { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-30px) scale(1.05)} }

  .px-hero-content { position: relative; z-index: 2; max-width: 760px; }
  .px-hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--surface); border: 1px solid var(--border);
    padding: 6px 16px; border-radius: 100px; font-size: 12px; font-weight: 500;
    color: var(--text-muted); letter-spacing: 0.06em; text-transform: uppercase;
    margin-bottom: 28px; animation: px-fadeUp 0.8s ease both;
  }
  .px-hero-badge .dot {
    width: 6px; height: 6px; background: var(--accent);
    border-radius: 50%; animation: px-pulse 2s ease infinite;
  }
  @keyframes px-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
  .px-hero-title {
    font-family: 'Syne', sans-serif; font-size: clamp(52px, 8vw, 88px);
    font-weight: 800; line-height: 1.0; letter-spacing: -0.03em;
    margin-bottom: 28px; animation: px-fadeUp 0.8s ease 0.1s both;
  }
  .px-hero-title .line2 { color: var(--primary-light); }
  .px-hero-title .line3 { -webkit-text-stroke: 1.5px var(--text-muted); color: transparent; }
  .px-hero-sub {
    font-size: 17px; color: var(--text-muted); line-height: 1.7;
    max-width: 520px; margin-bottom: 44px;
    animation: px-fadeUp 0.8s ease 0.2s both; font-weight: 300;
  }
  .px-hero-actions { display: flex; gap: 16px; flex-wrap: wrap; animation: px-fadeUp 0.8s ease 0.3s both; }
  @keyframes px-fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

  .px-hero-stats {
    display: flex; gap: 48px; margin-top: 64px;
    padding-top: 48px; border-top: 1px solid var(--border);
    animation: px-fadeUp 0.8s ease 0.4s both; flex-wrap: wrap;
  }
  .px-stat-num { font-family: 'Syne', sans-serif; font-size: 36px; font-weight: 800; line-height: 1; margin-bottom: 4px; }
  .px-stat-num span { color: var(--primary-light); }
  .px-stat-label { font-size: 13px; color: var(--text-muted); font-weight: 400; }

  /* BUTTONS */
  .px-btn-primary {
    display: inline-flex; align-items: center; gap: 10px;
    background: linear-gradient(135deg, var(--primary), var(--primary-light));
    color: #fff; padding: 16px 34px; border-radius: 100px;
    font-size: 15px; font-weight: 600; text-decoration: none; border: none; cursor: pointer;
    box-shadow: 0 8px 40px rgba(92,0,211,0.35);
    transition: transform var(--transition), box-shadow var(--transition);
  }
  .px-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 16px 50px rgba(92,0,211,0.5); }
  .px-btn-secondary {
    display: inline-flex; align-items: center; gap: 10px;
    background: var(--surface); border: 1px solid var(--border);
    color: var(--text); padding: 16px 34px; border-radius: 100px;
    font-size: 15px; font-weight: 500; text-decoration: none; cursor: pointer;
    transition: background var(--transition), border-color var(--transition), transform var(--transition);
  }
  .px-btn-secondary:hover { background: var(--surface2); border-color: rgba(255,255,255,0.15); transform: translateY(-2px); }

  /* MARQUEE */
  .px-marquee-wrapper {
    overflow: hidden; padding: 20px 0;
    border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
    background: var(--bg2);
  }
  .px-marquee-track {
    display: flex; gap: 48px;
    animation: px-marquee 20s linear infinite; width: max-content;
  }
  .px-marquee-item {
    font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-dim);
    display: flex; align-items: center; gap: 12px; white-space: nowrap;
  }
  .px-marquee-item .sep { color: var(--primary-light); font-size: 18px; }
  @keyframes px-marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }

  /* SECTIONS */
  .px-section { padding: 100px 48px; }
  .px-section-dark { background: var(--bg2); }
  .px-section-label {
    font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--primary-light); margin-bottom: 16px; display: flex; align-items: center; gap: 10px;
  }
  .px-section-label::before { content:''; width: 28px; height: 1.5px; background: var(--primary-light); }
  .px-section-title {
    font-family: 'Syne', sans-serif; font-size: clamp(36px, 5vw, 54px);
    font-weight: 800; line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 20px;
  }
  .px-section-sub { font-size: 16px; color: var(--text-muted); max-width: 500px; line-height: 1.7; font-weight: 300; }

  /* SERVICES */
  .px-services-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 60px; flex-wrap: wrap; gap: 24px; }
  .px-services-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 2px; background: var(--border); border: 1px solid var(--border);
    border-radius: var(--radius); overflow: hidden;
  }
  .px-service-card {
    background: var(--bg2); padding: 48px 36px; position: relative;
    overflow: hidden; transition: background var(--transition); cursor: default;
  }
  .px-service-card::before {
    content:''; position:absolute; inset:0;
    background: linear-gradient(135deg, var(--primary-glow), transparent);
    opacity: 0; transition: opacity var(--transition);
  }
  .px-service-card:hover { background: var(--bg3); }
  .px-service-card:hover::before { opacity: 1; }
  .px-service-icon {
    width: 56px; height: 56px; background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; display: flex; align-items: center; justify-content: center;
    margin-bottom: 28px; font-size: 26px;
    transition: background var(--transition), border-color var(--transition), transform var(--transition);
  }
  .px-service-card:hover .px-service-icon {
    background: linear-gradient(135deg, var(--primary), var(--primary-light));
    border-color: transparent; transform: rotate(-5deg) scale(1.1);
  }
  .px-service-num { position: absolute; top: 36px; right: 36px; font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; color: var(--text-dim); }
  .px-service-name { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; margin-bottom: 12px; }
  .px-service-desc { font-size: 14px; color: var(--text-muted); line-height: 1.7; font-weight: 300; }

  /* WHY US */
  .px-why-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
  .px-why-card-stack { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .px-why-mini-card {
    background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 28px 24px; transition: transform var(--transition), border-color var(--transition);
  }
  .px-why-mini-card:hover { transform: translateY(-4px); border-color: rgba(124,34,245,0.3); }
  .px-why-mini-card.tall { grid-row: span 2; display: flex; flex-direction: column; justify-content: center; }
  .px-why-mini-icon { font-size: 28px; margin-bottom: 14px; }
  .px-why-mini-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; margin-bottom: 8px; }
  .px-why-mini-desc { font-size: 13px; color: var(--text-muted); line-height: 1.6; font-weight: 300; }
  .px-why-points { display: flex; flex-direction: column; gap: 32px; }
  .px-why-point { display: flex; gap: 20px; align-items: flex-start; padding-bottom: 32px; border-bottom: 1px solid var(--border); }
  .px-why-point:last-child { border-bottom: none; padding-bottom: 0; }
  .px-why-point-icon {
    width: 44px; height: 44px; flex-shrink: 0; background: var(--surface); border: 1px solid var(--border);
    border-radius: 12px; display: flex; align-items: center; justify-content: center;
    font-size: 20px; transition: background var(--transition);
  }
  .px-why-point:hover .px-why-point-icon { background: linear-gradient(135deg, var(--primary), var(--primary-light)); }
  .px-why-point-title { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; margin-bottom: 6px; }
  .px-why-point-desc { font-size: 14px; color: var(--text-muted); line-height: 1.6; font-weight: 300; }

  /* PORTFOLIO */
  .px-portfolio-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 52px; flex-wrap: wrap; gap: 24px; }
  .px-portfolio-grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: auto; gap: 20px; }
  .px-portfolio-item {
    background: var(--bg3); border: 1px solid var(--border); border-radius: var(--radius);
    overflow: hidden; position: relative; cursor: pointer;
    transition: transform var(--transition), border-color var(--transition);
  }
  .px-portfolio-item:hover { transform: translateY(-6px); border-color: rgba(124,34,245,0.4); }
  .px-portfolio-item.large { grid-column: span 2; }
  .px-portfolio-thumb {
    width: 100%; aspect-ratio: 16/9; background: var(--bg3);
    display: flex; align-items: center; justify-content: center; font-size: 48px;
    overflow: hidden; position: relative;
  }
  .px-portfolio-thumb.square { aspect-ratio: 1; }
  .px-portfolio-thumb::after { content:''; position:absolute; inset:0; background: linear-gradient(to bottom, transparent 40%, var(--bg3)); }
  .px-portfolio-thumb-bg { position: absolute; inset:0; display: flex; align-items: center; justify-content: center; font-size: 80px; opacity: 0.08; filter: blur(2px); }
  .px-portfolio-item-info { padding: 24px; }
  .px-portfolio-tag { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--primary-light); margin-bottom: 8px; }
  .px-portfolio-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; }

  /* TESTIMONIALS */
  .px-testimonials-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 60px; }
  .px-testimonial-card {
    background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 40px; position: relative;
    transition: border-color var(--transition), transform var(--transition);
  }
  .px-testimonial-card:hover { border-color: rgba(124,34,245,0.3); transform: translateY(-4px); }
  .px-testimonial-card.featured { background: linear-gradient(135deg, rgba(92,0,211,0.15), rgba(124,34,245,0.05)); border-color: rgba(124,34,245,0.25); }
  .px-testimonial-stars { color: var(--accent); font-size: 14px; margin-bottom: 20px; letter-spacing: 3px; }
  .px-testimonial-text { font-size: 16px; line-height: 1.75; color: var(--text); font-weight: 300; font-style: italic; margin-bottom: 28px; }
  .px-testimonial-author { display: flex; align-items: center; gap: 14px; }
  .px-testimonial-avatar {
    width: 44px; height: 44px; border-radius: 50%;
    background: linear-gradient(135deg, var(--primary), var(--primary-light));
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 16px; color: #fff; flex-shrink: 0;
  }
  .px-testimonial-name { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; margin-bottom: 2px; }
  .px-testimonial-role { font-size: 13px; color: var(--text-muted); }

  /* PRICING */
  .px-pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 60px; align-items: start; }
  .px-pricing-card {
    background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 40px 36px; position: relative;
    transition: transform var(--transition), border-color var(--transition);
  }
  .px-pricing-card:hover { transform: translateY(-6px); }
  .px-pricing-card.popular {
    background: linear-gradient(170deg, rgba(92,0,211,0.2), rgba(124,34,245,0.08));
    border-color: rgba(124,34,245,0.5); transform: translateY(-8px);
  }
  .px-pricing-card.popular:hover { transform: translateY(-14px); }
  .px-popular-badge {
    position: absolute; top: -14px; left: 50%; transform: translateX(-50%);
    background: linear-gradient(135deg, var(--primary), var(--primary-light));
    color: #fff; font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; padding: 5px 18px; border-radius: 100px; white-space: nowrap;
  }
  .px-pricing-name { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 20px; }
  .px-pricing-amount { display: flex; align-items: baseline; gap: 4px; margin-bottom: 6px; }
  .px-pricing-currency { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; color: var(--text-muted); margin-top: 6px; }
  .px-pricing-number { font-family: 'Syne', sans-serif; font-size: 56px; font-weight: 800; line-height: 1; }
  .px-pricing-desc { font-size: 14px; color: var(--text-muted); margin-bottom: 32px; padding-bottom: 32px; border-bottom: 1px solid var(--border); line-height: 1.6; font-weight: 300; }
  .px-pricing-features { list-style: none; display: flex; flex-direction: column; gap: 14px; margin-bottom: 36px; }
  .px-pricing-features li { display: flex; align-items: center; gap: 12px; font-size: 14px; }
  .px-check { width: 20px; height: 20px; background: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; flex-shrink: 0; }
  .px-cross { width: 20px; height: 20px; background: var(--surface); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; flex-shrink: 0; color: var(--text-dim); }
  .px-dimmed { color: var(--text-dim); }
  .px-btn-pricing {
    display: block; width: 100%; padding: 14px; text-align: center; border-radius: 100px;
    font-size: 14px; font-weight: 600; text-decoration: none; cursor: pointer; border: none;
    transition: transform var(--transition), box-shadow var(--transition);
    font-family: 'DM Sans', sans-serif;
  }
  .px-btn-pricing-outline { background: transparent; border: 1.5px solid var(--border); color: var(--text); }
  .px-btn-pricing-outline:hover { border-color: var(--primary-light); color: var(--primary-light); transform: translateY(-2px); }
  .px-btn-pricing-solid { background: linear-gradient(135deg, var(--primary), var(--primary-light)); color: #fff; box-shadow: 0 8px 32px rgba(92,0,211,0.35); }
  .px-btn-pricing-solid:hover { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(92,0,211,0.5); }

  /* CONTACT */
  .px-contact-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 80px; align-items: start; }
  .px-contact-info-title { font-family: 'Syne', sans-serif; font-size: clamp(36px, 5vw, 52px); font-weight: 800; line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 20px; }
  .px-contact-info-title span { color: var(--primary-light); }
  .px-contact-info-sub { font-size: 16px; color: var(--text-muted); line-height: 1.7; margin-bottom: 48px; font-weight: 300; }
  .px-contact-channels { display: flex; flex-direction: column; gap: 16px; }
  .px-contact-channel {
    display: flex; align-items: center; gap: 16px; padding: 20px 24px;
    background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius-sm);
    text-decoration: none; color: var(--text);
    transition: border-color var(--transition), transform var(--transition), background var(--transition);
  }
  .px-contact-channel:hover { border-color: rgba(124,34,245,0.4); transform: translateX(6px); background: var(--bg3); }
  .px-channel-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
  .px-channel-icon.mail { background: rgba(124,34,245,0.15); }
  .px-channel-icon.whatsapp { background: rgba(37,211,102,0.15); }
  .px-channel-icon.instagram { background: rgba(225,48,108,0.15); }
  .px-channel-icon.linkedin { background: rgba(10,102,194,0.15); }
  .px-channel-label { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 2px; }
  .px-channel-value { font-size: 15px; font-weight: 500; }

  .px-contact-form-wrapper { background: var(--bg2); border: 1px solid var(--border); border-radius: 24px; padding: 48px 44px; }
  .px-form-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; margin-bottom: 32px; }
  .px-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  .px-form-group { margin-bottom: 16px; }
  .px-form-label { display: block; font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px; }
  .px-form-input, .px-form-select, .px-form-textarea {
    width: 100%; background: var(--bg); border: 1.5px solid var(--border); border-radius: 12px;
    padding: 14px 18px; font-family: 'DM Sans', sans-serif; font-size: 15px; color: var(--text);
    transition: border-color var(--transition), box-shadow var(--transition); outline: none; appearance: none;
  }
  .px-form-input::placeholder, .px-form-textarea::placeholder { color: var(--text-dim); }
  .px-form-input:focus, .px-form-select:focus, .px-form-textarea:focus { border-color: var(--primary-light); box-shadow: 0 0 0 3px rgba(124,34,245,0.12); }
  .px-form-select {
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238b80a8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 18px center; padding-right: 44px;
  }
  .px-form-select option { background: #1a1230; color: var(--text); }
  .px-form-textarea { resize: vertical; min-height: 120px; }
  .px-btn-submit {
    width: 100%; padding: 17px;
    background: linear-gradient(135deg, var(--primary), var(--primary-light));
    color: #fff; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600;
    border: none; border-radius: 100px; cursor: pointer;
    box-shadow: 0 8px 32px rgba(92,0,211,0.35);
    transition: transform var(--transition), box-shadow var(--transition);
    display: flex; align-items: center; justify-content: center; gap: 10px;
  }
  .px-btn-submit:hover { transform: translateY(-2px); box-shadow: 0 16px 44px rgba(92,0,211,0.5); }
  .px-btn-submit:active { transform: translateY(0); }
  .px-success-toast {
    display: none; background: rgba(37,211,102,0.1); border: 1px solid rgba(37,211,102,0.3);
    color: #25d366; border-radius: 12px; padding: 14px 20px; font-size: 14px; font-weight: 500;
    margin-top: 16px; align-items: center; gap: 10px;
  }
  .px-success-toast.show { display: flex; }

  /* FOOTER */
  .px-footer { background: var(--bg2); border-top: 1px solid var(--border); padding: 60px 48px 40px; }
  .px-footer-top { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 48px; margin-bottom: 40px; border-bottom: 1px solid var(--border); flex-wrap: wrap; gap: 40px; }
  .px-footer-brand { max-width: 320px; }
  .px-footer-tagline { font-size: 14px; color: var(--text-muted); line-height: 1.7; margin-top: 16px; font-weight: 300; }
  .px-footer-links-group h4 { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 20px; }
  .px-footer-links-group ul { list-style: none; display: flex; flex-direction: column; gap: 12px; }
  .px-footer-links-group ul a { color: var(--text-dim); text-decoration: none; font-size: 14px; transition: color var(--transition); }
  .px-footer-links-group ul a:hover { color: var(--text); }
  .px-footer-bottom { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
  .px-footer-copy { font-size: 13px; color: var(--text-dim); }
  .px-footer-socials { display: flex; gap: 12px; }
  .px-social-btn {
    width: 38px; height: 38px; border-radius: 10px; background: var(--surface); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center; text-decoration: none; font-size: 16px;
    transition: background var(--transition), border-color var(--transition), transform var(--transition);
  }
  .px-social-btn:hover { background: var(--surface2); border-color: rgba(255,255,255,0.15); transform: translateY(-3px); }

  /* WHATSAPP FLOAT */
  .px-whatsapp-float {
    position: fixed; bottom: 28px; right: 28px;
    width: 56px; height: 56px; background: #25d366;
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 26px; text-decoration: none; z-index: 500;
    box-shadow: 0 8px 32px rgba(37,211,102,0.4);
    transition: transform var(--transition), box-shadow var(--transition);
    animation: px-bounceIn 0.6s ease 1s both;
  }
  .px-whatsapp-float:hover { transform: scale(1.1) translateY(-3px); box-shadow: 0 14px 40px rgba(37,211,102,0.6); }
  @keyframes px-bounceIn { from{opacity:0;transform:scale(0.5)} 80%{transform:scale(1.05)} to{opacity:1;transform:scale(1)} }

  /* REVEAL */
  .px-reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .px-reveal.visible { opacity: 1; transform: translateY(0); }
  .px-reveal-d1 { transition-delay: 0.1s; }
  .px-reveal-d2 { transition-delay: 0.2s; }
  .px-reveal-d3 { transition-delay: 0.3s; }

  /* RESPONSIVE */
  @media(max-width: 900px) {
    .px-nav { padding: 18px 24px; }
    .px-nav.scrolled { padding: 14px 24px; }
    .px-nav-links { display: none; }
    .px-hamburger { display: flex; }
    .px-hero { padding: 100px 24px 60px; }
    .px-hero-stats { gap: 28px; }
    .px-section { padding: 70px 24px; }
    .px-why-grid { grid-template-columns: 1fr; }
    .px-portfolio-grid { grid-template-columns: 1fr; }
    .px-portfolio-item.large { grid-column: span 1; }
    .px-testimonials-grid { grid-template-columns: 1fr; }
    .px-pricing-grid { grid-template-columns: 1fr; }
    .px-pricing-card.popular { transform: none; }
    .px-contact-grid { grid-template-columns: 1fr; gap: 48px; }
    .px-form-row { grid-template-columns: 1fr; }
    .px-footer { padding: 48px 24px 32px; }
    .px-footer-top { flex-direction: column; }
    .px-footer-bottom { flex-direction: column; text-align: center; }
    .px-services-grid { grid-template-columns: 1fr; }
  }
`;

const marqueeItems = ["Website Design","Canva Graphics","Blog Writing","Social Media Content","Brand Identity","SEO Optimization","Landing Pages"];

export default function PixoraStudio() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const [toast, setToast] = useState(false);
  const ringTimeout = useRef(null);

  // Cursor
  useEffect(() => {
    const move = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      clearTimeout(ringTimeout.current);
      ringTimeout.current = setTimeout(() => setRingPos({ x: e.clientX, y: e.clientY }), 60);
    };
    document.addEventListener("mousemove", move);
    return () => document.removeEventListener("mousemove", move);
  }, []);

  // Scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const els = document.querySelectorAll(".px-reveal");
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const hoverOn = () => setHovered(true);
  const hoverOff = () => setHovered(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.formName.value;
    const email = e.target.formEmail.value;
    const phone = e.target.formPhone.value || "Not provided";
    const service = e.target.formService.value;
    const message = e.target.formMessage.value;
    const subject = encodeURIComponent(`[Pixora Studio] New Inquiry - ${service}`);
    const body = encodeURIComponent(`Hi Pixora Studio Team,\n\nName: ${name}\nEmail: ${email}\nPhone/WhatsApp: ${phone}\nService Required: ${service}\n\nMessage:\n${message}\n\n---\nSent from Pixora Studio Website`);
    window.location.href = `mailto:pixorastudio7@gmail.com?subject=${subject}&body=${body}`;
    setTimeout(() => { setToast(true); setTimeout(() => setToast(false), 5000); }, 500);
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileNavOpen(false);
  };

  const doubled = [...marqueeItems, ...marqueeItems];

  return (
    <>
      <style>{STYLES}</style>

      {/* Cursor */}
      <div className={`px-cursor${hovered ? " hovered" : ""}`} style={{ left: cursorPos.x, top: cursorPos.y }} />
      <div className={`px-cursor-ring${hovered ? " hovered" : ""}`} style={{ left: ringPos.x, top: ringPos.y }} />
      <div className="px-noise-overlay" />

      {/* WhatsApp Float */}
      <a className="px-whatsapp-float" href="https://wa.me/919834823478?text=Hi%20Pixora%20Studio!%20I%20came%20across%20your%20website%20and%20I%27m%20interested%20in%20your%20services.%20Can%20we%20talk%3F" target="_blank" rel="noreferrer" title="Chat on WhatsApp" onMouseEnter={hoverOn} onMouseLeave={hoverOff}>💬</a>

      {/* Mobile Nav */}
      <div className={`px-mobile-nav${mobileNavOpen ? " open" : ""}`}>
        <button className="px-mobile-nav-close" onClick={() => setMobileNavOpen(false)}>✕</button>
        {["services","work","pricing","contact"].map(id => (
          <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollTo(id); }}>{id.charAt(0).toUpperCase()+id.slice(1)}</a>
        ))}
      </div>

      {/* NAVBAR */}
      <nav className={`px-nav${scrolled ? " scrolled" : ""}`} id="navbar">
        <button className="px-nav-logo" type="button" onClick={() => { window.scrollTo({top:0,behavior:"smooth"}); }} onMouseEnter={hoverOn} onMouseLeave={hoverOff} style={{background:'none',border:'none',padding:0,cursor:'pointer',textDecoration:'none'}}>
          <div className="px-logo-mark">P</div>
          <span className="px-logo-text">PIXORA <span>STUDIO</span></span>
        </button>
        <div className="px-nav-links">
          {["services","work","pricing"].map(id => (
            <button key={id} type="button" className="px-nav-link" onClick={() => { scrollTo(id); }} onMouseEnter={hoverOn} onMouseLeave={hoverOff} style={{background:'none',border:'none',padding:0,cursor:'pointer',textDecoration:'none',color:'inherit'}}>
              {id.charAt(0).toUpperCase()+id.slice(1)}
            </button>
          ))}
          <a href="#contact" className="px-nav-cta" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>Let's Talk →</a>
        </div>
        <button className="px-hamburger" onClick={() => setMobileNavOpen(true)} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
          <span/><span/><span/>
        </button>
      </nav>

      {/* HERO */}
      <section className="px-hero">
        <div className="px-hero-bg" />
        <div className="px-hero-grid" />
        <div className="px-orb px-orb-1" />
        <div className="px-orb px-orb-2" />
        <div className="px-hero-content">
          <div className="px-hero-badge"><div className="dot" />Now Accepting New Clients — 2026</div>
          <h1 className="px-hero-title">
            We Build<br/>
            <span className="line2">Digital</span><br/>
            <span className="line3">Presence.</span>
          </h1>
          <p className="px-hero-sub">High-impact websites, graphics, content & social media — crafted by a next-gen creative studio. Student-founded. Startup-driven.</p>
          <div className="px-hero-actions">
            <a href="#contact" className="px-btn-primary" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>Get a Free Quote <span>→</span></a>
            <a href="#work" className="px-btn-secondary" onClick={(e) => { e.preventDefault(); scrollTo("work"); }} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>View Our Work</a>
          </div>
          <div className="px-hero-stats">
            {[["50","+ ","Projects Delivered"],["100","% ","Client Satisfaction"],["24","h ","Response Time"]].map(([n,s,l]) => (
              <div key={l}><div className="px-stat-num">{n}<span>{s}</span></div><div className="px-stat-label">{l}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="px-marquee-wrapper">
        <div className="px-marquee-track">
          {doubled.map((item, i) => (
            <div className="px-marquee-item" key={i}>{item} <span className="sep">✦</span></div>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section className="px-section px-section-dark" id="services">
        <div className="px-services-header">
          <div>
            <div className="px-section-label px-reveal">What We Do</div>
            <h2 className="px-section-title px-reveal">Expertise for the<br/>Modern Web.</h2>
          </div>
          <p className="px-section-sub px-reveal">From pixels to prose — we handle every layer of your digital presence.</p>
        </div>
        <div className="px-services-grid px-reveal">
          {[
            { num:"01", icon:"🌐", name:"Website Design", desc:"Responsive, fast-loading, and visually stunning websites built for conversion and credibility. From landing pages to full multi-page sites." },
            { num:"02", icon:"🎨", name:"Canva Graphics", desc:"Professional brand assets, social media posts, pitch decks, and presentation templates — designed to make you stand out instantly." },
            { num:"03", icon:"✍️", name:"Blog Writing", desc:"SEO-optimized, engaging articles that build authority, drive organic traffic, and tell your brand story in a way that resonates." },
            { num:"04", icon:"📱", name:"Social Media", desc:"Strategic content creation, captions, and posting plans designed to grow your audience and drive real engagement across platforms." },
          ].map(s => (
            <div className="px-service-card" key={s.num} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
              <div className="px-service-num">{s.num}</div>
              <div className="px-service-icon">{s.icon}</div>
              <h3 className="px-service-name">{s.name}</h3>
              <p className="px-service-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="px-section">
        <div className="px-why-grid">
          <div className="px-why-visual px-reveal">
            <div className="px-why-card-stack">
              {[
                { icon:"💰", title:"Affordable", desc:"Premium quality without the agency price tag.", tall:false },
                { icon:"⚡", title:"Fast Delivery", desc:"We work at the speed of internet culture. Quick turnarounds, zero compromise on quality.", tall:true },
                { icon:"✅", title:"Quality Work", desc:"Rigorous attention to detail on every project.", tall:false },
                { icon:"🎓", title:"Student-Built", desc:"Young, hungry, and passionate creators.", tall:false },
              ].map(c => (
                <div className={`px-why-mini-card${c.tall ? " tall" : ""}`} key={c.title} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
                  <div className="px-why-mini-icon">{c.icon}</div>
                  <div className="px-why-mini-title">{c.title}</div>
                  <div className="px-why-mini-desc">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="px-section-label px-reveal">Our Advantage</div>
            <h2 className="px-section-title px-reveal">Fresh Perspectives,<br/>Real Results.</h2>
            <div className="px-why-points">
              {[
                { icon:"🚀", title:"Startup-Friendly Mindset", desc:"We understand what early-stage businesses need. We've been there. No corporate fluff — just results that matter for growth.", d:"" },
                { icon:"🤝", title:"Personal & Responsive", desc:"Direct communication with the people actually doing the work. No account managers, no ticketing systems. WhatsApp-first support.", d:"px-reveal-d1" },
                { icon:"🔁", title:"Unlimited Revisions", desc:"We don't stop until you love it. Every project includes revisions until the result matches your vision — guaranteed.", d:"px-reveal-d2" },
              ].map(p => (
                <div className={`px-why-point px-reveal ${p.d}`} key={p.title} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
                  <div className="px-why-point-icon">{p.icon}</div>
                  <div>
                    <div className="px-why-point-title">{p.title}</div>
                    <div className="px-why-point-desc">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="px-section px-section-dark" id="work">
        <div className="px-portfolio-header">
          <div>
            <div className="px-section-label px-reveal">Portfolio</div>
            <h2 className="px-section-title px-reveal">Recent Projects.</h2>
          </div>
          <a href="#contact" className="px-btn-secondary px-reveal" style={{fontSize:"14px",padding:"12px 24px"}} onClick={(e)=>{e.preventDefault();scrollTo("contact")}} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>Start Your Project →</a>
        </div>
        <div className="px-portfolio-grid">
          {[
            { large:true, icon:"🌐", tag:"Web Design", title:"Eco-Stream Startup — Full Landing Page", square:false, image:"https://via.placeholder.com/400x300/1a472a/ffffff?text=Eco-Stream" },
            { large:false, icon:"🎨", tag:"Canva Graphics", title:"Vibe Coffee Brand Kit", square:true, image:"https://via.placeholder.com/300x300/8B4513/ffffff?text=Vibe+Coffee" },
            { large:false, icon:"📱", tag:"Social Media", title:"FitLife Instagram Revamp", square:true, image:"https://via.placeholder.com/300x300/FF6B6B/ffffff?text=FitLife" },
            { large:false, icon:"✍️", tag:"Blog Writing", title:"Journal for GenZ — 20-Article Series", square:false, image:"https://via.placeholder.com/400x200/4A90E2/ffffff?text=Journal+GenZ" },
            { large:false, icon:"🚀", tag:"E-Commerce", title:"TechGear Pro — Product Launch Campaign", square:true, image:"https://via.placeholder.com/300x300/2ECC71/ffffff?text=TechGear" },
          ].map((p,i) => (
            <div className={`px-portfolio-item${p.large?" large":""} px-reveal${i===1?" px-reveal-d1":i===2?" px-reveal-d1":i===3?" px-reveal-d2":""}`} key={i} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
              <div className={`px-portfolio-thumb${p.square?" square":""}`}>
                {p.image ? (
                  <img src={p.image} alt={p.title} style={{width:"100%", height:"100%", objectFit:"cover"}} />
                ) : (
                  <>
                    <div className="px-portfolio-thumb-bg">{p.icon}</div>
                    <div style={{position:"relative",zIndex:1,fontSize:"56px",filter:"drop-shadow(0 0 30px rgba(92,0,211,0.5))"}}>{p.icon}</div>
                  </>
                )}
              </div>
              <div className="px-portfolio-item-info">
                <div className="px-portfolio-tag">{p.tag}</div>
                <div className="px-portfolio-title">{p.title}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-section">
        <div style={{maxWidth:"600px"}}>
          <div className="px-section-label px-reveal">Testimonials</div>
          <h2 className="px-section-title px-reveal">Trusted by Founders & Creators.</h2>
        </div>
        <div className="px-testimonials-grid">
          {[
            { featured:true, initials:"JM", name:"Jordan Miller", role:"CEO, NexaGrowth", text:`"Pixora Studio delivered a website that outshines agencies charging triple the price. Their team is professional, creative, and incredibly responsive. Best investment for our startup."`, d:"" },
            { featured:false, initials:"SC", name:"Sarah Chen", role:"Founder, Bloom Agency", text:`"The social media content they produced completely revitalized our brand. Engagement jumped 40% in the first month. These guys are the real deal and incredibly easy to work with."`, d:"px-reveal-d1" },
            { featured:false, initials:"RK", name:"Rahul Kapoor", role:"Co-founder, LaunchPad India", text:`"Got my entire Canva brand kit done in 48 hours. The quality was stunning — logos, social templates, pitch deck — all perfectly on-brand. Highly recommend Pixora Studio!"`, d:"px-reveal-d2" },
            { featured:false, initials:"AM", name:"Aisha Mehta", role:"Blogger & Creator", text:`"Their blog content drove real organic traffic for us. Within 2 months of working with them, we saw a 60% increase in website visits. They truly understand SEO and storytelling."`, d:"px-reveal-d3" },
          ].map(t => (
            <div className={`px-testimonial-card${t.featured?" featured":""} px-reveal ${t.d}`} key={t.name} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
              <div className="px-testimonial-stars">★★★★★</div>
              <p className="px-testimonial-text">{t.text}</p>
              <div className="px-testimonial-author">
                <div className="px-testimonial-avatar">{t.initials}</div>
                <div>
                  <div className="px-testimonial-name">{t.name}</div>
                  <div className="px-testimonial-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="px-section px-section-dark" id="pricing">
        <div style={{textAlign:"center",maxWidth:"560px",margin:"0 auto"}}>
          <div className="px-section-label px-reveal" style={{justifyContent:"center"}}>Investment</div>
          <h2 className="px-section-title px-reveal">Simple, Honest Pricing.</h2>
          <p className="px-section-sub px-reveal" style={{margin:"0 auto"}}>No hidden charges. No confusing packages. Just clear pricing for real value.</p>
        </div>
        <div className="px-pricing-grid">
          {[
            {
              name:"Basic", price:"999", popular:false,
              desc:"Perfect for single-task needs or businesses just getting started online.",
              features:[
                {ok:true,text:"5 Canva Graphics"},{ok:true,text:"2 Blog Posts"},{ok:true,text:"Email Support"},
                {ok:true,text:"3-Day Delivery"},{ok:false,text:"Custom Web Design"},{ok:false,text:"Social Media Strategy"},
              ],
              btnClass:"px-btn-pricing-outline", btnText:"Get Started",
              href:"#contact", wa:false, d:""
            },
            {
              name:"Standard", price:"4,999", popular:true,
              desc:"The complete package for growing businesses and serious creators.",
              features:[
                {ok:true,text:"15 Social Media Posts"},{ok:true,text:"Landing Page Design"},{ok:true,text:"5 Blog Posts"},
                {ok:true,text:"Priority WhatsApp Support"},{ok:true,text:"Brand Color Palette"},{ok:true,text:"5-Day Delivery"},
              ],
              btnClass:"px-btn-pricing-solid", btnText:"Select Plan →",
              href:"https://wa.me/919834823478?text=Hi!%20I%27m%20interested%20in%20the%20Standard%20Plan%20at%20Pixora%20Studio.%20Can%20we%20discuss?",
              wa:true, d:"px-reveal-d1"
            },
            {
              name:"Premium", price:"9,999", popular:false,
              desc:"Full digital ecosystem for established brands wanting a complete refresh.",
              features:[
                {ok:true,text:"5-Page Dynamic Website"},{ok:true,text:"Full Brand Kit"},{ok:true,text:"Monthly Content Strategy"},
                {ok:true,text:"30 Social Media Posts"},{ok:true,text:"10 Blog Posts"},{ok:true,text:"24/7 WhatsApp Support"},
              ],
              btnClass:"px-btn-pricing-outline", btnText:"Contact Us",
              href:"#contact", wa:false, d:"px-reveal-d2"
            },
          ].map(plan => (
            <div className={`px-pricing-card${plan.popular?" popular":""} px-reveal ${plan.d}`} key={plan.name}>
              {plan.popular && <div className="px-popular-badge">✦ Most Popular</div>}
              <div className="px-pricing-name">{plan.name}</div>
              <div className="px-pricing-amount">
                <span className="px-pricing-currency">₹</span>
                <span className="px-pricing-number">{plan.price}</span>
              </div>
              <p className="px-pricing-desc">{plan.desc}</p>
              <ul className="px-pricing-features">
                {plan.features.map(f => (
                  <li key={f.text} className={!f.ok?"px-dimmed":""}>
                    {f.ok ? <span className="px-check">✓</span> : <span className="px-cross">✕</span>}
                    {f.text}
                  </li>
                ))}
              </ul>
              <a
                className={`px-btn-pricing ${plan.btnClass}`}
                href={plan.href}
                target={plan.wa?"_blank":undefined}
                rel={plan.wa?"noreferrer":undefined}
                onClick={!plan.wa ? (e)=>{e.preventDefault();scrollTo("contact")} : undefined}
                onMouseEnter={hoverOn} onMouseLeave={hoverOff}
              >{plan.btnText}</a>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section className="px-section" id="contact">
        <div className="px-contact-grid">
          <div>
            <div className="px-section-label px-reveal">Get In Touch</div>
            <h2 className="px-contact-info-title px-reveal">Let's Create<br/><span>Something Iconic.</span></h2>
            <p className="px-contact-info-sub px-reveal">Ready to elevate your digital presence? Reach out — we respond within 24 hours and love talking about ideas.</p>
            <div className="px-contact-channels px-reveal">
              {[
                { cls:"mail", icon:"📧", label:"Email Us", value:"pixorastudio7@gmail.com", href:"mailto:pixorastudio7@gmail.com", target:undefined },
                { cls:"whatsapp", icon:"💬", label:"WhatsApp (Fastest)", value:"+91 98348 23478", href:"https://wa.me/919834823478?text=Hi%20Pixora%20Studio!%20I%27m%20interested%20in%20your%20services.", target:"_blank" },
                { cls:"instagram", icon:"📸", label:"Instagram", value:"@pixorastudio", href:"https://instagram.com/pixorastudio", target:"_blank" },
                { cls:"linkedin", icon:"💼", label:"LinkedIn", value:"Pixora Studio", href:"https://linkedin.com/company/pixorastudio", target:"_blank" },
              ].map(ch => (
                <a key={ch.cls} className="px-contact-channel" href={ch.href} target={ch.target} rel={ch.target?"noreferrer":undefined} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
                  <div className={`px-channel-icon ${ch.cls}`}>{ch.icon}</div>
                  <div>
                    <div className="px-channel-label">{ch.label}</div>
                    <div className="px-channel-value">{ch.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
          <div className="px-contact-form-wrapper px-reveal">
            <div className="px-form-title">Send Us a Message ✉️</div>
            <form onSubmit={handleSubmit}>
              <div className="px-form-row">
                <div className="px-form-group">
                  <label className="px-form-label">Your Name</label>
                  <input className="px-form-input" type="text" placeholder="Arjun Sharma" required name="formName" />
                </div>
                <div className="px-form-group">
                  <label className="px-form-label">Email Address</label>
                  <input className="px-form-input" type="email" placeholder="you@example.com" required name="formEmail" />
                </div>
              </div>
              <div className="px-form-group">
                <label className="px-form-label">Phone / WhatsApp</label>
                <input className="px-form-input" type="tel" placeholder="+91 98765 43210" name="formPhone" />
              </div>
              <div className="px-form-group">
                <label className="px-form-label">Service Required</label>
                <select className="px-form-select" name="formService">
                  <option value="Website Design">Website Design</option>
                  <option value="Canva Graphics">Canva Graphics</option>
                  <option value="Blog Writing">Blog Writing</option>
                  <option value="Social Media Content">Social Media Content</option>
                  <option value="Full Package">Full Package (Best Value)</option>
                </select>
              </div>
              <div className="px-form-group">
                <label className="px-form-label">Your Message</label>
                <textarea className="px-form-textarea" placeholder="Tell us about your project, budget, and timeline..." name="formMessage" required />
              </div>
              <button type="submit" className="px-btn-submit" onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
                <span>Send via Email</span><span>→</span>
              </button>
              <div className={`px-success-toast${toast?" show":""}`}>
                ✅ Message sent! We'll get back to you within 24 hours.
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-footer">
        <div className="px-footer-top">
          <div className="px-footer-brand">
            <button className="px-nav-logo" type="button" onClick={()=>{window.scrollTo({top:0,behavior:"smooth"})}} style={{marginBottom:0,background:'none',border:'none',padding:0,cursor:'pointer',textDecoration:'none'}} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
              <div className="px-logo-mark">P</div>
              <span className="px-logo-text">PIXORA <span>STUDIO</span></span>
            </button>
            <p className="px-footer-tagline">A student-founded digital services agency building the next generation of online brands — one pixel at a time.</p>
          </div>
          {[
            { heading:"Services", links:[["#services","Website Design"],["#services","Canva Graphics"],["#services","Blog Writing"],["#services","Social Media"]] },
            { heading:"Company", links:[["#work","Portfolio"],["#pricing","Pricing"],["#contact","Contact"]] },
            { heading:"Connect", links:[["https://instagram.com/pixorastudio","Instagram"],["https://linkedin.com/company/pixorastudio","LinkedIn"],["https://wa.me/919834823478","WhatsApp"],["mailto:pixorastudio7@gmail.com","Email"]] },
          ].map(g => (
            <div className="px-footer-links-group" key={g.heading}>
              <h4>{g.heading}</h4>
              <ul>
                {g.links.map(([href,label]) => (
                  <li key={label}><a href={href} target={href.startsWith("http")?"_blank":undefined} rel={href.startsWith("http")?"noreferrer":undefined} onClick={href.startsWith("#")?(e)=>{e.preventDefault();scrollTo(href.slice(1))}:undefined} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>{label}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="px-footer-bottom">
          <p className="px-footer-copy"> 2025 Pixora Studio. Built with by a 2nd-year student who believed in the dream.</p>
          <div className="px-footer-socials">
            {[
              ["https://instagram.com/pixorastudio","📸","Instagram"],
              ["https://www.linkedin.com/in/abhishek-yadav-399b08385?utm_source=share_via&utm_content=profile&utm_medium=member_android","💼","LinkedIn"],
              ["https://wa.me/919834823478","💬","WhatsApp"],
              ["mailto:pixorastudio7@gmail.com","📧","Email"]
            ].map(([href,icon,title]) => (
              <a key={title} className="px-social-btn" href={href} target={href.startsWith("http")?"_blank":undefined} rel={href.startsWith("http")?"noreferrer":undefined} title={title} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>{icon}</a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
