
module.exports = ( req, res, next ) => {
	if( !req.session.isLoggedIn ){
		return res.redirect( '/login' )
	}
	next()
}

//exports.isNotAdmin = (req, res, next) => {
//	if(req.user.role !== 1) {
//		return res.redirect('/')
//	}
//	next()
//}