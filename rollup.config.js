import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";

export default {
  input: "src/package.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs"
    }
  ],
  external: [...Object.keys(pkg.peerDependencies || {}), "apollo-link-http"],
  plugins: [
    typescript({
      typescript: require("typescript"),
      declarationDir: "dist"
    })
  ]
};
