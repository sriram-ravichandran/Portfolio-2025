import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
import { useMemo } from 'react';

const EXPERIENCE = [
  {
    role: 'Member Technical Staff',
    company: 'Zoho Corporation · Chennai, India',
    dates: 'Jun 2023 – Jul 2023',
    points: [
      'Resolved high-priority tickets with fixes rolled out to 10,000+ Apple devices.',
      'Partnered with frontend teams for smooth REST API integration and troubleshooting.',
    ],
  },
  {
    role: 'Project Trainee',
    company: 'Zoho Corporation · Chennai, India',
    dates: 'Aug 2022 – May 2023',
    points: [
      'Fixed MDM glitches enabling policy bypass; reduced violations by 10%.',
      'Authored product feature docs; contributed to debugging and feature tasks.',
    ],
  },
  {
    role: 'Summer Intern',
    company: 'Zoho Corporation · Chennai, India',
    dates: 'May 2022 – Jun 2022',
    points: [
      'Strengthened backend skills across languages, frameworks, and tools.',
      'Improved code quality via reviews and mentorship from senior devs.',
    ],
  },
];

const SKILLS = [
  { title: 'Programming', items: ['C','C++','Python', 'Java', 'JavaScript', 'HTML', 'CSS'] },
  { title: 'Frameworks', items: ['React JS', 'Servlets', 'Jersey', 'Docker', 'ElasticSearch', 'AutoGen', 'LangGraph','Tailwind CSS', 'Kubernetes', 'Kafka' ,'GIT','GitHub'] },
  { title: 'Databases', items: ['MySQL', 'PostgreSQL', 'NoSQL'] },
  { title: 'Cloud', items: ['Amazon Web Services', 'Microsoft Azure', 'Google Cloud'] },
  { title: 'Languages', items: ['English', 'Tamil'] },
  { title: 'Honors', items: ['🏆 Interizon Hackathon 2021 – Winner (Jan 2023)', '🏆Freshathon Project Expo 2024 – Jury (Jun 2024)'] },
];

const splitWords = (str) =>
  str.split(' ').map((w, i) => (
    <span key={i} className="word inline-block will-change-transform mr-1">
      {w}
    </span>
  ));

