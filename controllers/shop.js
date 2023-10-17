const Product = require('../models/product');
const Cart = require('../models/cart')

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  
  Product.findById(prodId, product => {
    if (product) {
      res.render('shop/product-detail', {product: product, pageTitle: product.title, path: '/products'})
    } else {
      console.log('Product not found');
      // Handle the error or return an appropriate response
    }
  });
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    const cartProductsPromises = cart.products.map(cartProduct => {
      return new Promise((resolve, reject) => {
        Product.findById(cartProduct.id, product => {
          if(product) {
            resolve({productData: product, qty: cartProduct.qty});
          } else {
            reject('Product not found');
          }
        });
      });
    });

    Promise.all(cartProductsPromises)
      .then(cartProducts => {
        res.render('shop/cart', {
          path: '/cart',
          pageTitle: 'Your Cart',
          products: cartProducts
        });
      })
      .catch(err => console.log(err));
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  
  Product.findById(prodId, (product) => {
   Cart.addProduct(prodId, product.price)
  })
  
  
  res.redirect('/cart')
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
      Cart.deleteProduct(prodId, product.price);
      res.redirect('/cart')
  })
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
