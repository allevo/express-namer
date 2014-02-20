express-namer
=============

Use this to give a name to route

Example
=======

```
var app = requite('express')()
var namer = require('namer')

namer.name(app)

app.get({re: '/user/:id', name: 'user_instance' }, function(req, res) { })

...

namer.url_for('user_instance', { id: 2 })
```
See test.js for more explanation
