import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Projects from './components/Projects.jsx';
import Contact from './components/Contact.jsx';


const App = () => {
  return (
    <main className='relative overflow-hidden'>
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Contact />
    </main>
  );
};

export default App;