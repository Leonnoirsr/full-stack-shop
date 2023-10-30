const User = require( '../models/user' )

exports.getLogin = ( req, res, next ) => {
	
	res.render( 'auth/login', {
		path:            '/login',
		pageTitle:       'Login',
		isAuthenticated: req.session.isLoggedIn
	} )
}

exports.postLogin = ( req, res, next ) => {
	
	User.findById( '653ad004ab849160d3dc0374' )
	    .then( user => {
		    req.session.isLoggedIn = true
		    req.session.user       = user;
		    res.redirect( '/' )
	    } )
	    .catch()
}

exports.postLogout = ( req, res, next ) => {
	
	req.session.destroy( ( err ) => {
		console.log( err )
		res.redirect( '/' )
	} )
}




