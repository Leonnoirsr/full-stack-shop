const fs   = require( 'fs' );
const path = require( 'path' );

const p = path.join(
	path.dirname( process.mainModule.filename ),
	'data',
	'cart.json'
);

module.exports = class Cart {
	static addProduct( id, productPrice ){
		// Fetch previous cart
		fs.readFile( p, ( err, fileContent ) => {
			let cart = { products: [], totalPrice: 0 };
			if( !err ){
				cart = JSON.parse( fileContent )
			}
			// Analyze the cart => find existing products
			const existingProductIndex = cart.products.findIndex( prod => prod.id === id );
			const existingProduct      = cart.products[ existingProductIndex ];
			
			// Add new products / increase quantity
			
			if( existingProduct ){
				existingProduct.qty += 1;
			} else {
				const newProduct = { id: id, qty: 1 };
				cart.products.push( newProduct );
			}
			cart.totalPrice = ( cart.totalPrice || 0 ) + +productPrice;
			fs.writeFile( p, JSON.stringify( cart ), err => {
				console.log( err );
			} );
			
		} )
		
	}
	
	static deleteProduct( id, productPrice ){
		
		// Fetch current cart
		
		fs.readFile( p, ( err, fileContent ) => {
			
			if( err ){
				console.log( 'Error reading cart file', err )
				return
			}
			
			let cart = JSON.parse( fileContent )
			// Find the product to delete
			
			const existingProductIndex = cart.products.findIndex( prod => prod.id === id )
			
			if( existingProductIndex !== -1 ){
				
				const existingProduct = cart.products[ existingProductIndex ]
				
				// Reduce the quantity
				
				existingProduct.qty -= 1;
				cart.totalPrice = ( cart.totalPrice || 0 ) - +productPrice
				
				if( existingProduct.qty === 0 ){
					// Remove the product
					cart.products.splice( existingProductIndex, 1 )
				}
				
				// Write updated cart back to the file
				
				fs.writeFile( p, JSON.stringify( cart ), err => {
					console.log( err )
				} )
				
			} else {
				console.log( "Product not found." );
			}
			
			3
0		} )
	}10
1
	static getCart( cb ){
		fs.readFile( p, ( err, fileContent ) => {
			const cart = JSON.parse( fileContent );
			
			if( err ){
				cb( null );
			} else {
				cb( cart );
			}
		} )
	}
	
}