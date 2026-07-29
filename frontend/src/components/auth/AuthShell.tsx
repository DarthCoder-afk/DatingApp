"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowLeft, Compass, Heart, MessageCircle, UserRound } from "lucide-react";

gsap.registerPlugin(useGSAP);

type AuthShellProps = {
  mode: "login" | "register";
  eyebrow: string;
  title: string;
  support: string;
  children: React.ReactNode;
};

export default function AuthShell({ mode, eyebrow, title, support, children }: AuthShellProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .from(".auth-back", { y: -8, opacity: 0, duration: .32 }, 0)
        .from(".auth-brand", { y: 8, opacity: 0, duration: .36 }, .04)
        .from(".auth-preview", { x: 20, opacity: 0, duration: .52 }, .04)
        .from(".auth-heading > *", { y: 10, opacity: 0, duration: .38, stagger: .045 }, .1)
        .from(".auth-field", { y: 8, opacity: 0, duration: .34, stagger: .03 }, .17)
        .from(".auth-submit", { y: 7, opacity: 0, duration: .32 }, .32)
        .from(".auth-switch, .auth-privacy", { opacity: 0, duration: .28, stagger: .04 }, .38);
    });
    media.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".auth-back, .auth-brand, .auth-preview, .auth-heading > *, .auth-field, .auth-submit, .auth-switch, .auth-privacy", {
        clearProps: "all",
        opacity: 1,
      });
    });
    return () => media.revert();
  }, { scope: root });

  const isLogin = mode === "login";

  return (
    <div ref={root} className={`auth-shell auth-${mode}`}>
      <section className="auth-form-panel">
        <div className="auth-form-wrap">
          <Link href="/" className="auth-back"><ArrowLeft size={16} /> Back to home</Link>
          <Link href="/" aria-label="HeartLink home" className="auth-brand">
            <Image src="/heartlink-icon.png" alt="" width={38} height={38} />
            <span>HeartLink</span>
          </Link>
          <header className="auth-heading">
            <p>{eyebrow}</p>
            <h1>{title}</h1>
            <span>{support}</span>
          </header>
          {children}
        </div>
      </section>

      <aside className="auth-preview" aria-label="A preview of the HeartLink mobile experience">
        <div className="auth-preview-copy">
          <p>{isLogin ? "Back to your connections" : "Designed around real introductions"}</p>
          <h2>{isLogin ? "A calm place to pick up the conversation." : "Start with a profile that feels like you."}</h2>
        </div>
        <div className="auth-phone">
          <div className="auth-phone-top"><span>{isLogin ? "Messages" : "Discover"}</span>{isLogin ? <MessageCircle size={17} /> : <Compass size={17} />}</div>
          {isLogin ? (
            <div className="auth-chat-demo">
              <div className="auth-chat-person"><span>N</span><div><strong>Noah</strong><small>Your match</small></div></div>
              <div className="auth-demo-bubble received">What’s your ideal slow Sunday?</div>
              <div className="auth-demo-bubble sent">Coffee, a long walk, and nowhere urgent to be.</div>
              <div className="auth-demo-composer">Write a message… <span>→</span></div>
            </div>
          ) : (
            <div className="auth-profile-demo">
              <Image src="/images/heartlink-register-editorial.png" alt="A fictional HeartLink profile preview" fill sizes="300px" className="object-cover" />
              <div className="auth-profile-shade" />
              <div className="auth-profile-copy"><small>Nearby</small><strong>Avery, 26</strong><p>Coffee walks, film photography, and finding the city’s best dumplings.</p></div>
            </div>
          )}
          <div className="auth-phone-tabs"><Compass /><Heart /><MessageCircle /><UserRound /></div>
        </div>
        <div className="auth-preview-note"><Heart size={15} fill="currentColor" /><span>{isLogin ? "Mutual connections, private conversations." : "One thoughtful introduction at a time."}</span></div>
      </aside>
    </div>
  );
}
