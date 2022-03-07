export const vshader = `
varying vec3 vUv;

void main() {
  vUv = position;

  vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;
}
`

export const fshader = `
#define PI2 6.28318530718
uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_color_a;
uniform vec3 u_color_b;

varying vec3 vUv;

void main() {
  gl_FragColor = vec4(mix(u_color_a, cos(u_time)*u_color_b, vUv.z), 1.0);
}
`