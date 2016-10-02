window.onload = runWebGL;

function runWebGL() {
  const canvas = document.getElementById('canvas');
  const gl = canvas.getContext('webgl');
  const shaderProgram = createShaderProgram();
  gl.viewport(0, 0, canvas.width, canvas.height);

  clear();
  draw();

  function clear() {
    gl.clearColor(1, 1, 1 , 1); // rgba
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  function draw() {
    gl.drawArrays(gl.POINTS, 0 , 1);
  }

  function createShaderProgram() {
    program = gl.createProgram();

    gl.attachShader(program, createVertexShader());
    gl.attachShader(program, createFragmentShader());
    gl.linkProgram(program);
    gl.useProgram(program);

    return program;
  }

  function createVertexShader() {
    const vs = `
      void main(void) {
        gl_Position = vec4(0.0, 0.0, 0.0, 1.0); // xyzw
        gl_PointSize = 10.0;
      }
    `;

    return createShader(vs, gl.VERTEX_SHADER);
  }

  function createFragmentShader() {
    const fs = `
      void main(void) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // rgba
      }
    `;

    return createShader(fs, gl.FRAGMENT_SHADER);
  }

  function createShader(source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
  }
}
