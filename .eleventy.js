module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/assets");
    eleventyConfig.addPassthroughCopy("src/favicon");
    eleventyConfig.addPassthroughCopy("CNAME");

    return {
        dir: {
            input: "src",
            includes: "_includes",
            data: "_data",
            output: "dist"
        }
    };
};