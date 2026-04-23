/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useMemo, FormEvent } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  ArrowRight, 
  Zap, 
  Binary, 
  Cpu, 
  Eye, 
  Activity, 
  Plus, 
  ChevronDown,
  Monitor,
  Shield,
  Layers,
  Dna,
  Volume2,
  VolumeX
} from 'lucide-react';

// --- Components ---

const Scanlines = () => <div className="scanlines" />;
const Noise = () => <div className="noise-overlay" />;

const Marquee = ({ items }: { items: string[] }) => {
  return (
    <div className="overflow-hidden bg-[#00FF41] py-4 whitespace-nowrap flex border-y border-[#00FF41]/30">
      <motion.div 
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="flex"
      >
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} className="text-black font-black text-2xl px-8 uppercase flex items-center">
            {item} <Plus className="ml-8 w-6 h-6" />
          </span>
        ))}
      </motion.div>
    </div>
  );
};

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, input')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.div 
      className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] hidden md:block"
      animate={{ 
        x: position.x - 16, 
        y: position.y - 16,
        scale: isHovering ? 2 : 1,
        borderWidth: isHovering ? '1px' : '2px'
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 400, mass: 0.5 }}
    >
      <div className="w-full h-full border border-[#00FF41] rounded-none opacity-50 relative">
        <div className="absolute top-0 left-0 w-2 h-[1px] bg-[#00FF41]" />
        <div className="absolute top-0 left-0 w-[1px] h-2 bg-[#00FF41]" />
        <div className="absolute bottom-0 right-0 w-2 h-[1px] bg-[#00FF41]" />
        <div className="absolute bottom-0 right-0 w-[1px] h-2 bg-[#00FF41]" />
      </div>
    </motion.div>
  );
};

