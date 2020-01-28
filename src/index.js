const express 		= require('express'),
	  app			= express(),
	  path 			= require('path'),
	  http			= require('http')

const server = http.createServer(app)

const publicPath = path.join(__dirname, '../public')

console.log(publicPath)

app.set('view engine', 'ejs')
app.use(express.static(publicPath))


app.get('/', (req, res) => {
	res.render('index')
})

server.listen(3000, () => console.log('Listening on port 3000'))
