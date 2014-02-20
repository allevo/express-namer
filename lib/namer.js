
function NamingRoutes() {
  this.routes = {}
  this._app = null;
}

NamingRoutes.prototype.name = function (app) {
  this._app = app
  var self = this

  function replace(method) {
    var oldMethod = app[method]
    return function() {
      if (1 == arguments.length) return app.set(arguments['0']);

      var keys = Object.keys(arguments)
      var routePropertyKey = keys.shift()
      var routeProperty = arguments[routePropertyKey]


      if (typeof routeProperty !== 'object') {
        return oldMethod.apply(app, arguments)
      }
      delete arguments[routePropertyKey]

      var name = routeProperty.name
      self.routes[name] = routeProperty

      arguments['0'] = routeProperty.re
      return oldMethod.apply(app, arguments)
    }
  }

  app.get = replace('get')
  app.post = replace('post')
  app.delete = replace('delete')
  app.put = replace('put')
}


NamingRoutes.prototype.builtPath = function(route, params, query_string) {
  var path = route.path

  if (typeof path !== 'string') {
    throw new Error('Unsupported path: please use string to define a route')
  }

  for(var k in params) {
    path = path.replace(':' + k, params[k])
  }
  if (path.indexOf(':') !== -1) {
    throw new Error('You must specify all parameters')
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
  var params = arguments['1'] || {}
  var query_string = arguments['2'] || {}

  var path = this.routes[name].re


  for (var method in this._app.routes) {
    var routesForThisMethod = this._app.routes[method]
    for (var i = 0; i< routesForThisMethod.length; i++) {
      if (routesForThisMethod[i].match(path)) {
        return this.builtPath(routesForThisMethod[i], params, query_string)
      }
    }
  }
  // thow exception??
}

module.exports = new NamingRoutes()