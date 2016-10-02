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
    //gl.drawArrays(gl.LINE_LOOP, 0 , 3); 
    gl.drawArrays(gl.TRIANGLES, 0 , 3);
  }

  function createShaderProgram() {
    program = gl.createProgram();

    gl.attachShader(program, getShader(gl, 'shader-vs'));
    gl.attachShader(program, getShader(gl, 'shader-fs'));
    gl.linkProgram(program);
    gl.useProgram(program);

    return program;
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

// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context
function getShader(gl, id, type) {
  var shaderScript, theSource, currentChild, shader;
  
  shaderScript = document.getElementById(id);
  
  if (!shaderScript) {
    return null;
  }
  
  theSource = shaderScript.text;

  if (!type) {
    if (shaderScript.type == "x-shader/x-fragment") {
      type = gl.FRAGMENT_SHADER;
    } else if (shaderScript.type == "x-shader/x-vertex") {
      type = gl.VERTEX_SHADER;
    } else {
      // Unknown shader type
      return null;
    }
  }

  shader = gl.createShader(type);

  gl.shaderSource(shader, theSource);
    
  // Compile the shader program
  gl.compileShader(shader);  
    
  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {  
      alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));  
      gl.deleteShader(shader);
      return null;
  }
    
  return shader;
}