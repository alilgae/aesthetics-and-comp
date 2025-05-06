precision highp float;

uniform sampler2D sampledImage;
uniform float time;
uniform vec2 resolution;
uniform vec2 mouseCoords;

void main() {
    float effectRadius = 0.5;
    float effectAngle = 3.14 * time * 0.25 ;
    vec2 effectScale = vec2(2., 1.);
    
    vec2 center = mouseCoords.xy / resolution.xy;
    center.x *= -1.0;
    center.x += 1.0;

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    uv *= -1.0;
    uv += 1.0;
    vec2 baseUV = uv;

    uv.xy -= center.xy;

    vec2 displacement = uv * sin(effectAngle) * 0.1;
    float theta = atan(uv.y, uv.x);

    float radius = length(uv);
    
    float wobble = (sin((theta + (-time * 0.123)) * 9.0) * 0.03) + 0.15;
    float wobbleStrength = radius * 5. * smoothstep(effectRadius, effectRadius / 2.0, radius);
    wobble *= wobbleStrength;
    vec2 wobblePolar = vec2(wobble * cos(theta), wobble * sin(theta));

    float lengthFromCenter = length(((uv / effectScale) + displacement) * vec2(resolution.x / resolution.y, 1.0));
    float angle = atan(uv.y, uv.x) + effectAngle * smoothstep(effectRadius, 0.0, lengthFromCenter);

    vec2 effect = vec2(radius * cos(angle), radius * sin(angle)) + center;

    // mix is just lerp
    vec2 finalCoord = effect + wobblePolar;
    gl_FragColor = texture2D(sampledImage, finalCoord);
}