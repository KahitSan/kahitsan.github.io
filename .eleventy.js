const htmlmin = require("html-minifier-terser");
const Image = require("@11ty/eleventy-img");
const path = require("path");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/favicon");
  eleventyConfig.addPassthroughCopy("CNAME");

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

  // Modified image shortcode with support for extra HTML attributes
  eleventyConfig.addNunjucksAsyncShortcode(
    "image",
    async function (
      src,
      sizes = "(min-width: 1280px) 100vw, (min-width: 768px) 80vw, 100vw",
      attrs = {},
      widths = [32, 64, 99, 160, 320, 640]
    ) {
      let fullSrc = path.join("src/assets", src);
      let metadata = await Image(fullSrc, {
        widths,
        formats: ["webp", "jpeg"],
        outputDir: "./_site/assets/optimized",
        urlPath: "/assets/optimized/",
      });

      let imageAttributes = {
        sizes,
        loading: "lazy",
        decoding: "async",
        ...attrs, // alt should be passed here
      };

      return Image.generateHTML(metadata, imageAttributes);
    }
  );

  // bgImage shortcode stays same as before
  eleventyConfig.addNunjucksAsyncShortcode("bgImage", async function (src, className = "") {
    let fullSrc = path.join("src/assets", src);
    let metadata = await Image(fullSrc, {
      widths: [1980],
      formats: ["jpeg"],
      outputDir: "./_site/assets/optimized",
      urlPath: "/assets/optimized/",
    });

    let imageUrl = metadata.jpeg[0].url;

    return `<div class="${className}" style="background-image: url('${imageUrl}');"></div>`;
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
  };
};
