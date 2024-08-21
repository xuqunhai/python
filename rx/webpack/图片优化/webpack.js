const imagemin = require("imagemin");
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require("imagemin-pngquant");
const imageminSvgo = require("imagemin-svgo");

imagemin(["src/assets/images/*.{jpg,png,svg}"], {
  destination: "dist/assets/images",
  plugins: [
    imageminMozjpeg({ quality: 75 }),
    imageminPngquant({ quality: [0.6, 0.8] }),
    imageminSvgo({
      plugins: [{ removeViewBox: false }, { cleanupIDs: false }],
    }),
  ],
}).then(() => {
  console.log("Images optimized");
});
