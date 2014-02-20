
function NamingRoutes() {
  this.routes = {}
  this._app = null;
}

NamingRoutes.prototype.name = function (app) {
  var oldGet = app.get
  this._app = app

  app.get = function() {
    if (1 == arguments.length) return app.set(arguments['0']);

    var keys = Object.keys(arguments)
    var routePropertyKey = keys.shift()
    var routeProperty = arguments[routePropertyKey]


    if (typeof routeProperty !== 'object') {
      return oldGet.apply(app, arguments)
    }
    delete arguments[routePropertyKey]

    var name = routeProperty.name
    this.routes[name] = routeProperty

    arguments['0'] = routeProperty.re
    return oldGet.apply(app, arguments)
  }
}


NamingRoutes.prototype.builtPath = function(route, params, query_string) {
  var path = route.path

  if (typeof path !== 'string')
    throw 'Unsupported path: please use string to define a route'

  for(var k in params) {
    path = path.replace(':' + k, params[k])
  }

  var q = ''
  for(var k in query_string) {
    q += '&' + k + '=' + query_string[k]
  }
  if (q.length !== 0) {
    path += '?' + q.slice(1)
  }
  return path
}

NamingRoutes.prototype.url_for = function() {
  var name = arguments['0']
  var method = arguments['1']
  var params = arguments['2'] || {}
  var query_string = arguments['3'] || {}
  var path = this.routes[name].re


  var routesForThisMethod = this._app.routes[method]
  for (var i = 0; i< routesForThisMethod.length; i++) {
    if (routesForThisMethod[i].match(path)) {
      return builtPath(routesForThisMethod[i], params, query_string)
    }
  }
  // thow exception??
}

module.exports.namingRoutes = NamingRoutes()