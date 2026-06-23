'use client';
import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    if (!gl) return;

    let animationFrameId: number;
    let resizeObserver: ResizeObserver;

    function syncSize() {
      if (!canvas) return;
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl?.viewport(0, 0, w, h);
      }
    }

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(syncSize);
      resizeObserver.observe(canvas);
    }
    syncSize();

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

    const fs = `precision highp float;
varying vec2 v_texCoord;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_isDark;

// Simplex 2D noise
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.wwww) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 a0 = x - floor(x + 0.5);
  vec3 m0 = 1.25 - 0.5 * ( a0*a0 + h*h );
  vec4 hb = fract(p.xyxy * vec4(1.1, 1.2, 1.3, 1.4));
  return 130.0 * dot(m, h * m0);
}

void main() {
    vec2 uv = v_texCoord;
    vec2 mouse = u_mouse / u_resolution;
    
    // Create multiple layers of noise for a "digital flow" effect
    float n = snoise(uv * 3.0 + u_time * 0.1);
    n += 0.5 * snoise(uv * 6.0 - u_time * 0.2);
    n += 0.25 * snoise(uv * 12.0 + u_time * 0.5);
    
    // Brand colors adapted for dark/light mode
    vec3 color1 = mix(vec3(0.0, 0.4, 0.9), vec3(0.0, 0.94, 1.0), u_isDark); 
    vec3 color2 = mix(vec3(0.95, 0.97, 1.0), vec3(0.05, 0.08, 0.08), u_isDark);
    
    // Mix based on noise and mouse proximity
    float dist = distance(uv, mouse);
    float glow = exp(-dist * 4.0);
    
    vec3 finalColor = mix(color2, color1 * (u_isDark > 0.5 ? 0.15 : 0.05), n * 0.5 + 0.5);
    finalColor += color1 * glow * (u_isDark > 0.5 ? 0.2 : 0.1);
    
    // Add subtle grid lines
    vec2 grid = fract(uv * 40.0);
    float gridLine = smoothstep(0.02, 0.0, grid.x) + smoothstep(0.02, 0.0, grid.y);
    finalColor += color1 * gridLine * (u_isDark > 0.5 ? 0.05 : 0.02);

    gl_FragColor = vec4(finalColor, 1.0);
}`;

    function cs(type: number, src: string) {
      if (!gl) return null;
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('Shader compile failed:', gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    }

    const prog = gl.createProgram();
    if (!prog) return;

    const vShader = cs(gl.VERTEX_SHADER, vs);
    const fShader = cs(gl.FRAGMENT_SHADER, fs);
    if (!vShader || !fShader) return;

    gl.attachShader(prog, vShader);
    gl.attachShader(prog, fShader);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('Program link failed:', gl.getProgramInfoLog(prog));
      return;
    }

    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    
    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    
    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');
    const uIsDark = gl.getUniformLocation(prog, 'u_isDark');

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    function render(t: number) {
      if (!gl) return;
      if (typeof ResizeObserver === 'undefined') syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      if (uIsDark) gl.uniform1f(uIsDark, isDarkMode ? 1.0 : 0.0);
      
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }
    
    render(0);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (resizeObserver) resizeObserver.disconnect();
      if (!gl) return;
      gl.deleteProgram(prog);
      gl.deleteShader(vShader);
      gl.deleteShader(fShader);
      gl.deleteBuffer(buf);
    };
  }, [theme]); // Re-run effect when theme changes to update uIsDark

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none opacity-50 dark:opacity-40" 
      aria-hidden="true"
    />
  );
}
