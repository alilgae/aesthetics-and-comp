precision highp float;

uniform sampler2D sampledImage;
uniform float time;
uniform vec2 resolution;
uniform vec2 mouseCoords;

void main() {
    float effectRadius = 0.5;
    float effectAngle = 3.14 * (time * 0.25) ;
    vec2 effectScale = vec2(2., 1.);
    
    vec2 center = mouseCoords.xy / resolution.xy;
    center.x *= -1.0;
    center.x += 1.0;
    // center = center == vec2(0., 0.) ? vec2(.5, .5) : center;

    vec2 uv = gl_FragCoord.xy / resolution.xy;
    uv *= -1.0;
    uv += 1.0;
    uv.xy -= center.xy;

    // uv /= effectScale;

    float lengthFromCenter = length(uv / effectScale * vec2(resolution.x / resolution.y, 1.0));
    float angle = atan(uv.y, uv.x) + effectAngle * smoothstep(effectRadius, 0.0, lengthFromCenter);
    float radius = length(uv);

    gl_FragColor = texture2D(sampledImage, vec2(radius * cos(angle), radius * sin(angle)) + center);
}