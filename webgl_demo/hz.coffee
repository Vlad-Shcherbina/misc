---
---

this.start = (canvas_id) ->
  canvas = document.getElementById(canvas_id)
  gl = canvas.getContext("webgl") or canvas.getContext("experimental-webgl")
  if not gl
    alert "Unable to initialize WebGL."
    return

  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.viewport(0, 0, canvas.width, canvas.height)

  prog = shaderProgram(gl,
    """
    attribute vec2 pos;
    void main() {
      gl_Position = vec4(pos, 0.0, 1.0);
    }
    """,
    """
    void main() {
      gl_FragColor = vec4(1, 1, 0, 1);
    }
    """)
  gl.useProgram(prog)

  vertices = new Float32Array([
    0, 0
    1, 0
    -1, -1
  ])

  buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
  pos_attr = gl.getAttribLocation(prog, "pos")
  gl.enableVertexAttribArray(pos_attr)
  gl.vertexAttribPointer(pos_attr, 2, gl.FLOAT, false, 0, 0)

  gl.drawArrays(gl.TRIANGLES, 0, 3)


shaderProgram = (gl, vs, fs) ->
  prog = gl.createProgram()
  addShader = (type, source) ->
    s = gl.createShader(type)
    gl.shaderSource(s, source)
    gl.compileShader(s)
    if not gl.getShaderParameter(s, gl.COMPILE_STATUS)
      throw "Could not compile " + type + " shader:\n\n" + gl.getShaderInfoLog(s)
    gl.attachShader(prog, s)
    return

  addShader(gl.VERTEX_SHADER, vs)
  addShader(gl.FRAGMENT_SHADER, fs)
  gl.linkProgram(prog)
  if not gl.getProgramParameter(prog, gl.LINK_STATUS)
    throw "Could not link the shader program!"
  return prog
