import { Project, SourceFile } from 'ts-morph'
import path = require('node:path')

interface DependencyGraph {
    [filePath: string]: {
        dependencies: string[]
        exports: string[]
    }
}

/**
 * Analisa um diretório de código TypeScript e retorna um mapa de dependências.
 * @param projectPath O caminho para o projeto.
 */
export function analyzeProject(projectPath: string) {
    const project = new Project()
    project.addSourceFilesAtPaths(`${projectPath}/**/*.{ts,tsx}`)

    const dependencyGraph: DependencyGraph = {}
    const sourceFiles = project.getSourceFiles()

    sourceFiles.forEach((file: SourceFile) => {
        const filePath = path.relative(process.cwd(), file.getFilePath())
        const dependencies: string[] = []
        const exports: string[] = []

        file.getImportDeclarations().forEach(ImportDeclaration => {
            const moduleSpecifier = ImportDeclaration.getModuleSpecifierValue()
            if (!moduleSpecifier.startsWith(".") && !path.isAbsolute(moduleSpecifier)) {
                if (!isNodeBuiltin(moduleSpecifier)) {
                    dependencies.push(moduleSpecifier)
                }
            } else {
                const resolvedPath = ImportDeclaration.getModuleSpecifierSourceFile()?.getFilePath()
                if (resolvedPath) {
                    dependencies.push(path.relative(process.cwd(), resolvedPath))
                }
            }
        })

        file.getExportedDeclarations().forEach((declaration, name) => {
            exports.push(name)
        })

        dependencyGraph[filePath] = { dependencies, exports: Array.from(new Set(exports)) }
    })

    return dependencyGraph
}

/**
 * Checa se um módulo é nativo do Node.js
 * @param moduleName O nome do módulo.
 */
function isNodeBuiltin(moduleName: string): boolean {
    const builtins = ['path', 'fs', 'http', 'os', 'util']
    return builtins.includes(moduleName)
}
