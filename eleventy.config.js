import esbuild from "./config/esbuild.js"
import lightningcss from "./config/lightningcss.js"

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ 'public': '/' })

  eleventyConfig.addPlugin(esbuild)
  eleventyConfig.addPlugin(lightningcss)

  return {
    dir: {
      input: 'src',
      output: 'dist'
    }
  }
}
