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
uniform vec3 u_LightColor;\r
uniform vec3 u_LightDirection;\r
uniform vec3 u_AmbientLight;\r
uniform bool u_UseTexture;\r
uniform bool u_UseLight;\r
uniform PositionalLight u_PositionalLight;\r
uniform Material u_Material;\r
uniform sampler2D u_Sampler;\r
varying vec4 v_Color;\r
varying vec3 v_Position;\r
varying vec3 v_Normal;\r
varying vec2 v_TexCoord;\r
varying vec3 v_LightDirection;\r
varying vec3 v_HalfVector;\r
void main()\r
{\r
    // vec3 normal = normalize(vec3(u_NormalMatrix * v_Normal));\r
    if (!u_UseLight) {\r
        gl_FragColor = v_Color;\r
        return;\r
    }\r
    vec3 L = normalize(v_LightDirection);\r
    vec3 N = normalize(v_Normal);\r
    vec3 V = normalize(-v_Position);\r
    float cosTheta = max(dot(N, L), 0.0);\r
    vec3 H = normalize(v_HalfVector);\r
    float cosPhi = max(dot(N, H), 0.0);\r
    vec3 ambient = u_AmbientLight * v_Color.rgb;\r
    vec3 diffuse = u_PositionalLight.diffuse.xyz * u_Material.diffuse.xyz * cosTheta;\r
    vec3 specular = u_PositionalLight.specular.xyz * u_Material.specular.xyz * pow(cosPhi, u_Material.shininess);\r
    if (u_UseTexture) {\r
        // gl_FragColor = vec4(v_TexCoord, 0.0, 1.0);\r
        vec3 color = texture2D(u_Sampler, v_TexCoord).rgb;\r
        vec3 diffuse = u_LightColor * color * cosTheta;\r
        vec3 ambient = u_AmbientLight * color;\r
        gl_FragColor = vec4(diffuse + ambient, texture2D(u_Sampler, v_TexCoord).a);\r
        return;\r
    }\r
    gl_FragColor = vec4(diffuse + ambient + specular, 1.0);\r
}`;export{r as default};
