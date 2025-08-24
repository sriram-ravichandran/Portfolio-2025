import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useEffect, useMemo, useState, useRef } from 'react';

const links = [
  { id: 'home', title: 'Home' },
  { id: 'about', title: 'About' },
  { id: 'projects', title: 'Projects' },
  { id: 'contact', title: 'Contact' },
];

const getInitialTheme = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  return 'dark'; // Default for server-side rendering
};

const Navbar = () => {
  const [theme, setTheme] = useState(getInitialTheme);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const container = useRef(null);
  const menuTimeline = useRef(null);

  const isLight = theme === 'light';
  const breakpoint = 1300;

  // --- Theme and Window Resize Effects ---
  useEffect(() => {
    document.body.classList.toggle('theme-light', isLight);
    localStorage.setItem('theme', theme);
  }, [theme, isLight]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- GSAP Animations ---
  useGSAP(() => {
    // Navbar scroll background animation
    gsap.fromTo('.navbar-container', { backgroundColor: 'transparent' }, {
      backgroundColor: isLight ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.30)',
      scrollTrigger: { 
        trigger: 'body', 
        start: 'top top',
        end: '+=100',
        scrub: 1,
      },
      ease: 'power1.inOut',
    });
  
    // Page scroll progress bar
    gsap.set('.progress-bar', { transformOrigin: '0% 50%', scaleX: 0 });
    gsap.to('.progress-bar', {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { 
        trigger: document.documentElement,
        start: 'top top', 
        end: 'bottom bottom', 
        scrub: true 
      },
    });
  
    // Pebble hover effect for desktop links
    document.querySelectorAll('.nav-link-desktop').forEach((link) => {
      const pebble = link.querySelector('.pebble');
      if (!pebble) return;
      gsap.set(pebble, { scale: 0.001, opacity: 0, willChange: 'transform, opacity' });
      const hoverTl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out', duration: 0.28 } })
        .to(pebble, { scale: 1, opacity: 0.45 }, 0);
      link.addEventListener('mouseenter', () => hoverTl.play());
      link.addEventListener('mouseleave', () => hoverTl.reverse());
    });
  }, { scope: container, dependencies: [isLight, windowWidth] });

  // Theme change icon animation
  useEffect(() => {
    gsap.fromTo('.theme-pulse', { scale: 0.9, opacity: 0.2 }, { scale: 1, opacity: 0.6, duration: 0.4, ease: 'power2.out' });
    gsap.fromTo('.theme-icon', { rotate: isLight ? 90 : -90, opacity: 0 }, { rotate: 0, opacity: 1, duration: 0.35, ease: 'power2.out' });
  }, [theme, isLight]);

  // Mobile menu and hamburger animation
  useGSAP(() => {
    if (windowWidth < breakpoint) {
      // Set initial state of the dropdown to be invisible
      gsap.set('.dropdown-menu', { autoAlpha: 0, scale: 0.95, y: -10, transformOrigin: 'top right' });

      menuTimeline.current = gsap.timeline({ paused: true })
        // Animate the dropdown menu to be visible
        .to('.dropdown-menu', {
          autoAlpha: 1, // Fades in and becomes interactive
          scale: 1,
          y: 0,
          duration: 0.2,
          ease: 'power1.out',
        })
        // Stagger in the links
        .fromTo('.dropdown-link', {
          opacity: 0,
          x: -15,
        }, {
          opacity: 1,
          x: 0,
          stagger: 0.05,
          duration: 0.3,
          ease: 'power2.out'
        }, "-=0.1")
        // Animate the hamburger icon
        .to('.hamburger-top', { rotation: 45, y: 5 }, 0)
        .to('.hamburger-middle', { opacity: 0 }, 0)
        .to('.hamburger-bottom', { rotation: -45, y: -5 }, 0);
    }
  }, { scope: container, dependencies: [windowWidth] });

  useEffect(() => {
    if (isMenuOpen) {
      menuTimeline.current?.play();
    } else {
      menuTimeline.current?.reverse();
    }
  }, [isMenuOpen]);

  // --- Event Handlers ---
  const toggleTheme = () => setTheme(isLight ? 'dark' : 'light');
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // --- Reusable Components/Elements ---
  const themeIcon = useMemo(() => (
    isLight ? (
      <svg className="theme-icon size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="4" strokeWidth="1.5" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M5 19l1.5-1.5" strokeWidth="1.5" />
      </svg>
    ) : (
      <svg className="theme-icon size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" strokeWidth="1.5" />
      </svg>
    )
  ), [isLight]);
  
  const NavLinksContent = ({ isMobile }) => (
    <>
      {links.map((link) => (
        <li key={link.id} className={isMobile ? 'dropdown-link w-full' : ''}>
          <a
            href={`#${link.id}`}
            onClick={isMobile ? closeMenu : undefined}
            className={`nav-link-${isMobile ? 'mobile' : 'desktop'} relative font-medium transition-all duration-200 rounded-full overflow-hidden ${isMobile ? 'block text-left px-4 py-2 w-full text-base' : 'px-4 py-2'}`}
          >
            <span
              className="pebble absolute inset-0 rounded-full"
              style={{ background: isLight ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.45)' }}
            />
            <span className="relative z-10 text-white">{link.title}</span>
          </a>
        </li>
      ))}
      <li className={isMobile ? 'dropdown-link pt-2' : ''}>
        <button
          aria-label="Toggle theme"
          onClick={toggleTheme}
          className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm text-white font-medium transition-all duration-200 overflow-hidden ${isMobile ? 'w-full justify-start' : ''}`}
          style={{ background: 'rgba(180, 180, 180, 0.5)', border: `1px solid ${isLight ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.15)'}` }}
        >
          <span className="pebble absolute inset-0 rounded-full" style={{ background: isLight ? 'rgba(230, 230, 230, 0.9)' : 'rgba(255, 255, 255, 0.45)' }} />
          <span className="theme-pulse absolute inset-0 -z-10 rounded-full bg-yellow/20 opacity-0 pointer-events-none" />
          <span className="relative z-10 flex items-center gap-2">
            {themeIcon}
            <span>{isLight ? 'Light' : 'Dark'}</span>
          </span>
        </button>
      </li>
    </>
  );

  return (
    <div ref={container}>
      <div className="progress-bar fixed top-0 left-0 h-[2px] bg-yellow z-[60] w-full" />
      <nav className="fixed z-50 w-full flex justify-center">
        <div
          className="navbar-container relative max-w-[1100px] w-[60%] lg:w-[60%] xl:w-[55%] rounded-2xl mt-4 px-6 py-4 flex items-center justify-between transition-all duration-300"
          style={{
            backdropFilter: 'blur(20px)',
            border: `2px solid ${isLight ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.5)'}`,
            boxShadow: isLight ? '0 0 20px rgba(0, 0, 0, 0.25)' : '0 0 20px rgba(255, 255, 255, 0.45)',
          }}
        >
          <a href="https://www.sriramravichandran.in" className="flex items-center gap-2">
            <p className="font-semibold text-xl text-white">Sriram</p>
          </a>
          
          {windowWidth >= breakpoint ? (
            <ul className="flex items-center gap-6">
              <NavLinksContent isMobile={false} />
            </ul>
          ) : (
            <>
              <button aria-label="Open menu" onClick={toggleMenu} className="hamburger z-[100] flex flex-col justify-center items-center w-6 h-6 gap-1">
                <span className="hamburger-top block w-full h-0.5 bg-white rounded-full"></span>
                <span className="hamburger-middle block w-full h-0.5 bg-white rounded-full"></span>
                <span className="hamburger-bottom block w-full h-0.5 bg-white rounded-full"></span>
              </button>

              {/* --- Compact Dropdown Menu --- */}
              <div
                className="dropdown-menu absolute top-full right-0 mt-3 w-56 rounded-xl shadow-xl z-[90] p-2 invisible"
                style={{
                  background: isLight ? 'rgba(255, 255, 255, 0.65)' : 'rgba(15, 15, 15, 0.75)',
                  backdropFilter: 'blur(30px)',
                  border: `1px solid ${isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'}`,
                }}
              >
                <ul className="flex flex-col items-center space-y-1">
                  <NavLinksContent isMobile={true} />
                </ul>
              </div>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;