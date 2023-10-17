const fs   = require( 'fs' );
const path = require( 'path' );

const Cart = require( './cart' )

const p = path.join(
	path.dirname( process.mainModule.filename ),
	'data',
	'products.json'
);

const getProductsFromFile = cb => {
	fs.readFile( p, ( err, fileContent ) => {
		if( err ){
			cb( [] );
		} else {
			const products = JSON.parse( fileContent );
			//			console.log(products); // Add this line to log the products array
			cb( products );
		}
	} );
};

module.exports = class Product {
	constructor( id, title, imageUrl, description, price ){
		this.id          = id;
		this.title       = title;
		this.imageUrl    = imageUrl;
		this.description = description;
		this.price       = price;
	}
	
	save(){
		getProductsFromFile( products => {
			if( this.id ){
				const existingProductIndex = products.findIndex( prod => prod.id === this.id );
				
				if( existingProductIndex !== -1 ){
					products[ existingProductIndex ] = this;
				} else {
					console.log( "Product with the specified ID does not exist." );
					return;
				}
			} else {
				this.id = Math.random().toString();
				products.push( this );
			}
			
			fs.writeFile( p, JSON.stringify( products ), err => {
				console.log( err );
			} );
		} );
	}
	
	delete(){
		getProductsFromFile( products => {
			const productIndex = products.findIndex( prod => prod.id === this.id );
			if( productIndex !== -1 ){
				products.splice( productIndex, 1 );
				fs.writeFile( p, JSON.stringify( products ), err => {
					
					if( !err ){
						Cart.deleteProduct( this.id, productIndex.price )
					} else {
						console.log( err );
					}
				} );
			} else {
				console.log( "Product with the specified ID does not exist." );
			}
		} );
	}
	
	static fetchAll( cb ){
		getProductsFromFile( cb );
	}
	
	static findById( id, cb ){
		getProductsFromFile( products => {
			const product = products.find( p => p.id.toString() === id.toString() );
			cb( product );
		} )
	}
	
};
