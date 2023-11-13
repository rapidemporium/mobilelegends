var express = require('express');
var router = express.Router();
const axios = require('axios');
const CryptoJS = require('crypto-js');
require('dotenv').config();
const http = require('http');
const userModel = require('./users');
const localStrategy =  require('passport-local');
const passport = require('passport');
 
 
 

const partnerId = process.env.YOUR_PARTNER_ID;
const secretKey = process.env.YOUR_SECRET_KEY;

//setting up users Auth
const { findOne } = require('./users');

/* LOCAL PASSPORT STRATEGY */

passport.use(
  new localStrategy(
    {
      usernameField: "email",
    },
    userModel.authenticate()
  )
);


router.post("/register", function (req, res, next) {
  var usersRouter = new userModel({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email
  });
  userModel.register(usersRouter, req.body.password).then(function (dets) {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/home");
    });
  });
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/",
    failureFlash: true,
  }),
  function (req, res, next) {
    res.redirect("/");
  }
);

/* LOGOUT ROUTE */

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

/* MIDDLEWARE */

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/");
  }
}


const Razorpay = require("razorpay");
var instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

router.post('/proceed', function(req, res, next){
  //Obtain Product ID from Product Detail API
const payload = {
  path: "order/create_order",
  data: {
      category: "1",
      "product-id": "1874705",
      quantity: "1",
      "Player ID": "12314123",
      Server: "Asia Pacific - Eden"
  }
};

const timestamp = Math.floor(Date.now() / 1000);
const path = "order/create_order";

const STRING_TO_SIGN = JSON.stringify(payload) + timestamp + path;
const auth = CryptoJS.HmacSHA256(STRING_TO_SIGN, secretKey).toString();
const auth_basic = Buffer.from(`${partnerId}:${secretKey}`).toString('base64');

axios.post("https://moogold.com/wp-json/v1/api/order/create_order", payload, {
  headers: {
      timestamp,
      auth,
      Authorization: `Basic ${auth_basic}`,
      'Content-Type': 'routerlication/json'
  }
})
.then(response => {
  console.log(response.data);
  console.log("proceed run !");
})
.catch(error => {
  console.error(error);
  console.log("We are Facing Some issue");
});

})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('userAuth');
});

router.get('/mlbb-moogold', isLoggedIn,  function(req, res, next){
  res.render('index');
})

router.get('/home', isLoggedIn,  async function(req, res, next){
  let user = await userModel.findOne({email: req.session.passport.user});
  res.render('home', {user});
})

router.get('/test', function(req, res, next){
  res.render('test');
})


// router.use("/payment", async (req, res, next) => {

// try{
  
//   var instance = new Razorpay({ key_id: process.env.KEY_ID, key_secret: process.env.KEY_SECRET })
 
//   var order = await instance.orders.create({
//     amount: req.body.amount,  // amount in the smallest currency unit
//     currency: "INR",
//     receipt: "order_rcptid_11", 
//   });

// res.status(201).json({
//   success: true,
//   order,
// });

// }catch(err){
//   next(err);
// }

// });



// router.post('/pay-verify', async (req,res, next) => {

//   var expectedSignature = crypto.createHmac('sha256', 'NbuBBPdNMiBejAITkjNeVHds')
//                                   .update(req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id)
//                                   .digest('hex');
//                                   console.log("sig"+req.body.razorpay_signature);
//                                   console.log("sig"+expectedSignature);
 
//   if(expectedSignature === req.body.razorpay_signature){
//     console.log("Payment Success");
//     //sending product details to its owner
//   }else{
//     console.log("Payment Fail");
//     res.redirect("/home");
//   }
 
// })


//listing products
router.get('/products', async (req, res) => {
  try {
  
const category_id = 1223; // Replace with the desired category ID
const productList = {
  path: "product/list_product",
  data: {
      category_id: category_id
  }
}
    
    // Make a request to the MooGold API with Basic Authentication
const timestamp = Math.floor(Date.now() / 1000);
const path = "product/list_product";

const STRING_TO_SIGN = JSON.stringify(productList) + timestamp + path;
const auth = CryptoJS.HmacSHA256(STRING_TO_SIGN, secretKey).toString();
const auth_basic = Buffer.from(`${partnerId}:${secretKey}`).toString('base64');

axios.post("https://moogold.com/wp-json/v1/api/product/list_product", productList, {
  headers: {
      timestamp,
      auth,
      Authorization: `Basic ${auth_basic}`,
      'Content-Type': 'routerlication/json'
  }
})
.then(response => {
  console.log(response.data);
  console.log("proceed run !");
})
.catch(error => {
  console.error(error);
  console.log("We are Facing Some issue");
});

    // Check if the response contains an error
    if (response.data && response.data.err_code) {
      // Handle the case where the request is unauthorized
      if (response.data.err_code === '403') {
        return res.status(403).json({ error: 'Unauthorized. Your account is not authorized to access the requested resource.' });
      } else {
        console.log("Error facing!");
        return res.status(500).json({ error: 'Internal Server Error' });
        
      }
    }

    // Extract relevant product information from the API response
    const products = response.data.map(product => ({
      ID: product.ID,
      post_title: product.post_title,
    }));

    // Send only the extracted product data in the response
    res.json(products);
    console.log('Products fetched!');
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

 
module.exports = router;
