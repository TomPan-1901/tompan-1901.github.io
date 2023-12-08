precision mediump float;
struct PositionalLight
{	vec4 ambient;
    vec4 diffuse;
    vec4 specular;
    vec3 position;
};
struct Material
{	vec4 ambient;
    vec4 diffuse;
    vec4 specular;
    float shininess;
};
uniform vec3 u_LightColor;
uniform vec3 u_LightDirection;
uniform vec3 u_AmbientLight;
uniform bool u_UseTexture;
uniform bool u_UseLight;
uniform PositionalLight u_PositionalLight;
uniform Material u_Material;
uniform sampler2D u_Sampler;
varying vec4 v_Color;
varying vec3 v_Position;
varying vec3 v_Normal;
varying vec2 v_TexCoord;
varying vec3 v_LightDirection;
varying vec3 v_HalfVector;
void main()
{
    // vec3 normal = normalize(vec3(u_NormalMatrix * v_Normal));
    if (!u_UseLight) {
        gl_FragColor = v_Color;
        return;
    }
    vec3 L = normalize(v_LightDirection);
    vec3 N = normalize(v_Normal);
    vec3 V = normalize(-v_Position);
    float cosTheta = max(dot(N, L), 0.0);
    vec3 H = normalize(v_HalfVector);
    float cosPhi = max(dot(N, H), 0.0);
    vec3 ambient = u_AmbientLight * v_Color.rgb;
    vec3 diffuse = u_PositionalLight.diffuse.xyz * u_Material.diffuse.xyz * cosTheta;
    vec3 specular = u_PositionalLight.specular.xyz * u_Material.specular.xyz * pow(cosPhi, u_Material.shininess);
    if (u_UseTexture) {
        // gl_FragColor = vec4(v_TexCoord, 0.0, 1.0);
        vec3 color = texture2D(u_Sampler, v_TexCoord).rgb;
        vec3 diffuse = u_LightColor * color * cosTheta;
        vec3 ambient = u_AmbientLight * color;
        gl_FragColor = vec4(diffuse + ambient, texture2D(u_Sampler, v_TexCoord).a);
        return;
    }
    gl_FragColor = vec4(diffuse + ambient + specular, 1.0);
}