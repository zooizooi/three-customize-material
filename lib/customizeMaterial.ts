import { IUniform, Material, WebGLProgramParametersWithUniforms } from 'three';

type Uniforms = {
    [uniform: string]: IUniform<any>
}

declare module 'three' {
    interface Material {
        uniforms: Uniforms;
    }
}

interface Properties {
    material: Material
    vertexShader?: string
    fragmentShader?: string
    uniforms?: Uniforms,
    defines?: {
        [key: string]: any;
    }
}

export default function customizeMaterial(properties: Properties) {
    const material = properties.material;

    if (properties.uniforms) {
        material.uniforms = properties.uniforms;
    }

    if (properties.defines) {
        if (!material.defines) material.defines = {};
        Object.assign(material.defines, properties.defines);
    }

    material.onBeforeCompile = (shader: WebGLProgramParametersWithUniforms) => {
        if (material.uniforms) {
            Object.assign(shader.uniforms, material.uniforms);
        }

        if (properties.vertexShader) {
            shader.vertexShader = updateShader(shader.vertexShader, properties.vertexShader);
        }

        if (properties.fragmentShader) {
            shader.fragmentShader = updateShader(shader.fragmentShader, properties.fragmentShader);
        }
    };

    return material;
}

function updateShader(shader: string, customShader: string) {
    // Variables
    const match = customShader.match(/^(.*?)(?=void\s+main\(\)\s*\{)/s);
    const contentBeforeMain = match ? match[1].trim() : '';
    shader = `${contentBeforeMain}\n\n${shader}`;

    // Prepend
    const prependPartials = extractPartial(customShader, 'prepend');
    if (prependPartials) {
        shader = shader.replace(
            'void main() {',
            `
                void main() {
                ${prependPartials.join(' ')}
            `
        );
    }

    // Replace
    const replacePartials = extractReplacePartials(customShader, 'replace');
    if (replacePartials) {
        replacePartials.forEach((partial) => {
            console.log(partial);
            shader = shader.replace(partial.searchValue, partial.replaceValue);
        });
    }

    // Append
    const appendPartials = extractPartial(customShader, 'append');
    if (appendPartials) {
        shader = shader.replace(
            /}/g,
            `
                ${appendPartials.join(' ')}
                }
            `
        );
    }

    return shader;
}

function extractPartial(shader: string, delimiter: string) {
    const regexPattern = new RegExp(`#${delimiter}\\s*([\\s\\S]+?)\\s*#end${delimiter}`, 'g');
    const contents = [];
    let match;
    while ((match = regexPattern.exec(shader)) !== null) {
        contents.push(match[1].trim());
    }
    return contents;
}

function extractReplacePartials(shader: string, delimiter: string) {
    const regexPattern = new RegExp(`#${delimiter}\\s*([\\s\\S]+?)\\s*#end${delimiter}`, 'g');
    const contents = [];
    let match;
    while ((match = regexPattern.exec(shader)) !== null) {
        const result = match[1].trim();
        const parts = result.split(/(#include\s+<.*>)/);
        contents.push({
            searchValue: parts[1],
            replaceValue: parts[2]
        });
    }
    return contents;
}