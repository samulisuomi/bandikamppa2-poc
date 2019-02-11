const proxy = require('http-proxy-middleware')
const rootUrl = process.env.LEGACY_BACKEND_ROOT_URL

module.exports = function(app) {
  app.use(proxy('/api/login',        { ignorePath: true, changeOrigin: true, target: `${rootUrl}/login.php` }))
  app.use(proxy('/api/reservations', { ignorePath: true, changeOrigin: true, target: `${rootUrl}/reservations.php` }))
}
