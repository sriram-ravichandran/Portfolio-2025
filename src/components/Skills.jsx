import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const SECTIONS = [
  { title: 'Programming', items: ['C','C++','Python', 'Java', 'JavaScript', 'HTML', 'CSS'] },
  { title: 'Frameworks', items: ['React JS', 'Servlets', 'Jersey', 'Docker', 'ElasticSearch', 'AutoGen', 'LangGraph','Tailwind CSS','GIT','GitHub'] },
  { title: 'Databases', items: ['MySQL', 'PostgreSQL', 'NoSQL'] },
  { title: 'Cloud', items: ['AWS', 'Microsoft Azure', 'Google Cloud'] },
  { title: 'Languages', items: ['English', 'Tamil'] },
  { title: 'Honors', items: ['Interizon Hackathon 2021 – Winner (Jan 2023)', 'Freshathon Project Expo 2024 – Jury (Jun 2024)'] },
];

const iconUrl = (name) => {
  const n = name.toLowerCase().trim();

  // Programming
  if (n === 'c') return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg';
  if (n.includes('c++') || n === 'cpp') return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg';
  if (n.includes('python')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg';
  if (n.includes('javascript')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg';
  if (n.includes('java') && !n.includes('javascript')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg';
  if (n.includes('html')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg';
  if (n.includes('css') && !n.includes('tailwind')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg';

  // Frameworks / Tools
  if (n.includes('react')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg';
  if (n.includes('docker')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg';
  if (n.includes('elastic')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elasticsearch/elasticsearch-original.svg';
  if (n.includes('tailwind')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg';
  // No official Devicon for these:
  if (n.includes('servlet') || n.includes('jersey') || n.includes('autogen') || n.includes('langgraph')) return null;

  // Databases
  if (n.includes('mysql')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg';
  if (n.includes('postgres')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg';
  if (n.includes('nosql') || n.includes('mongo')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg';

  // Cloud
  if (n.includes('aws')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg';
  if (n.includes('azure')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg';
  if (n.includes('google cloud') || n.includes('gcp') || n.includes('google')) return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg';

  // Human languages and unknowns → handled by emoji fallback
  return null;
};

const Emoji = ({ children }) => (
  <span aria-hidden="true" className="inline-block w-5 h-5 text-lg leading-none">
    {children}
  </span>
);

const Logo = ({ name, section }) => {
  if (section === 'Honors') return <Emoji>🏆</Emoji>;
  const src = iconUrl(name);
  if (src) {
    return (
      <img
        src={src}
        alt={`${name} logo`}
        className="w-5 h-5 object-contain"
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    );
  }
  // Fallback emojis by category
  const n = name.toLowerCase();
  if (section === 'Frameworks') return <Emoji>🧩</Emoji>;
  if (section === 'Databases') return <Emoji>🗄️</Emoji>;
  if (section === 'Cloud') return <Emoji>☁️</Emoji>;
  if (section === 'Languages') return <Emoji>🌐</Emoji>;
  return <Emoji>🔧</Emoji>;
};

const Skills = () => {
  useGSAP(() => {
    gsap.from('#skills .skill-card', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.08,
      scrollTrigger: { trigger: '#skills', start: 'top 75%' },
    });
    gsap.from('#skills li', {
      opacity: 0,
      y: 10,
      duration: 0.4,
      ease: 'power2.out',
      stagger: 0.02,
      scrollTrigger: { trigger: '#skills', start: 'top 70%' },
    });
  }, []);

  return (
    <section id="skills" className="container mx-auto px-6 py-24">
      <h2 className="text-4xl md:text-5xl font-modern-negra mb-10">Skills</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SECTIONS.map((section, idx) => (
          <div key={idx} className="skill-card rounded-2xl border border-white/10 p-6 bg-white/5 backdrop-blur">
            <h3 className="text-xl font-semibold">{section.title}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {section.items.map((item, i) => (
                <li
                  key={i}
                  className="px-3 py-1 rounded-full border border-white/15 text-white/80 text-sm flex items-center gap-2"
                >
                  <Logo name={item} section={section.title} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;