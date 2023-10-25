const getDb = require( '../util/database' ).getDB;

class Product {
	constructor( title, price, imageUrl, description ){
		this.title       = title;
		this.imageUrl    = imageUrl;
		this.description = description;
		this.price       = price;
	}
	
	save(){
		const db = getDb();
		return db.collection( 'products' )
		         .insertOne( this )
		         .then( result => {
			         console.log( result )
		         } )
		         .catch( err => console.log( err ) )
	}
	
	static fetchAll(){
		const db = getDb()
		return db.collection( 'products' )
		         .find()
		         .toArray()
		         .then(products => {
					 console.log(products)
			         return products;
		         })
		         .catch(err => console.log(err))
	}
	
}

module.exports = Product;