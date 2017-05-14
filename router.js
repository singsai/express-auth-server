module.exports = function(app) {
	app.get('/', function(req, res, next) {
		res.send(['what do you want', 'dammit'])
	})
}