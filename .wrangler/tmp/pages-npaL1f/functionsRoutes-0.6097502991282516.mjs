import { onRequestGet as __api_price_js_onRequestGet } from "D:\\soxl web page\\functions\\api\\price.js"

export const routes = [
    {
      routePath: "/api/price",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_price_js_onRequestGet],
    },
  ]