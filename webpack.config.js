module.exports = {
    resolve: {
        extensions: ['', '.js', '.jsx'],
    },
    externals: {
      "react": "React",
      "react/addons": "React"
    },
    module: {
      loaders: [
        {test: /\.js$/, loader: 'jsx-loader'}
      ]
    },
};
