import { useEffect, useRef } from 'react';

const vertex = `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragment = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865, 0.366025403, -0.577350269, 0.024390243);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.792842914 - 0.85373472 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    uv.x *= aspect;
    vec2 mouse = uMouse;
    mouse.x *= aspect;

    float dist = length(uv - mouse);

    // Gentle twist — lowest speed setting (1.4 strength, soft falloff)
    float twist = exp(-dist * 4.0);
    float angle = twist * 1.4;
    float s = sin(angle);
    float c = cos(angle);
    mat2 rot = mat2(c, -s, s, c);
    vec2 displacedUv = mouse + rot * (uv - mouse);

    // Very slow time — speed at minimum (0.1 original × 0.1 = slowest)
    float n1 = snoise(displacedUv * 2.0 + uTime * 0.01);
    float n2 = snoise(displacedUv * 4.0 - uTime * 0.015);

    float field = n1 + n2 * 0.4 + dist * 0.2;

    // Maximum bands (80) with soft smoothstep to avoid harshness
    float banding = sin(field * 80.0);
    float pattern = smoothstep(-0.15, 0.15, banding);

    // Damascus palette
    vec3 jet   = vec3(0.176, 0.192, 0.259);
    vec3 slate = vec3(0.310, 0.365, 0.459);
    vec3 coral = vec3(0.937, 0.514, 0.329);

    vec3 color = mix(jet, slate, pattern * 0.8);

    // Subtle coral glow near cursor center
    float glow = smoothstep(0.4, 1.0, twist) * smoothstep(0.5, 1.0, banding);
    color = mix(color, coral, glow * 0.25);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function FluidBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const renderer = document.createElement('canvas');
    const gl = renderer.getContext('webgl') as WebGLRenderingContext;
    if (!gl) return;

    containerRef.current.appendChild(renderer);

    // Helper: compile shader
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    // Build program
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vertex));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // Full-screen triangle with UVs
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 0, 0, 3, -1, 2, 0, -1, 3, 0, 2]),
      gl.STATIC_DRAW
    );
    const posLoc = gl.getAttribLocation(prog, 'position');
    const uvLoc = gl.getAttribLocation(prog, 'uv');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(uvLoc);
    gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 16, 8);

    // Uniforms
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uMouse = gl.getUniformLocation(prog, 'uMouse');
    const uResolution = gl.getUniformLocation(prog, 'uResolution');

    // Mouse state with smooth lerp
    const mouse = { cx: 0.5, cy: 0.5, tx: 0.5, ty: 0.5 };

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      renderer.width = window.innerWidth * dpr;
      renderer.height = window.innerHeight * dpr;
      renderer.style.width = window.innerWidth + 'px';
      renderer.style.height = window.innerHeight + 'px';
      gl.viewport(0, 0, renderer.width, renderer.height);
      gl.uniform2f(uResolution, renderer.width, renderer.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || !target.closest) return;

      const isInteractiveArea = target.closest(
        'header, footer, nav, .bg-slate\\/25, .bg-jet, .backdrop-blur-md, .backdrop-blur-xl, button, a, input, select, textarea'
      );

      if (!isInteractiveArea) {
        mouse.tx = e.clientX / window.innerWidth;
        mouse.ty = 1.0 - e.clientY / window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    handleResize();

    let animId: number;

    const render = (now: number) => {
      animId = requestAnimationFrame(render);

      // Slow, smooth mouse tracking
      mouse.cx += (mouse.tx - mouse.cx) * 0.06;
      mouse.cy += (mouse.ty - mouse.cy) * 0.06;

      gl.uniform1f(uTime, now * 0.001);
      gl.uniform2f(uMouse, mouse.cx, mouse.cy);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      if (containerRef.current?.contains(renderer)) {
        containerRef.current.removeChild(renderer);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ touchAction: 'none' }}
    />
  );
}
