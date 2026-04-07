export const peelXShader = `
  vec4 transition(vec2 uv) {
    float p = progress;
    // Invertimos para que barra de derecha a izquierda
    float x = 1.0 - p; 
    
    float mix1 = step(uv.x, x);
    
    float angleOffset = p * 1.5707963;
    float xc = x - uv.x;
    float z = sin(angleOffset) * xc;
    float y = cos(angleOffset) * (uv.y - 0.5) + 0.5;
    
    vec2 newUV = vec2(uv.x + z * 2.0, y);
    
    // Si la nueva coordenada deformada se sale del cuadro (0.0 a 1.0)
    // devolvemos la imagen de destino directamente para evitar estiramientos.
    if(newUV.x < 0.0 || newUV.x > 1.0 || newUV.y < 0.0 || newUV.y > 1.0) {
       return getToColor(uv);
    }

    if(mix1 == 0.0) {
      // Parte que se dobla (Imagen actual)
      vec4 col = getFromColor(newUV);
      // Sombra sutil en el borde del doblez
      col.rgb *= smoothstep(0.0, 0.15, uv.x - x);
      return col;
    } else {
      // Parte revelada (Imagen nueva)
      return getToColor(uv);
    }
  }
`;