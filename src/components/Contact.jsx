import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CONTACTS = [
  {
    label: "Location",
    value: "Chicago, IL",
    href: "https://maps.google.com/?q=Chicago, IL",
    icon: "📍",
    description: "Available for in-person meetings",
  },
  {
    label: "Phone",
    value: "+1 312 394 9647",
    href: "tel:+13123949647",
    icon: "📞",
    description: "Available 9 AM - 9 PM CST",
  },
  {
    label: "Email",
    value: "sriramravichandran02@gmail.com",
    href: "mailto:sriramravichandran02@gmail.com",
    icon: "✉️",
    description: "Response within 24 hours",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/sriram-ravichandran",
    href: "https://linkedin.com/in/sriram-ravichandran",
    icon: "💼",
    description: "Let's connect professionally",
  },
];

export default function Contact() {
  const sectionRef = useRef(null);
  const [copied, setCopied] = useState("");

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(""), 1600);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  useGSAP(
    () => {
      const el = sectionRef.current;
      const cards = gsap.utils.toArray(".contact-card");

      // Prepare cards (hidden before entering) - set initial state first
      gsap.set(cards, {
        opacity: 0,
        y: 24,
        filter: "blur(6px)",
        willChange: "transform, opacity, filter",
        // Ensure 3D transforms are neutral initially
        rotationY: 0,
        rotationX: 0,
        scale: 1,
        z: 0,
        transformStyle: "preserve-3d",
        transformPerspective: 1200,
      });

      // Single ScrollTrigger for both section and cards entrance
      const entranceTL = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 65%",
          once: true,
          invalidateOnRefresh: true,
        },
      });

      // Section entrance
      entranceTL.fromTo(
        el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
        }
      );

      // Cards entrance (starts slightly after section)
      entranceTL.to(cards, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.12,
        onComplete: () => {
          gsap.set(cards, { willChange: "auto" });
          // Enable hover interactions after entrance completes
          enableHoverInteractions();
        },
      }, 0.2);

      // 3D hover interactions - only enabled after entrance
      const listeners = [];
      let hoverEnabled = false;

      const enableHoverInteractions = () => {
        hoverEnabled = true;

      cards.forEach((card, idx) => {
        const iconEl = card.querySelector("div.w-16"); // icon circle
        
        // ensure pointer events enabled on card
        card.style.touchAction = "none";

        // Prepare icon (after main card is already set up)
        gsap.set(iconEl, { 
          x: 0,
          y: 0,
          z: 0,
          rotationY: 0,
          transformStyle: "preserve-3d", 
          willChange: "transform" 
        });

        // Quick setters for performance
        const cardTween = (props = {}, opts = {}) =>
          gsap.to(card, { overwrite: true, duration: opts.duration ?? 0.45, ease: opts.ease ?? "power3.out", ...props });

        const iconTween = (props = {}, opts = {}) =>
          gsap.to(iconEl, { overwrite: true, duration: opts.duration ?? 0.45, ease: opts.ease ?? "power3.out", ...props });

        // Helper: convert pointer position to tilt/offset
        const calculate = (e) => {
          const rect = card.getBoundingClientRect();
          const px = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 .. 1
          const py = ((e.clientY - rect.top) / rect.height) * 2 - 1; // -1 .. 1
          return { px, py, width: rect.width, height: rect.height };
        };

        // On pointer move: tilt and move icon
        const onMove = (e) => {
          if (!hoverEnabled) return; // prevent interaction during entrance
          
          const { px, py } = calculate(e);

          // rotation range
          const rotY = px * 10; // rotateY (left-right)
          const rotX = -py * 8; // rotateX (up-down)
          const tiltScale = 1.03;

          // depth translation
          const z = 20 + Math.abs(px * 6) + Math.abs(py * 6); // center lift a bit

          cardTween({
            rotationY: rotY,
            rotationX: rotX,
            scale: tiltScale,
            z: z,
            transformOrigin: "center center",
            duration: 0.22,
            ease: "power2.out",
          }, { duration: 0.22 });

          // small parallax for icon
          iconTween({ x: px * 10, y: py * 6, z: z * 0.6, rotationY: rotY * 0.12 }, { duration: 0.35 });
        };

        // On enter: pop
        const onEnter = (e) => {
          if (!hoverEnabled) return; // prevent interaction during entrance
          
          // subtle pop
          cardTween(
            { scale: 1.04, y: -6, z: 10, duration: 0.35, ease: "back.out(1.1)" },
            { duration: 0.35 }
          );
        };

        // On leave: spring back to neutral
        const onLeave = () => {
          if (!hoverEnabled) return; // prevent interaction during entrance
          
          gsap.to(card, {
            rotationY: 0,
            rotationX: 0,
            scale: 1,
            z: 0,
            y: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.5)",
            overwrite: true,
          });

          iconTween({ x: 0, y: 0, z: 0, rotationY: 0, duration: 0.6, ease: "elastic.out(1,0.6)" });
        };

        // Attach listeners (pointer events preferred)
        card.addEventListener("pointermove", onMove);
        card.addEventListener("pointerenter", onEnter);
        card.addEventListener("pointerleave", onLeave);
        card.addEventListener("pointercancel", onLeave);

        // store references for cleanup
        listeners.push({ card, onMove, onEnter, onLeave });
      });
      }; // end enableHoverInteractions

      ScrollTrigger.refresh();

      // Cleanup event listeners on unmount
      return () => {
        listeners.forEach(({ card, onMove, onEnter, onLeave }) => {
          card.removeEventListener("pointermove", onMove);
          card.removeEventListener("pointerenter", onEnter);
          card.removeEventListener("pointerleave", onLeave);
          card.removeEventListener("pointercancel", onLeave);
        });
        // kill all GSAP tweens related to cards
        gsap.killTweensOf(".contact-card");
        gsap.killTweensOf("div.w-16");
      };
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="contact" className="relative w-full py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="special-font hero-heading text-blue-75">
            <b>Let's Connect</b>
          </h2>
          <p className="hero-sub mt-4 text-white/80 md:text-2xl">
            Ready for new opportunities and exciting collaborations.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {CONTACTS.map((contact) => (
            <div
              key={contact.label}
              className="
                contact-card relative overflow-hidden
                glass glass-border rounded-xl p-6 transform-gpu
                transition-[background-color,border-color] duration-300
                "
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-gray-100 dark:bg-stone-700 rounded-full flex items-center justify-center text-2xl mb-4 mx-auto">
                {contact.icon}
              </div>

              {/* Label */}
              <h3 className="mt-3 text-white/70 font-normal text-center mb-3">
                {contact.label}
              </h3>

              {/* Value */}
              <div className="text-center mb-4">
                <a
                  href={contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg contact-value font-bold mt-3 hover:text-green-500 transition-colors duration-200 break-words"
                >
                  {contact.value}
                </a>
              </div>

              {/* Description */}
              <p className="mt-3 text-white/70 font-normal text-center mb-4">
                {contact.description}
              </p>

              {/* Copy Button */}
              <div className="text-center">
                <button
                  onClick={() => copyToClipboard(contact.value, contact.label)}
                  className="
                    px-4 py-2 border-2 contact-btn
                    hover:border-lime-600
                    text-gray-300 rounded-lg text-sm font-medium
                    transition-all duration-300
                  "
                >
                  {copied === contact.label ? "✓ Copied!" : "Copy"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200/40 dark:border-gray-700/60">
          <p className="text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Sriram Ravichandran — Always building
            something amazing
          </p>
        </div>
      </div>
    </section>
  );
}