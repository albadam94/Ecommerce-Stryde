export const peelXShader = `
  vec4 transition(vec2 uv) {
    float progress2 = progress;
    float x = progress2 / 1.0;
    float mix1 = step(uv.x, x);
    
    float angleOffset = progress2 * 1.5707963;
    float xc = x - uv.x;
    float z = sin(angleOffset) * xc;
    float y = cos(angleOffset) * (uv.y - 0.5) + 0.5;
    
    vec2 newUV = vec2(uv.x + z * 2.0, y);
    
    if(mix1 == 0.0) {
      return getToColor(uv);
    } else {
      return getFromColor(newUV);
    }
  }
`