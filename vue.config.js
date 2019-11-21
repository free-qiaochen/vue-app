const px2rem = require('postcss-px2rem')
const postcss = px2rem({
  remUnit: 32 // 基准大小 baseSize，需要和rem.js中相同
})

module.exports = {
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          postcss
        ]
      }
    }
  }
}
