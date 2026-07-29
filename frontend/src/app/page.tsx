"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Check,
  Compass,
  Heart,
  LockKeyhole,
  Menu,
  MessageCircle,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const journey = [
  ["01", "Create your profile", "Share the details and photo that feel most like you."],
  ["02", "Discover thoughtfully", "Meet one person at a time in a calm, focused view."],
  ["03", "Choose naturally", "Express interest privately. A match happens when it’s mutual."],
  ["04", "Start a conversation", "Move from an introduction to a comfortable, real-time chat."],
];

export default function LandingPage() {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useGSAP(() => {
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .from(".lp-nav", { y: -18, opacity: 0, duration: 0.55 })
        .from(".hero-eyebrow", { y: 14, opacity: 0, duration: 0.5 }, "-=.18")
        .from(".hero-line", { yPercent: 105, duration: 0.75, stagger: 0.09 }, "-=.28")
        .from(".hero-support", { y: 16, opacity: 0, duration: 0.55 }, "-=.35")
        .from(".hero-actions", { y: 14, opacity: 0, duration: 0.5 }, "-=.3")
        .from(".phone-main", { y: 44, opacity: 0, duration: 0.8 }, "-=.55")
        .from(".preview-float", { y: 20, opacity: 0, duration: 0.55, stagger: 0.1 }, "-=.4")
        .from(".phone-detail", { scaleX: 0, transformOrigin: "left", duration: 0.45 }, "-=.2");

      gsap.utils.toArray<HTMLElement>(".lp-reveal").forEach((element) => {
        gsap.from(element, {
          y: 28,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: element, start: "top 84%", once: true },
        });
      });

      gsap.from(".journey-step", {
        opacity: 0,
        x: -24,
        stagger: 0.12,
        duration: 0.62,
        ease: "power2.out",
        scrollTrigger: { trigger: ".journey-list", start: "top 78%", once: true },
      });

      gsap.from(".chat-bubble", {
        opacity: 0,
        y: 12,
        stagger: 0.18,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: { trigger: ".conversation-preview", start: "top 74%", once: true },
      });

      const pointerFine = window.matchMedia("(pointer: fine)").matches;
      if (pointerFine && preview.current) {
        const node = preview.current;
        const xTo = gsap.quickTo(node, "x", { duration: 0.45, ease: "power2.out" });
        const yTo = gsap.quickTo(node, "y", { duration: 0.45, ease: "power2.out" });
        const move = (event: PointerEvent) => {
          const box = node.getBoundingClientRect();
          xTo(((event.clientX - box.left) / box.width - 0.5) * 10);
          yTo(((event.clientY - box.top) / box.height - 0.5) * 8);
        };
        const leave = () => { xTo(0); yTo(0); };
        node.addEventListener("pointermove", move);
        node.addEventListener("pointerleave", leave);
        return () => {
          node.removeEventListener("pointermove", move);
          node.removeEventListener("pointerleave", leave);
        };
      }
    });

    media.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".hero-line, .hero-eyebrow, .hero-support, .hero-actions, .phone-main, .preview-float, .lp-reveal, .journey-step, .chat-bubble", {
        clearProps: "all",
        opacity: 1,
      });
    });

    return () => media.revert();
  }, { scope: root });

  return (
    <main ref={root} className="landing-shell">
      <header className={`lp-nav ${scrolled ? "lp-nav-scrolled" : ""}`}>
        <div className="lp-nav-inner">
          <Link href="/" aria-label="HeartLink home" className="lp-brand">
            <span className="lp-brand-mark"><Image src="/heartlink-icon.png" alt="" width={32} height={32} /></span>
            <span>HeartLink</span>
          </Link>
          <nav aria-label="Landing page" className="lp-nav-links">
            <a href="#product">Product</a>
            <a href="#how-it-works">How it works</a>
            <a href="#safety">Safety</a>
          </nav>
          <div className="lp-nav-actions">
            <Link href="/login" className="lp-sign-in">Sign in</Link>
            <Link href="/register" className="lp-nav-cta">Create account</Link>
          </div>
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className="lp-menu-button"
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
        <div id="mobile-menu" className={`lp-mobile-menu ${menuOpen ? "is-open" : ""}`}>
          <a href="#product" onClick={() => setMenuOpen(false)}>Product</a>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#safety" onClick={() => setMenuOpen(false)}>Safety</a>
          <Link href="/login">Sign in</Link>
          <Link href="/register" className="lp-mobile-cta">Create account</Link>
        </div>
      </header>

      <section className="lp-hero">
        <div className="hero-copy">
          <p className="hero-eyebrow">A mobile-first way to meet</p>
          <h1 aria-label="Meet people worth knowing.">
            <span className="hero-line-wrap"><span className="hero-line">Meet people</span></span>
            <span className="hero-line-wrap"><span className="hero-line hero-line-accent">worth knowing.</span></span>
          </h1>
          <p className="hero-support">
            Discover profiles, find mutual connections, and start conversations through a dating experience designed around mobile.
          </p>
          <div className="hero-actions">
            <Link href="/register" className="lp-primary-button">Create your profile <ArrowRight size={18} /></Link>
            <Link href="/login" className="lp-secondary-button">I have an account</Link>
          </div>
          <p className="mobile-note"><span /> A responsive web experience, at its best in your hand.</p>
        </div>

        <div ref={preview} className="hero-preview" aria-label="HeartLink mobile product preview">
          <div className="preview-float match-note">
            <div className="mini-avatars">
              <span>A</span><span>N</span>
            </div>
            <div><strong>It’s mutual</strong><small>Say hello when you’re ready</small></div>
          </div>
          <div className="phone-main">
            <div className="phone-speaker" />
            <div className="phone-topbar"><span>Discover</span><Compass size={18} /></div>
            <div className="phone-profile">
              <Image
                src="/images/heartlink-landing-editorial.png"
                alt="A warm profile moment in the HeartLink discovery experience"
                fill
                priority
                sizes="(max-width: 700px) 78vw, 340px"
                className="phone-profile-image"
              />
              <div className="phone-profile-shade" />
              <div className="photo-dots"><i className="active" /><i /><i /></div>
              <div className="phone-profile-copy">
                <small>Nearby</small>
                <h2>Avery, 26</h2>
                <p>Coffee walks, film photography, and finding the city’s best dumplings.</p>
              </div>
            </div>
            <div className="phone-controls">
              <button type="button" aria-label="Pass profile"><X size={21} /></button>
              <button type="button" aria-label="Like profile" className="phone-like"><Heart size={20} fill="currentColor" /></button>
            </div>
            <div className="phone-tabbar">
              <span className="selected"><Compass size={17} />Discover</span>
              <span><Heart size={17} />Matches</span>
              <span><MessageCircle size={17} />Chat</span>
              <span><UserRound size={17} />Profile</span>
            </div>
          </div>
          <div className="preview-float chat-note">
            <span className="chat-avatar">N</span>
            <div><strong>Noah</strong><small>That hidden café sounds perfect.</small></div>
            <span className="chat-time">now</span>
          </div>
        </div>
      </section>

      <section id="product" className="mobile-first-section">
        <div className="lp-section-copy lp-reveal">
          <p className="lp-kicker">Made for real moments</p>
          <h2>The best dating experience fits in one hand.</h2>
          <p>HeartLink is a mobile-first web experience shaped around natural gestures, quick decisions, and conversations you can return to whenever it feels right.</p>
          <ul className="benefit-list">
            <li><Check size={17} /> Focused, one-person-at-a-time discovery</li>
            <li><Check size={17} /> Controls placed comfortably within thumb reach</li>
            <li><Check size={17} /> Matches and messages kept easy to follow</li>
          </ul>
        </div>
        <div className="reach-preview lp-reveal">
          <div className="reach-screen">
            <div className="reach-photo">
              <Image src="/images/heartlink-date-journal-hero.png" alt="HeartLink profile discovery preview" fill sizes="360px" className="object-cover" />
              <span>Sofia, 28</span>
            </div>
            <div className="reach-zone">
              <span><X size={19} /></span>
              <span className="reach-like"><Heart size={19} fill="currentColor" /></span>
            </div>
            <div className="reach-tabs"><Compass /><Heart /><MessageCircle /><UserRound /></div>
          </div>
          <div className="reach-caption"><span>Comfort zone</span><p>Primary actions live where your thumb naturally rests.</p></div>
        </div>
      </section>

      <section id="how-it-works" className="journey-section">
        <div className="journey-heading lp-reveal">
          <p className="lp-kicker">From profile to conversation</p>
          <h2>One connected, human journey.</h2>
        </div>
        <div className="journey-list">
          {journey.map(([number, title, copy]) => (
            <article className="journey-step" key={number}>
              <span>{number}</span>
              <div><h3>{title}</h3><p>{copy}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="discovery-showcase">
        <div className="discovery-collage lp-reveal">
          <div className="portrait-panel">
            <Image src="/images/heartlink-register-editorial.png" alt="Profile discovery with room for personality" fill sizes="(max-width: 800px) 90vw, 520px" className="object-cover" />
            <div><small>A little about me</small><p>“The perfect Sunday starts with coffee and ends somewhere by the water.”</p></div>
          </div>
          <div className="bio-slip"><small>Avery’s profile</small><p>Photography · Coffee walks · Dumpling hunts</p></div>
        </div>
        <div className="lp-section-copy lp-reveal">
          <p className="lp-kicker">More than a first glance</p>
          <h2>Meet the person, not a pile of cards.</h2>
          <p>A clear photo, a short biography, and the details someone chooses to share create a fuller introduction—without visual clutter or invented compatibility scores.</p>
        </div>
      </section>

      <section className="conversation-section">
        <div className="lp-section-copy lp-reveal">
          <p className="lp-kicker">A match is only the beginning</p>
          <h2>Make room for a real conversation.</h2>
          <p>Mutual interest opens a private conversation. From there, HeartLink keeps the experience calm, readable, and focused on what you want to say next.</p>
        </div>
        <div className="conversation-preview lp-reveal">
          <header><span className="conversation-avatar">N</span><div><strong>Noah</strong><small>Your match</small></div></header>
          <div className="conversation-body">
            <div className="chat-bubble received">You mentioned live music—what’s the best show you’ve seen lately?</div>
            <div className="chat-bubble sent">A tiny jazz set downtown. I’m still thinking about it.</div>
            <div className="chat-bubble received">That sounds like a very good second-date idea.</div>
          </div>
          <div className="conversation-composer"><span>Write a message…</span><button type="button" aria-label="Send message"><ArrowRight size={17} /></button></div>
        </div>
      </section>

      <section id="safety" className="safety-section lp-reveal">
        <div className="safety-mark"><ShieldCheck size={28} /></div>
        <div>
          <p className="lp-kicker">Your pace. Your boundaries.</p>
          <h2>Connection should always come with control.</h2>
        </div>
        <div className="safety-points">
          <p><LockKeyhole size={19} /><span><strong>Mutual by design</strong>Messaging begins after both people express interest.</span></p>
          <p><UserRound size={19} /><span><strong>Your profile, your call</strong>Update what you share and how you appear at any time.</span></p>
          <p><X size={19} /><span><strong>Leave a connection</strong>Unmatch whenever a conversation no longer feels right.</span></p>
        </div>
      </section>

      <section className="final-cta lp-reveal">
        <p className="lp-kicker">Ready when you are</p>
        <h2>Your next conversation could start here.</h2>
        <p>Designed for mobile, ready wherever a quiet moment finds you.</p>
        <Link href="/register" className="lp-primary-button">Create your profile <ArrowRight size={18} /></Link>
      </section>

      <footer className="lp-footer">
        <Link href="/" className="lp-brand"><span className="lp-brand-mark"><Image src="/heartlink-icon.png" alt="" width={32} height={32} /></span><span>HeartLink</span></Link>
        <p>Meet people worth knowing.</p>
        <nav aria-label="Footer navigation"><a href="#product">Product</a><a href="#safety">Safety</a><Link href="/login">Sign in</Link><Link href="/register">Create account</Link></nav>
        <small>© {new Date().getFullYear()} HeartLink.</small>
      </footer>
    </main>
  );
}
