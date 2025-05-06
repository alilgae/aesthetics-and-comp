precision highp float;

uniform sampler2D sampledImage;
uniform float time;
uniform vec2 resolution;
uniform vec2 mouseCoords;

void main() {
    // settings 
    float effectRadius = 0.5;
    float effectAngle = 3.14 * time * 0.25 ;
    vec2 effectScale = vec2(2., 1.);
    
    // get the center of the warping (mouse position)
    vec2 center = mouseCoords.xy / resolution.xy;
    center.x *= -1.0;
    center.x += 1.0;

    vec2 uv = gl_FragCoord.xy / resolution.xy;
    // by default the image is upside down
    // and the webcame is mirrored
    // so we flip it, then translate so it is the full screen 
    uv *= -1.0;
    uv += 1.0;
    uv.xy -= center.xy;

    // gives a "breathing" effect, over time twists the spiral on a sin curve 
    vec2 displacement = uv * sin(effectAngle) * 0.1;

    // polar coordinates
    float theta = atan(uv.y, uv.x);
    float radius = length(uv);
    
    // wobbles the individual spokes of the spiral 
    // takes polar direction and adds a sine wave to it
    float wobble = (sin((theta + (-time * 0.123)) * 9.0) * 0.03) + 0.15;
    // makes it stronger / more visible the closer you are to the center
    // at the edge it smooths out to 0
    float wobbleStrength = radius * 5. * smoothstep(effectRadius, effectRadius / 2.0, radius);
    wobble *= wobbleStrength;
    vec2 wobblePolar = vec2(wobble * cos(theta), wobble * sin(theta));

    // applying swirl effect 
    float lengthFromCenter = length(((uv / effectScale) + displacement) * vec2(resolution.x / resolution.y, 1.0));
    float angle = atan(uv.y, uv.x) + effectAngle * smoothstep(effectRadius, 0.0, lengthFromCenter);

    // polar coordinates to cartesian coordinates
    vec2 effect = vec2(radius * cos(angle), radius * sin(angle)) + center;
    vec2 finalCoord = effect + wobblePolar;
    
    gl_FragColor = texture2D(sampledImage, finalCoord);
}