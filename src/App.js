import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { Play, ArrowUpRight, Instagram, Mail, ChevronRight, Zap, Briefcase, Award, Sparkles, Send, Check, Loader2, Wand2, Bot, Github } from 'lucide-react';
import './App.css'; // This links your CSS file

// --- CONFETTI SPARK EFFECT ---

const AntigravitySpark = ({ delay = 0, duration = 6, colorIndex = 0 }) => {
  const randomX = Math.random() * 100;
  const randomRotation = Math.random() * 360;
  const randomScale = Math.random() * 1 + 1; // Increased from 0.5 to 1
  const randomDuration = duration + Math.random() * 3;

  // Color palette: Red, Pink, Blue
  const colors = [
    { gradient: 'from-red-400 via-red-200 to-red-100', glow: 'rgba(248, 113, 113, 0.75)' }, // Red
    { gradient: 'from-pink-400 via-pink-200 to-pink-100', glow: 'rgba(244, 114, 182, 0.75)' }, // Pink
    { gradient: 'from-blue-400 via-blue-200 to-blue-100', glow: 'rgba(96, 165, 250, 0.75)' }, // Blue
  ];

  const color = colors[colorIndex % 3];

  return (
    <motion.div
      initial={{ 
        x: `${randomX}vw`, 
        y: "100vh", 
        rotate: randomRotation,
        opacity: 0.75,
        scale: randomScale 
      }}
      animate={{ 
        y: "-10vh",
        x: `${randomX + (Math.random() - 0.5) * 10}vw`,
        rotate: randomRotation + 720,
        opacity: [0.75, 0.75, 0]
      }}
      transition={{ 
        duration: randomDuration, 
        delay: delay, 
        ease: "easeOut"
      }}
      className="fixed pointer-events-none"
    >
      <div className={`w-2 h-2 bg-gradient-to-br ${color.gradient} rounded-full shadow-lg`}
        style={{
          boxShadow: `0 0 12px ${color.glow}, 0 0 24px ${color.glow.replace('0.75', '0.4')}, 0 0 36px ${color.glow.replace('0.75', '0.2')}`
        }}
      />
    </motion.div>
  );
};

const ConfettiSparks = React.memo(() => {
  const [sparks, setSparks] = useState([]);
  const colorIndexRef = useRef(0);

  useEffect(() => {
    // Generate initial sparks (increased from 20 to 35)
    const initialSparks = Array.from({ length: 35 }, (_, i) => ({
      id: i,
      delay: i * 0.05,
      colorIndex: i % 3,
    }));
    setSparks(initialSparks);
    colorIndexRef.current = 35;

    // Create new sparks continuously (faster interval)
    const interval = setInterval(() => {
      setSparks(prev => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          delay: 0,
          colorIndex: (colorIndexRef.current++) % 3,
        }
      ]);
    }, 500); // Reduced from 800 to 500 for even more density

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {sparks.map(spark => (
        <AntigravitySpark key={spark.id} delay={spark.delay} duration={9} colorIndex={spark.colorIndex} />
      ))}
    </div>
  );
});

ConfettiSparks.displayName = "ConfettiSparks";

// --- COMPONENTS ---

const AuraLogo = React.memo(({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <motion.path 
      d="M50 5 L95 80 L5 80 Z" 
      stroke="#000000" 
      strokeWidth="4" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, ease: "easeInOut" }}
    />
    <motion.path 
      d="M50 30 L75 70 L25 70 Z" 
      fill="#000000"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 0.1, scale: 1 }}
      transition={{ delay: 1, duration: 1 }}
    />
  </svg>
));

const CustomCursor = React.memo(() => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const ringX = useMotionValue(-100);
  const ringY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 700, mass: 0.1 };
  const ringSpringConfig = { damping: 30, stiffness: 200, mass: 0.5 };

  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  const ringXSpring = useSpring(ringX, ringSpringConfig);
  const ringYSpring = useSpring(ringY, ringSpringConfig);

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 4);
      cursorY.set(e.clientY - 4);
      ringX.set(e.clientX - 16);
      ringY.set(e.clientY - 16);
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('a, button, input, textarea, .interactive')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, ringX, ringY]);

  return (
    <>
      <motion.div
        className="custom-cursor fixed top-0 left-0 w-2 h-2 bg-black rounded-full pointer-events-none z-[100]"
        style={{ x: cursorXSpring, y: cursorYSpring, scale: isHovering ? 0 : 1 }}
      />
      <motion.div
        className="custom-cursor fixed top-0 left-0 w-8 h-8 border border-black/30 rounded-full pointer-events-none z-[99]"
        style={{ 
          x: ringXSpring, 
          y: ringYSpring,
          scale: isHovering ? 1.5 : 1,
          backgroundColor: isHovering ? 'rgba(0,0,0,0.05)' : 'transparent',
          borderColor: isHovering ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.3)',
        }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
});

