import browserslist from "browserslist"
import { transform as cssTransform, browserslistToTargets } from "lightningcss"
import { transform as jsTransform } from "esbuild"

const targets = browserslistToTargets(browserslist())

/** @param {string} content  */
export default async function (content) {
  if (this.type === 'css') {
    let result = cssTransform({
      code: Buffer.from(content),
      // minify: true,
      targets,
    })
    return result.code
  }

  if (this.type === 'js') {
    let result = await jsTransform(content, {
      // minify: true,
    })
    return result.code
  }
}
