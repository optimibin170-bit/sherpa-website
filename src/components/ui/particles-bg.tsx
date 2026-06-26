import { useEffect, useCallback, useRef } from "react";

interface ParticleConfig {
  particles: {
    number: { value: number; density: { enable: boolean; value_area: number } };
    color: { value: string };
    shape: { type: string; stroke: { width: number; color: string } };
    opacity: { value: number; random: boolean; anim: { enable: boolean; speed: number; opacity_min: number } };
    size: { value: number; random: boolean; anim: { enable: boolean; speed: number; size_min: number } };
    line_linked: { enable: boolean; distance: number; color: string; opacity: number; width: number };
    move: { enable: boolean; speed: number; random: boolean; out_mode: string };
  };
  interactivity: {
    detect_on: string;
    events: {
      onhover: { enable: boolean; mode: string };
      onclick: { enable: boolean; mode: string };
      resize: boolean;
    };
    modes: {
      grab: { distance: number; line_linked: { opacity: number } };
      push: { particles_nb: number };
      repulse: { distance: number; duration: number };
    };
  };
  retina_detect: boolean;
}

function destroyParticles(): void {
  if (window.pJSDom?.length > 0) {
    window.pJSDom.forEach((p) => p.pJS.fn.vendors.destroypJS());
    window.pJSDom = [];
  }
}

export default function ParticlesComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  const initParticles = useCallback(() => {
    if (!containerRef.current) return;

    destroyParticles();

    if (!window.particlesJS) return;

    const config: ParticleConfig = {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 900 } },
        color: { value: "#1a6b4a" },
        shape: { type: "circle", stroke: { width: 0.5, color: "#14532d" } },
        opacity: {
          value: 0.5,
          random: true,
          anim: { enable: true, speed: 1, opacity_min: 0.2 },
        },
        size: {
          value: 2.5,
          random: true,
          anim: { enable: true, speed: 2, size_min: 0.5 },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#15803d",
          opacity: 0.3,
          width: 1,
        },
        move: { enable: true, speed: 1.5, random: true, out_mode: "bounce" },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: true, mode: "push" },
          resize: true,
        },
        modes: {
          grab: { distance: 200, line_linked: { opacity: 0.6 } },
          push: { particles_nb: 3 },
          repulse: { distance: 150, duration: 0.4 },
        },
      },
      retina_detect: true,
    };

    window.particlesJS("particles-js", config);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (scriptLoaded.current) {
      initParticles();
      return;
    }

    const script = document.createElement("script");
    script.src = "/particles.min.js";
    script.async = true;
    script.integrity = "sha256-icjghcPaibMf1jv4gQIGi5MeWNHem2SispcorCiCfSg=";
    script.crossOrigin = "anonymous";
    script.onload = () => {
      scriptLoaded.current = true;
      initParticles();
    };
    document.body.appendChild(script);

    return () => {
      destroyParticles();
    };
  }, [initParticles]);

  return (
    <div
      ref={containerRef}
      id="particles-js"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
