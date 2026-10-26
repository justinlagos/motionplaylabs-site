// Placeholder footage. Each scene stands in for one shot in the shot list
// (playbook section 17) until the real macro footage is shot and encoded.
// Scenes are drawn live in WebGL so the film works end to end with zero video weight.

export const SCENES = {
  black: 0,
  ink: 1, // H1 cyan ink drop blooming in water
  trail: 2, // H2 fingertip light trail tracing the mark
  graphite: 3, // I1 graphite on cotton paper
  emboss: 4, // I2 embossed mark under raking light
  halftone: 5, // C1 loupe over halftone rosettes
  cmy: 6, // C2 CMY inks folding on an ink slab
  circuit: 7, // C3 solder bead and LED on a board
  beam: 8, // C4 projector beam through dust
  chalk: 9, // C5 chalk line and falling dust
  inkReverse: 10, // close: the ink bloom closing back in
  bokeh: 11, // P2 / P6 night lights through wet glass
} as const;

export type SceneId = keyof typeof SCENES;

export const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

export const FRAG = `
#extension GL_OES_standard_derivatives : enable
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 uRes;
uniform float uTime;
uniform int uSceneA;
uniform int uSceneB;
uniform float uMix;
varying vec2 vUv;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

// The mark: one continuous line, same path as the SVG logo (viewBox 120 x 52).
vec2 bez(vec2 a, vec2 b, vec2 c, vec2 d, float t) {
  float u = 1.0 - t;
  return u * u * u * a + 3.0 * u * u * t * b + 3.0 * u * t * t * c + t * t * t * d;
}

vec2 markPt(float s) {
  float seg = clamp(s, 0.0, 1.0) * 4.0;
  vec2 P;
  if (seg < 1.0) P = bez(vec2(4.0, 44.0), vec2(24.0, 44.0), vec2(40.0, 40.0), vec2(52.0, 28.0), seg);
  else if (seg < 2.0) P = bez(vec2(52.0, 28.0), vec2(62.0, 18.0), vec2(60.0, 6.0), vec2(50.0, 6.0), seg - 1.0);
  else if (seg < 3.0) P = bez(vec2(50.0, 6.0), vec2(40.0, 6.0), vec2(38.0, 20.0), vec2(48.0, 30.0), seg - 2.0);
  else P = bez(vec2(48.0, 30.0), vec2(60.0, 42.0), vec2(84.0, 46.0), vec2(116.0, 30.0), min(seg - 3.0, 1.0));
  return vec2((P.x - 60.0) / 60.0, -(P.y - 26.0) / 60.0);
}

// x: distance to the drawn part of the mark, y: curve position of the nearest point
vec2 markDist(vec2 p, float sMax) {
  float best = 1000.0;
  float bs = 0.0;
  vec2 a = markPt(0.0);
  for (int i = 1; i <= 48; i++) {
    float s = float(i) / 48.0;
    if (s - 1.0 / 48.0 > sMax) break;
    vec2 b = markPt(min(s, sMax));
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
    float d = length(pa - ba * h);
    if (d < best) {
      best = d;
      bs = (float(i - 1) + h) / 48.0;
    }
    a = b;
  }
  return vec2(best, bs);
}

vec3 sInk(vec2 q, float t, float closing) {
  vec2 p = q * 1.25;
  float tt = t * 0.045;
  vec2 w1 = vec2(fbm(p + vec2(0.0, tt)), fbm(p + vec2(5.2, 1.3) - tt));
  vec2 w2 = vec2(fbm(p + 3.0 * w1 + vec2(1.7, 9.2) + 0.15 * tt), fbm(p + 3.0 * w1 + vec2(8.3, 2.8) - 0.12 * tt));
  float f = fbm(p + 3.4 * w2);
  vec2 c = vec2(0.0, 0.1 + 0.03 * sin(t * 0.07));
  float radius = mix(1.15, 0.5, closing);
  float mask = smoothstep(radius, 0.0, length((q - c) * vec2(0.8, 0.95)));
  float d = smoothstep(0.22, 0.78, f * mask * 1.7);
  vec3 water = vec3(0.004, 0.012, 0.03) + vec3(0.0, 0.01, 0.025) * (0.5 - q.y);
  vec3 cyan = vec3(0.0, 0.63, 0.89);
  vec3 col = water;
  col = mix(col, cyan * 0.18, smoothstep(0.02, 0.3, d));
  col = mix(col, cyan * 0.7, smoothstep(0.3, 0.75, d));
  col = mix(col, vec3(0.55, 0.88, 1.0), smoothstep(0.82, 1.0, d) * 0.6);
  col += vec3(0.6, 0.9, 1.0) * pow(max(0.0, w2.x - 0.42) * 1.9, 3.0) * 0.5 * mask;
  // suspended particles
  vec2 pp = q * 70.0 + vec2(0.0, t * 0.6);
  float sp = step(0.985, hash(floor(pp))) * smoothstep(0.35, 0.0, length(fract(pp) - 0.5));
  col += vec3(0.4, 0.7, 0.9) * sp * 0.25;
  return col;
}

vec3 sTrail(vec2 q, float t, float aspect) {
  vec3 col = vec3(0.008, 0.009, 0.014) + 0.012 * fbm(q * 3.0 + t * 0.02);
  float S = min(0.62, aspect * 0.42);
  vec2 c = q / S;
  float cyc = mod(t, 8.0) / 5.5;
  float head = clamp(cyc, 0.0, 1.0);
  float fadeAll = 1.0 - smoothstep(1.08, 1.42, cyc);
  vec2 md = markDist(c, head);
  float age = head - md.y;
  float life = exp(-age * 2.4);
  float dd = md.x * S;
  float core = exp(-dd * dd * 26000.0);
  float glow = exp(-dd * 60.0) * 0.4 + exp(-dd * 14.0) * 0.08;
  vec3 warm = vec3(1.0, 0.93, 0.82);
  vec3 cy = vec3(0.35, 0.75, 1.0);
  col += (warm * core + mix(cy, warm, 0.35) * glow) * life * fadeAll;
  vec2 hp = markPt(head) * S;
  col += warm * exp(-length(q - hp) * 30.0) * 0.7 * fadeAll * step(cyc, 1.0);
  return col;
}

vec3 sGraphite(vec2 q, vec2 uv, float t) {
  vec3 paper = vec3(0.70, 0.70, 0.68);
  float fib = noise(mat2(0.8, 0.6, -0.6, 0.8) * q * vec2(260.0, 14.0)) * 0.5
            + noise(mat2(0.6, -0.8, 0.8, 0.6) * q * vec2(280.0, 12.0)) * 0.5;
  float tooth = fbm(q * 70.0);
  vec3 col = paper * (0.82 + 0.1 * fib + 0.1 * tooth);
  col *= 0.8 + 0.32 * (uv.x * 0.6 + uv.y * 0.4);
  float head = mod(t * 0.09, 2.0) - 1.0;
  float y = 0.05 * sin(q.x * 3.1 + 1.0) - 0.02;
  float dy = abs(q.y - y);
  float width = 0.013 + 0.005 * noise(vec2(q.x * 30.0, 0.0));
  float stroke = smoothstep(width, width * 0.35, dy) * step(q.x, head) * step(-1.0, q.x);
  float grainMask = smoothstep(0.3, 0.62, noise(q * vec2(420.0, 900.0)) * 0.7 + tooth * 0.5);
  col = mix(col, vec3(0.17, 0.17, 0.18), stroke * grainMask * 0.92);
  col += vec3(0.05) * exp(-length((q - vec2(head, y)) * vec2(1.0, 3.0)) * 12.0) * step(-1.0, head);
  return col;
}

vec3 sEmboss(vec2 q, float t, float aspect) {
  float S = min(0.5, aspect * 0.34);
  vec2 md = markDist((q - vec2(0.0, 0.02)) / S, 1.0);
  float w = 0.055;
  float h = exp(-(md.x * md.x) / (w * w));
  vec2 grad = vec2(dFdx(h), dFdy(h)) * uRes.y;
  vec3 n = normalize(vec3(-grad * 0.075, 1.0));
  float a = t * 0.18;
  vec3 L = normalize(vec3(cos(a), 0.45 + 0.4 * sin(a), 0.5));
  float tex = fbm(q * 40.0) * 0.5 + noise(q * 300.0) * 0.5;
  vec3 base = vec3(0.06, 0.06, 0.065) * (0.8 + 0.4 * tex);
  float shade = dot(n, L) - dot(vec3(0.0, 0.0, 1.0), L);
  vec3 col = base * (1.0 + 4.5 * shade);
  float spec = pow(max(dot(reflect(-L, n), vec3(0.0, 0.0, 1.0)), 0.0), 14.0);
  col += vec3(0.38) * spec * smoothstep(0.02, 0.5, h) * smoothstep(0.98, 0.7, n.z);
  col += vec3(0.02) * max(0.0, dot(normalize(vec2(L.x, L.y)), q)) ;
  return col;
}

vec3 sHalftone(vec2 q, float t, float aspect) {
  vec2 lc = vec2(min(0.36, aspect * 0.22) + 0.06 * sin(t * 0.13), 0.2 + 0.05 * sin(t * 0.21 + 1.0));
  float lr = 0.24;
  float ld = length(q - lc);
  float inL = smoothstep(lr, lr - 0.008, ld);
  vec2 p = mix(q, lc + (q - lc) / 2.8, inL);
  float img = smoothstep(0.32, 0.7, fbm(p * 1.6 + vec2(3.0, 7.0)));
  float freq = 30.0;
  vec2 gk = mat2(0.707, -0.707, 0.707, 0.707) * p * freq;
  float rk = sqrt(img) * 0.55;
  float dk = smoothstep(rk, rk - 0.09, length(fract(gk) - 0.5));
  vec2 gc = mat2(0.966, -0.259, 0.259, 0.966) * p * freq;
  float rc = sqrt(1.0 - img) * 0.42;
  float dc = smoothstep(rc, rc - 0.09, length(fract(gc) - 0.5));
  vec3 paper = vec3(0.72, 0.75, 0.78) * (0.9 + 0.1 * noise(p * 400.0));
  vec3 col = paper;
  col *= 1.0 - dc * vec3(0.6, 0.15, 0.0);
  col *= 1.0 - dk * 0.9;
  col = col * vec3(0.58, 0.66, 0.78) * 0.72;
  col *= mix(0.5, 1.05, inL);
  float ring = smoothstep(0.014, 0.0, abs(ld - lr));
  col += vec3(0.3, 0.33, 0.36) * ring;
  col += vec3(0.06) * smoothstep(lr, lr * 0.4, length(q - lc - vec2(-0.07, 0.07))) * inL;
  return col;
}

vec3 sCMY(vec2 q, float t) {
  vec3 slab = vec3(0.075, 0.08, 0.085) + 0.035 * fbm(q * 4.0);
  float tt = t * 0.05;
  float fc = fbm(q * 1.4 + vec2(tt, -tt * 0.7) + 2.0 * vec2(fbm(q * 1.2 + tt), fbm(q * 1.3 - tt)));
  float fm = fbm(q * 1.5 + vec2(-tt * 0.8, tt * 0.5) + 2.0 * vec2(fbm(q * 1.1 + 4.0 + tt), fbm(q * 1.4 + 7.0 - tt)));
  float fy = fbm(q * 1.3 + vec2(tt * 0.6, tt) + 2.0 * vec2(fbm(q * 1.5 + 9.0 - tt), fbm(q * 1.2 + 2.0 + tt)));
  float c = smoothstep(0.38, 0.5, fc);
  float m = smoothstep(0.41, 0.53, fm);
  float y = smoothstep(0.42, 0.54, fy);
  vec3 cov = vec3(1.0);
  cov *= mix(vec3(1.0), vec3(0.0, 0.63, 0.89), c);
  cov *= mix(vec3(1.0), vec3(0.88, 0.02, 0.5), m);
  cov *= mix(vec3(1.0), vec3(1.0, 0.86, 0.0), y);
  float anyInk = max(c, max(m, y));
  vec3 col = mix(slab, cov * 0.92, anyInk);
  float gl = pow(max(0.0, fbm(q * 7.0 + tt * 2.0) - 0.52) * 2.3, 3.0);
  col += gl * anyInk * 0.4;
  return col * 0.88;
}

vec3 sCircuit(vec2 q, float t) {
  vec2 bead = vec2(-0.12, 0.02);
  float focus = exp(-length((q - bead) * vec2(0.9, 1.6)) * 2.6);
  vec2 p = q * 15.0;
  vec2 id = floor(p);
  vec2 f = fract(p) - 0.5;
  float h1 = hash(id);
  float h2 = hash(id + 7.3);
  vec3 col = vec3(0.016, 0.06, 0.036) + 0.02 * noise(q * 90.0);
  float trace = 0.0;
  trace = max(trace, step(0.5, h1) * smoothstep(0.09, 0.04, abs(f.y)));
  trace = max(trace, step(0.62, h2) * smoothstep(0.09, 0.04, abs(f.x)));
  float pad = step(0.86, hash(id + 2.1)) * smoothstep(0.24, 0.2, length(f));
  float detail = mix(0.25, 1.0, focus);
  col = mix(col, vec3(0.07, 0.2, 0.11), trace * 0.85 * detail);
  col = mix(col, vec3(0.55, 0.47, 0.26), pad * detail);
  col *= 0.55 + 0.6 * focus;
  float br = 0.035 + 0.012 * sin(t * 0.6);
  float bd = length(q - bead);
  float bm = smoothstep(br, br - 0.004, bd);
  vec3 bn = normalize(vec3((q - bead) / br, 0.8));
  float bs = pow(max(dot(bn, normalize(vec3(-0.4, 0.6, 0.7))), 0.0), 24.0);
  col = mix(col, vec3(0.6, 0.62, 0.65) * (0.35 + 0.65 * bn.z) + bs * 0.8, bm);
  vec2 led = vec2(0.26, 0.11);
  float on = smoothstep(0.35, 0.55, sin(t * 2.2) * 0.5 + 0.5);
  float ld = length(q - led);
  col = mix(col, vec3(1.0, 0.75, 0.3), smoothstep(0.03, 0.026, ld) * (0.35 + 0.65 * on));
  col += vec3(1.0, 0.55, 0.12) * exp(-ld * 16.0) * on * 0.8;
  col += vec3(0.9, 0.95, 1.0) * exp(-bd * 40.0) * 0.12;
  return col;
}

vec3 sBeam(vec2 q, float t) {
  vec3 room = vec3(0.012, 0.01, 0.008);
  vec2 src = vec2(-1.05, 0.42);
  vec2 dir = normalize(vec2(1.0, -0.33));
  vec2 v = q - src;
  float along = dot(v, dir);
  float perp = abs(dot(v, vec2(-dir.y, dir.x)));
  float spread = 0.05 + along * 0.21;
  float cone = smoothstep(spread, spread * 0.55, perp) * step(0.0, along);
  float fall = 1.0 / (1.0 + along * along * 0.5);
  float haze = fbm(q * 3.0 + vec2(t * 0.05, 0.0)) * 0.6 + 0.4;
  vec3 amber = vec3(1.0, 0.72, 0.38);
  vec3 col = room + amber * cone * fall * haze * 0.33;
  float dust = 0.0;
  for (int L = 0; L < 3; L++) {
    float fl = float(L);
    vec2 pp = q * (14.0 + fl * 9.0) + vec2(t * (0.08 + fl * 0.03), t * (0.05 - fl * 0.02)) + fl * 13.0;
    vec2 id = floor(pp);
    vec2 f = fract(pp) - 0.5;
    float hh = hash(id + fl);
    vec2 o = vec2(hash(id + 3.1), hash(id + 5.7)) - 0.5;
    float d = length(f - o * 0.6);
    float tw = 0.5 + 0.5 * sin(t * (1.0 + hh * 2.0) + hh * 30.0);
    dust += step(0.8, hh) * smoothstep(0.07, 0.0, d) * tw;
  }
  col += amber * dust * cone * fall * 1.5;
  col += amber * exp(-length(q - src) * 3.2) * 0.55;
  return col;
}

vec3 sChalk(vec2 q, float t) {
  vec3 slate = vec3(0.07, 0.09, 0.083) + 0.03 * fbm(q * 5.0) + 0.015 * noise(q * 220.0);
  slate += 0.035 * smoothstep(0.55, 0.8, fbm(q * 2.3 + 5.0));
  float head = mod(t * 0.1, 2.1) - 1.05;
  float y = -0.24 + 0.06 * sin(q.x * 2.4 + 0.5);
  float dy = abs(q.y - y);
  float tex = noise(q * vec2(320.0, 80.0)) * 0.6 + noise(q * 520.0) * 0.4;
  float stroke = smoothstep(0.017, 0.006, dy) * step(q.x, head) * step(-1.05, q.x) * smoothstep(0.25, 0.55, tex);
  vec3 chalk = vec3(0.93, 0.91, 0.86);
  vec3 col = mix(slate, chalk, stroke * 0.9);
  float dust = 0.0;
  for (int L = 0; L < 2; L++) {
    float fl = float(L);
    vec2 pp = (q - vec2(head, y)) * (60.0 + fl * 40.0) + vec2(0.0, t * (2.0 + fl));
    vec2 id = floor(pp);
    float hh = hash(id + fl * 9.0);
    dust += step(0.9, hh) * smoothstep(0.14, 0.0, length(fract(pp) - 0.5));
  }
  float near = exp(-length((q - vec2(head - 0.04, y - 0.16)) * vec2(4.0, 1.4)) * 2.0);
  col += chalk * dust * near * 0.7;
  return col;
}

vec3 sBokeh(vec2 q, float t) {
  vec3 col = vec3(0.01, 0.012, 0.02);
  for (int L = 0; L < 3; L++) {
    float fl = float(L);
    vec2 pp = q * (1.8 + fl * 1.3) + vec2(t * (0.02 + fl * 0.012), fl * 4.0);
    vec2 id = floor(pp);
    vec2 f = fract(pp) - 0.5;
    float hh = hash(id + fl * 3.0);
    vec2 o = (vec2(hash(id + 1.7), hash(id + 8.1)) - 0.5) * 0.5;
    float d = length(f - o);
    float r = 0.16 + 0.12 * hash(id + 4.4);
    float disc = smoothstep(r, r - 0.06, d) * (0.55 + 0.45 * smoothstep(r - 0.08, r - 0.01, d));
    vec3 c = mix(vec3(1.0, 0.55, 0.15), vec3(0.95, 0.14, 0.08), step(0.33, hh));
    c = mix(c, vec3(0.88, 0.92, 1.0), step(0.66, hh));
    col += c * disc * (0.12 + 0.1 * fl) * step(0.62, hash(id + 2.2));
  }
  vec2 rp = q * vec2(46.0, 5.0) + vec2(0.0, t * 2.4);
  float streak = step(0.94, hash(floor(rp))) * smoothstep(0.12, 0.0, abs(fract(rp.x) - 0.5));
  col += streak * 0.07;
  vec2 dp = q * 22.0;
  float drop = step(0.9, hash(floor(dp) + 0.5)) * smoothstep(0.3, 0.1, length(fract(dp) - 0.5));
  col += drop * 0.04;
  return col;
}

vec3 scene(int id, vec2 q, vec2 uv, float t, float aspect) {
  if (id == 1) return sInk(q, t, 0.0);
  if (id == 2) return sTrail(q, t, aspect);
  if (id == 3) return sGraphite(q, uv, t);
  if (id == 4) return sEmboss(q, t, aspect);
  if (id == 5) return sHalftone(q, t, aspect);
  if (id == 6) return sCMY(q, t);
  if (id == 7) return sCircuit(q, t);
  if (id == 8) return sBeam(q, t);
  if (id == 9) return sChalk(q, t);
  if (id == 10) return sInk(q, 400.0 - t, 1.0);
  if (id == 11) return sBokeh(q, t);
  return vec3(0.0);
}

void main() {
  vec2 uv = vUv;
  float aspect = uRes.x / uRes.y;
  vec2 q = (uv - 0.5) * vec2(aspect, 1.0);
  vec3 col = scene(uSceneA, q, uv, uTime, aspect);
  if (uMix > 0.001) {
    vec3 colB = scene(uSceneB, q, uv, uTime, aspect);
    col = mix(col, colB, uMix);
  }
  col *= 1.0 - 0.38 * pow(length((uv - 0.5) * 1.25), 2.0);
  col += (hash(uv * uRes + fract(uTime * 0.37) * 91.0) - 0.5) * 0.05;
  gl_FragColor = vec4(max(col, 0.0), 1.0);
}
`;
