/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  FormEvent,
  useRef,
  RefObject,
} from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
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
  VolumeX,
} from "lucide-react";

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
          <span
            key={i}
            className="text-black font-black text-2xl px-8 uppercase flex items-center"
          >
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
      if (target.closest("button, a, input, .interactive-cursor")) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] hidden md:block"
      animate={{
        x: position.x - 16,
        y: position.y - 16,
        scale: isHovering ? 2 : 1,
        borderWidth: isHovering ? "1px" : "2px",
      }}
      transition={{ type: "spring", damping: 25, stiffness: 400, mass: 0.5 }}
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
  const targetDate = useMemo(() => new Date("2026-05-20T20:00:00Z"), []);
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
        <div className="text-[10px] text-[#00FF41] font-black uppercase tracking-[0.6em] text-center md:text-left opacity-50">
          Ativação_Em_Curso
        </div>
        <div className="flex flex-nowrap justify-between items-center w-full font-mono tabular-nums text-[#00FF41]">
          {Object.entries(timeLeft).map(([label, value]) => (
            <div
              key={label}
              className="flex flex-col items-center flex-1 min-w-0"
            >
              <span className="text-[12vw] sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-[-0.05em] leading-none whitespace-nowrap">
                {value.toString().padStart(2, "0")}
              </span>
              <span className="text-[7px] md:text-[10px] uppercase opacity-30 mt-2 tracking-[0.4em] font-bold">
                {label}
              </span>
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
    {
      q: "O que é o VISTO_LAB?",
      a: "O VISTO_LAB é uma plataforma experimental que investiga a relação entre corpo, imagem, som e sistemas digitais em tempo real.\n\nNão se trata de um aplicativo tradicional ou de uma interface estática. É um ambiente de experimentação onde o corpo deixa de ser apenas usuário e passa a operar como elemento ativo dentro do sistema.\n\nA proposta articula práticas de arte contemporânea, tecnologia e percepção, criando experiências nas quais movimento, presença e interação geram respostas visuais e sonoras.\n\nCada acesso não é apenas navegação — é uma ativação.",
    },
    {
      q: "Como funciona a ativação?",
      a: "A ativação é o primeiro contato com o sistema.\n\nAo acessar a plataforma, você entra em um ambiente interativo onde seus gestos e movimentos passam a influenciar diretamente o comportamento visual e sonoro da interface.\n\nNão há um “tutorial” no sentido tradicional. A lógica é exploratória. Você descobre o sistema ao interagir com ele.\n\nDurante a ativação, o sistema responde em tempo real, criando um campo sensível que se transforma conforme sua presença.\n\nApós essa primeira experiência, você poderá acessar outras camadas do VISTO_LAB, incluindo novos experimentos e protocolos interativos.",
    },
    {
      q: "É gratuito?",
      a: "Sim. O acesso inicial ao VISTO_LAB é gratuito.\n\nA proposta é ampliar o acesso a experiências que articulam arte e tecnologia, permitindo que diferentes públicos entrem em contato com práticas contemporâneas de criação digital.\n\nEventuais desdobramentos futuros, como programas formativos ou experiências avançadas, poderão ter formatos específicos, mas a ativação inicial permanece aberta.",
    },
    {
      q: "Quais tecnologias são usadas?",
      a: "O VISTO_LAB utiliza um conjunto de tecnologias voltadas à interação em tempo real entre corpo e sistema digital. Essas tecnologias não são apresentadas como ferramentas isoladas, mas integradas em uma lógica de experiência, onde o foco não está na tecnologia em si, e sim na relação que ela estabelece com o corpo e a percepção.\n\nEntre elas:\n• Sistemas de visão computacional para detecção de movimento e presença corporal\n• Processamento visual em tempo real para geração de imagens dinâmicas\n• Sistemas de áudio reativo, que respondem à interação do usuário\n• Bibliotecas e frameworks de programação criativa, como p5.js e ferramentas de mídia interativa baseadas na web",
    },
    {
      q: "Sobre o funcionamento web-based",
      a: "Todas as experiências do VISTO_LAB são desenvolvidas em ambiente web-based, ou seja, funcionam diretamente no navegador de internet. Isso significa que:\n• Não é necessário instalar aplicativos ou softwares específicos\n• O acesso é feito por meio de um link (como um site)\n• A experiência roda em tempo real dentro do navegador\n• Recursos do próprio dispositivo, como câmera e áudio, podem ser utilizados com autorização do usuário\n\n💡 O que isso possibilita:\n• Ampliar o acesso, reduzindo barreiras técnicas\n• Tornar as experiências mais imediatas e acessíveis\n• Integrar arte e tecnologia em um ambiente cotidiano\n• Distribuir o projeto sem necessidade de instalação local\n\n🔐 Sobre uso de câmera e interação:\nQuando necessário, o sistema solicita permissão para acessar recursos como a câmera do dispositivo. Esses dados são utilizados exclusivamente para processamento em tempo real da experiência, não sendo armazenados sem consentimento explícito.",
    },
    {
      q: "Preciso saber programar ou ter experiência prévia?",
      a: "Não.\n\nO VISTO_LAB é aberto tanto para pessoas com experiência em arte e tecnologia quanto para quem está tendo um primeiro contato com esse tipo de ambiente. A interação é direta e baseada em percepção, não em conhecimento técnico.",
    },
    {
      q: "O que acontece depois que eu me cadastro?",
      a: "Após o cadastro, você passa a receber informações sobre:\n• Acesso às ativações da plataforma\n• Convites para experiências ao vivo\n• Conteúdos relacionados ao projeto\n• Atualizações sobre novos experimentos\n\nO objetivo é criar uma rede de participantes que acompanham e interagem com o desenvolvimento do VISTO_LAB ao longo do tempo.",
    },
    {
      q: "Meus dados ou imagem são armazenados?",
      a: "O sistema utiliza a câmera apenas para processamento em tempo real da experiência. Não há armazenamento de imagens ou gravações sem consentimento explícito. Os dados coletados (como e-mail) são utilizados exclusivamente para comunicação relacionada ao projeto.",
    },
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className={`border transition-all duration-500 overflow-hidden relative group ${
            openIndex === i
              ? "border-[#00FF41]/40 bg-black/60 backdrop-blur-xl shadow-[0_0_40px_rgba(0,255,65,0.1)]"
              : "border-[#00FF41]/10 bg-black/20 backdrop-blur-md hover:border-[#00FF41]/30 hover:bg-[#00FF41]/5"
          }`}
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex justify-between items-center p-8 text-left transition-all duration-300"
          >
            <span
              className={`font-mono text-sm uppercase tracking-[0.2em] transition-colors duration-300 ${openIndex === i ? "text-[#00FF41]" : "text-[#00FF41]/70"}`}
            >
              {faq.q}
            </span>
            <Plus
              className={`w-5 h-5 transition-transform duration-500 text-[#00FF41] ${openIndex === i ? "rotate-45 scale-110" : "opacity-50 group-hover:opacity-100"}`}
            />
          </button>
          <AnimatePresence>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-8 pt-0 text-[#00FF41]/80 font-mono leading-relaxed text-sm uppercase tracking-wider whitespace-pre-wrap border-t border-[#00FF41]/10 mt-2 pt-6">
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {faq.a}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

const DnaIcon = () => (
  <Dna className="w-20 h-20 text-[#00FF41] animate-pulse" />
);

const SomaticFlow = () => {
  const canvasRef = useCallback((node: HTMLCanvasElement | null) => {
    if (node) {
      const ctx = node.getContext("2d");
      if (!ctx) return;

      let animationFrameId: number;
      let width = node.clientWidth;
      let height = node.clientHeight;

      const particles: {
        x: number;
        y: number;
        vx: number;
        vy: number;
        size: number;
      }[] = [];
      const particleCount = 35;

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height + height * 0.2, // Começam um pouco mais abaixo
          vx: (Math.random() - 0.5) * 0.3,
          vy: -Math.random() * 0.6 - 0.1, // Movimento constante para CIMA
          size: Math.random() * 4 + 1,
        });
      }

      const resize = () => {
        width = node.parentElement?.clientWidth || 0;
        height = node.parentElement?.clientHeight || 0;
        node.width = width;
        node.height = height;
      };

      window.addEventListener("resize", resize);
      resize();

      const draw = () => {
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = "#00FF41";
        ctx.fillStyle = "#00FF41";
        ctx.lineWidth = 0.5;

        particles.forEach((p, i) => {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < -50) p.y = height + 50; // Reseta no rodapé ao sair pelo topo

          // Desenha o Nodo com Glow (FORÇA MÁXIMA)
          ctx.shadowBlur = 25;
          ctx.shadowColor = "#00FF41";
          ctx.globalAlpha = 1.0;
          ctx.fillStyle = "#00FF41";
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
        window.removeEventListener("resize", resize);
      };
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
    />
  );
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

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches[0]) updatePos(e.touches[0].clientX, e.touches[0].clientY);
      },
      { passive: true },
    );

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
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
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden mix-blend-screen"
      style={{
        maskImage: isReady
          ? `radial-gradient(circle var(--reveal-radius, 350px) at ${mousePos.x}px ${mousePos.y}px, black 40%, transparent 95%)`
          : "none",
        WebkitMaskImage: isReady
          ? `radial-gradient(circle var(--reveal-radius, 350px) at ${mousePos.x}px ${mousePos.y}px, black 40%, transparent 95%)`
          : "none",
        opacity: isReady ? 1 : 0,
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

const vsSource = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    v_uv.y = 1.0 - v_uv.y;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fsSource = `
  precision mediump float;
  varying vec2 v_uv;
  uniform sampler2D u_image;
  uniform vec2 u_mouse;
  uniform float u_strength;
  uniform float u_aspect;
  uniform vec2 u_scale;

  void main() {
    vec2 cover_uv = (v_uv - 0.5) * u_scale + 0.5;
    vec2 diff = v_uv - u_mouse;
    diff.x *= u_aspect;
    float dist = length(diff);
    
    float radius = 0.3; // ~120px radius depending on screen width
    
    if (dist < radius) {
      float percent = 1.0 - (dist / radius);
      percent = percent * percent * (3.0 - 2.0 * percent);
      // Deslocamento para criar efeito elástico/tensão superficial
      cover_uv -= (diff / dist) * percent * u_strength * 0.05;
    }
    
    // Clamp limits sampling inside the video bounds
    cover_uv = clamp(cover_uv, 0.0, 1.0);
    gl_FragColor = texture2D(u_image, cover_uv);
  }
`;

const InteractiveVideoSurface = ({ isMuted }: { isMuted: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    video.play().catch(console.error);

    const gl = canvas.getContext("webgl", { premultipliedAlpha: false });
    if (!gl) return;

    function compileShader(type: number, source: string) {
      const shader = gl!.createShader(type)!;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.error(gl!.getShaderInfoLog(shader));
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = compileShader(gl.VERTEX_SHADER, vsSource);
    const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
      ]),
      gl.STATIC_DRAW,
    );

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const uMouseLoc = gl.getUniformLocation(program, "u_mouse");
    const uStrengthLoc = gl.getUniformLocation(program, "u_strength");
    const uAspectLoc = gl.getUniformLocation(program, "u_aspect");
    const uScaleLoc = gl.getUniformLocation(program, "u_scale");
    const posLoc = gl.getAttribLocation(program, "a_position");

    let animationId: number;
    let targetMouse = { x: 0.5, y: 0.5 };
    let currentMouse = { x: 0.5, y: 0.5 };
    let isHovering = false;
    let targetStrength = 0;
    let currentStrength = 0;
    let strengthVel = 0;
    let lastVideoTime = -1;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouse.x = (e.clientX - rect.left) / rect.width;
      targetMouse.y = (e.clientY - rect.top) / rect.height;
    };

    const handleMouseEnter = () => {
      isHovering = true;
    };
    const handleMouseLeave = () => {
      isHovering = false;
      targetStrength = 0;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const render = () => {
      // Física inercial: delay e easing
      currentMouse.x += (targetMouse.x - currentMouse.x) * 0.08;
      currentMouse.y += (targetMouse.y - currentMouse.y) * 0.08;

      let dx = targetMouse.x - currentMouse.x;
      let dy = targetMouse.y - currentMouse.y;
      let speed = Math.sqrt(dx * dx + dy * dy);

      // Limite: ignorar movimentos extremamente bruscos
      let activeSpeed = Math.min(speed, 0.06);

      if (isHovering) {
        targetStrength = activeSpeed * 8.0;
      } else {
        targetStrength = 0;
      }

      // Retorno elástico (spring) suave
      let strengthAcc = (targetStrength - currentStrength) * 0.08; // tension
      strengthVel += strengthAcc;
      strengthVel *= 0.85; // friction
      currentStrength += strengthVel;

      const aspect = canvas.clientWidth / canvas.clientHeight;
      if (
        canvas.width !== canvas.clientWidth ||
        canvas.height !== canvas.clientHeight
      ) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }

      if (video.readyState >= video.HAVE_CURRENT_DATA) {
        // OTIMIZAÇÃO: Apenas enviar o frame para a GPU se o tempo do vídeo mudou (novo frame)
        if (video.currentTime !== lastVideoTime) {
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            video,
          );
          lastVideoTime = video.currentTime;
        }

        let vAspect = video.videoWidth / video.videoHeight;
        let scaleX = 1,
          scaleY = 1;
        if (aspect > vAspect) {
          scaleY = aspect / vAspect;
        } else {
          scaleX = vAspect / aspect;
        }

        gl.useProgram(program);
        gl.uniform2f(uScaleLoc, scaleX, scaleY);
        gl.uniform1f(uAspectLoc, aspect);
        gl.uniform2f(uMouseLoc, currentMouse.x, currentMouse.y);
        gl.uniform1f(uStrengthLoc, currentStrength);

        gl.enableVertexAttribArray(posLoc);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseenter", handleMouseEnter);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        loop
        playsInline
        muted={isMuted}
        crossOrigin="anonymous"
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover opacity-[0.01] pointer-events-none -z-10"
      >
        <source
          src="https://res.cloudinary.com/dwx6kf2f6/video/upload/w_800,f_auto,q_auto/v1776907882/VIDEO_LANDING_PAGE_1_h83o0a.mp4"
          type="video/mp4"
        />
      </video>
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-90 contrast-125 brightness-110 cursor-crosshair object-cover"
        style={{ display: "block" }}
      />
    </>
  );
};

const VideoMonitor = () => {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="relative w-full max-w-2xl mx-auto group">
      {/* Moldura do Monitor */}
      <div className="absolute -inset-4 border-2 border-[#00FF41]/10 rounded-sm pointer-events-none group-hover:border-[#00FF41]/30 transition-colors duration-700" />

      <div className="crt-screen aspect-video relative overflow-hidden bg-black shadow-[0_0_50px_rgba(0,255,65,0.1)]">
        <InteractiveVideoSurface isMuted={isMuted} />

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
          <span className="text-[9px] text-[#00FF41]/50 tracking-[0.3em] font-black uppercase">
            Sincronia_Ativa
          </span>
        </div>

        <button
          onClick={() => setIsMuted(!isMuted)}
          className="flex items-center gap-3 px-4 py-2 border border-[#00FF41]/30 hover:bg-[#00FF41] hover:text-black transition-all cursor-pointer group/btn"
        >
          <span className="text-[9px] font-black uppercase tracking-widest">
            {isMuted ? "Audio_Off" : "Audio_On"}
          </span>
          {isMuted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
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
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#00FF41]">
            Sistema
          </span>
          <div className="h-px w-full bg-[#00FF41]/20 my-1" />
          <div className="text-sm leading-relaxed uppercase text-[#00FF41]/80 tracking-wider">
            Processo_Somatico: Ativado
            <br />
            Fluxo_Data: Síncrono
            <br />
            Terminal_ID: VSB_01
          </div>
        </div>

        {/* COL 4-6: LOCALIZAÇÃO */}
        <div className="md:col-span-3 flex flex-col gap-3">
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#00FF41]">
            Localização
          </span>
          <div className="h-px w-full bg-[#00FF41]/20 my-1" />
          <div className="text-sm leading-relaxed uppercase text-[#00FF41]/80 tracking-wider">
            Studio Core0gam3
            <br />
            Atelier LUGARzinho
            <br />
            4° Distrito / POA_BR
          </div>
        </div>

        {/* COL 7-9: REDE / TRANSMIT */}
        <div className="md:col-span-3 flex flex-col gap-3">
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#00FF41]">
            Conexão
          </span>
          <div className="h-px w-full bg-[#00FF41]/20 my-1" />
          <div className="flex flex-col gap-2">
            <a
              href="https://www.instagram.com/projeto_visto/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#00FF41]/85 tracking-[0.15em] font-semibold transition-all duration-300 [text-shadow:0_0_4px_rgba(0,255,100,0.25)] hover:text-[#00FF41]/100 hover:[text-shadow:0_0_8px_rgba(0,255,100,0.4)] uppercase flex items-center gap-2 group"
            >
              <div className="w-1 h-1 bg-[#00FF41]/40 group-hover:bg-[#00FF41]" />{" "}
              @projeto_visto
            </a>
            <a
              href="https://www.youtube.com/@PROJETOVISTO/streams"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#00FF41]/85 tracking-[0.15em] font-semibold transition-all duration-300 [text-shadow:0_0_4px_rgba(0,255,100,0.25)] hover:text-[#00FF41]/100 hover:[text-shadow:0_0_8px_rgba(0,255,100,0.4)] uppercase flex items-center gap-2 group"
            >
              <div className="w-1 h-1 bg-[#00FF41]/40 group-hover:bg-[#00FF41]" />{" "}
              @PROJETOVISTO
            </a>
            <a
              href="https://open.spotify.com/user/31lgtcyqypbtxgsvzrczwlndwt74"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#00FF41]/85 tracking-[0.15em] font-semibold transition-all duration-300 [text-shadow:0_0_4px_rgba(0,255,100,0.25)] hover:text-[#00FF41]/100 hover:[text-shadow:0_0_8px_rgba(0,255,100,0.4)] uppercase flex items-center gap-2 group"
            >
              <div className="w-1 h-1 bg-[#00FF41]/40 group-hover:bg-[#00FF41]" />{" "}
              @SPOTIFY_VISTO
            </a>
            <a
              href="https://openprocessing.org/user/530232/#activity"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#00FF41]/85 tracking-[0.15em] font-semibold transition-all duration-300 [text-shadow:0_0_4px_rgba(0,255,100,0.25)] hover:text-[#00FF41]/100 hover:[text-shadow:0_0_8px_rgba(0,255,100,0.4)] uppercase flex items-center gap-2 group"
            >
              <div className="w-1 h-1 bg-[#00FF41]/40 group-hover:bg-[#00FF41]" />{" "}
              @OPEN_PROCESSING
            </a>
          </div>
        </div>

        {/* COL 10-12: OPERAÇÃO */}
        <div className="md:col-span-3 flex flex-col gap-3">
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#00FF41]">
            Operação
          </span>
          <div className="h-px w-full bg-[#00FF41]/20 my-1" />
          <div className="flex flex-col">
            <span className="text-sm uppercase text-[#00FF41]/80 tracking-wider">
              VISTO_SYSTEM v.4.0
            </span>
            <span className="text-sm uppercase text-[#00FF41]/40 tracking-wider">
              Status: Sincronia Estável
            </span>
            <div className="mt-4 flex gap-8">
              <a
                href="#"
                className="text-[8px] uppercase opacity-30 hover:opacity-100 hover:text-[#00FF41] transition-all"
              >
                Privacidade
              </a>
              <a
                href="#"
                className="text-[8px] uppercase opacity-30 hover:opacity-100 hover:text-[#00FF41] transition-all"
              >
                Termos
              </a>
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

// --- INTERACTIVE TYPOGRAPHY SYSTEM ---
const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";

const ScrambleTitle = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<number | null>(null);

  const startScramble = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let iteration = 0;
    const textLength = text.length;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = window.setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((_, index) => {
            if (index < iteration) {
              return text[index];
            }
            return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
          })
          .join(""),
      );

      iteration += 1 / 3; // Slower progression (approx 3 frames per character)

      if (iteration >= textLength) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
      }
    }, 30);
  };

  const stopScramble = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayText(text);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <span
      onMouseEnter={startScramble}
      onMouseLeave={stopScramble}
      className="transition-all duration-200 hover:[text-shadow:0_0_10px_rgba(0,255,65,0.5)] cursor-default inline-block select-none"
      style={{ minWidth: `${text.length}ch` }}
    >
      {displayText}
    </span>
  );
};

