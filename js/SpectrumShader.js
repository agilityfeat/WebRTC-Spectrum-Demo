THREE.SpectrumShader = {
  defines: {},
  
  attributes: {
    "translation": { type:'v3', value:[] },
    "idx": { type:'f', value:[] }
  },
  
  uniforms: {
    "amplitude":  { type: "fv1", value: [] },
    "opacity":  { type: "f", value: 1.0 }
  },

  vertexShader: [
  
    "attribute vec3 translation;",
    
    "attribute float idx;",
    
    "uniform float amplitude[ 50 ];",

    "varying vec3 vNormal;",
    
    "varying float amp;",

    "void main() {",
      
      "gl_PointSize = 1.0;",
      
      "vNormal = normal;",
      
      "highp int index = int(idx);",
      
      "amp = amplitude[index];",
      
      "vec3 newPosition = position + normal + vec3(translation * amp);",
      
      "gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);",

    "}"

  ].join("\n"),

  fragmentShader: [

    "uniform float opacity;",
    
    "varying float amp;",

    "void main() {",
      
      "gl_FragColor = vec4(-(amp) + 1.0, 0.5 + (amp/2.0), 0.0, opacity);",

    "}"

  ].join("\n")
};