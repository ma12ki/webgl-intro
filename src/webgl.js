window.onload = runWebGL;

function runWebGL() {
  const canvas = document.getElementById('canvas');
  const gl = canvas.getContext('webgl');
  gl.viewport(0, 0, canvas.width, canvas.height);

  const shaderProgram = createShaderProgram();
  let vertices = [];
  createVertices();

  clear();
  draw();

  function clear() {
    gl.clearColor(1, 1, 1 , 1); // rgba
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  function draw() {
    gl.drawArrays(gl.POINTS, 0 , 3);
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
      attribute vec4 coords;
      attribute float pointSize;
      void main(void) {
        gl_Position = coords; // xyzw
        gl_PointSize = pointSize;
      }
    `;

    return createShader(vs, gl.VERTEX_SHADER);
  }

  function createFragmentShader() {
    const fs = `
      precision mediump float;
      uniform vec4 color;
      void main(void) {
        gl_FragColor = color; // rgba
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

  function createVertices() {
    vertices = [
      -0.9, -0.9, 0.0,
       0.9, -0.9, 0.0,
       0.0,  0.9, 0.0
    ];

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    const coords = gl.getAttribLocation(shaderProgram, 'coords');
    // gl.vertexAttrib3f(coords, 0, 0, 0);
    gl.vertexAttribPointer(coords, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coords);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    const pointSize = gl.getAttribLocation(shaderProgram, 'pointSize');
    gl.vertexAttrib1f(pointSize, 33.33);

    const color = gl.getUniformLocation(shaderProgram, 'color');
    gl.uniform4f(color, 1, 0, 1, 1);
  }
}
