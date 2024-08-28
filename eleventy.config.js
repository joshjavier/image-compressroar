import pluginWebc from '@11ty/eleventy-plugin-webc'
import esbuild from './config/esbuild.js'
import lightningcss from './config/lightningcss.js'
import processBundle from './config/process-bundle.js'

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ public: '/' })

  eleventyConfig.addPlugin(esbuild)
  eleventyConfig.addPlugin(lightningcss)
  eleventyConfig.addPlugin(pluginWebc, {
    components: 'src/_components/**/*.webc',
    bundlePluginOptions: {
      transforms: [processBundle],
    },
  })

  return {
    dir: {
      input: 'src',
      output: 'dist',
    },
  }
}
