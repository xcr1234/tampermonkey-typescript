module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // 使用corejs的方式 "usage" 表示按需加载
        "useBuiltIns": "usage",
        "corejs": {
          "version": 3
        },
      }
    ]
  ]
}
