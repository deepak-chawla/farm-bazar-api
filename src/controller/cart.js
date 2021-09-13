const Cart = require('../models/cart');

exports.addToCart = (req, res)=>{
    const userId = req.user._id;
    
    Cart.findOne({user: userId})
    .exec((error, cart)=>{
        if(error) return res.status(400).json({message: error});
        if(cart){
            const product = req.body.cartItems.product;
            const item = cart.cartItems.find(c => c.product === product);

            if(item){
                Cart.findOneAndUpdate({"user": userId, "cartItems.product": product},{
                    "$set":{
                        "cartItems":
                        { 
                            ...req.body.cartItems,
                            quantity: cart.cartItems.quantity + req.body.cartItems.quantity
                        }
                    }
                })
                .exec((error, adcart)=>{
                    if(!error) 
                    return res.status(400).json({adcart});
                })
            }
            else{
                Cart.findOneAndUpdate({user: userId},{
                    "$push":{
                        "cartItems": req.body.cartItems
                    }
                })
                .exec((error, adcart)=>{
                    if(!error) 
                    return res.status(400).json({adcart});
                })
            }
            
        }else{
            //if cart not exists then create new cart
            const _cart = new Cart({
                user: userId,
                cartItems: [req.body.cartItems]
            });

            _cart.save((error,cart)=>{
                if(!error) 
                return res.status(400).json({cart});
            });
        }

    });
}