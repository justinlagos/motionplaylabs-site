import { FRAG, SCENES, VERT, type SceneId } from "./shaders";

type Options = {
  /** Fraction of CSS pixels to render at. Footage is soft, so under 1 is fine. */
  quality?: number;
  /** Cap on the drawing buffer width in pixels. */
  maxWidth?: number;
  preserveDrawingBuffer?: boolean;
};

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) throw new Error("shader alloc failed");
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(s);
    gl.deleteShader(s);
    throw new Error(log ?? "shader compile failed");
  }
  return s;
}

/**
 * Draws one or two scenes into a canvas and cross-fades between them.
 * Time only advances while playing, so pausing freezes the frame.
 */
export class SceneRenderer {
  readonly canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext;
  private u: Record<string, WebGLUniformLocation | null> = {};
  private raf = 0;
  private last = 0;
  private clock = 0;
  private playing = false;
  private a = 0;
  private b = 0;
  private mixAmount = 0;
  private quality: number;
  private maxWidth: number;
  private dirty = true;
  private lost = false;

  constructor(canvas: HTMLCanvasElement, opts: Options = {}) {
    this.canvas = canvas;
    this.quality = opts.quality ?? 0.6;
    this.maxWidth = opts.maxWidth ?? 1280;
    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      depth: false,
      powerPreference: "low-power",
      preserveDrawingBuffer: opts.preserveDrawingBuffer ?? false,
    });
    if (!gl) throw new Error("WebGL unavailable");
    this.gl = gl;
    gl.getExtension("OES_standard_derivatives");
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(prog) ?? "link failed");
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    for (const name of ["uRes", "uTime", "uSceneA", "uSceneB", "uMix"]) {
      this.u[name] = gl.getUniformLocation(prog, name);
    }
    canvas.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      this.lost = true;
      this.stop();
    });
  }

  setScenes(a: SceneId, b: SceneId, mix: number) {
    const ia = SCENES[a];
    const ib = SCENES[b];
    const m = Math.min(1, Math.max(0, mix));
    if (ia !== this.a || ib !== this.b || Math.abs(m - this.mixAmount) > 0.001) {
      this.a = ia;
      this.b = ib;
      this.mixAmount = m;
      this.dirty = true;
      if (!this.playing) this.draw();
    }
  }

  setTime(seconds: number) {
    this.clock = seconds;
    this.dirty = true;
  }

  resize() {
    const r = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = Math.max(2, Math.round(r.width * dpr * this.quality));
    let h = Math.max(2, Math.round(r.height * dpr * this.quality));
    if (w > this.maxWidth) {
      h = Math.round((h * this.maxWidth) / w);
      w = this.maxWidth;
    }
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
      this.dirty = true;
    }
    if (!this.playing) this.draw();
  }

  draw() {
    if (this.lost) return;
    const gl = this.gl;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.uniform2f(this.u.uRes, this.canvas.width, this.canvas.height);
    gl.uniform1f(this.u.uTime, this.clock);
    gl.uniform1i(this.u.uSceneA, this.a);
    gl.uniform1i(this.u.uSceneB, this.b);
    gl.uniform1f(this.u.uMix, this.mixAmount);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    this.dirty = false;
  }

  play() {
    if (this.playing || this.lost) return;
    this.playing = true;
    this.last = performance.now();
    const tick = (now: number) => {
      if (!this.playing) return;
      const dt = Math.min(0.1, (now - this.last) / 1000);
      this.last = now;
      if (!document.hidden) {
        this.clock += dt;
        this.draw();
      }
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  stop() {
    this.playing = false;
    cancelAnimationFrame(this.raf);
    if (this.dirty && !this.lost) this.draw();
  }

  get isPlaying() {
    return this.playing;
  }
}

/** One shared renderer for still thumbnails, so index pages use a single WebGL context. */
let thumbRenderer: SceneRenderer | null = null;
const thumbCache = new Map<string, string>();

export function sceneStill(scene: SceneId, width: number, height: number, time = 14): string | null {
  const key = `${scene}:${width}x${height}:${time}`;
  const hit = thumbCache.get(key);
  if (hit) return hit;
  try {
    if (!thumbRenderer) {
      const c = document.createElement("canvas");
      thumbRenderer = new SceneRenderer(c, { preserveDrawingBuffer: true, quality: 1, maxWidth: 2000 });
    }
    const c = thumbRenderer.canvas;
    c.width = width;
    c.height = height;
    thumbRenderer.setTime(time);
    thumbRenderer.setScenes(scene, scene, 0);
    thumbRenderer.draw();
    const url = c.toDataURL("image/jpeg", 0.85);
    thumbCache.set(key, url);
    return url;
  } catch {
    return null;
  }
}