const Countdown = () => {
  const targetDate = useMemo(() => new Date('2026-05-20T20:00:00Z'), []);
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  const calculateTimeLeft = useCallback(() => {
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();
    
    if (difference > 0) {
      setTimeLeft({
        d: Math.floor(difference / (1000 * 60 * 60 * 24)),
        h: Math.floor((difference / (1000 * 60 * 60)) % 24),
        m: Math.floor((difference / 1000 / 60) % 60),
        s: Math.floor((difference / 1000) % 60),
      });
    }
  }, [targetDate]);

  useEffect(() => {
    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return (
    <div className="w-full border-y border-[#00FF41]/20 bg-[#00FF41]/5 py-6 md:py-10">
      <div className="max-w-[1600px] mx-auto px-4 md:px-10 flex flex-col gap-4">
        <div className="text-[10px] text-[#00FF41] font-black uppercase tracking-[0.6em] text-center md:text-left opacity-50">Ativação_Em_Curso</div>
        <div className="flex flex-nowrap justify-between items-center w-full font-mono tabular-nums text-[#00FF41]">
          {Object.entries(timeLeft).map(([label, value]) => (
            <div key={label} className="flex flex-col items-center flex-1 min-w-0">
              <span className="text-[12vw] sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-[-0.05em] leading-none whitespace-nowrap">
                {value.toString().padStart(2, '0')}
              </span>
              <span className="text-[7px] md:text-[10px] uppercase opacity-30 mt-2 tracking-[0.4em] font-bold">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: "O que é o VISTO_LAB?", a: "Uma plataforma experimental para explorar as fronteiras entre corpo, tecnologia e percepção através de interfaces sensíveis." },
    { q: "Como funciona a ativação?", a: "Ao entrar na lista, você receberá coordenadas para experiências imersivas, tanto digitais quanto presenciais, via protocolos criptografados." },
    { q: "É gratuito?", a: "O acesso inicial e as ativações experimentais são gratuitos para os primeiros exploradores da rede." },
    { q: "Quais tecnologias são usadas?", a: "Sistemas de visão computacional, biofeedback, processamento generativo e protocolos descentralizados de dados somáticos." }
  ];

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {faqs.map((faq, i) => (
        <div key={i} className="border border-[#00FF41]/20 overflow-hidden bg-white/[0.02]">
          <button 
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex justify-between items-center p-6 text-left hover:bg-[#00FF41]/10 transition-colors"
          >
            <span className="font-mono text-xs uppercase tracking-wider">{faq.q}</span>
            <Plus className={`w-4 h-4 transition-transform text-[#00FF41] ${openIndex === i ? 'rotate-45' : ''}`} />
          </button>
          <AnimatePresence>
            {openIndex === i && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 pt-0 text-white/40 font-light leading-relaxed text-xs uppercase">
                  {faq.a}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

const DnaIcon = () => <Dna className="w-20 h-20 text-[#00FF41] animate-pulse" />;

const SomaticFlow = () => {
  const canvasRef = useCallback((node: HTMLCanvasElement | null) => {
    if (node) {
      const ctx = node.getContext('2d');
      if (!ctx) return;

      let animationFrameId: number;
      let width = node.clientWidth;
      let height = node.clientHeight;

      const particles: { x: number, y: number, vx: number, vy: number, size: number }[] = [];
      const particleCount = 35;

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height + height * 0.2, // Começam um pouco mais abaixo
          vx: (Math.random() - 0.5) * 0.3,
          vy: -Math.random() * 0.6 - 0.1, // Movimento constante para CIMA
          size: Math.random() * 4 + 1
        });
      }

      const resize = () => {
        width = node.parentElement?.clientWidth || 0;
        height = node.parentElement?.clientHeight || 0;
        node.width = width;
        node.height = height;
      };

      window.addEventListener('resize', resize);
      resize();

      const draw = () => {
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = '#00FF41';
        ctx.fillStyle = '#00FF41';
        ctx.lineWidth = 0.5;

     particles.forEach((p, i) => {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < -50) p.y = height + 50; // Reseta no rodapé ao sair pelo topo

          // Desenha o Nodo com Glow (FORÇA MÁXIMA)
          ctx.shadowBlur = 25;
          ctx.shadowColor = '#00FF41';
          ctx.globalAlpha = 1.0;
          ctx.fillStyle = '#00FF41';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          // Connect (Rede Neural Hiper-Visível)
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist < 180) {
              ctx.globalAlpha = (1 - dist / 180) * 0.9;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        });

        animationFrameId = requestAnimationFrame(draw);
      };

      draw();
      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', resize);
      };
    }
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" />;
};

const ASCCI_CHARS = "01VISTOLAB<>[]{}/\\|!@#$%&*+=-_~^";

const ASCIILantern = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const updatePos = (x: number, y: number) => {
      setMousePos({ x, y });
      if (!isReady) setIsReady(true);
    };

    const handleMouseMove = (e: MouseEvent) => updatePos(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) updatePos(e.touches[0].clientX, e.touches[0].clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', (e) => {
      if (e.touches[0]) updatePos(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isReady]);

  // Gera uma grade massiva e ultra-densa com caracteres legíveis (15k caracteres)
  const asciiGrid = useMemo(() => {
    let raw = "";
    const iterations = 15000;
    for (let i = 0; i < iterations; i++) {
      raw += ASCCI_CHARS[Math.floor(Math.random() * ASCCI_CHARS.length)];
    }
    return raw;
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[5] overflow-hidden mix-blend-screen"
      style={{
        maskImage: isReady ? `radial-gradient(circle var(--reveal-radius, 350px) at ${mousePos.x}px ${mousePos.y}px, black 40%, transparent 95%)` : 'none',
        WebkitMaskImage: isReady ? `radial-gradient(circle var(--reveal-radius, 350px) at ${mousePos.x}px ${mousePos.y}px, black 40%, transparent 95%)` : 'none',
        opacity: isReady ? 1 : 0
      }}
    >
      <style>{`
        :root { --reveal-radius: 400px; }
        @media (max-width: 768px) { :root { --reveal-radius: 200px; } }
      `}</style>
      <div className="absolute inset-0 w-full h-full text-[#00FF41] font-mono text-[16px] leading-relaxed select-none opacity-40 drop-shadow-[0_0_10px_rgba(0,255,65,0.3)] break-all overflow-hidden whitespace-normal tracking-[0.5em] uppercase">
        {asciiGrid}
      </div>
    </div>
  );
};

const VideoMonitor = () => {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="relative w-full max-w-2xl mx-auto group">
      {/* Moldura do Monitor */}
      <div className="absolute -inset-4 border-2 border-[#00FF41]/10 rounded-sm pointer-events-none group-hover:border-[#00FF41]/30 transition-colors duration-700" />
      
      <div className="crt-screen aspect-video relative overflow-hidden bg-black shadow-[0_0_50px_rgba(0,255,65,0.1)]">
        <video
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover opacity-90 contrast-125 brightness-110"
        >
          <source 
            src="https://res.cloudinary.com/dwx6kf2f6/video/upload/f_auto,q_auto/v1776907882/VIDEO_LANDING_PAGE_1_h83o0a.mp4" 
            type="video/mp4" 
          />
        </video>

        {/* Static noise overlay */}
        <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/oEI9uWUeez9ZK/giphy.gif')] opacity-5 pointer-events-none mix-blend-overlay" />
      </div>

      {/* Control Panel (Outside Screen) */}
      <div className="mt-6 flex justify-between items-center border-t border-[#00FF41]/20 pt-4 px-2">
         <div className="flex gap-4">
            <div className="flex gap-1">
               <div className="w-1.5 h-1.5 bg-[#00FF41] animate-pulse rounded-full" />
               <div className="w-1.5 h-1.5 bg-[#00FF41]/20 rounded-full" />
               <div className="w-1.5 h-1.5 bg-[#00FF41]/20 rounded-full" />
            </div>
            <span className="text-[9px] text-[#00FF41]/50 tracking-[0.3em] font-black uppercase">Sincronia_Ativa</span>
         </div>

         <button 
           onClick={() => setIsMuted(!isMuted)}
           className="flex items-center gap-3 px-4 py-2 border border-[#00FF41]/30 hover:bg-[#00FF41] hover:text-black transition-all cursor-pointer group/btn"
         >
           <span className="text-[9px] font-black uppercase tracking-widest">{isMuted ? 'Audio_Off' : 'Audio_On'}</span>
           {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
         </button>
      </div>
    </div>
  );
};

const SystemFooter = () => (
  <footer className="w-full bg-[#050505] border-t-2 border-[#00FF41]">
    
    {/* ROW 1: INSTITUTIONAL LOGOS - FULL WIDTH INTERACTIVE */}
    <div className="w-full py-16 md:py-24 bg-[#CCFF00] flex flex-col items-center overflow-hidden border-b-2 border-black group cursor-crosshair transition-colors duration-700 hover:bg-black">
      <div className="relative w-full max-w-[1400px] px-6 md:px-20 transition-transform duration-700 group-hover:scale-[1.02]">
        <img 
          src="https://drive.google.com/thumbnail?id=1ZXJ1MQ-KW89XY23H5Qywt-yRlaxTDo4x&sz=w2000" 
          alt="Logos Institucionais" 
          className="w-full h-auto object-contain block group-hover:opacity-0 transition-opacity duration-500" 
          referrerPolicy="no-referrer"
        />
        <img 
          src="https://drive.google.com/thumbnail?id=1wiuKVl7TTphuQhoCUX0S6cxFdZ5HZw-I&sz=w2000" 
          alt="Logos Negative" 
          className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-500 px-6 md:px-20" 
          referrerPolicy="no-referrer"
        />
      </div>
    </div>

    {/* ROW 2: TELEMETRY (COUNTDOWN) */}
    <Countdown />

    <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-20">
      {/* ROW 3: SYSTEM DATA BLOCKS - 4 x 3 COLS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 border-t border-white/10 pt-8">
        
        {/* COL 1-3: STATUS AREA REPLACED */}
        <div className="md:col-span-3 flex flex-col gap-3">
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#00FF41]">Sistema</span>
          <div className="h-px w-full bg-[#00FF41]/20 my-1" />
          <div className="text-[11px] leading-relaxed uppercase opacity-60">
             Processo_Somatico: Ativado<br/>
             Fluxo_Data: Síncrono<br/>
             Terminal_ID: VSB_01
          </div>
        </div>

        {/* COL 4-6: LOCALIZAÇÃO */}
        <div className="md:col-span-3 flex flex-col gap-3">
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#00FF41]">Localização</span>
          <div className="h-px w-full bg-[#00FF41]/20 my-1" />
          <div className="text-[11px] leading-relaxed uppercase opacity-60">
            Studio Core0gam3<br/>
            Atelier LUGARzinho<br/>
            4° Distrito / POA_BR
          </div>
        </div>

        {/* COL 7-9: REDE / TRANSMIT */}
        <div className="md:col-span-3 flex flex-col gap-3">
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#00FF41]">Conexão</span>
          <div className="h-px w-full bg-[#00FF41]/20 my-1" />
          <div className="flex flex-col gap-2">
            <a href="https://www.instagram.com/projeto_visto/" target="_blank" rel="noopener noreferrer" className="text-[11px] uppercase opacity-60 hover:text-[#00FF41] hover:opacity-100 transition-all flex items-center gap-2 group">
              <div className="w-1 h-1 bg-[#00FF41]/40 group-hover:bg-[#00FF41]" /> @projeto_visto
            </a>
            <a href="https://www.youtube.com/@PROJETOVISTO/streams" target="_blank" rel="noopener noreferrer" className="text-[11px] uppercase opacity-60 hover:text-[#00FF41] hover:opacity-100 transition-all flex items-center gap-2 group">
              <div className="w-1 h-1 bg-[#00FF41]/40 group-hover:bg-[#00FF41]" /> @PROJETOVISTO
            </a>
          </div>
        </div>

        {/* COL 10-12: OPERAÇÃO */}
        <div className="md:col-span-3 flex flex-col gap-3">
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#00FF41]">Operação</span>
          <div className="h-px w-full bg-[#00FF41]/20 my-1" />
          <div className="flex flex-col">
            <span className="text-[11px] uppercase opacity-60">VISTO_SYSTEM v.4.0</span>
            <span className="text-[11px] uppercase text-[#00FF41]/40">Status: Sincronia Estável</span>
            <div className="mt-4 flex gap-8">
              <a href="#" className="text-[8px] uppercase opacity-30 hover:opacity-100 hover:text-[#00FF41] transition-all">Privacidade</a>
              <a href="#" className="text-[8px] uppercase opacity-30 hover:opacity-100 hover:text-[#00FF41] transition-all">Termos</a>
            </div>
          </div>
        </div>

      </div>

      {/* FINAL BASELINE */}
      <div className="mt-12 flex justify-between items-center text-[8px] uppercase tracking-[0.4em] opacity-20 border-t border-white/5 pt-6">
        <span>© 2026 V.I.S.T.O LAB _ REDE SOMÁTICA-DIGITAL</span>
        <span className="hidden md:block">Process_ID: VSL-0423-POA</span>
      </div>
    </div>
  </footer>
);

// --- Main App ---

export default function App() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [activeTensionIndex, setActiveTensionIndex] = useState(0);

  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  // Sincronia de Ciclo: Move o índice a cada 3.33s (baseado em 20s de animação do Marquee com 6 itens)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTensionIndex((prev) => (prev + 1) % 6);
    }, 3333);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          userAgent: window.navigator.userAgent
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Formato de resposta inválido' }));
        throw new Error(errorData.error || `Erro do servidor (${response.status})`);
      }

      const result = await response.json();
      if (result.status !== 'ok' || (result.debug && !result.emailSent)) {
        throw new Error(result.debug || 'Falha no processamento do e-mail');
      }

      setStatus('success');
    } catch (error: any) {
      console.error("Subscription failed:", error);
      setStatus('idle');
      alert(`Falha na ativação: ${error.message}. Verifique sua conexão ou tente novamente.`);
    }
  };

  const tensionItems = [
    "Objetos Digitais Interativos", 
    "Código Aberto", 
    "Workshops Gratuitos", 
    "Galeria de Arte Digital", 
    "Objetos Sonoros", 
    "Corpo como Interface"
  ];

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-[#00FF41] selection:text-black overflow-hidden font-mono">
      <Scanlines />
      <Noise />
      
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <motion.div 
          style={{ y: backgroundY }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#00FF41_0%,transparent_70%)]" 
        />
      </div>

      <div className="relative z-20 min-h-screen w-full flex flex-col md:grid md:grid-cols-[280px_1fr_300px] md:grid-rows-[80px_1fr_auto] border border-[#00FF41]/30">
        
        {/* LOGO AREA */}
        <div className="w-full md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-2 border-b-2 border-[#00FF41] flex items-center justify-between md:justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl md:text-2xl font-black tracking-[0.3em] neon-text"
          >
            VISTO_LAB
          </motion.div>
          
          <div className="md:hidden flex items-center gap-4">
             <div className="w-2 h-2 bg-[#00FF41] animate-pulse" />
             <span className="text-[9px] uppercase tracking-widest text-[#00FF41]">Sistema Ativo</span>
          </div>
        </div>

        {/* HEADER MAIN */}
        <div className="hidden md:flex col-start-2 col-end-4 row-start-1 row-end-2 border-b border-[#00FF41] items-center justify-between px-10 bg-[#00FF41]/5">
          <div className="text-[10px] uppercase tracking-widest text-white/40 max-w-xl">
            Plataforma experimental de operações digitais-somáticas. Hackeando a percepção através do código e do corpo.
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[8px] text-[#00FF41] font-black uppercase tracking-wider">Status: Online</span>
              <span className="text-[8px] text-white/20 uppercase">Protocolo_V.4</span>
            </div>
            <img 
              src="https://raw.githubusercontent.com/1projetovisto-web/visto_lab_landing/main/public/favicon.png" 
              alt="VISTO Logo" 
              className="w-10 h-10 object-contain brightness-125" 
            />
          </div>
        </div>

        {/* SIDEBAR LEFT */}
        <div className="hidden md:flex col-start-1 col-end-2 row-start-2 row-end-4 border-r border-[#00FF41]/30 p-6 flex-col justify-between relative overflow-hidden">
          <SomaticFlow />
          <div className="relative z-10">
            <span className="text-[10px] text-[#00FF41] block mb-4 tracking-[0.2em] uppercase">Status do Sistema</span>
            {tensionItems.map((item, i) => (
              <div key={i} className={`flex items-center gap-3 text-xs mb-4 transition-all duration-700 ${i === activeTensionIndex ? 'text-[#00FF41] font-black scale-105 drop-shadow-[0_0_12px_#00FF41]' : 'text-white/20'}`}>
                 <div className={`w-2.5 h-2.5 rounded-sm transition-all duration-700 ${i === activeTensionIndex ? 'bg-[#00FF41] shadow-[0_0_15px_#00FF41] animate-pulse' : 'bg-white/5'}`} /> 
                 <span className="tracking-widest">{item.toUpperCase()}</span>
              </div>
            ))}
          </div>

          <div className="border border-white/10 p-5 bg-white/[0.02]">
            <span className="text-[10px] text-[#00FF41] block mb-2 tracking-[0.2em] uppercase">O que é</span>
            <p className="text-[11px] leading-relaxed text-white/80 font-bold mb-4 uppercase">
              Laboratório de ativação sensorial em tempo real. Interação entre carne e hardware.
            </p>
            <div className="border border-[#00FF41] text-[#00FF41] px-3 py-1 text-[9px] inline-block rounded-full uppercase">
              Sistema Sensível
            </div>
          </div>
        </div>

        {/* CONTENT AREA (Middle) */}
        <div className="flex-1 md:col-start-2 md:col-end-3 md:row-start-2 md:row-end-3 overflow-y-auto border-b md:border-b-0 border-[#00FF41]/30">
          
          {/* HERO SECTION */}
          <section className="min-h-[60vh] md:min-h-[calc(100vh-80px-140px)] flex flex-col justify-center p-6 md:p-14 border-b border-[#00FF41]/10">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[9px] md:text-[10px] text-[#00FF41] block mb-4 tracking-[0.3em] uppercase"
            >
              Manifesto 01.0 // Protocol: Somatic
            </motion.span>
            
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] uppercase tracking-tighter"
            >
              A INTERFACE <br/>
              <span className="neon-text">É O SEU CORPO</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="mt-6 md:mt-8 text-xs md:text-base text-white/80 font-black max-w-lg leading-relaxed uppercase tracking-wide"
            >
              Não somos usuários. Somos componentes ativos de uma infraestrutura nervosa em expansão. O VISTO_LAB rompe a tela.
            </motion.p>
            
            <div className="mt-10 md:mt-12 max-w-md w-full">
              {status === 'success' ? (
                <div className="border border-[#00FF41] p-6 text-[#00FF41] bg-[#00FF41]/10 text-center uppercase text-xs tracking-widest">
                  Acesso garantido. Aguarde protocolo de sincronização.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col border border-[#00FF41] bg-black/50 hover:shadow-[0_0_15px_rgba(0,255,65,0.1)] transition-shadow">
                  <input 
                    type="email" 
                    placeholder="DIGITE SEU ACESSO (EMAIL)" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-5 bg-transparent outline-none border-b border-[#00FF41]/30 focus:bg-[#00FF41]/5 transition-colors uppercase text-sm"
                  />
                  <button 
                    type="submit"
                    disabled={status === 'loading'}
                    className="p-5 bg-[#00FF41] text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-white transition-all disabled:opacity-50"
                  >
                    {status === 'loading' ? 'Processando...' : 'Entrar na ativação'}
                  </button>
                </form>
              )}
            </div>
          </section>

          {/* TENSION / MARQUEE SECTION */}
          <section className="py-20 border-b border-[#00FF41]/10">
             <Marquee items={tensionItems} />
          </section>

          {/* ALTAR CIBERNÉTICO SECTION */}
          <section className="py-32 px-6 md:px-14 border-b border-[#00FF41]/10 bg-black/40">
            <div className="max-w-4xl mx-auto space-y-20">
              <div className="text-center">
                 <span className="text-[10px] text-[#00FF41] tracking-[0.5em] uppercase mb-12 block opacity-50 font-black">Protocolo_Visual_Central</span>
                 <VideoMonitor />
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center space-y-8"
              >
                <div className="w-1 w-full max-w-[300px] h-px bg-gradient-to-r from-transparent via-[#00FF41] to-transparent mx-auto" />
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight text-white uppercase tracking-tighter">
                  "Não somos mais usuários, somos o próprio sistema tentando se reconhecer."
                </h2>
                <p className="text-[10px] text-[#00FF41] tracking-[0.3em] font-black uppercase">
                  // Ruptura_Somática 0x4f2 // VISTO_LAB
                </p>
              </motion.div>
            </div>
          </section>

          {/* FEATURES SECTION */}
          <section className="py-20 px-6 md:px-14 border-b border-[#00FF41]/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#00FF41]/10 border border-[#00FF41]/10">
              {[
                { icon: <Monitor />, title: "Plataforma Experimental", desc: "Novos modos de existir na rede." },
                { icon: <Activity />, title: "Interação Corpo + Código", desc: "Seus movimentos geram mundos." },
                { icon: <Layers />, title: "Experiências Audiovisuais", desc: "Sintetizadores de realidade sensível." },
                { icon: <Shield />, title: "Acesso Antecipado", desc: "Seja um dos primeiros nodos ativos." }
              ].map((f, i) => (
                <div key={i} className="bg-[#050505] p-8 space-y-4">
                  <div className="text-[#00FF41]">{f.icon}</div>
                  <h4 className="font-bold uppercase text-sm tracking-widest">{f.title}</h4>
                  <p className="text-[10px] text-white/60 font-bold uppercase leading-tight">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ SECTION */}
          <section className="py-20 px-6 md:px-14 border-b border-[#00FF41]/10">
            <div className="text-center mb-10">
              <span className="text-[10px] text-[#00FF41] block mb-2 tracking-[0.2em] uppercase">Consultas Frequentes</span>
            </div>
            <FAQ />
          </section>

          {/* FINAL CTA SECTION */}
          <section className="py-32 px-6 md:px-14 text-center">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8 italic">
              VOCÊ ESTÁ PRONTO PARA SER VISTO?
            </h2>
            <div className="max-w-xs mx-auto">
               <button 
                onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full p-5 bg-[#00FF41] text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,65,0.3)]"
               >
                 Reclamar Acesso
               </button>
            </div>
          </section>

        </div>

        {/* SIDEBAR RIGHT */}
        <div className="hidden md:flex col-start-3 col-end-4 row-start-2 row-end-3 border-l border-[#00FF41]/30 p-8 flex-col justify-between bg-black/20 relative overflow-hidden">
          <SomaticFlow />
          <div className="relative z-10">
            <span className="text-[10px] text-[#00FF41] block mb-6 tracking-[0.2em] uppercase">Protocolos</span>
            <ul className="space-y-4 text-[11px] text-white/50 uppercase leading-relaxed">
              <li className="flex gap-3"><span className="text-[#00FF41]">[01]</span> Interação corpo + código</li>
              <li className="flex gap-3"><span className="text-[#00FF41]">[02]</span> Experiências audiovisuais</li>
              <li className="flex gap-3"><span className="text-[#00FF41]">[03]</span> Resposta em tempo real</li>
            </ul>
          </div>

          <div className="border-t border-white/10 pt-8">
            <span className="text-[10px] text-[#00FF41] block mb-4 tracking-[0.2em] uppercase">Info</span>
            <p className="text-[10px] text-white/70 font-black leading-relaxed uppercase">
              Acesso antecipado exclusivo para terminais autenticados. Sem algoritmos de recomendação. Apenas feedback direto.
            </p>
          </div>
        </div>

        {/* FULL WIDTH SYSTEM FOOTER - ACROSS ALL COLUMNS */}
        <div className="col-span-full border-t border-[#00FF41]/30">
           <SystemFooter />
        </div>

      </div>
      <ASCIILantern />
      <CustomCursor />
    </div>
  );
}
