// -----------------CORE MODULES -------------------------------------------------

const path = require( 'path' );

// ---------------- DEPENDENCIES -------------------------------------------------
const express      = require( 'express' );
const bodyParser   = require( 'body-parser' );
const dotenv       = require( 'dotenv' ).config();
const mongoose     = require( 'mongoose' );
const session      = require( 'express-session' );
const MongoDBStore = require( 'connect-mongodb-session' )( session );
const csrf         = require( 'csurf' );
const flash        = require( 'connect-flash' );

const errorController = require( './controllers/error' );
const User            = require( './models/user' )

// ------------------DOTENV CREDENTIALS------------------------------------------

let username = encodeURIComponent( process.env.DB_USERNAME );
let password = encodeURIComponent( process.env.DB_PASSWORD );
let dbName   = process.env.DB_NAME;

//------------------------------------------------------------------------------
const MONGODB_URI = `mongodb+srv://${ username }:${ password }@node-shop.nyhur31.mongodb.net/${ dbName }`

// -------------------- MAIN CODE ----------------------------------------------

const app   = express();
const store = new MongoDBStore( {
	uri:        MONGODB_URI,
	collection: 'sessions'
	
} );

const csrfProtection = csrf();

app.set( 'view engine', 'ejs' );
app.set( 'views', 'views' );

const adminRoutes = require( './routes/admin' );
const shopRoutes  = require( './routes/shop' );
const authRoutes  = require( './routes/auth' );

app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( express.static( path.join( __dirname, 'public' ) ) );
app.use(
	session(
		{
			secret:            'cyxnyeaijq',
			resave:            false,
			saveUninitialized: false,
			store:             store
		} ) )
app.use( csrfProtection );
app.use( flash() );
app.use( ( req, res, next ) => {
	if( req.session && req.session.user ){
		User.findById( req.session.user._id )
		    .then( user => {
			    req.user = user
			    next()
		    } )
		    .catch()
	} else {
		next();
	}
} )

app.use( ( req, res, next ) => {
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.csrfToken       = req.csrfToken();
	next();
} )

app.use( '/admin', adminRoutes );
app.use( shopRoutes );
app.use( authRoutes );

app.use( errorController.get404 );

mongoose
	.connect( MONGODB_URI )
	.then( () => {
		console.log( 'Connected to Database' )
		app.listen( 3000 )
	} )
	.catch( err => console.log( err ) )
