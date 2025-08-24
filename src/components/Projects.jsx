import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect } from 'react';

const PROJECTS = [
  {
    name: 'SmartHomes',
    stack: 'React.js · Servlets · MySQL · MongoDB · ElasticSearch · Docker · OpenAI',
    timeline: 'Sep 2024 – Nov 2024',
    desc: 'Built a scalable e-commerce platform with React.js frontend and Servlets backend, integrating MySQL and MongoDB databases. Leveraged ElasticSearch for lightning-fast product search, containerized services using Docker, and integrated an OpenAI-powered AI assistant to deliver personalized shopping experiences, intelligent recommendations, and efficient handling of user queries in real time.',
  },{
    name: 'Connect',
    stack: 'React.js · Express.js · MySQL',
    timeline: 'Jan 2022 - May 2022',
    desc: '“Developed a full-stack social media application using React.js, Express.js, and MySQL. Implemented essential features such as posting, liking, sharing, commenting, real-time chatting, and group creation, ensuring smooth user interaction and scalability, while focusing on performance optimization and a responsive design for seamless engagement across devices.',
  },
  {
    name: 'Voice Assistant',
    stack: 'Python',
    timeline: 'Jun 2021 – Jul 2021',
    desc: 'Created a Python-based desktop voice assistant that leverages APIs to process natural spoken language, interact with computer systems, and integrate with web services. The assistant efficiently executes system commands, fetches real-time results, and automates routine tasks, providing users with a seamless, voice-driven interface for productivity and convenience.',
  }
];

const Projects = () => {




  
  useGSAP(() => {

    let stackCards = gsap.utils.toArray(".stackCard");

  let stickDistance = 0;

  let firstCardST = ScrollTrigger.create({
    trigger: stackCards[0],
    start: "center center"
  });

  let lastCardST = ScrollTrigger.create({
    trigger: stackCards[stackCards.length-1],
    start: "center center"
  });

  stackCards.forEach((card, index) => {

    var scale = 1 - (stackCards.length - index) * 0.025;
    let scaleDown = gsap.to(card, {scale: scale, 'transform-origin': '"50% '+ (lastCardST.start + stickDistance) +'"' });

    ScrollTrigger.create({
      trigger: card,
      start: "center center",
      end: () => lastCardST.start + stickDistance,
      pin: true,
      pinSpacing: false,
      ease: "none",
      animation: scaleDown,
      toggleActions: "restart none none reverse"
    });
  });

  }, []);

  return (
    <section id="projects" className="center container mx-auto px-6 py-24 ">
      {/* <div className="blob size-[30vmax] left-[-8vmax] top-[20%]" style={{ background: 'linear-gradient(135deg, rgba(231,211,147,0.22), rgba(0,0,0,0))' }} /> */}
      <h1 className="special-font hero-heading text-blue-75">
        <b>Projects</b>
      </h1>
      

      <div className='flex items-center justify-center flex-col relative container mx-auto px-6 py-24 nopadding'>
        <section className="cardStacking ">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12">
                <div className="cardStacking__cards">
                  <div className="stackCard d-flex align-items-center justify-content-between glass-card glass-border" >
                    <div className="stackCard__body d-flex align-items-center justify-content-between">
                        <div className="flex items-center justify-between gap-3 flex-wrap pb-4">
                          <h3 className="text-3xl font-medium ">{PROJECTS[0].name}</h3>
                          <span className="text-s uppercase font-medium tracking-wider text-white/60">{PROJECTS[0].timeline}</span>  
                        </div>
                        <span className="text-s uppercase font-medium  tracking-wider text-white/60 ">{PROJECTS[0].stack}</span>
                        <p className="mt-3 text-lg text-white/80 pt-7">{PROJECTS[0].desc}</p>
                    </div>
                  </div>

                  <div className="stackCard d-flex align-items-center justify-content-between glass-card glass-border" >
                      <div className="stackCard__body d-flex align-items-center justify-content-between">
                            <div className="flex items-center justify-between gap-3 flex-wrap pb-4">
                              <h3 className="text-3xl font-medium ">{PROJECTS[1].name}</h3>
                              <span className="text-s uppercase font-medium tracking-wider text-white/60">{PROJECTS[1].timeline}</span>  
                            </div>
                            <span className="text-s uppercase font-medium  tracking-wider text-white/60 ">{PROJECTS[1].stack}</span>
                            <p className="mt-3 text-lg  text-white/80 pt-7">{PROJECTS[1].desc}</p>
                        </div>
                  </div>

                  <div className="stackCard d-flex align-items-center justify-content-between glass-card glass-border" >
                      <div className="stackCard__body d-flex align-items-center justify-content-between">
                            <div className="flex items-center justify-between gap-3 flex-wrap pb-4">
                              <h3 className="text-3xl font-medium ">{PROJECTS[2].name}</h3>
                              <span className="text-s uppercase tracking-wider text-white/60">{PROJECTS[2].timeline}</span>  
                            </div>
                            <span className="text-s uppercase font-medium  tracking-wider text-white/60 ">{PROJECTS[2].stack}</span>
                            <p className="mt-3 text-lg text-white/80 pt-7">{PROJECTS[2].desc}</p>
                        </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        </div>

    </section>
  );
};

export default Projects;
