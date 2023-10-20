const Product = require( '../models/product' );
const Cart    = require( '../models/cart' )

exports.getProducts = ( req, res, next ) => {
	Product.fetchAll()
	       .then( ( [ rows ] ) => {
		       res.render( 'shop/product-list', {
			       prods:     rows,
			       pageTitle: 'All Products',
			       path:      '/products'
		       } );
	       } )
	       .catch( err => console.log( err ) );
	
};

exports.getProduct = ( req, res, next ) => {
	const prodId = req.params.productId;
	
	Product.findById( prodId )
	       .then( ( [ product ] ) => {
		       res.render( 'shop/product-detail', { product: product[0], pageTitle: product.title, path: '/products' } )
	       } )
	       .catch( ( err ) => {
		       if( err ){
			       return console.log( err, 'Product not found' );
		       }
		       
	       } )
};
	
	exports.getIndex = ( req, res, next ) => {
		Product.fetchAll()
		       .then( ( [ rows ] ) => {
			       res.render( 'shop/index', {
				       prods:     rows,
				       pageTitle: 'Shop',
				       path:      '/'
			       } );
		       } )
		       .catch( err => console.log( err ) );
		
	};
	
	exports.getCart = ( req, res, next ) => {
		Cart.getCart( cart => {
			const cartProductsPromises = cart.products.map( cartProduct => {
				return new Promise( ( resolve, reject ) => {
					Product.findById( cartProduct.id, product => {
						if( product ){
							resolve( { productData: product, qty: cartProduct.qty } );
						} else {
							reject( 'Product not found' );
						}
					} );
				} );
			} );
			
			Promise.all( cartProductsPromises )
			       .then( cartProducts => {
				       res.render( 'shop/cart', {
					       path:      '/cart',
					       pageTitle: 'Your Cart',
					       products:  cartProducts
				       } );
			       } )
			       .catch( err => console.log( err ) );
		} );
	};
	
	exports.postCart = ( req, res, next ) => {
		const prodId = req.body.productId;
		
		Product.findById( prodId, ( product ) => {
			Cart.addProduct( prodId, product.price )
		} )
		
		res.redirect( '/cart' )
	}
	
	exports.postCartDeleteProduct = ( req, res, next ) => {
		const prodId = req.body.productId;
		Product.findById( prodId, product => {
			Cart.deleteProduct( prodId, product.price );
			res.redirect( '/cart' )
		} )
	}
	
	exports.getOrders = ( req, res, next ) => {
		res.render( 'shop/orders', {
			path:      '/orders',
			pageTitle: 'Your Orders'
		} );
	};
	
	exports.getCheckout = ( req, res, next ) => {
		res.render( 'shop/checkout', {
			path:      '/checkout',
			pageTitle: 'Checkout'
		} );
	};
