export const vshader = `
uniform vec2 u_resolution;

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

uniform vec2 u_points[9];

varying vec3 vUv;
varying vec2 uv;


void main() {
  vec2 uv = gl_FragColor.xy/u_resolution;

  vec3 col = mix(u_color_a, cos(u_time)*u_color_b, vUv.z);

  gl_FragColor = vec4(vUv.x, col.xy, 1.0);
}
`


// export const fshader = `
// #define PI2 6.28318530718
// uniform vec2 u_mouse;
// uniform vec2 u_resolution;
// uniform float u_time;
// uniform vec3 u_color_a;
// uniform vec3 u_color_b;

// uniform vec2 u_points[9];

// varying vec3 vUv;
// varying vec2 uv;

// float circle(in vec2 _st, in float _radius){
//   vec2 dist = _st-vec2(0.5);
// return 1.-smoothstep(_radius-(_radius*0.01),
//                        _radius+(_radius*0.01),
//                        dot(dist,dist)*4.0);
// }

// void main() {
//   // vec2 uv = gl_FragColor.xy/u_resolution;
//   // vec2 st = vUv.xy/u_resolution;

//   // vec3 col = mix(u_color_a, cos(u_time)*u_color_b, vUv.z);

//   //  for(int i = 0; i < 9; i++) {
//   //    vec2 p = u_points[i]/u_resolution;
//   //    float radius = 0.1 * u_resolution.x;
//   //    float d = length(p - vUv.xy) - radius;

//   //    float t = clamp(d, 0.4, 1.0);

//   //   //  col *= t;

//   //  }


//   // // vec2 center = st * 0.5;
//   // // float radius = 0.20 * u_resolution.x;
//   // // float d = length(center - vUv.xy) - radius;
//   // // float t = clamp(d, 0.4, 1.0);
//   // // gl_FragColor = vec4( t, center, (120,230,0));

//   // // // gl_FragColor = vec4(col, 1.0);
//   // // // gl_FragColor = vec4(st.x,st.y,0.0,1.0);

//   // gl_FragColor = vec4(uv.x, uv.y, 0.0, 1.0);



//   vec3 color = vec3(0.0);

//   // color += vec3(circle(vUv.xy, 0.5));
//   color += vec3(circle(vec2(-1.0, 2.0), 9.));



//   // color.r = vUv.x * vUv.y;
//   color.b = clamp(vUv.y, 1.0, 1.0);

//   // vec2 p = vec2(u_points[i][0],u_points[i][1]);

//   float d = length(vUv.xy);
//   color.g = d;

//   gl_FragColor = vec4(color, 1.0);
// }
// `

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