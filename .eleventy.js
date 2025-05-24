const htmlmin = require("html-minifier-terser");

module.exports = function (eleventyConfig) {
  // Passthrough copy for assets, favicon, and CNAME
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/favicon");
  eleventyConfig.addPassthroughCopy("CNAME");

  // HTML minification transform
  eleventyConfig.addTransform("htmlmin", async function (content, outputPath) {
    if (outputPath && outputPath.endsWith(".html")) {
      return await htmlmin.minify(content, {
        removeComments: true,
        collapseWhitespace: true,
        useShortDoctype: true,
        minifyCSS: true,
        minifyJS: true,
      });
    }
    return content;
  });

  // Directory config
  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
  };
};
