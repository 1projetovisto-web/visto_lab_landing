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
  Dna
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
  const targetDate = useMemo(() => new Date(Date.now() + 1000 * 60 * 60 * 24 * 14 + 1000 * 60 * 60 * 5), []);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const calculateTimeLeft = useCallback(() => {
    const difference = +targetDate - +new Date();
    if (difference > 0) {
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    }
  }, [targetDate]);

  useEffect(() => {
    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return (
    <div className="flex gap-4 font-mono text-sm tracking-tighter sm:text-base">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} className="flex flex-col items-center p-2 border border-white/10 bg-white/5 min-w-[60px] sm:min-w-[80px]">
          <span className="text-xl sm:text-2xl font-bold leading-none">{value.toString().padStart(2, '0')}</span>
          <span className="text-[10px] uppercase opacity-50 mt-1">{label}</span>
        </div>
      ))}
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

// --- Main App ---

export default function App() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

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
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server error');
      }

      setStatus('success');
    } catch (error) {
      console.error("Subscription failed:", error);
      setStatus('idle');
      alert("Falha na ativação. Verifique sua conexão com a rede VISTO ou tente novamente.");
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
      <CustomCursor />
      <Scanlines />
      <Noise />
      
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <motion.div 
          style={{ y: backgroundY }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#00FF41_0%,transparent_70%)]" 
        />
      </div>

      <div className="relative z-10 h-screen w-screen grid grid-cols-1 md:grid-cols-[280px_1fr_300px] grid-rows-[80px_1fr_140px] border border-[#00FF41]/30">
        
        {/* LOGO AREA */}
        <div className="md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-2 border-b-2 border-[#00FF41] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-black tracking-[0.3em] neon-text"
          >
            VISTO_LAB
          </motion.div>
        </div>

        {/* HEADER MAIN */}
        <div className="hidden md:flex col-start-2 col-end-4 row-start-1 row-end-2 border-b border-[#00FF41] items-center px-10 bg-[#00FF41]/5">
          <div className="text-[10px] uppercase tracking-widest text-white/40 max-w-xl">
            Plataforma experimental de operações digitais-somáticas. Hackeando a percepção através do código e do corpo.
          </div>
        </div>

        {/* SIDEBAR LEFT */}
        <div className="hidden md:flex col-start-1 col-end-2 row-start-2 row-end-4 border-r border-[#00FF41]/30 p-6 flex-col justify-between overflow-y-auto">
          <div className="space-y-10">
            <div>
              <span className="text-[10px] text-[#00FF41] block mb-4 tracking-[0.2em] uppercase">Status do Sistema</span>
              {tensionItems.map((item, i) => (
                <div key={i} className={`flex items-center gap-3 text-xs mb-3 ${i === 0 ? 'text-[#00FF41] font-bold' : 'text-white/40'}`}>
                   <div className={`w-2 h-2 ${i === 0 ? 'bg-[#00FF41]' : 'bg-white/10'}`} /> {item.toUpperCase()}
                </div>
              ))}
            </div>

            <div className="border border-white/10 p-5 bg-white/[0.02]">
              <span className="text-[10px] text-[#00FF41] block mb-2 tracking-[0.2em] uppercase">O que é</span>
              <p className="text-[11px] leading-relaxed text-white/60 mb-4 uppercase">
                Laboratório de ativação sensorial em tempo real. Interação entre carne e hardware.
              </p>
              <div className="border border-[#00FF41] text-[#00FF41] px-3 py-1 text-[9px] inline-block rounded-full uppercase">
                Sistema Sensível
              </div>
            </div>
          </div>

          <div>
             <span className="text-[10px] text-[#00FF41] block mb-2 tracking-[0.2em] uppercase">Ativação em</span>
             <div className="inline-block border border-[#00FF41] p-3">
               <Countdown />
             </div>
          </div>
        </div>

        {/* CONTENT AREA (Middle) */}
        <div className="col-start-1 md:col-start-2 col-end-2 md:col-end-3 row-start-2 row-end-3 overflow-y-auto border-b md:border-b-0 border-[#00FF41]/30">
          
          {/* HERO SECTION */}
          <section className="min-h-[calc(100vh-80px-140px)] flex flex-col justify-center p-6 md:p-14 border-b border-[#00FF41]/10">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] text-[#00FF41] block mb-4 tracking-[0.3em] uppercase"
            >
              Manifesto 01.0 // Protocol: Somatic
            </motion.span>
            
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] uppercase tracking-tighter"
            >
              A INTERFACE <br/>
              <span className="neon-text">É O SEU CORPO</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="mt-8 text-sm md:text-base text-white/40 max-w-lg leading-relaxed uppercase"
            >
              Não somos usuários. Somos componentes ativos de uma infraestrutura nervosa em expansão. O VISTO_LAB rompe a tela.
            </motion.p>

            <div className="mt-12 max-w-md w-full">
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

          {/* RUPTURE SECTION */}
          <section className="py-32 px-6 md:px-14 border-b border-[#00FF41]/10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div className="w-1 w-full max-w-[200px] h-[1px] bg-gradient-to-r from-transparent via-[#00FF41] to-transparent mx-auto" />
              <h2 className="text-3xl md:text-4xl font-light italic leading-tight text-white/90 uppercase tracking-tight">
                "Não somos mais usuários, somos o próprio sistema tentando se reconhecer."
              </h2>
              <div className="text-[10px] text-[#00FF41] tracking-widest uppercase">
                // Protocolo de Ruptura 0x4f2
              </div>
            </motion.div>
          </section>

          {/* SOLUTION SECTION */}
          <section className="py-32 px-6 md:px-14 border-b border-[#00FF41]/10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block px-3 py-1 border border-[#00FF41] text-[#00FF41] text-[10px] uppercase tracking-widest mb-4">
                Definição de Sistema
              </div>
              <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
                Laboratório de Operações Digitais-Somáticas
              </h3>
              <p className="text-sm text-white/40 leading-relaxed uppercase">
                O VISTO_LAB nasce como um espaço de investigação crítica e poética. 
                Deslocamos o código das telas para o sistema nervoso. 
                Nossas máquinas não apenas processam; elas sentem.
              </p>
            </div>
            <div className="relative aspect-square max-w-sm mx-auto">
               <div className="absolute inset-0 border border-[#00FF41]/20 rotate-3" />
               <div className="absolute inset-0 border border-[#00FF41]/50 -rotate-3" />
               <div className="absolute inset-0 flex items-center justify-center p-8 bg-black/40">
                  <Dna className="w-20 h-20 text-[#00FF41] animate-pulse" />
               </div>
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
                  <p className="text-[10px] text-white/30 uppercase leading-tight">{f.desc}</p>
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
                className="w-full p-5 bg-[#00FF41] text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-white transition-all"
               >
                 Reclamar Acesso
               </button>
            </div>
          </section>

        </div>

        {/* SIDEBAR RIGHT */}
        <div className="hidden md:flex col-start-3 col-end-4 row-start-2 row-end-3 border-l border-[#00FF41]/30 p-8 flex-col justify-between bg-black/20">
          <div>
            <span className="text-[10px] text-[#00FF41] block mb-6 tracking-[0.2em] uppercase">Protocolos</span>
            <ul className="space-y-4 text-[11px] text-white/50 uppercase leading-relaxed">
              <li className="flex gap-3"><span className="text-[#00FF41]">[01]</span> Interação corpo + código</li>
              <li className="flex gap-3"><span className="text-[#00FF41]">[02]</span> Experiências audiovisuais</li>
              <li className="flex gap-3"><span className="text-[#00FF41]">[03]</span> Resposta em tempo real</li>
            </ul>
          </div>

          <div className="border-t border-white/10 pt-8">
            <span className="text-[10px] text-[#00FF41] block mb-4 tracking-[0.2em] uppercase">Info</span>
            <p className="text-[10px] text-white/30 leading-relaxed uppercase">
              Acesso antecipado exclusivo para terminais autenticados. Sem algoritmos de recomendação. Apenas feedback direto.
            </p>
          </div>
        </div>

        {/* FOOTER ACTION */}
        <div className="col-start-1 md:col-start-2 col-end-2 md:col-end-4 row-start-3 row-end-4 border-t border-[#00FF41] flex flex-col md:flex-row items-center gap-10 px-6 md:px-14 py-4 md:py-0 bg-[#00FF41]/[0.02]">
          <div>
            <span className="text-[9px] text-[#00FF41] block mb-1 uppercase tracking-widest">Localização</span>
            <div className="text-[11px] uppercase opacity-70">Studio Core0gam3 _ 4° Distrito_POA/RS_BR</div>
          </div>
          <div className="flex gap-10">
            <div>
              <span className="text-[9px] text-[#00FF41] block mb-1 uppercase tracking-widest">Rede</span>
              <a href="https://www.instagram.com/projeto_visto/" target="_blank" rel="noopener noreferrer" className="text-[11px] uppercase opacity-70 underline decoration-[#00FF41] hover:text-[#00FF41] transition-colors">@projeto_visto</a>
            </div>
            <div>
              <span className="text-[9px] text-[#00FF41] block mb-1 uppercase tracking-widest">Transmit</span>
              <a href="https://www.youtube.com/@PROJETOVISTO/streams" target="_blank" rel="noopener noreferrer" className="text-[11px] uppercase opacity-70 underline decoration-[#00FF41] hover:text-[#00FF41] transition-colors">@PROJETOVISTO</a>
            </div>
          </div>
          <div className="md:ml-auto text-right hidden lg:block">
            <span className="text-[9px] text-[#00FF41] block mb-1 uppercase tracking-widest">Segurança</span>
            <div className="text-[10px] uppercase text-white/20">Dados encriptados // Conexão ponto-a-ponto</div>
          </div>
        </div>

      </div>
    </div>
  );
}