const SomaticChar = ({
  children,
}: {
  children: string;
  key?: number | string;
}) => {
  return (
    <motion.span
      className="inline-block"
      whileHover={{
        scale: 1.4,
        color: "#FFFFFF",
        textShadow: "0 0 15px rgba(0, 255, 65, 1)",
        y: -2,
        transition: { type: "spring", stiffness: 500, damping: 15 },
      }}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      style={{ display: "inline-block", cursor: "default" }}
    >
      {children === " " ? "\u00A0" : children}
    </motion.span>
  );
};

const SomaticText = ({ text }: { text: string }) => {
  const lines = text.split("\n");

  return (
    <div className="flex flex-col gap-2">
      {lines.map((line, li) => {
        const isLastLine = line.trim().startsWith("//");
        return (
          <motion.div
            key={li}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{
              delay: li * 0.15,
              duration: 0.8,
              ease: "easeOut",
            }}
            viewport={{ once: true }}
            className={`flex flex-wrap ${isLastLine ? "mt-4 text-[#00FF41]/40" : ""}`}
          >
            {isLastLine ? (
              <motion.div
                animate={{
                  opacity: [0.4, 1, 0.4],
                  textShadow: [
                    "0 0 8px rgba(0, 255, 65, 0.2)",
                    "0 0 20px rgba(0, 255, 65, 1)",
                    "0 0 8px rgba(0, 255, 65, 0.2)",
                  ],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex flex-wrap text-[#00FF41]"
              >
                {line.split(" ").map((word, wi) => (
                  <div key={wi} className="flex mr-[0.4em]">
                    {word.split("").map((char, ci) => (
                      <span key={ci}>{char}</span>
                    ))}
                  </div>
                ))}
              </motion.div>
            ) : (
              line.split(" ").map((word, wi) => (
                <div key={wi} className="flex mr-[0.4em] mb-[0.1em]">
                  {word.split("").map((char, ci) => (
                    <SomaticChar key={ci}>{char}</SomaticChar>
                  ))}
                </div>
              ))
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

// --- FIELD-BASED UI: PROTOCOLS ---
const CHARS_SCRAMBLE = "01VISTOLAB<>[]{}/\\|!@#$%&*+=-_~^";

const PhysicsChar = ({
  char,
  mouseRef,
  intensity = 1,
  className = "",
}: {
  char: string;
  mouseRef: RefObject<{ x: number; y: number }>;
  intensity?: number;
  className?: string;
  key?: string | number;
}) => {
  const elementRef = useRef<HTMLSpanElement>(null);
  const vel = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const basePos = useRef({ x: 0, y: 0 });
  const lastUpdate = useRef(performance.now());
  const initialSet = useRef(false);

  useEffect(() => {
    if (!elementRef.current) return;

    const updateBase = () => {
      const rect = elementRef.current!.getBoundingClientRect();
      basePos.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      initialSet.current = true;
    };

    updateBase();
    window.addEventListener("resize", updateBase);

    let frameId: number;
    const update = (time: number) => {
      if (!initialSet.current || !elementRef.current) {
        frameId = requestAnimationFrame(update);
        return;
      }

      const dt = Math.min((time - lastUpdate.current) / 16, 2);
      lastUpdate.current = time;

      const dx = mouseRef.current.x - (basePos.current.x + pos.current.x);
      const dy = mouseRef.current.y - (basePos.current.y + pos.current.y);
      const dist = Math.sqrt(dx * dx + dy * dy);

      const forceRadius = 200;
      if (dist < forceRadius) {
        const force = (1 - dist / forceRadius) * 0.5 * intensity;
        vel.current.x += (dx / dist) * force;
        vel.current.y += (dy / dist) * force;

        // Scramble
        if (dist < 30 && Math.random() > 0.95) {
          elementRef.current.innerText =
            CHARS_SCRAMBLE[Math.floor(Math.random() * CHARS_SCRAMBLE.length)];
          setTimeout(() => {
            if (elementRef.current) elementRef.current.innerText = char;
          }, 80);
        }
      }

      // Physics
      const springK = 0.08;
      const damping = 0.88;

      vel.current.x += -pos.current.x * springK;
      vel.current.y += -pos.current.y * springK;

      vel.current.x *= damping;
      vel.current.y *= damping;

      pos.current.x += vel.current.x * dt;
      pos.current.y += vel.current.y * dt;

      elementRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      elementRef.current.style.textShadow = `0 0 ${Math.min(Math.abs(vel.current.x + vel.current.y) * 4, 15)}px rgba(0, 255, 65, 0.4)`;
      elementRef.current.style.opacity = `${0.6 + Math.min(Math.abs(vel.current.x + vel.current.y) * 0.1, 0.4)}`;

      frameId = requestAnimationFrame(update);
    };

    frameId = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", updateBase);
    };
  }, [char, mouseRef, intensity]);

  return (
    <span
      ref={elementRef}
      className={`inline-block whitespace-pre ${className}`}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  );
};

const PhysicsProtocolItem = ({
  item,
  mouseRef,
}: {
  item: { id: string; label: string; desc: string };
  mouseRef: RefObject<{ x: number; y: number }>;
  key?: string | number;
}) => {
  return (
    <div className="flex flex-col gap-2 mb-8 relative group">
      <div className="flex gap-4 items-center">
        {/* Layer 1: Numbers (High Intensity) */}
        <div className="text-[#00FF41] font-bold flex">
          {"[".split("").map((c, i) => (
            <PhysicsChar
              key={`id-pre-${i}`}
              char={c}
              mouseRef={mouseRef}
              intensity={2.5}
            />
          ))}
          {item.id.split("").map((c, i) => (
            <PhysicsChar
              key={`id-${i}`}
              char={c}
              mouseRef={mouseRef}
              intensity={2.5}
            />
          ))}
          {"]".split("").map((c, i) => (
            <PhysicsChar
              key={`id-post-${i}`}
              char={c}
              mouseRef={mouseRef}
              intensity={2.5}
            />
          ))}
        </div>

        {/* Layer 2: Labels (Medium Intensity) */}
        <div className="text-[#00FF41] font-mono tracking-widest flex">
          {item.label.split("").map((c, i) => (
            <PhysicsChar
              key={`label-${i}`}
              char={c}
              mouseRef={mouseRef}
              intensity={1.5}
            />
          ))}
        </div>

        <div className="text-[#00FF41]/40">
          {"→".split("").map((c, i) => (
            <PhysicsChar
              key={`arr-${i}`}
              char={c}
              mouseRef={mouseRef}
              intensity={1.2}
            />
          ))}
        </div>
      </div>

      {/* Layer 3: Descriptions (Low Intensity) */}
      <div className="pl-10 text-[#00FF41]/60 text-[10px] sm:text-xs italic tracking-tight flex flex-wrap">
        {item.desc.split("").map((c, i) => (
          <PhysicsChar
            key={`desc-${i}`}
            char={c}
            mouseRef={mouseRef}
            intensity={0.6}
          />
        ))}
      </div>
    </div>
  );
};

const AtmosphericCanvas = ({
  isHovered,
  mousePos,
  type,
}: {
  isHovered: boolean;
  mousePos: { x: number; y: number };
  type: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mPos = useRef(mousePos);
  const isHov = useRef(isHovered);

  useEffect(() => {
    mPos.current = mousePos;
  }, [mousePos]);
  useEffect(() => {
    isHov.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.parentElement?.clientWidth || 300;
    let height = canvas.parentElement?.clientHeight || 300;
    canvas.width = width;
    canvas.height = height;

    const numParticles = 80;
    // Helper to generate a random position safely
    const randomX = () => Math.random() * width;
    const randomY = () => Math.random() * height;

    const particles = Array.from({ length: numParticles }, () => ({
      x: randomX(),
      y: randomY(),
      baseX: randomX(),
      baseY: randomY(),
      vx: 0,
      vy: 0,
      size: Math.random() * 1.5 + 1.0, // Aumentado
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.015 + 0.005,
    }));

    let animationId: number;
    let time = 0;

    const draw = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      const mx = mPos.current.x;
      const my = mPos.current.y;
      const hov = isHov.current;

      particles.forEach((p) => {
        let targetX = p.baseX;
        let targetY = p.baseY;

        if (type === 0) {
          // Breathing: Quase estático, leve pulsação
          targetX += Math.sin(time * p.speed + p.phase) * 15;
          targetY += Math.cos(time * p.speed + p.phase) * 15;
          if (hov) {
            targetX += Math.sin(time * p.speed * 2 + p.phase) * 20;
          }
        } else if (type === 1) {
          // Flow: Fluxo direcional suave
          p.baseX -= 0.3;
          p.baseY -= 0.2;
          if (p.baseX < 0) p.baseX = width;
          if (p.baseY < 0) p.baseY = height;

          targetX = p.baseX;
          targetY = p.baseY + Math.sin(time * 0.01 + p.phase) * 15;

          if (hov) {
            const dx = mx - p.x;
            const dy = my - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
              targetX += dx * 0.1;
              targetY += dy * 0.1;
            }
          }
        } else if (type === 2) {
          // Wave: Movimento ondulatório
          targetX = p.baseX + Math.sin(time * 0.015 + p.baseY * 0.05) * 30;
          targetY = p.baseY + Math.cos(time * 0.01 + p.baseX * 0.05) * 25;
          if (hov) {
            targetY += Math.sin(time * 0.05 + p.baseX * 0.02) * 30;
          }
        } else if (type === 3) {
          // Convergence: Leve convergência para o centro
          if (hov) {
            const cx = width / 2;
            const cy = height / 2;
            // Move gently towards center but keep organic motion
            targetX += (cx - p.baseX) * 0.15 * Math.sin(time * 0.03 + p.phase);
            targetY += (cy - p.baseY) * 0.15 * Math.sin(time * 0.03 + p.phase);
          } else {
            targetX += Math.sin(time * p.speed + p.phase) * 15;
            targetY += Math.cos(time * p.speed + p.phase) * 15;
          }
        }

        p.vx += (targetX - p.x) * 0.03;
        p.vy += (targetY - p.y) * 0.03;

        // Friction
        p.vx *= 0.85;
        p.vy *= 0.85;
        p.x += p.vx;
        p.y += p.vy;

        // Opacity logic (pulse & hover state)
        const baseOpacity = 0.3; // Aumentado
        const hoverOpacity = hov ? 0.5 : 0; // Aumentado
        const pulse = Math.sin(time * 0.02 + p.phase) * 0.2;
        const currentOpacity = Math.max(
          0.1,
          Math.min(0.9, baseOpacity + hoverOpacity + pulse),
        );

        ctx.fillStyle = `rgba(0, 255, 65, ${currentOpacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (hov ? 1.5 : 1), 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width;
      canvas.height = height;
      // Reposicionar partículas caso a tela mude de tamanho para não sumirem
      particles.forEach((p) => {
        p.baseX = Math.random() * width;
        p.baseY = Math.random() * height;
        p.x = p.baseX;
        p.y = p.baseY;
      });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [type]);

  return (
    <div
      className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000 ${isHovered ? "opacity-100" : "opacity-60"}`}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full mix-blend-screen"
      />
      {/* Soft radial mask to fade edges into background, keeping center clear but organic */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,5,5,0.8)_100%)] pointer-events-none" />
    </div>
  );
};

const InteractiveFeatureCard = ({
  icon,
  title,
  desc,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  index: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={`group relative bg-[#050505] p-8 space-y-4 overflow-hidden border border-[#00FF41]/10 transition-all duration-300 
      hover:border-[#00FF41]/40 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(0,255,65,0.15)] z-10 hover:z-20`}
    >
      <AtmosphericCanvas
        isHovered={isHovered}
        mousePos={mousePos}
        type={index}
      />

      <div className="relative z-10 text-[#00FF41] transition-transform duration-300 group-hover:scale-105 origin-left group-hover:drop-shadow-[0_0_8px_rgba(0,255,65,0.8)]">
        {icon}
      </div>
      <h4 className="relative z-10 font-bold uppercase text-sm tracking-widest text-[#00FF41] transition-all duration-300 group-hover:[text-shadow:0_0_8px_rgba(0,255,65,0.4)] group-hover:brightness-125">
        {title}
      </h4>
      <p className="relative z-10 text-sm text-[#00FF41]/60 font-bold uppercase leading-tight tracking-wider transition-colors duration-300 group-hover:text-[#00FF41]/80">
        {desc}
      </p>
    </div>
  );
};

import Lantern from "./Lantern";
import InteractiveText from "./InteractiveText";

export default function App() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [activeTensionIndex, setActiveTensionIndex] = useState(0);
  const sidebarMouseRef = useRef({ x: -1000, y: -1000 });

  if (window.location.pathname === "/lantern") {
    return <Lantern />;
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      sidebarMouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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
    setStatus("loading");
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          userAgent: window.navigator.userAgent,
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Formato de resposta inválido" }));
        throw new Error(
          errorData.error || `Erro do servidor (${response.status})`,
        );
      }

      const result = await response.json();
      if (result.status !== "ok" || (result.debug && !result.emailSent)) {
        throw new Error(result.debug || "Falha no processamento do e-mail");
      }

      setStatus("success");
    } catch (error: any) {
      console.error("Subscription failed:", error);
      setStatus("idle");
      alert(
        `Falha na ativação: ${error.message}. Verifique sua conexão ou tente novamente.`,
      );
    }
  };

  const tensionItems = [
    "Objetos Digitais Interativos",
    "Código Aberto",
    "Workshops Gratuitos",
    "Galeria de Arte Digital",
    "Objetos Sonoros",
    "Corpo como Interface",
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

      <div className="relative z-20 min-h-screen w-full flex flex-col md:grid md:grid-cols-[280px_1fr_300px] md:grid-rows-[120px_1fr_auto] border border-[#00FF41]/30">
        {/* LOGO AREA */}
        <div className="w-full md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-2 border-b-2 border-[#00FF41] flex items-center justify-between md:justify-center p-6 bg-[#00FF41]/5">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.8, 1, 0.8],
              textShadow: [
                "0 0 15px rgba(0, 255, 65, 0.4)",
                "0 0 35px rgba(0, 255, 65, 0.9)",
                "0 0 15px rgba(0, 255, 65, 0.4)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-[32px] md:text-5xl font-black text-[#00FF41] tracking-[-0.05em] drop-shadow-[0_0_20px_rgba(0,255,65,0.5)]"
          >
            <ScrambleTitle text="VISTO_LAB" />
          </motion.div>

          <div className="md:hidden flex items-center gap-4">
            <div className="w-2 h-2 bg-[#00FF41] animate-pulse" />
            <span className="text-[9px] uppercase tracking-widest text-[#00FF41]">
              Sistema Ativo
            </span>
          </div>
        </div>

        {/* SUBTITLE AREA (CENTER) */}
        <div className="hidden md:flex col-start-2 col-end-3 row-start-1 row-end-2 min-w-0 border-b border-[#00FF41] items-center justify-center bg-[#00FF41]/10 px-8">
          <div className="text-sm md:text-base lg:text-lg uppercase tracking-[0.25em] text-[#00FF41] font-black whitespace-nowrap drop-shadow-[0_0_10px_rgba(0,255,65,0.2)] text-center max-w-[90%] overflow-hidden text-ellipsis">
            Plataforma experimental de operações digitais-somáticas
          </div>
        </div>

        {/* STATUS & FAVICON AREA (RIGHT) */}
        <div className="hidden md:flex col-start-3 col-end-4 row-start-1 row-end-2 border-b border-[#00FF41] items-center justify-end px-12 bg-[#00FF41]/10">
          <div className="flex items-center gap-12">
            <div className="flex flex-col items-end">
              <span className="text-xs md:text-sm text-[#00FF41] font-black uppercase tracking-widest animate-pulse border-r-4 border-[#00FF41] pr-3 mb-1">
                Status: Online
              </span>
              <span className="text-xs md:text-sm text-white/80 uppercase font-mono tracking-tight">
                Protocolo_V.4.0.1
              </span>
            </div>
            <img
              src="https://raw.githubusercontent.com/1projetovisto-web/visto_lab_landing/main/public/favicon.png"
              alt="VISTO Logo"
              className="w-20 h-20 object-contain brightness-150 drop-shadow-[0_0_25px_rgba(0,255,65,0.4)] animate-pulse"
            />
          </div>
        </div>

        {/* SIDEBAR LEFT */}
        <div className="hidden md:flex col-start-1 col-end-2 row-start-2 row-end-4 border-r border-[#00FF41]/30 p-6 flex-col justify-between relative overflow-hidden">
          <SomaticFlow />
          <div className="relative z-10">
            <span className="text-xs text-[#00FF41]/85 block mb-4 tracking-[0.15em] font-semibold transition-all duration-300 [text-shadow:0_0_4px_rgba(0,255,100,0.25)] hover:text-[#00FF41]/100 hover:[text-shadow:0_0_8px_rgba(0,255,100,0.4)] uppercase">
              Status do Sistema
            </span>
            {tensionItems.map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 text-xs mb-4 transition-all duration-700 ${i === activeTensionIndex ? "text-[#00FF41] font-black scale-105 drop-shadow-[0_0_12px_#00FF41]" : "text-white/20"}`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-sm transition-all duration-700 ${i === activeTensionIndex ? "bg-[#00FF41] shadow-[0_0_15px_#00FF41] animate-pulse" : "bg-white/5"}`}
                />
                <span className="tracking-widest">{item.toUpperCase()}</span>
              </div>
            ))}
          </div>

          <div className="border border-white/10 p-5 bg-white/[0.02]">
            <span className="text-xs text-[#00FF41]/85 block mb-2 tracking-[0.15em] font-semibold transition-all duration-300 [text-shadow:0_0_4px_rgba(0,255,100,0.25)] hover:text-[#00FF41]/100 hover:[text-shadow:0_0_8px_rgba(0,255,100,0.4)] uppercase">
              O que é
            </span>
            <p className="text-sm leading-relaxed text-[#00FF41]/80 font-bold mb-4 uppercase tracking-wider">
              Laboratório de ativação sensorial em tempo real. Interação entre
              carne e hardware.
            </p>
            <div className="border border-[#00FF41] text-[#00FF41] px-3 py-1 text-[9px] inline-block rounded-full uppercase">
              Sistema Sensível
            </div>
          </div>
        </div>

        {/* CONTENT AREA (Middle) */}
        <div className="flex-1 min-w-0 md:col-start-2 md:col-end-3 md:row-start-2 md:row-end-3 overflow-y-auto overflow-x-hidden border-b md:border-b-0 border-[#00FF41]/30">
          {/* HERO SECTION */}
          <section className="min-h-[60vh] md:min-h-[calc(100vh-80px-140px)] flex flex-col justify-center p-6 md:p-14 border-b border-[#00FF41]/10">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-[#00FF41]/85 block mb-4 tracking-[0.15em] font-semibold transition-all duration-300 [text-shadow:0_0_4px_rgba(0,255,100,0.25)] hover:text-[#00FF41]/100 hover:[text-shadow:0_0_8px_rgba(0,255,100,0.4)] uppercase"
            >
              Manifesto 01.0 // Protocol: Somatic
            </motion.span>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] uppercase tracking-tighter flex flex-col gap-2"
            >
              <SomaticText text="A INTERFACE" />
              <div className="neon-text">
                <SomaticText text="É O SEU CORPO" />
              </div>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="mt-6 md:mt-8 text-sm md:text-xl lg:text-2xl text-[#00FF41]/80 font-black max-w-xl leading-snug uppercase tracking-widest"
            >
              <SomaticText
                text={`VOCÊ NÃO É O USUÁRIO\n\nVOCÊ É O INPUT\n\nO SISTEMA\nJÁ ESTÁ EM EXECUÇÃO\n\n// VISTO_LAB`}
              />
            </motion.div>
          </section>

          {/* TENSION / MARQUEE SECTION */}
          <section className="py-20 border-b border-[#00FF41]/10">
            <Marquee items={tensionItems} />
          </section>

          {/* ALTAR CIBERNÉTICO SECTION */}
          <section className="py-32 px-6 md:px-14 border-b border-[#00FF41]/10 bg-black/40">
            <div className="max-w-4xl mx-auto space-y-20">
              <div className="text-center">
                <span className="text-xs text-[#00FF41]/85 tracking-[0.15em] uppercase mb-12 block font-semibold transition-all duration-300 [text-shadow:0_0_4px_rgba(0,255,100,0.25)] hover:text-[#00FF41]/100 hover:[text-shadow:0_0_8px_rgba(0,255,100,0.4)]">
                  Protocolo_Visual_Central
                </span>
                <VideoMonitor />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center space-y-8"
              >
                <div className="w-1 w-full max-w-[300px] h-px bg-gradient-to-r from-transparent via-[#00FF41] to-transparent mx-auto" />
                <div className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight text-white uppercase tracking-tighter flex justify-center">
                  <SomaticText
                    text={`// USUÁRIO: INATIVO\n\nSISTEMA: ATIVO\n\nRECONHECIMENTO EM CURSO\n\n// VISTO_LAB`}
                  />
                </div>
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
                {
                  icon: <Monitor />,
                  title: "Plataforma Experimental",
                  desc: "Novos modos de existir na rede.",
                },
                {
                  icon: <Activity />,
                  title: "Interação Corpo + Código",
                  desc: "Seus movimentos geram mundos.",
                },
                {
                  icon: <Layers />,
                  title: "Experiências Audiovisuais",
                  desc: "Sintetizadores de realidade sensível.",
                },
                {
                  icon: <Shield />,
                  title: "Acesso Antecipado",
                  desc: "Seja um dos primeiros nodos ativos.",
                },
              ].map((f, i) => (
                <InteractiveFeatureCard
                  key={i}
                  index={i}
                  icon={f.icon}
                  title={f.title}
                  desc={f.desc}
                />
              ))}
            </div>
          </section>

          {/* FAQ SECTION */}
          <section className="py-20 px-6 md:px-14 border-b border-[#00FF41]/10">
            <div className="mb-12">
              <span className="text-3xl md:text-5xl font-black text-[#00FF41] block mb-2 tracking-[-0.05em] uppercase leading-none border-l-4 border-[#00FF41] pl-4">
                FAQ//V.I.S.T.O
              </span>
              <span className="text-xs text-[#00FF41]/85 tracking-[0.15em] uppercase ml-5 font-semibold transition-all duration-300 [text-shadow:0_0_4px_rgba(0,255,100,0.25)] hover:text-[#00FF41]/100 hover:[text-shadow:0_0_8px_rgba(0,255,100,0.4)]">
                Base de Conhecimento_Sistêmica
              </span>
            </div>
            <FAQ />
          </section>

          {/* FINAL CTA SECTION */}
          <section id="cta-section" className="py-32 px-6 md:px-14 text-center">
            <InteractiveText 
              text="VOCÊ ESTÁ PRONTO PARA SER VISTO?"
              className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8 italic text-white/90"
            />
            <div className="max-w-md w-full mx-auto mt-8">
              {status === "success" ? (
                <div className="border border-[#00FF41] p-6 text-[#00FF41] bg-[#00FF41]/10 text-center uppercase text-xs tracking-widest">
                  Acesso garantido. Aguarde protocolo de sincronização.
                </div>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  className="flex flex-col border border-[#00FF41] bg-black/50 hover:shadow-[0_0_15px_rgba(0,255,65,0.1)] transition-shadow"
                >
                  <input
                    type="email"
                    placeholder="DIGITE SEU ACESSO (EMAIL)"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-5 bg-transparent outline-none border-b border-[#00FF41]/30 text-[#00FF41] focus:bg-[#00FF41]/5 transition-colors uppercase text-sm text-center"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="p-5 bg-[#00FF41] text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-white transition-all disabled:opacity-50"
                  >
                    {status === "loading"
                      ? "Processando..."
                      : "Estabelecer Conexão"}
                  </button>
                </form>
              )}
            </div>
          </section>
        </div>

        {/* SIDEBAR RIGHT */}
        <div className="hidden md:flex col-start-3 col-end-4 row-start-2 row-end-3 border-l border-[#00FF41]/30 p-8 flex-col justify-between bg-black/20 relative overflow-hidden">
          <SomaticFlow />
          <div className="relative z-10 w-full h-full flex flex-col">
            <span className="text-xs text-[#00FF41]/80 block mb-8 tracking-[0.15em] uppercase transition-all duration-300 [text-shadow:0_0_4px_rgba(0,255,100,0.25)] hover:text-[#00FF41]/100 hover:[text-shadow:0_0_8px_rgba(0,255,100,0.4)] font-bold">
              Protocolos
            </span>

            <div className="relative flex-1">
              {[
                { id: "01", label: "INPUT", desc: "CORPO EM MOVIMENTO" },
                { id: "02", label: "PROCESS", desc: "SISTEMA SENSÍVEL" },
                { id: "03", label: "OUTPUT", desc: "RESPOSTA AUDIOVISUAL" },
              ].map((item) => (
                <PhysicsProtocolItem
                  key={item.id}
                  item={item}
                  mouseRef={sidebarMouseRef}
                />
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 mt-auto relative z-10">
            <span className="text-xs text-[#00FF41]/85 block mb-4 tracking-[0.15em] font-semibold transition-all duration-300 [text-shadow:0_0_4px_rgba(0,255,100,0.25)] hover:text-[#00FF41]/100 hover:[text-shadow:0_0_8px_rgba(0,255,100,0.4)] uppercase">
              Info
            </span>
            <p className="text-sm text-[#00FF41]/80 font-black leading-relaxed uppercase tracking-wider">
              Acesso antecipado exclusivo para terminais autenticados. Sem
              algoritmos de recomendação. Apenas feedback direto.
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
