# Three customize material
Setup to customize Three.js materials

### Install
```bash
# ni
ni @zooizooi/three-customize-material

# npm
npm install @zooizooi/three-customize-material

# pnpm
pnpm add @zooizooi/three-customize-material
```

### Use
```js
import customizeMaterial from '@zooizooi/three-customize-material';

const material = customizeMaterial({
    material: new MeshBasicMaterial({
        color: 0x00ff00
    }),
    uniforms: {
        uColor: { value: new Color(0x00ffff) }
    },
    fragmentShader: `
        uniform vec3 uColor;

        void main() {
            #append
                gl_FragColor.rgb = uColor;
            #endappend
        }
    `,
    defines: {}
});

material.uniforms.uColor.value.set(1, 0, 0);
```

### Customize code
Add code to the beginning of the main function
```glsl
#prepend
    vColor = vec3(1.0, 0.0, 0.0);
#endprepend
```

Add code to the end of the main function
```glsl
#append
    gl_FragColor.rgb = vec3(1.0, 0.0, 0.0);
#endappend
```

Replace code within the main function
```glsl
#replace #include <default_vertex>
    vec3 customPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(customPosition, 1.0);
#endreplace
```
