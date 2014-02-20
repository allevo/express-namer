var assert = require('assert')
var namer = require('./index')

describe('correct parsing url', function() {
  beforeEach(function(done) {
    this.app = require('express')()
    done()
  })

  it('simple same', function() {
    namer.name(this.app)

    this.app.get({re: '/', name: 'myget'}, function(req, res) { })
    this.app.post({re: '/', name: 'mypost'}, function(req, res) { })
    this.app.delete({re: '/', name: 'mydelete'}, function(req, res) { })
    this.app.put({re: '/', name: 'myput'}, function(req, res) { })

    assert.equal('/', namer.url_for('myget'))
    assert.equal('/', namer.url_for('mypost'))
    assert.equal('/', namer.url_for('mydelete'))
    assert.equal('/', namer.url_for('myput'))
  })

  it('simple different', function() {
    namer.name(this.app)

    this.app.get({re: '/get', name: 'myget'}, function(req, res) { })
    this.app.post({re: '/post', name: 'mypost'}, function(req, res) { })
    this.app.delete({re: '/delete', name: 'mydelete'}, function(req, res) { })
    this.app.put({re: '/put', name: 'myput'}, function(req, res) { })

    assert.equal('/get', namer.url_for('myget'))
    assert.equal('/post', namer.url_for('mypost'))
    assert.equal('/delete', namer.url_for('mydelete'))
    assert.equal('/put', namer.url_for('myput'))
  })


  it('with parameters', function() {
    namer.name(this.app)

    this.app.get({re: '/:id/:name/:surname', name: 'user'}, function(req, res) { })

    assert.equal('/1/tommaso/allevi', namer.url_for('user', {id: 1, name: 'tommaso', surname: 'allevi'}))
  })

  it('missing parameters', function() {
    namer.name(this.app)

    this.app.get({re: '/:id/:name/:surname', name: 'user'}, function(req, res) { })

    assert.throws(function() {
        namer.url_for('user', {id: 1, name: 'tommaso'})
      },
      /parameters/
    )
  })

  it('with query string', function() {
    namer.name(this.app)

    this.app.get({re: '/:id/email', name: 'user_emails'}, function(req, res) { })

    assert.equal('/1/email?with=tom', namer.url_for('user_emails', { id: 1 }, { 'with': 'tom' }))
  })
})