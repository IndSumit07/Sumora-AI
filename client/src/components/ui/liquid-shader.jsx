import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function InteractiveNebulaShader({
  hasActiveReminders = false,
  hasUpcomingReminders = false,
  disableCenterDimming = false,
  className = "",
  isDark = true,
}) {
  const containerRef = useRef(null);
  const materialRef = useRef();

  // Sync props into uniforms
  useEffect(() => {
    const mat = materialRef.current;
    if (mat) {
      mat.uniforms.hasActiveReminders.value = hasActiveReminders;
      mat.uniforms.hasUpcomingReminders.value = hasUpcomingReminders;
      mat.uniforms.disableCenterDimming.value = disableCenterDimming;
      mat.uniforms.isDark.value = isDark;
    }
  }, [hasActiveReminders, hasUpcomingReminders, disableCenterDimming, isDark]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Renderer, scene, camera, clock
    let renderer, scene, camera, clock;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(renderer.domElement);

      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      clock = new THREE.Clock();
    } catch (err) {
      console.warn("WebGL not supported, skipping nebula background:", err);
      // Fail gracefully — just don't render the shader canvas
      return;
    }

    // Vertex shader: pass UVs
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    // Ray-marched nebula fragment shader
    const fragmentShader = `
      precision mediump float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform vec2 iMouse;
      uniform bool hasActiveReminders;
      uniform bool hasUpcomingReminders;
      uniform bool disableCenterDimming;
      uniform bool isDark;
      varying vec2 vUv;

      #define t iTime
      mat2 m(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }
      float map(vec3 p){
        p.xz *= m(t*0.4);
        p.xy *= m(t*0.3);
        vec3 q = p*2. + t;
        return length(p + vec3(sin(t*0.7))) * log(length(p)+1.0)
             + sin(q.x + sin(q.z + sin(q.y))) * 0.5 - 1.0;
      }

      void mainImage(out vec4 O, in vec2 fragCoord) {
        vec2 uv = fragCoord / min(iResolution.x, iResolution.y) - vec2(.9, .5);
        uv.x += .4;
        vec3 col = vec3(0.0);
        float d = 2.5;

        // Base theme colors (matching #ea580c / orange-600)
        // Dark mode: dark background with glowing orange
        // Light mode: light background with softer orange glow
        
        for (int i = 0; i <= 5; i++) {
          vec3 p = vec3(0,0,5.) + normalize(vec3(uv, -1.)) * d;
          float rz = map(p);
          float f  = clamp((rz - map(p + 0.1)) * 0.5, -0.1, 1.0);

          vec3 base = vec3(0.3, 0.05, 0.0) + vec3(1.2, 0.5, 0.1) * f;

          if (!isDark) {
             base = vec3(0.95, 0.4, 0.2) + vec3(0.8, 0.3, 0.0) * f;
          }

          col = col * base + smoothstep(2.5, 0.0, rz) * 0.9 * base;
          d += min(rz, 1.0);
        }

        float dist   = distance(fragCoord, iResolution*0.5);
        float radius = min(iResolution.x, iResolution.y) * 0.5;
        float dim    = disableCenterDimming
                     ? 1.0
                     : smoothstep(radius*0.3, radius*0.5, dist);

        if (!disableCenterDimming) {
          col = mix(col * 0.5, col, dim); // Less dimming in the center
        }

        // Increase alpha multiplier so it pops much more
        float alpha = isDark ? clamp(dot(col, vec3(0.5)), 0.0, 1.0) : clamp(dot(col, vec3(0.5)), 0.3, 1.0);
        
        if (!isDark) {
           O = vec4(col, alpha * 0.7); // Much more visible in light mode
        } else {
           O = vec4(col, 1.0);
        }
      }

      void main() {
        mainImage(gl_FragColor, vUv * iResolution);
      }
    `;

    // Uniforms
    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector2() },
      iMouse: { value: new THREE.Vector2() },
      hasActiveReminders: { value: hasActiveReminders },
      hasUpcomingReminders: { value: hasUpcomingReminders },
      disableCenterDimming: { value: disableCenterDimming },
      isDark: { value: isDark },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
    });
    materialRef.current = material;
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    // Resize & mouse
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.iResolution.value.set(w, h);
    };
    const onMouseMove = (e) => {
      uniforms.iMouse.value.set(e.clientX, window.innerHeight - e.clientY);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouseMove);
    // slight delay to ensure container has dimensions
    setTimeout(onResize, 0);

    // Animation loop
    renderer.setAnimationLoop(() => {
      uniforms.iTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    });

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      renderer.setAnimationLoop(null);
      container.removeChild(renderer.domElement);
      material.dispose();
      mesh.geometry.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      aria-label="Interactive nebula background"
    />
  );
}
