const express 		= require('express'),
	  app			= express(),
	  path 			= require('path');

const publicPath = path.join(__dirname, '../public')

console.log(publicPath)

app.set('view engine', 'ejs')

app.use(express.static(publicPath))

app.get('/', (req, res) => {
	res.render('index');
})

app.listen(3000, () => console.log('Listening on port 3000'))