const About = () => {


  useGSAP(() => {
    gsap.timeline({ scrollTrigger: { trigger: '#about', start: 'top 75%' } })
      .from('#about .about-title .word', {
        opacity: 0, yPercent: 100, filter: 'blur(6px)',
        duration: 0.8, ease: 'power2.out', stagger: 0.03, clearProps: 'filter',
      })
      .from('#about .intro p', {
        opacity: 0, y: 20, filter: 'blur(6px)',
        duration: 0.7, ease: 'power2.out', stagger: 0.06, clearProps: 'filter',
      }, '-=0.2');

    // Panel clip reveals + subtle scale
    gsap.utils.toArray('#about .ab-panel').forEach((el) => {
      gsap.from(el.children, {
        opacity: 0, y: 20, filter: 'blur(6px)',
        duration: 0.6, ease: 'power2.out', stagger: 0.08, clearProps: 'filter',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
        },
      });
    });

    // Experience item stagger with highlight line
    gsap.from('#about .exp-item', {
      opacity: 0, y: 24, filter: 'blur(8px)',
      duration: 0.6, ease: 'power2.out', stagger: 0.12, clearProps: 'filter',
      scrollTrigger: { trigger: '#about .experience', start: 'top 80%' },
    });

    gsap.from('#about .skill-chip', {
      opacity: 0, y: 14, rotate: () => gsap.utils.random(-2, 2), filter: 'blur(6px)',
      duration: 0.5, ease: 'power2.out', stagger: { each: 0.015, from: 'random' }, clearProps: 'filter',
      scrollTrigger: { trigger: '#about .skills', start: 'top 85%' },
    });

    // Add hover effect for skill chips
    const skillChipz = gsap.utils.toArray('#about .skill-chip');
    skillChipz.forEach((chip) => {
      const onEnter = () => gsap.to(chip, { y: -3, backgroundColor: 'rgba(255,255,255,0.08)', duration: 0.1, ease: 'power2.out' });
      const onLeave = () => gsap.to(chip, { y: 0, backgroundColor: 'transparent', duration: 0.1, ease: 'power3.out' });
      chip.addEventListener('mouseenter', onEnter);
      chip.addEventListener('mouseleave', onLeave);
    });

    // Pin aside (lg+)
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      gsap.timeline({ scrollTrigger: { trigger: '#about', start: 'top top+=80', end: 'bottom bottom', pin: '#about .ab-sticky' } });
    });

    // Straight connectors that grow with scroll (fully drawn when midpoint hits top-half)
    (() => {
      const container = document.querySelector('.experience');
      if (!container) return;

      const dots = Array.from(container.querySelectorAll('.exp-dot'));
      if (dots.length < 2) return;

      const lines = [];
      const layout = () => {
        lines.forEach(l => { l.trigger?.kill(); l.el?.remove(); l.marker?.remove(); });
        lines.length = 0;

        const cRect = container.getBoundingClientRect();

        for (let i = 0; i < dots.length - 1; i++) {
          const a = dots[i].getBoundingClientRect();
          const b = dots[i + 1].getBoundingClientRect();

          const x1 = a.left - cRect.left + a.width / 2;
          const y1 = a.bottom - cRect.top - 60;
          const x2 = b.left - cRect.left + b.width / 2;
          const y2 = b.top - cRect.top -30;

          const dx = x2 - x1;
          const dy = y2 - y1;
          const len = Math.hypot(dx, dy)+30;
          const angle = Math.atan2(dy, dx) * 180 / Math.PI;

          // line div rotated to connect dots
          const el = document.createElement('div');
          Object.assign(el.style, {
            position: 'absolute',
            left: `${x1 - 2}px`,
            top: `${y1}px`,
            width: `${len}px`,
            height: '5px', // Changed from '2px' to '4px' for thicker lines
            transformOrigin: 'left center',
            transform: `rotate(${angle}deg) scaleX(0)`,
            zIndex: -1,
            pointerEvents: 'none',
          });
          // Add the class properly
          el.className = 'exp-line';
          container.appendChild(el);

          // midpoint marker drives ScrollTrigger
          const marker = document.createElement('div');
          Object.assign(marker.style, {
            position: 'absolute',
            left: `${x1 + dx / 2}px`,
            top: `${y1 + dy / 2}px`,
            width: '1px',
            height: '1px',
            pointerEvents: 'none',
          });
          container.appendChild(marker);

          const trigger = ScrollTrigger.create({
            trigger: marker,
            start: 'top bottom',
            end: 'top 50%',
            scrub: true,
            onUpdate: self => {
              gsap.set(el, { transform: `rotate(${angle}deg) scaleX(${self.progress})` });
            }
          });

          lines.push({ el, marker, trigger });
        }
        ScrollTrigger.refresh();
      };

      layout();
      const onResize = () => layout();
      window.addEventListener('resize', onResize);

      // cleanup on unmount
      const cleanup = () => {
        window.removeEventListener('resize', onResize);
        lines.forEach(l => { l.trigger.kill(); l.el.remove(); l.marker.remove(); });
      };
      // tie cleanup to GSAP context if you have one, otherwise:
      window.addEventListener('beforeunload', cleanup);
    })();

    // Add visited class to skill chips when they come into view
    const skillChips = document.querySelectorAll('.skill-chip');
    
    skillChips.forEach((chip, index) => {
      ScrollTrigger.create({
        trigger: chip,
        start: 'top 99%',
        onEnter: () => {
          // Add visited class with delay for staggered effect
          setTimeout(() => {
            chip.classList.add('visited');
          }, index * 150); // 200ms delay between each chip
        },
        once: true // Only trigger once
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="about" className="relative container mx-auto px-6 py-24">
      {/* background glows */}
      <div className="blob size-[35vmax] left-[-10vmax] top-[10%]" style={{ background: 'linear-gradient(135deg, rgba(231,211,147,0.25), rgba(0,0,0,0))' }} />
      <div className="blob size-[28vmax] right-[-8vmax] bottom-[10%]" style={{ background: 'linear-gradient(135deg, rgba(120,180,255,0.22), rgba(0,0,0,0))' }} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative">
        <aside className="ab-sticky lg:col-span-4 space-y-6">
        <h2 className="special-font hero-heading text-blue-75">
          <b>About</b>
        </h2>
          <div className="intro space-y-3 text-white/80">
            <p>
            Hi 😉. I enjoy taking on challenges and building solutions that has a real impact.
            </p>
            <a
  href="https://docs.google.com/document/d/1iXWJzeLECENQXcnyOjwzMGs5a50ip8P5_9nnBsSOXLE"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-block mt-4 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300
              text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 
              "
>
  Download Resume
</a>
          </div>
        </aside>

        <div className="lg:col-span-8 space-y-10">
          <div className="ab-panel rounded-2xl glass glass-border p-6 space-y-4">
            <h3 className="text-3xl font-semibold mb-4 pb-3">Education</h3>
            <div className="space-y-2">
              <p className="text-xl md:text-xl font-serif">MS, Computer Science — Illinois Institute of Technology</p>
              <p className="text-white/60 tracking-wider text-sm">GPA 3.33 · Aug 2024 – Dec 2026 · Chicago, IL</p>
            </div>
            <div className="space-y-2">
              <p className="text-xl md:text-xl font-serif">BE, Computer Science and Engineering — Sri Eshwar College of Engineering</p>
              <p className="text-white/60 tracking-wider text-sm">GPA 3.66 · May 2019 – May 2023 · Coimbatore, India</p>
            </div>
          </div>

          <div className="ab-panel experience relative rounded-2xl glass glass-border p-6">
            <h3 className="text-3xl font-semibold mb-4 pb-3">Experience</h3>
            <div className="space-y-6">
              {EXPERIENCE.map((item, idx) => (
                <div key={idx} className="exp-item">
                  <div className="flex items-start space-x-4">
                      {/* Circle Image Placeholder */}
                      <div className="flex-shrink-0 Z-50 overflow-hidden">
                        <div className="exp-dot w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-3 overflow-hidden border-white">
                          <img src="/images/zoho-logo.png" alt="Experience" className="w-full h-full object-contain " />
                        </div>
                      </div>
                      
                      {/* Content - Indented to the right of the image */}
                      <div className="flex-1 min-w-0 pt-1">
                        <h4 className="text-xl md:text-xl font-serif">{item.role}</h4>
                        <span className="text-sm uppercase tracking-wider text-white/60">{item.dates}</span>
                      </div>
                    </div>
                  <p className="text-white/80 pl-20">{item.company}</p>
                  <ul className="mt-3 space-y-2 list-disc text-md text-white/80 pl-25 pb-3">
                    {item.points.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="ab-panel skills rounded-2xl glass glass-border p-6 space-y-6">
            <h3 className="text-3xl font-semibold">Skills</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {SKILLS.map((section, idx) => (
                <div key={idx}>
                  <h4 className="uppercase text-md tracking-widest text-white/70 mb-2 bold-text">{section.title}</h4>
                  <ul className="mt-3 flex flex-wrap gap-3">
                    {section.items.map((item, i) => (
                      <li key={i} className="skill-chip px-3 py-1 rounded-full border border-white/15 text-white/80 text-sm">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;