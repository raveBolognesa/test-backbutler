const express = require('express');
require('dotenv');
const router  = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const uploadCloud = require('../config/cloudinary.js');
const Picture = require('../models/Picture');





// CREATE
router.post('/newproduct', (req, res, next) => {

    const { price,
        description,
        title,
        localization,
        date,imgProduct } = req.body;

        const author = req.user
  
  
    // Check for non empty fields
    if (!price || !title || !date){
      next(res.json({mensaje:'You have to put tittle price and date!'}));
    }
  
    // Check if product exists in DB
    Product.findOne({ title })
    .then( foundUser => {
      if (foundUser) throw new Error('This already exists');
  
      return new Product({
        price,
        description,
        title,
        author,
        localization,
        date,
        imgProduct
      }).save();
    })
    .then( user => res.json({status: 'Created Product', user}))
    .catch(e => res.json({message:'./error', e}));
  });

  //EDIT

  router.post('/:title/edit', (req, res, next) => { 
    Product.updateOne({title: req.params.title}, req.body)
      .then(updated => {
        res.json(updated);
      })
      .catch(err => {
        res.json({message:'./error', err})
      })
  })

  //Delete

  router.post('/:id/delete', (req, res, next) => {
    Product.findByIdAndDelete({_id: req.params.id})
      .then(record => {
        res.json({message:"deleted",record});
      })
      .catch(err => {
        res.json({message:'./error', err})
      })
  })

  //All products

  router.get('/all', (req, res, next) => {
    Product.find({})
      .then(products => {
        res.json(products);
      })
      .catch(err => {
        res.json({message:'./error', err})
      })
  });

  // One product

  router.get('/:id/oneproduct', (req, res, next) => {
    Product.findOne({_id : req.params.id})
      .then(product => {
        res.json({message:'the product', product})
      })
      .catch(err => {
        res.json({message:'./error', err})
      })
  });

  //todos los productos menos los mios

  router.get("/losproductos",(req,res,next)=>{
    
    Product.find({ "author.username": { $ne: req.user.username } })
      .then(product => {
        res.json(product)
      })
      .catch(err => {
        res.json({message:'./error', err})
      })
  })

  //todos los que hice yo

  router.get("/misproductos",(req,res,next)=>{
    
    Product.find({ "author.username": req.user.username  })
      .then(product => {
        res.json(product)
      })
      .catch(err => {
        res.json({message:'./error', err})
      })
  })

  // comprar 

  // router.post('/:id/comprar', (req, res, next) => {

  //   const { price,
  //       description,
  //       title,
  //       localization,
  //       date,imgProduct } = req.body;

  //       const author = req.user
  
  
  //   // Check for non empty fields
  //   if (!price || !title || !date){
  //     next(res.json({mensaje:'You have to put tittle price and date!'}));
  //   }
  
  //   // Check if product exists in DB
  //   Payment.findOne({ _id:req.params.id })
  //   .then( foundUser => {
  //     if (foundUser) throw new Error('This already exists');
  
  //     return new Payment({
  //       price,
  //       description,
  //       title,
  //       author,
  //       localization,
  //       date,
  //       imgProduct
  //     }).save();
  //   })
  //   .then( user => res.json({status: 'Created Product', user}))
  //   .catch(e => res.json({message:'./error', e}));
  // });
  

  router.post("/:id/comprar",(req,res,next)=>{
    Product.findOne({_id : req.params.id})
      .then(product => {
        return        User.updateOne(
          { username: req.user.username },
          { $push: { buys: product } }
        ).then(
          x=>{
            return           User.updateOne(
              { username: product.author.username },
              { $push: { sells: product } }
            )
          }
        )
      })
      .catch(err => {
        res.json({message:'./error'})
      });

      });


      router.post('/subirfoto', uploadCloud.single('photo'), (req, res, next) => {
        console.log(req.file)
        const imgName = req.file.originalname;
        const newPhoto = new Picture({imgName})
        console.log(req.file.url);
      
        //actual write in mongo using mongoose
        newPhoto.save()
        .then(photo => {
          res.json({url: req.file.url, photo: photo});
        })
        .catch(error => {
          console.log(error);
        })
      });





module.exports = router;