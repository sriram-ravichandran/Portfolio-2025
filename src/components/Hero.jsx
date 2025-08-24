import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SplitText } from 'gsap/all';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  // Keep some refs for wave management & cleanup
  const waveCleanupsRef = useRef([]); // array of cleanup functions
  const wavesActiveRef = useRef(false);
  const resizeTimeoutRef = useRef(null);
  const tickerRef = useRef(null);

  // -------------------------
  // Existing GSAP animations (text, CTA, aurora motion, etc.)
  // -------------------------
  useGSAP(() => {
    const titleSplit = new SplitText('.hero-heading', { type: 'chars,words' });
    const subSplit = new SplitText('.hero-sub', { type: 'words' });

    gsap.set('.hero-heading, .hero-sub', { perspective: 400 });

    // Add hover animations for individual characters
    const h1 = document.querySelector('.hero-heading');

    if (h1 && titleSplit.chars) {
      const ACCENT = getComputedStyle(document.documentElement).getPropertyValue('--glass-accent')?.trim() || '#60f';
      const isDark = document.documentElement.classList.contains('dark') || 
                    getComputedStyle(document.body).backgroundColor === 'rgb(0, 0, 0)';
      
      titleSplit.chars.forEach((char, index) => {
        // Enhanced setup for each character
        gsap.set(char, {
          transformStyle: 'preserve-3d',
          transformOrigin: '50% 50%', // centered for professional look
          willChange: 'transform, filter, text-shadow',
          display: 'inline-block',
          position: 'relative',
          zIndex: 1,
          // Prevent initial flash by setting base filter state
          filter: 'brightness(1)',
          textShadow: '0 0 0 rgba(0,0,0,0)',
        });
    
        // Create dynamic phase for unique character behavior
        const phase = gsap.utils.random(0.92, 1.08);
        const isSpace = char.textContent.trim() === '';
        
        // Skip spaces but keep them in flow
        if (isSpace) {
          char.style.pointerEvents = 'none';
          return;
        }
    
        // State tracking for smooth interactions
        let isHovered = false;
        let hoverTween = null;
        let resetTween = null;
        
        // Performance-optimized quick setters for minimal movements
        const quickRotY = gsap.quickTo(char, "rotationY", { duration: 0.3, ease: "power2.out" });
        const quickRotX = gsap.quickTo(char, "rotationX", { duration: 0.3, ease: "power2.out" });
    
        // Subtle mouse tracking for minimal 3D effect
        const onMouseMove = (e) => {
          if (!isHovered) return;
          
          const rect = char.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          
          // Normalized coordinates from center (-1 to 1)
          const dx = (e.clientX - centerX) / (rect.width / 2);
          const dy = (e.clientY - centerY) / (rect.height / 2);
          
          // Minimal micro-movements
          quickRotY(dx * 3);
          quickRotX(-dy * 2);
        };
    
        const onMouseEnter = () => {
          if (isHovered) return;
          isHovered = true;
          
          // Kill any existing tweens
          if (hoverTween) hoverTween.kill();
          if (resetTween) resetTween.kill();
          
          // Professional minimal hover animation
          hoverTween = gsap.timeline({
            onComplete: () => hoverTween = null
          });
          
          // Subtle transform
          hoverTween.to(char, {
            duration: 0.2 * phase,
            scale: 1.05,
            y: -3,
            ease: 'power2.out',
            zIndex: 20,
          }, 0);
          
          // Theme-aware glow effect
          const shadowColor = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)';
          const glowIntensity = isDark ? '0.6' : '0.4';
          
          hoverTween.to(char, {
            duration: 0.1 * phase,
            textShadow: `
              0 0 12px ${ACCENT}${glowIntensity.replace('0.', '')},
              0 2px 8px ${shadowColor}
            `,
            ease: 'power2.out',
          }, 0);
          
          // Gentle brightness adjustment (theme-aware) - start from base filter
          const brightness = isDark ? '1.15' : '1.1';
          hoverTween.fromTo(char, {
            filter: 'brightness(1) drop-shadow(0 0 0px transparent)',
          }, {
            duration: 0.3 * phase,
            filter: `brightness(${brightness}) drop-shadow(0 1px 3px ${ACCENT}40)`,
            ease: 'power2.out',
          }, 0.05);
    
          // Start mouse tracking
          document.addEventListener('mousemove', onMouseMove, { passive: true });
        };
    
        const onMouseLeave = () => {
          if (!isHovered) return;
          isHovered = false;
          
          // Cleanup mouse tracking
          document.removeEventListener('mousemove', onMouseMove);
          
          // Kill existing tweens
          if (hoverTween) hoverTween.kill();
          if (resetTween) resetTween.kill();
          
          // Smooth professional reset
          resetTween = gsap.timeline({
            onComplete: () => {
              resetTween = null;
              char.style.zIndex = '';
            }
          });
          
          // Main transform reset
          resetTween.to(char, {
            duration: 0.6,
            scale: 1,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            ease: 'power2.out',
          }, 0);
          
          // Effects fade out
          resetTween.to(char, {
            duration: 0.5,
            textShadow: '0 0 0 rgba(0,0,0,0)',
            filter: 'brightness(1) drop-shadow(0 0 0px transparent)',
            ease: 'power2.out',
          }, 0);
        };
    
        // Touch support for mobile
        const onTouchStart = (e) => {
          e.preventDefault();
          onMouseEnter();
          // Auto-reset after touch
          setTimeout(() => {
            if (isHovered) onMouseLeave();
          }, 800);
        };
    
        // Enhanced event listeners
        char.addEventListener('mouseenter', onMouseEnter, { passive: true });
        char.addEventListener('mouseleave', onMouseLeave, { passive: true });
        char.addEventListener('touchstart', onTouchStart, { passive: false });
        
        // Keyboard accessibility
        char.setAttribute('tabindex', '0');
        char.addEventListener('focus', onMouseEnter, { passive: true });
        char.addEventListener('blur', onMouseLeave, { passive: true });
      });
    }

    // Title/sub animation
    gsap.from(titleSplit.chars, {
      opacity: 0,
      yPercent: 100,
      rotationX: -50,
      filter: 'blur(8px)',
      duration: 1.2,
      ease: 'power3.out',
      stagger: 0.03,
      clearProps: 'filter',
    });

    gsap.from(subSplit.words, {
      opacity: 0,
      y: 20,
      filter: 'blur(6px)',
      duration: 0.8,
      ease: 'power2.out',
      stagger: 0.05,
      delay: 0.4,
      clearProps: 'filter',
    });

    gsap.from('.hero-cta a', {
      opacity: 0,
      y: 16,
      filter: 'blur(6px)',
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.1,
      delay: 0.8,
      clearProps: 'filter',
    });

    gsap.to('.mouse-indicator', {
      y: 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      duration: 1.2,
    });

    // Aurora motion — keep a reference to the tick so we can remove it on cleanup
    const A = document.querySelector('.aurora-a');
    const B = document.querySelector('.aurora-b');
    if (A && B) {
      const section = document.getElementById('home');
      const getRect = () => section.getBoundingClientRect();

      const posA = { x: -60, y: -40 };
      const posB = { x: 60, y: 40 };
      const speed = 110; // px/s
      let velA = { x: 0.82, y: -0.57 };
      let velB = { x: -0.76, y: 0.65 };

      const setSpeed = (v, s) => {
        const l = Math.hypot(v.x, v.y) || 1;
        v.x = (v.x / l) * s;
        v.y = (v.y / l) * s;
      };
      setSpeed(velA, speed);
      setSpeed(velB, speed);

      const reflect = (pos, vel, limX, limY) => {
        if (pos.x >= limX) { pos.x = limX; vel.x = -Math.abs(vel.x); }
        if (pos.x <= -limX) { pos.x = -limX; vel.x = Math.abs(vel.x); }
        if (pos.y >= limY) { pos.y = limY; vel.y = -Math.abs(vel.y); }
        if (pos.y <= -limY) { pos.y = -limY; vel.y = Math.abs(vel.y); }
      };

      const tick = () => {
        const r = getRect();
        const halfW = r.width / 2;
        const halfH = r.height / 2;
        const ra = A.getBoundingClientRect().width / 2;
        const rb = B.getBoundingClientRect().width / 2;
        const limAx = Math.max(8, halfW - ra);
        const limAy = Math.max(8, halfH - ra);
        const limBx = Math.max(8, halfW - rb);
        const limBy = Math.max(8, halfH - rb);

        const dt = gsap.ticker.deltaRatio() / 60; // seconds

        posA.x += velA.x * dt; posA.y += velA.y * dt;
        posB.x += velB.x * dt; posB.y += velB.y * dt;

        reflect(posA, velA, limAx, limAy);
        reflect(posB, velB, limBx, limBy);

        setSpeed(velA, speed);
        setSpeed(velB, speed);

        gsap.set(A, { x: posA.x, y: posA.y });
        gsap.set(B, { x: posB.x, y: posB.y });
      };

      gsap.ticker.add(tick);
      tickerRef.current = tick;
    }

    // Optional: return cleanup for useGSAP if it supports it, otherwise the outer effect unmount will handle cleanup
  }, []);

  // -------------------------
  // Wave creation + resize listener (dynamic add/remove)
  // -------------------------
  useEffect(() => {
    const svgNS = 'http://www.w3.org/2000/svg';

    // Helper to generate wave path
    function generateD(amplitude, startY = 10, height = 800) {
      const controlX = 50 + amplitude;
      return `M90,${startY} Q${controlX},${startY + height * 0.3} 50,${startY + height * 0.6} T50,${startY + height}`;
    }

    // Create a single wave instance and return its cleanup function
    const createWaveInstance = ({ rightPct = '18%', targetAmp = 90, heightMultiplier = 0.7, idSuffix = '1' }) => {
      const right = rightPct;
      const target = targetAmp;
      const height = Math.max(200, window.innerHeight * heightMultiplier);

      const svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('width', '400');
      svg.setAttribute('height', String(height));
      svg.style.cssText = `
        position: absolute;
        right: ${right};
        top: 10%;
        width: 100px;
        height: ${height * 0.8}px;
        z-index: 5;
        transform-origin: top;
        overflow: visible;
        pointer-events: none;
      `;
      svg.classList.add('sin-wave-line', `sin-wave-${idSuffix}`);

      // float tween
      const floatTween = gsap.to(svg, {
        y: 15,
        duration: 1.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });

      // defs + blur filter
      const defs = document.createElementNS(svgNS, 'defs');
      const filter = document.createElementNS(svgNS, 'filter');
      const filterId = `blurFilter_${right.replace('%', '').replace('.', '')}_${idSuffix}`;
      filter.setAttribute('id', filterId);
      filter.setAttribute('filterUnits', 'userSpaceOnUse');
      const marginPx = 400;
      filter.setAttribute('x', String(-marginPx));
      filter.setAttribute('y', String(-marginPx));
      filter.setAttribute('width', String(400 + marginPx * 2));
      filter.setAttribute('height', String(height + marginPx * 2));

      const feGaussian1 = document.createElementNS(svgNS, 'feGaussianBlur');
      feGaussian1.setAttribute('in', 'SourceGraphic');
      feGaussian1.setAttribute('stdDeviation', '16');
      feGaussian1.setAttribute('result', 'g1');

      const feGaussian2 = document.createElementNS(svgNS, 'feGaussianBlur');
      feGaussian2.setAttribute('in', 'g1');
      feGaussian2.setAttribute('stdDeviation', '8');
      feGaussian2.setAttribute('result', 'g2');

      const feMerge = document.createElementNS(svgNS, 'feMerge');
      const m1 = document.createElementNS(svgNS, 'feMergeNode'); m1.setAttribute('in', 'g2');
      const m2 = document.createElementNS(svgNS, 'feMergeNode'); m2.setAttribute('in', 'SourceGraphic');
      feMerge.appendChild(m1); feMerge.appendChild(m2);

      filter.appendChild(feGaussian1);
      filter.appendChild(feGaussian2);
      filter.appendChild(feMerge);
      defs.appendChild(filter);
      svg.appendChild(defs);

      // path
      const path = document.createElementNS(svgNS, 'path');
      const startY = 0;
      path.setAttribute('d', generateD(0, startY, height));
      path.setAttribute('stroke', '#ffffff');
      path.setAttribute('stroke-width', '20');
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-dasharray', '1 1000');
      path.setAttribute('stroke-dashoffset', '1000');
      path.style.opacity = '0';
      path.setAttribute('filter', `url(#${filterId})`);

      svg.appendChild(path);
      const heroSection = document.querySelector('#home');
      if (heroSection) heroSection.appendChild(svg);

      // state + helpers
      const state = { amplitude: 0, opacity: 0 };
      function applyState() {
        const totalLength = path.getTotalLength();
        path.setAttribute('d', generateD(state.amplitude, startY, height));
        path.setAttribute('stroke-dasharray', String(totalLength));
        path.setAttribute('stroke-dashoffset', String(Math.round(totalLength * (1 - (state.amplitude / target || 0)))));
        path.style.opacity = String(state.opacity);
      }

      let currentTween = null;
      let visible = false;

      const st = ScrollTrigger.create({
        trigger: '#home',
        start: 'top top',
        end: 'top+=200px top',
        onUpdate: () => {
          const scrollPx = window.scrollY;
          if (scrollPx > 10) {
            if (!visible) {
              visible = true;
              if (currentTween) currentTween.kill();
              currentTween = gsap.to(state, {
                amplitude: target,
                opacity: 1,
                duration: 0.9,
                ease: 'power2.out',
                onUpdate: applyState,
                onComplete: () => { currentTween = null; }
              });
            }
          } else {
            if (visible) {
              visible = false;
              if (currentTween) currentTween.kill();
              currentTween = gsap.to(state, {
                amplitude: 0,
                opacity: 0,
                duration: 0.1,
                ease: 'power1.in',
                onUpdate: applyState,
                onComplete: () => { currentTween = null; }
              });
            }
          }
        }
      });

      // Return cleanup function for this instance
      return () => {
        try {
          // Kill floating tween
          floatTween?.kill?.();

          // Kill any running state tween
          if (currentTween) { currentTween.kill(); currentTween = null; }

          // Kill ScrollTrigger
          st?.kill?.();

          // Remove svg from DOM
          if (svg && svg.parentNode) svg.parentNode.removeChild(svg);
        } catch (e) {
          // silent
        }
      };
    }; // createWaveInstance

    // Create all waves (three instances) and store their cleanups
    const createAllWaves = () => {
      // Avoid double-creating
      if (wavesActiveRef.current) return;
      waveCleanupsRef.current = [
        createWaveInstance({ rightPct: '18%', targetAmp: 90, heightMultiplier: 0.7, idSuffix: '1' }),
        createWaveInstance({ rightPct: '12%', targetAmp: 90, heightMultiplier: 0.75, idSuffix: '2' }),
        createWaveInstance({ rightPct: '6%',  targetAmp: 90, heightMultiplier: 0.8, idSuffix: '3' }),
      ];
      wavesActiveRef.current = true;
    };

    // Cleanup all waves
    const cleanupAllWaves = () => {
      if (!wavesActiveRef.current) return;
      (waveCleanupsRef.current || []).forEach((fn) => {
        try { fn && fn(); } catch (e) {}
      });
      waveCleanupsRef.current = [];
      wavesActiveRef.current = false;
    };

    // Initial mount: create if wide enough
    if (typeof window !== 'undefined' && window.innerWidth >= 1300) {
      createAllWaves();
    }

    // Debounced resize handler
    const onResize = () => {
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(() => {
        const w = window.innerWidth;
        if (w >= 1300) {
          createAllWaves();
        } else {
          cleanupAllWaves();
        }
      }, 120); // small debounce
    };

    window.addEventListener('resize', onResize);

    // Cleanup when component unmounts
    return () => {
      window.removeEventListener('resize', onResize);
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      cleanupAllWaves();

      // remove aurora ticker if it was added
      if (tickerRef.current) {
        try { gsap.ticker.remove(tickerRef.current); } catch (e) {}
        tickerRef.current = null;
      }
    };
  }, []); // run once on mount

  return (
    <section id="home" className="min-h-[100svh] flex items-center justify-center relative px-6 mx-auto max-w-[2000px]">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="blob aurora-a absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[64vmin] h-[64vmin]"
          style={{
            background:
              'radial-gradient(circle at 30% 30%, rgba(230,60,150,0.78) 0%, rgba(230,60,150,0.38) 40%, rgba(0,0,0,0) 72%)',
            mixBlendMode: 'screen',
            opacity: 0.7,
          }}
        />
        <div
          className="blob aurora-b absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[64vmin] h-[64vmin]"
          style={{
            background:
              'radial-gradient(circle at 70% 70%, rgba(50,100,210,0.72) 0%, rgba(50,100,210,0.32) 38%, rgba(0,0,0,0) 70%)',
            mixBlendMode: 'screen',
            opacity: 0.68,
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto ">
        <h1 className="special-font hero-heading text-blue-75">
          <b>Sriram <br />Ravichandran</b>
        </h1>
        <p className="hero-sub mt-4 text-white/80 md:text-2xl">
          Software Developer · MCS @ Illinois Tech · Chicago, IL
        </p>

        <div className="mt-16 flex flex-col items-center justify-center">
          <div className="mouse-indicator w-1 h-6 rounded-full bg-white/80" />
          <span className="text-xs mt-2 text-white/80">Scroll</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
