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
attribute vec4 a_Position;
attribute vec4 a_Color;
attribute vec4 a_Normal;
attribute vec2 a_TexCoord;
uniform mat4 u_MvpMatrix;
uniform mat4 u_ModelMatrix;
uniform mat4 u_NormalMatrix;
uniform PositionalLight u_PositionalLight;
uniform Material u_Material;
varying vec4 v_Color;
varying vec3 v_Normal;
varying vec3 v_Position;
varying vec2 v_TexCoord;
varying vec3 v_LightDirection;
varying vec3 v_HalfVector;
void main()
{
    gl_Position = u_MvpMatrix * a_Position;
    v_Position = vec3(u_ModelMatrix * a_Position);
    v_LightDirection = normalize(u_PositionalLight.position - v_Position);
    v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));
    v_Color = a_Color;
    v_TexCoord = a_TexCoord;
    v_HalfVector = normalize(normalize(v_LightDirection)
		+ normalize(-v_Position)).xyz;
    // vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));
    // float nDotL = max(dot(u_LightDirection, normal), 0.0);
    // vec3 diffuse = u_LightColor * a_Color.rgb * nDotL;
    // vec3 ambient = u_AmbientLight * a_Color.rgb;
    // v_Color = vec4(diffuse + ambient, a_Color.a);
}
