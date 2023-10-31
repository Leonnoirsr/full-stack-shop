const bcrypt = require( 'bcrypt' )

const User = require( '../models/user' )

exports.getLogin = ( req, res, next ) => {
	
	res.render( 'auth/login', {
		path:            '/login',
		pageTitle:       'Login',
		isAuthenticated: req.session.isLoggedIn
	} )
}

exports.getSignup = ( req, res, next ) => {
	res.render( 'auth/signup', {
		path:            '/signup',
		pageTitle:       'Signup',
		isAuthenticated: false
	} );
};

exports.postLogin = ( req, res, next ) => {
	
	const email    = req.body.email;
	const password = req.body.password
	
	User.findOne( { email: email } )
	    .then( user => {
		    if( !user ){
			    return res.redirect( '/login' )
		    }
		    bcrypt.compare( password, user.password ).then( passwordMatch => {
			          if( passwordMatch ){
				          req.session.isLoggedIn = true
				          req.session.user       = user;
				         return req.session.save( err => {
					          console.log( err )
					         console.log('User logged in')
					          res.redirect( '/' )
						  });
			          }
			          return res.redirect('/login')
		          } )
		          .catch( err => console.log( err ) )
		    
	    } )
	    .catch()
}

exports.postLogout = ( req, res, next ) => {
	
	req.session.destroy( ( err ) => {
		console.log( err )
		res.redirect( '/' )
	} )
}

exports.postSignup = ( req, res, next ) => {
	
	const email    = req.body.email;
	const password = req.body.password;
	//	const confirmPassword = req.body.confirmPassword
	
	User.findOne( { email: email } )
	    .then( userDoc => {
		    if( userDoc ){
			    return res.redirect( '/signup' )
		    }
		    return bcrypt.hash( password, 12 ).then( hashedPassword => {
			    const user = new User( {
				    email:    email,
				    password: hashedPassword,
				    cart:     { items: [] }
			    } );
			    return user.save()
		    } )
	    } )
	    .then( result => {
		    console.log( 'New user Created' )
		    res.redirect( '/login' )
	    } )
	    .catch( err => console.log( err ) )
	
};

exports.postLogout = ( req, res, next ) => {
	req.session.destroy( err => {
		console.log( err );
		res.redirect( '/' );
	} );
};


