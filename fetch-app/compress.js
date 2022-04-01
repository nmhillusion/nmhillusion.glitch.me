const minify = require("babel-minify");
const fs = require("fs");

const ignores = ["node_modules", "images", ".git"];

function cssContent() {
  return fs.readFileSync("./app.css").toString();
}

function compileFolder(pathInp) {
  fs.readdirSync(pathInp)
    .filter((path) => !ignores.includes(path))
    .forEach((path) => {
      path = `${pathInp}/${path}`;
      console.log({ path });
      const stats = fs.lstatSync(path);

      if (stats.isDirectory()) {
        compileFolder(`${path}`);
      } else if (stats.isFile()) {
        if (path.endsWith(".raw.js")) {
          let out = minify(fs.readFileSync(path).toString()).code;

          out = out.replace("{{ CSS_CONTENT }}", cssContent());

          fs.writeFile(path.replace(".raw.js", ".out.js"), out, function (err) {
            if (err) {
              console.error("Error when compile: ", path, err);
            } else {
              console.log("compiled: ", path);
            }
          });
        }
      }
    });
}

compileFolder(".");
