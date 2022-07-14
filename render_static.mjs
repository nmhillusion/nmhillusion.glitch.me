import { BullEngine } from "n2ngin-bull-engine";

new BullEngine()
  .config({
    copyResource: {
      enabled: true,
    },
    outDir: process.cwd() + "/static",
    rootDir: process.cwd() + "/static_src",
    pug: {
      enabled: true,
    },
    scss: {
      enabled: true,
      config: {
        outputStyle: "compressed",
      },
    },
    typescript: {
      enabled: true,
    },
    rewriteJavascript: {
      enabled: true,
      config: {
        compress: true,
        rewriteImport: true,
      },
    },
    watch: {
      enabled: true,
      config: {
        minIntervalInMs: 1_200,
        handleChangeEvent: true,
        handleRenameEvent: true
      },
    },
  })
  .setVariableFilePathToInject(process.cwd() + "/static_env/dev.json")
  .render();