const MagneticButton = React.memo(({ children, className, onClick, primary = false }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  const { x, y } = position;

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-full group interactive transition-shadow duration-300 ${
        primary 
          ? 'bg-black text-white font-semibold shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_25px_rgba(0,0,0,0.25)]' 
          : 'bg-white/60 border border-white/40 text-black backdrop-blur-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-md hover:bg-white/80'
      } ${className}`}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
});

const TiltCard = React.memo(({ children, className }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        rotateX, 
        rotateY, 
        transformStyle: "preserve-3d",
        boxShadow: "0 20px 50px rgba(0,0,0,0.05), inset 0 0 0 1px rgba(255,255,255,0.5), inset 0 20px 40px rgba(255,255,255,0.6)"
      }}
      className={`relative rounded-[24px] bg-white/30 backdrop-blur-[40px] p-8 transition-colors hover:bg-white/40 interactive ${className}`}
    >
      <div style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }} className="w-full h-full">
        {children}
      </div>
      <motion.div 
        className="absolute inset-0 rounded-[24px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: useTransform(
            [mouseXSpring, mouseYSpring],
            ([mx, my]) => `radial-gradient(circle at ${(mx + 0.5) * 100}% ${(my + 0.5) * 100}%, rgba(255, 255, 255, 0.5), transparent 60%)`
          )
        }}
      />
    </motion.div>
  );
});

const SectionHeading = React.memo(({ children, subtitle }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="mb-16"
  >
    {subtitle && (
      <h4 className="text-black/60 font-semibold tracking-wider uppercase text-sm mb-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-black" /> {subtitle}
      </h4>
    )}
    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-black">
      {children}
    </h2>
  </motion.div>
));

const Loader = React.memo(({ onComplete }) => {
  return (
    <motion.div
      key="loader"
      exit={{ opacity: 0, filter: "blur(20px)" }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#F7F9FC]"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <AuraLogo className="w-20 h-20 mb-6" />
        <div className="overflow-hidden">
          <motion.h1 
            initial={{ y: 40 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl tracking-[0.3em] font-light text-black"
          >
            AURA
          </motion.h1>
        </div>
      </motion.div>
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: "200px" }}
        transition={{ delay: 1, duration: 1.5, ease: "easeInOut" }}
        onAnimationComplete={onComplete}
        className="h-[1px] bg-gradient-to-r from-transparent via-black/50 to-transparent mt-8"
      />
    </motion.div>
  );
});

// --- GEMINI API HELPER ---
const callGeminiAPI = async (prompt, systemPrompt) => {
  const apiKey = ""; // API key is provided by the execution environment
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] }
  };

  const delays = [1000, 2000, 4000, 8000, 16000];
  
  for (let i = 0; i < 5; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      return result.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
    } catch (error) {
      if (i === 4) throw error; // Re-throw on final failure
      await new Promise(res => setTimeout(res, delays[i])); // Exponential backoff
    }
  }
};

// --- AI CONCEPT STUDIO COMPONENT ---
const AIConceptStudio = React.memo(() => {
  const [idea, setIdea] = useState("");
  const [concept, setConcept] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!idea.trim()) return;
    setIsGenerating(true);
    setError("");
    setConcept("");

    const systemPrompt = `You are an expert creative director and cinematic video editor assistant working for Vivin M. 
    The user will give you a rough product or idea. You must generate a highly engaging, 3-part storyboard concept designed for maximum viewer retention (perfect for TikTok/Reels/Shorts in 4K cinematic style). 
    Keep it extremely punchy and under 100 words. Format with bold headers: '1. The Hook:', '2. The Build-up:', '3. The CTA:'. Avoid emojis.`;

    try {
      const result = await callGeminiAPI(`My idea is: ${idea}`, systemPrompt);
      setConcept(result);
    } catch (err) {
      setError("Oops! The AI needs a quick break. Try again in a moment.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative rounded-[3rem] bg-white/40 backdrop-blur-[40px] p-10 md:p-16 border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
      <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
        <Bot className="w-40 h-40 text-black" />
      </div>
      
      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-black/5 text-sm font-bold tracking-widest uppercase mb-6 shadow-sm">
          <Sparkles className="w-4 h-4 text-indigo-500" /> AI Co-Creator
        </div>
        <h3 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 text-black">Brainstorm your next viral hit.</h3>
        <p className="text-black/60 text-lg mb-8 font-light">Type a raw product or brand idea below, and my custom AI assistant will instantly draft a high-retention video concept for us to build together.</p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input 
            type="text" 
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="e.g., A sleek new coffee brand..." 
            className="flex-1 bg-white/50 border border-black/10 rounded-2xl px-6 py-4 text-black focus:outline-none focus:border-black/30 focus:bg-white transition-all shadow-inner placeholder:text-black/40"
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <MagneticButton primary onClick={handleGenerate} className="py-4 px-8" disabled={isGenerating}>
            {isGenerating ? <><Loader2 className="w-5 h-5 animate-spin" /> Thinking...</> : "✨ Generate Concept"}
          </MagneticButton>
        </div>

        <AnimatePresence mode="wait">
          {concept && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-6 rounded-2xl bg-white/60 border border-black/5 shadow-sm"
            >
              <div className="prose prose-sm md:prose-base prose-black max-w-none">
                {concept.split('\n').map((line, i) => {
                  if (line.includes('The Hook:')) return <p key={i}><strong className="text-indigo-600">The Hook:</strong> {line.replace(/.*The Hook:\s*/i, '')}</p>;
                  if (line.includes('The Build-up:')) return <p key={i}><strong className="text-blue-600">The Build-up:</strong> {line.replace(/.*The Build-up:\s*/i, '')}</p>;
                  if (line.includes('The CTA:')) return <p key={i}><strong className="text-purple-600">The CTA:</strong> {line.replace(/.*The CTA:\s*/i, '')}</p>;
                  return line ? <p key={i} className="text-black/80">{line}</p> : null;
                })}
              </div>
            </motion.div>
          )}
          {error && <p className="text-red-500 font-medium">{error}</p>}
        </AnimatePresence>
      </div>
    </div>
  );
});

// --- MAIN APPLICATION ---

export default function App() {
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  
  // Form State
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDraftingMessage, setIsDraftingMessage] = useState(false);

  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleDraftMessage = async () => {
    if (!formState.message.trim()) return;
    setIsDraftingMessage(true);
    
    const systemPrompt = `You are an AI assistant helping a client write a professional, polite inquiry email to Vivin M (a professional video editor and AI student). 
    The client has typed some rough notes. Turn these notes into a clean, concise, enthusiastic professional message (max 3 sentences) asking to collaborate or get a quote. 
    DO NOT include subject lines, greetings like "Dear Vivin", or sign-offs like "Best regards, [Name]". Just write the core message body seamlessly.`;

    try {
      const drafted = await callGeminiAPI(`Rough notes to expand: ${formState.message}`, systemPrompt);
      setFormState(prev => ({ ...prev, message: drafted }));
    } catch (err) {
      console.error("Failed to draft message", err);
    } finally {
      setIsDraftingMessage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const access_key = "1f7134f5-8a51-4231-a3da-5cbcca9bb5df"; 
      
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: access_key,
          name: formState.name,
          email: formState.email,
          message: formState.message,
          subject: "New Message from Aura Portfolio Website",
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormState({ name: '', email: '', message: '' }); // Clear form
        
        // Reset success message after 5 seconds
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        setIsSubmitting(false);
        alert("Failed to send message. Please check your Access Key.");
      }
    } catch (error) {
      setIsSubmitting(false);
      alert("An error occurred. Please check your connection and try again.");
    }
  };

  // SEO & Meta Tags Optimization Effect
  useEffect(() => {
    document.title = "Aura – Visual Experience by Vivin M";
    
    const setMeta = (name, content, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    setMeta('description', 'Portfolio of Vivin M - Professional Video Editor & Entrepreneur. Crafting high-end 4K visual content and cinematic storytelling.');
    setMeta('keywords', 'Vivin M, Aura, Video Editor, Motion Design, After Effects, Premiere Pro, Entrepreneur, 4K Editing, Portfolio');
    setMeta('author', 'Vivin M');
    setMeta('og:title', 'Aura – Visual Experience by Vivin M', true);
    setMeta('og:description', 'Professional Video Editor & Entrepreneur portfolio.', true);
    setMeta('og:type', 'website', true);
  }, []);

  return (
    <>
      <CustomCursor />
      <ConfettiSparks />
      
      <AnimatePresence>
        {loading && <Loader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <div className="bg-grain" />

      {/* Minimal Ambient Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(230,224,255,0.15)_0%,transparent_70%)] pointer-events-none" />
      </div>

      {!loading && (
        <motion.div 
          initial={{ opacity: 0, filter: "blur(20px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative z-10"
        >
          {/* Navbar */}
          <nav className="fixed top-0 w-full z-50 px-6 py-6 md:px-12 flex justify-between items-center bg-white/60 backdrop-blur-[20px] border-b border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3">
              <AuraLogo className="w-8 h-8" />
              <span className="text-xl font-bold tracking-widest uppercase text-black">Aura</span>
            </div>
            <MagneticButton primary className="px-4 py-2 md:px-6 md:py-2 text-xs md:text-sm" onClick={() => document.getElementById('contact').scrollIntoView()}>
              Let's Talk
            </MagneticButton>
          </nav>

          {/* Hero Section */}
          <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 pt-20 bg-[#F7F9FC]">
            <div className="max-w-6xl mx-auto w-full relative z-10">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[900px] h-[600px] md:h-[900px] bg-[radial-gradient(circle_at_center,rgba(230,224,255,0.35)_0%,transparent_70%)] rounded-full blur-[80px] pointer-events-none -z-10"
              />
              
              <div className="overflow-hidden mb-4">
                <motion.div 
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-3 mb-4" // UPDATED: Flex container for Logo + Text
                >
                  {/* 👇 YOUR LOGO HERE (Make sure mylogo.png is in the public folder) */}
                  <img 
                    src="/mylogo.png" 
                    alt="Logo" 
                    className="w-10 h-10 object-cover rounded-full border border-black/10 shadow-sm"
                  />
                  
                  <p className="text-black/60 font-semibold tracking-widest uppercase text-sm md:text-base">
                    Vivin M • @aura.edit_ae
                  </p>
                </motion.div>
              </div>

              <div className="overflow-hidden py-2">
                <motion.h1 
                  initial={{ y: "100%", rotate: 2 }}
                  animate={{ y: 0, rotate: 0 }}
                  transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-5xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[1.1] text-black"
                >
                  Crafting Visual<br/>Stories in 4K.
                </motion.h1>
              </div>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="text-xl md:text-2xl text-black/60 mt-8 max-w-2xl font-light"
              >
                <span className="text-black font-semibold">Editor.</span> Creator. Entrepreneur. <span className="text-black italic">AI Student.</span>
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="flex flex-wrap gap-4 mt-12"
              >
                <MagneticButton primary className="px-8 py-4 text-lg" onClick={() => document.getElementById('portfolio').scrollIntoView()}>
                  View My Work <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform text-white" />
                </MagneticButton>
                <MagneticButton className="px-8 py-4 text-lg" onClick={() => document.getElementById('contact').scrollIntoView()}>
                  Contact Me
                </MagneticButton>
              </motion.div>
            </div>
            
            {/* Scroll Indicator */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
              <span className="text-xs tracking-widest text-black/40 uppercase font-semibold">Scroll</span>
              <div className="w-[1px] h-12 bg-black/10 relative overflow-hidden">
                <motion.div 
                  animate={{ y: ["-100%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute top-0 left-0 w-full h-1/2 bg-black"
                />
              </div>
            </motion.div>
          </section>

          {/* About & Skills Section */}
          <section id="about" className="py-32 px-6 md:px-12 max-w-7xl mx-auto bg-transparent">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              {/* About */}
              <div>
                <SectionHeading subtitle="The Mindset">Beyond Editing.</SectionHeading>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="space-y-6 text-lg text-black/70 leading-relaxed font-light"
                >
                  <p>
                    I'm Vivin M, a professional video editor, entrepreneur, and an <strong className="text-black font-semibold">AI student pursuing a BSc in CS(AI)</strong>. With <strong className="text-black font-semibold">2.5 years of professional editing experience</strong>, I specialize in crafting high-retention, cinematic visual stories in 4K that capture attention and drive engagement.
                  </p>
                  <p>
                    But I'm not just an editor. My <strong className="text-black font-semibold">3 years of entrepreneurial experience</strong> have shaped how I approach every frame. I don't just cut clips; I understand the business goal behind the content.
                  </p>
                  <div className="pt-6 border-t border-black/10 flex gap-12">
                    <div>
                      <div className="text-4xl font-bold text-black mb-2">2.5<span className="text-black/40">+</span></div>
                      <div className="text-sm uppercase tracking-wider text-black/50 font-semibold">Years Editing</div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-black mb-2">3<span className="text-black/40">+</span></div>
                      <div className="text-sm uppercase tracking-wider text-black/50 font-semibold">Years Business</div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Skills */}
              <div className="flex flex-col justify-center">
                <div className="space-y-8">
                  {[
                    { name: 'Adobe After Effects', value: 95 },
                    { name: 'Adobe Premiere Pro', value: 92 },
                    { name: 'Motion Design', value: 88 },
                    { name: '4K Editing & Color Grading', value: 95 },
                    { name: 'Adobe Photoshop', value: 85 }
                  ].map((skill, index) => (
                    <motion.div 
                      key={skill.name}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group"
                    >
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-black font-semibold tracking-wide">{skill.name}</span>
                        <span className="text-black/50 font-medium">{skill.value}%</span>
                      </div>
                      <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden relative shadow-inner">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.value}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, delay: 0.2 + (index * 0.1), ease: "easeOut" }}
                          className={`absolute top-0 left-0 h-full bg-black rounded-full`}
                        >
                          {/* Shimmer effect */}
                          <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse" />
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Business & Entrepreneurship Section */}
          <section className="py-32 px-6 md:px-12 relative bg-[#F7F9FC] overflow-hidden">
             {/* Background glow to enhance the liquid glass effect */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(223,244,255,0.6)_0%,transparent_70%)] rounded-full blur-[100px] pointer-events-none" />
             
            <div className="max-w-7xl mx-auto relative z-10">
              <SectionHeading subtitle="Entrepreneurial Journey">Building Businesses.</SectionHeading>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <TiltCard className="flex flex-col justify-between group">
                  <div style={{ transform: "translateZ(40px)" }}>
                    <div className="w-16 h-16 rounded-2xl bg-black/5 flex items-center justify-center mb-8 border border-black/10 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                      <Zap className="w-8 h-8 text-black" />
                    </div>
                    <h3 className="text-3xl font-bold mb-4 text-black">Granite Laser Engraving</h3>
                    <p className="text-black/60 text-lg leading-relaxed mb-8 font-light">
                      Started during my school years as a part-time venture. Scaled operations to generate <span className="text-black font-semibold">₹6+ Lakhs in revenue</span> over 2.5 years.
                    </p>
                  </div>
                  <div style={{ transform: "translateZ(60px)" }} className="inline-flex items-center gap-2 text-black font-semibold">
                    View Case Study <ChevronRight className="w-4 h-4" />
                  </div>
                </TiltCard>

                <TiltCard className="flex flex-col justify-between group">
                  <div style={{ transform: "translateZ(40px)" }}>
                    <div className="w-16 h-16 rounded-2xl bg-black/5 flex items-center justify-center mb-8 border border-black/10 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                      <Briefcase className="w-8 h-8 text-black" />
                    </div>
                    <h3 className="text-3xl font-bold mb-4 text-black">Biofloc Fish Farming</h3>
                    <p className="text-black/60 text-lg leading-relaxed mb-8 font-light">
                      An entrepreneurial leap into modern aquaculture. Implementing biofloc technology to create sustainable, high-yield fish farming systems.
                    </p>
                  </div>
                  <div style={{ transform: "translateZ(60px)" }} className="inline-flex items-center gap-2 text-black font-semibold">
                    View Details <ChevronRight className="w-4 h-4" />
                  </div>
                </TiltCard>
              </div>
            </div>
          </section>

          {/* Experience Timeline */}
          <section className="py-32 px-6 md:px-12 bg-[#EDF1F7] border-y border-[#E4EBF5] relative">
            <div className="max-w-4xl mx-auto">
              <SectionHeading subtitle="The Path">Evolution.</SectionHeading>
              
              <div className="relative pl-8 md:pl-0">
                {/* Vertical Line */}
                <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-black/20 via-black/10 to-transparent -translate-x-1/2" />

                {[
                  { year: "Present", title: "Professional Video Editor", desc: "Crafting high-end 4K visual content for premium clients, combining motion design with cinematic storytelling.", align: "right", icon: <Play className="w-4 h-4 text-black" /> },
                  { year: "2025", title: "Biofloc Fish Farming", desc: "Launched second entrepreneurial venture, focusing on sustainable and tech-driven aquaculture.", align: "left", icon: <Briefcase className="w-4 h-4 text-black" /> },
                  { year: "2023 - 2025", title: "Granite Laser Engraving", desc: "Scaled a part-time school business to ₹6L revenue, learning sales, operations, and scaling.", align: "right", icon: <Award className="w-4 h-4 text-black" /> },
                  { year: "The Beginning", title: "Creative Spark", desc: "Discovered the passion for video editing and business, laying the foundation for Aura.", align: "left", icon: <Sparkles className="w-4 h-4 text-black" /> }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`relative flex flex-col md:flex-row items-start md:items-center justify-between mb-16 last:mb-0 ${item.align === 'right' ? 'md:flex-row-reverse' : ''}`}
                  >
                    {/* Node */}
                    <div className="absolute left-[-40px] md:left-1/2 w-10 h-10 rounded-full bg-white border-2 border-black flex items-center justify-center -translate-x-1/2 z-10 shadow-[0_4px_15px_rgba(0,0,0,0.08)]">
                      {item.icon}
                    </div>
                    
                    {/* Content */}
                    <div className={`w-full md:w-[45%] ${item.align === 'right' ? 'md:pl-12 text-left' : 'md:pr-12 md:text-right'} pl-6 md:pl-0`}>
                      <span className="text-black/60 font-mono text-sm tracking-widest font-semibold">{item.year}</span>
                      <h4 className="text-2xl font-bold text-black mt-2 mb-3">{item.title}</h4>
                      <p className="text-black/60 leading-relaxed font-light">{item.desc}</p>
                    </div>
                    
                    {/* Empty spacer for grid alignment on desktop */}
                    <div className="hidden md:block w-[45%]" />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Portfolio Section */}
          <section id="portfolio" className="py-32 px-6 md:px-12 max-w-7xl mx-auto bg-transparent">
            <SectionHeading subtitle="Selected Works">Visual Portfolio.</SectionHeading>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  id: 1,
                  title: "Cinematic Reel 01",
                  category: "Motion Design • 4K",
                  videoUrl: "/reel1.mp4" 
                },
                {
                  id: 2,
                  title: "Cinematic Reel 02",
                  category: "VFX • 4K",
                  videoUrl: "/reel2.mp4" 
                },
                {
                  id: 3,
                  title: "Cinematic Reel 03",
                  category: "Color Grading • 4K",
                  videoUrl: "/reel3.mp4"
                },
                {
                  id: 4,
                  title: "Cinematic Reel 04",
                  category: "Content • 4K",
                  videoUrl: "/reel4.mp4"
                }
              ].map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="group relative overflow-hidden rounded-[24px] aspect-[16/9] bg-[#FFFFFF] border border-[#E4EBF5] shadow-[0_10px_30px_rgba(0,0,0,0.05)] cursor-pointer interactive"
                >
                  {/* Background Video */}
                  <video
                    src={item.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-white/40 group-hover:bg-white/10 transition-colors duration-500" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-between">
                    <div className="flex justify-end">
                      <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-black/5 flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <Play className="w-5 h-5 text-black ml-1" />
                      </div>
                    </div>
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-sm font-bold tracking-widest text-black/60 uppercase mb-2">{item.category}</p>
                      <h4 className="text-2xl font-bold text-black shadow-white drop-shadow-md">{item.title}</h4>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-16 flex justify-center">
              <MagneticButton className="px-8 py-4">
                View Full Archive <ArrowUpRight className="w-4 h-4 text-black" />
              </MagneticButton>
            </div>
          </section>

          {/* AI Concept Studio Section */}
          <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto relative z-20">
            <AIConceptStudio />
          </section>

          {/* Contact Section */}
          <section id="contact" className="py-32 px-6 md:px-12 relative overflow-hidden bg-[#FFFFFF]">
             {/* Background glow */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#DFF4FF] rounded-full blur-[150px] pointer-events-none opacity-60" />

            <div className="max-w-4xl mx-auto relative z-10 bg-white/60 border border-white/40 backdrop-blur-[20px] rounded-[3rem] p-10 md:p-20 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
              <div className="text-center mb-16">
                <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-black">Let's Create<br/>Something Epic.</h2>
                <p className="text-xl text-black/60 font-light">Available for freelance opportunities and collaborations.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div>
                    <h4 className="text-sm uppercase tracking-widest text-black/50 font-semibold mb-2">Social</h4>
                    <div className="flex flex-col gap-3">
                      {/* Instagram */}
                      <a href="https://instagram.com/aura.edit_ae" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 text-xl font-bold text-black hover:opacity-70 transition-opacity group interactive">
                        <Instagram className="w-6 h-6" /> @aura.edit_ae
                        <ArrowUpRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </a>
                      
                      {/* GitHub (NEW ADDITION) */}
                      <a href="https://github.com/YOUR_USERNAME" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 text-xl font-bold text-black hover:opacity-70 transition-opacity group interactive">
                        <Github className="w-6 h-6" /> /vivin-m
                        <ArrowUpRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </a>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm uppercase tracking-widest text-black/50 font-semibold mb-2">Direct</h4>
                    <a href="mailto:auraeditae@gmail.com" className="inline-flex items-center gap-3 text-xl font-bold text-black hover:opacity-70 transition-opacity group interactive">
                      <Mail className="w-6 h-6" /> auraeditae@gmail.com
                      <ArrowUpRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </a>
                  </div>
                </div>

                <form className="space-y-6 flex flex-col" onSubmit={handleSubmit}>
                  <div className="relative group">
                    <input type="text" name="name" required value={formState.name} onChange={handleInputChange} placeholder="Your Name" className="w-full bg-transparent border-b border-black/10 pb-4 text-lg text-black focus:outline-none focus:border-black transition-colors placeholder:text-black/40" />
                    <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-black group-focus-within:w-full transition-all duration-500" />
                  </div>
                  <div className="relative group">
                    <input type="email" name="email" required value={formState.email} onChange={handleInputChange} placeholder="Your Email" className="w-full bg-transparent border-b border-black/10 pb-4 text-lg text-black focus:outline-none focus:border-black transition-colors placeholder:text-black/40" />
                    <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-black group-focus-within:w-full transition-all duration-500" />
                  </div>
                  <div className="relative group pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-black/50 uppercase tracking-widest">Project Details</span>
                      <button 
                        type="button" 
                        onClick={handleDraftMessage}
                        disabled={isDraftingMessage || !formState.message}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 disabled:opacity-40 disabled:hover:text-indigo-600"
                        title="Type a few keywords and click to auto-draft a professional message"
                      >
                        {isDraftingMessage ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                        ✨ Auto-Draft with AI
                      </button>
                    </div>
                    <textarea placeholder="Type some rough notes here..." name="message" required value={formState.message} onChange={handleInputChange} rows={3} className="w-full bg-transparent border-b border-black/10 pb-4 text-lg text-black focus:outline-none focus:border-black transition-colors placeholder:text-black/40 resize-none" />
                    <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-black group-focus-within:w-full transition-all duration-500" />
                  </div>
                  
                  <MagneticButton primary className={`py-4 mt-6 w-full sm:w-auto self-start ${isSubmitting ? 'opacity-80 cursor-wait' : ''}`} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>Sending <Loader2 className="w-4 h-4 animate-spin" /></>
                    ) : isSubmitted ? (
                      <>Message Sent! <Check className="w-4 h-4 text-green-400" /></>
                    ) : (
                      <>Send Message <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                    )}
                  </MagneticButton>
                </form>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-8 px-6 text-center border-t border-[#E4EBF5] flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto text-sm text-black/50 font-medium bg-[#F7F9FC]">
            <p>© {new Date().getFullYear()} Aura by Vivin M. All rights reserved.</p>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <span>Crafted with</span>
              <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
              <span>in 4K</span>
            </div>
          </footer>
        </motion.div>
      )}
    </>
  );
}