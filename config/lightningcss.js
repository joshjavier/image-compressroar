import path from "node:path"
import browserslist from "browserslist"
import { bundleAsync, browserslistToTargets } from "lightningcss"

const targets = browserslistToTargets(browserslist())

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default function (eleventyConfig) {
  eleventyConfig.addTemplateFormats('css')

  eleventyConfig.addExtension('css', {
    outputFileExtension: 'css',
    async compile(inputContent, inputPath) {
      let parsed = path.parse(inputPath)
      let filename = parsed.name
      let baseDir = path.basename(parsed.dir)

      // Do not process files and directories starting with an underscore
      if (filename.startsWith('_') || baseDir.startsWith('_')) return

      let imports = []
      let result = await bundleAsync({
        filename: inputPath,
        minify: true,
        targets,
        resolver: {
          resolve(specifier, from) {
            const importPath = path.resolve(path.dirname(from), specifier)
            imports.push(importPath)
            return importPath
          }
        }
      })

      // Register imports as dependencies for incremental builds
      this.addDependencies(inputPath, imports)

      return async () => {
        return result.code.toString()
      }
    }
  })
}
