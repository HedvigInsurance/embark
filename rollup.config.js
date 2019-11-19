import typescript from "rollup-plugin-typescript2";
import graphql from "rollup-plugin-graphql";
import pkg from "./package.json";

export default {
  input: "src/package.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs"
    },
    {
      file: pkg.module,
      format: "es"
    }
  ],
  external: [...Object.keys(pkg.peerDependencies || {})],
  plugins: [
    typescript({
      typescript: require("typescript")
    }),
    graphql()
  ]
};
