const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const fetch = require("node-fetch");
var url = require("url");
var querystring = require("querystring");

const add = (app, middleware, option) => {
  middleware.webpack();
  middleware.content();

  app.use(async (ctx, next) => {
    if (ctx.originalUrl.match(/\/proxy/)) {
      const { query } = url.parse(ctx.originalUrl);
      const q = querystring.parse(query);
      const { hostname, protocol } = url.parse(q.url);
      await fetch(q.url)
        .then(res => res.text())
        .then(body => {
          ctx.response.status = 200;
          ctx.response.type = "text/html";
          body = body.replace(/href="\/\//g, `href="${protocol}//`);
          body = body.replace(/href="\//g, `href="${protocol}//${hostname}/`);
          body = body.replace(/src="\/\//g, `src="${protocol}//`);
          body = body.replace(/src="\//g, `src="${protocol}//${hostname}/`);
          body = body.replace(/poster="\//g, `poster="${protocol}//${hostname}/`);
          body = body.replace(/<head([^>]+)>/, `<head\\1><base href="${q.url}" />`);
          ctx.response.body = body;
        });
    } else {
      await next();
    }
  });
};

module.exports = {
  mode: process.env.WEBPACK_SERVE ? "development" : "production",
  entry: {
    main: path.resolve(__dirname, "./src/", "index.js")
  },
  output: {
    path: path.resolve(__dirname, "./dist/"),
    filename: "[name]-[hash].js"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/],
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        exclude: [/node_modules/],
        use: ["style-loader", { loader: "css-loader", options: { modules: true } }]
      }
    ]
  },
  devtool: "source-map",
  serve: {
    open: true,
    port: 8080,
    content: path.resolve(__dirname, "public"),
    add: add
  },
  plugins: [new HtmlWebpackPlugin({ template: "src/index.html" })]
};
