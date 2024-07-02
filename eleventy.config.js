/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ 'public': '/' })

  return {
    dir: {
      input: 'src',
      output: 'dist'
    }
  }
}
