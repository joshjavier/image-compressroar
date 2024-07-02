import path from "node:path"
import { build } from "esbuild"

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default function (eleventyConfig) {
  eleventyConfig.addTemplateFormats('js')

  eleventyConfig.addExtension('js', {
    outputFileExtension: 'js',
    async compile(inputContent, inputPath) {
      let parsed = path.parse(inputPath)
      let filename = parsed.name
      let baseDir = path.basename(parsed.dir)

      // Do not process files and directories starting with an underscore
      if (filename.startsWith('_') || baseDir.startsWith('_')) return

      let result = await build({
        entryPoints: [inputPath],
        bundle: true,
        outdir: 'dist',
        outbase: 'src',
        format: 'esm',
        minify: true,
        metafile: true,
        write: false
      })

      let files = []
      let inputs = Object.values(result.metafile.inputs)
      inputs.forEach((input) => {
        const { imports } = input
        if (imports.length) {
          imports.forEach((file) => {
            files.push(file.path)
          })
        }
      })

      // Register imports as dependencies for incremental builds
      this.addDependencies(inputPath, files)

      return async () => {
        return result.outputFiles[0].text
      }
    }
  })
}
