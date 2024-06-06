{
  "presets": [
    ["@babel/preset-env", { "modules": false }],
    "@babel/preset-typescript"
  ],
  "plugins": [
    [
      "babel-plugin-transform-rewrite-imports",
      { "appendExtension": ".mjs" }
    ]
  ]
}