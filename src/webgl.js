window.onload = runWebGL;

function runWebGL() {
  const canvas = document.getElementById('canvas');
  const gl = canvas.getContext('webgl');
  gl.viewport(0, 0, canvas.width, canvas.height);

  let mouseX, mouseY;

  trackMouseMovements();

  const shaderProgram = createShaderProgram();
  let vertices = [];
  let vertexCount = 5000;
  createVertices();

  draw();

  function trackMouseMovements() {
    document.addEventListener('mousemove', mapMouseEventToCoords);
  }

  function mapMouseEventToCoords(event) {
    mouseX = mapDOMCoordsToWebGLCoords(event.clientX, 0, canvas.width, -1, 1);
    mouseY = mapDOMCoordsToWebGLCoords(event.clientY, 0, canvas.height, 1, -1);
  }

  function mapDOMCoordsToWebGLCoords(value, minSrc, maxSrc, minDest, maxDest) {
    return (value - minSrc) / (maxSrc - minSrc) * (maxDest - minDest) + minDest;
  }

  function draw() {
    clear();
    // gl.drawArrays(gl.LINE_LOOP, 0 , 3);
    // gl.drawArrays(gl.TRIANGLES, 0 , 3);

    for (let i = 0; i < vertexCount * 2; i += 2) {
      const dx = vertices[i] - mouseX,
            dy = vertices[i + 1] - mouseY,
            dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 0.2) {
        vertices[i] = mouseX + dx / dist * 0.2;
        vertices[i + 1] = mouseY + dy / dist * 0.2;
      } else {
        vertices[i] += Math.random() * 0.01 - 0.005;
        vertices[i + 1] += Math.random() * 0.01 - 0.005;
      }
    }

    gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(vertices));

    gl.drawArrays(gl.POINTS, 0 , vertexCount);

    requestAnimationFrame(draw);
  }

  function clear() {
    gl.clearColor(1, 1, 1 , 1); // rgba
    gl.clear(gl.COLOR_BUFFER_BIT);
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
    vertices = [];

    for (let i = 0; i < vertexCount; i++) {
      vertices.push(Math.random() * 2 - 1);
      vertices.push(Math.random() * 2 - 1);
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    const coords = gl.getAttribLocation(shaderProgram, 'coords');
    // gl.vertexAttrib3f(coords, 0, 0, 0);
    gl.vertexAttribPointer(coords, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coords);
    // gl.bindBuffer(gl.ARRAY_BUFFER, null);

    const pointSize = gl.getAttribLocation(shaderProgram, 'pointSize');
    gl.vertexAttrib1f(pointSize, 1);

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