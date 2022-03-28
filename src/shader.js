// https://github.com/mrdoob/three.js/tree/master/src/renderers/shaders/ShaderChunk
// https://github.com/hoskra/surreal-museum/blob/master/data/shaders/lighting.vert
// https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram

export const vshader = `
#include <noise>
#define EULER 2.718281828459045
uniform vec2 u_resolution;
varying vec3 vPosition;
varying vec2 vUv;
uniform float u_time;

varying vec3 vNormal;

void main() {
  vUv = uv;
  vPosition = position;
  vNormal = normal;

  vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;

  float n = cnoise( vPosition );
  // gl_Position.x += n;
  // gl_Position.y += n;

}
`

export const fshader = `
#include <noise>
// #include <simple_lambert_vertex>


#define PI2 6.28318530718
uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_color_a;
uniform vec3 u_color_b;

varying vec3 vPosition;
uniform vec2 u_points[9];

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vMVP;

varying vec4 color; //color

void main() {
  vec2 uv = gl_FragColor.xy/u_resolution.xy;
  uv.x *= u_resolution.x/u_resolution.y;

  float n = cnoise( vPosition );

  gl_FragColor = vec4(-n, 2.*n, -n, 1.0);
  gl_FragColor = vec4(0.1, .2, 0.1, 1.0);
  // gl_FragColor.r -= n;

}
`

export const fshader2 = `
#include <noise>
#define PI2 6.28318530718
uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_color_a;
uniform vec3 u_color_b;

varying vec3 vPosition;

uniform vec2 u_points[9];

varying vec2 vUv;
varying vec2 uv;

float circle(in vec2 _st, in float _radius){
  vec2 dist = _st-vec2(0.5);
return 1.-smoothstep(_radius-(_radius*0.01),
                       _radius+(_radius*0.01),
                       dot(dist,dist)*4.0);
}

void main() {
  // vec2 uv = gl_FragColor.xy/u_resolution;
  // vec2 st = vUv.xy/u_resolution;

  // vec3 col = mix(u_color_a, cos(u_time)*u_color_b, vUv.x);

  //  for(int i = 0; i < 9; i++) {
  //    vec2 p = u_points[i]/u_resolution;
  //    float radius = 0.1 * u_resolution.x;
  //    float d = length(p - vUv.xy) - radius;

  //    float t = clamp(d, 0.4, 1.0);

  //   //  col *= t;

  //  }


  // // vec2 center = st * 0.5;
  // // float radius = 0.20 * u_resolution.x;
  // // float d = length(center - vUv.xy) - radius;
  // // float t = clamp(d, 0.4, 1.0);
  // // gl_FragColor = vec4( t, center, (120,230,0));

  // // // gl_FragColor = vec4(col, 1.0);
  // // // gl_FragColor = vec4(st.x,st.y,0.0,1.0);



  vec3 color = vec3(0.0);

  float n = cnoise( vUv );


  color += vec3(circle(vUv.xy, 0.9));
  // color += vec3(circle(vec2(-1.0, 2.0), 9.));
  color.r += n;
  color.b += n;


  // color.r = vUv.x * vUv.y;
  // color.b = clamp(vUv.y, 1.0, 1.0);


  // float d = length(vUv.xy);
  // color.g = d;

  gl_FragColor = vec4(color, 1.0);
}
`

/*
uv values
 + ---- (1.0, 1.0)
 |            |
 |            |
(0.0, 0.0) ---+
position values
 + ---- (1.0, 1.0, 0.0)
 |                   |
 |                   |
(-1.0, -1.0, 0.0) ---+
*/