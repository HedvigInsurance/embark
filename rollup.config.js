import typescript from "rollup-plugin-typescript2";
import graphql from "rollup-plugin-graphql";
import pkg from "./package.json";

export default {
  input: "src/package.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs"
    }
  ],
  external: [...Object.keys(pkg.peerDependencies || {})],
  plugins: [
    typescript({
      typescript: require("typescript"),
      declarationDir: "dist"
    }),
    graphql()
  ]
};
