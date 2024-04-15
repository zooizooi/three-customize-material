uniform vec3 uColor;

void main() {
    #append
        gl_FragColor.rgb = uColor;
    #endappend
}