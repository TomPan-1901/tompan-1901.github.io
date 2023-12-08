const r=`precision mediump float;\r
struct PositionalLight\r
{	vec4 ambient;\r
    vec4 diffuse;\r
    vec4 specular;\r
    vec3 position;\r
};\r
struct Material\r
{	vec4 ambient;\r
    vec4 diffuse;\r
    vec4 specular;\r
    float shininess;\r
};\r
attribute vec4 a_Position;\r
attribute vec4 a_Color;\r
attribute vec4 a_Normal;\r
attribute vec2 a_TexCoord;\r
uniform mat4 u_MvpMatrix;\r
uniform mat4 u_ModelMatrix;\r
uniform mat4 u_NormalMatrix;\r
uniform PositionalLight u_PositionalLight;\r
uniform Material u_Material;\r
varying vec4 v_Color;\r
varying vec3 v_Normal;\r
varying vec3 v_Position;\r
varying vec2 v_TexCoord;\r
varying vec3 v_LightDirection;\r
varying vec3 v_HalfVector;\r
void main()\r
{\r
    gl_Position = u_MvpMatrix * a_Position;\r
    v_Position = vec3(u_ModelMatrix * a_Position);\r
    v_LightDirection = normalize(u_PositionalLight.position - v_Position);\r
    v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\r
    v_Color = a_Color;\r
    v_TexCoord = a_TexCoord;\r
    v_HalfVector = normalize(normalize(v_LightDirection)\r
		+ normalize(-v_Position)).xyz;\r
    // vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));\r
    // float nDotL = max(dot(u_LightDirection, normal), 0.0);\r
    // vec3 diffuse = u_LightColor * a_Color.rgb * nDotL;\r
    // vec3 ambient = u_AmbientLight * a_Color.rgb;\r
    // v_Color = vec4(diffuse + ambient, a_Color.a);\r
}\r
`;export{r as default};
