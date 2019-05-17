const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const Group = require("../models/Group");
const User = require("../models/User");
const bodyParser   = require('body-parser');
require('dotenv').config('');
const stripeSecret = process.env.STRIPE_KEYSECRET;
const stripeMailRcpt = process.env.STRIPE_MAILRECEIPT;
var stripe = require("stripe")('sk_test_VRA85VgkKiCPRRovLObtEA8000y8GOjeEA');


router.post('/api/doPayment/', (req, res) => {
  return stripe.charges
    .create({
      amount: req.body.amount, // Unit: cents
      currency: 'eur',
      source: req.body.tokenId,
      description: 'Test payment',
    })
    .then(result => res.status(200).json(result));
});

//All the payments
router.get('/payments', (req, res, next) => {
  Payment.find({}).then(payments => {
    res.json(payments);
  })
  ;
});

//New payment test screen
// router.get('/payments/create', (req, res, next) => {
//   res.render('payments/create');
// });

//New payment
//Only for tests purposes
router.post('/payments/create', (req, res, next) => {
  let { idUser, idGrupo, idGroupLeader, quota, status } = req.body;
  const newPayment = new Payment({ idUser, idGrupo, idGroupLeader, quota, status })
  newPayment.save()
    .then((payments) => {
      res.redirect("/search-tribes");
    })
    .catch((error) => {
      console.log(error);
    })
});

//New payment called from  '/addMember/:userid/:groupid/:notificationid'
router.get('/payments/create/:idUser/:groupid', (req, res, next) => {
  let idUser = req.params.idUser;
  let idGrupo = req.params.groupid;
  Group.findById(idGrupo)
  .then(groupRequest=>{
    let idGroupLeader = groupRequest.leader;
    let quota = groupRequest.pricePerson;
    let status = "Pending";
    const newPayment = new Payment({ idUser, idGrupo, idGroupLeader, quota, status });
    newPayment.save()
      .then((payments) => {
        res.redirect("/");
      })
      .catch((error) => {
        console.log(error);
      })
  })
  .catch(err=>{console.log(err)})
 });

//execute payment
router.get('/payments/execute/:idPayment', (req, res, next) => {

  let idPayment = req.params.idPayment;
  Payment.findById(idPayment)
  .then(paymentToExec => {
    let quota = paymentToExec.quota;
    let idUser = paymentToExec.idUser;
    User.findById(idUser).then(userData=>{
      let cardNumber = userData.cardNumber;
      let cardMonth = userData.cardMonth;
      let cardYear = userData.cardYear;
      stripe.tokens.create({
        card:{
          number: cardNumber,
          exp_month: cardMonth,
          exp_year: cardYear}
      }).then(token =>{
          // console.log('Token!');
          // console.log(token);
          stripe.charges.create({
            amount: quota * 100 ,
            currency: 'eur',
            source: token.id ,
            receipt_email: `${stripeMailRcpt}`
          }).then(charge => {
            Payment.findByIdAndUpdate(idPayment , {status: 'Completed', invoice:charge.receipt_url})
            .then(paymentProcesed=>{
              // { username:req.user.username, quota: quota, cardNumber: cardNumber , receipt_email:`${stripeMailRcpt}`, invoice:charge.receipt_url }
              res.render('payments/invoice', { username:req.user.username, quota: quota, cardNumber: cardNumber , receipt_email:`${stripeMailRcpt}`, invoice:charge.receipt_url })})
          })                  
      }) 
    })
  }).catch(err => {console.log(err)});
});


  

            
                  



// stripe.tokens.create({
//   card:{
//     number: cardNumber,
//     exp_month: cardMonth,
//     exp_year: cardYear}})
//   .then(token =>{
//     console.log('Token!');
//     console.log(token);
//     res.redirect('/payments');
//   })

      // .then(token =>{
      //   console.log('Token!');
      //   console.log(token);
      //   stripe.charges.create({
      //     amount: req.body.paymentAmount * 100 ,
      //     currency: 'eur',
      //     source: token.id ,
      //     receipt_email: `${stripeMailRcpt}`
      //   })})
      // .then(charge => {
      //     Payment.findByIdAndUpdate(req.body.idPayment , {status: 'Completed', invoice:charge.receipt_url})
      //     .then((paymentProcesed)=>{res.redirect('/payments');
      //     });
      //   })

  //   })
  // })
  // .catch(err => {console.log(err)});







router.post('/payments/execute', (req, res, next) => {
  Payment.findById(req.body.idPayment).then( paymentToExec => {
    console.log('Pagado!');
    stripe.tokens.create({
      card:{
        number: req.body.cardNumber,
        exp_month: req.body.cardMonth,
        exp_year: req.body.cardYear}})
      .then(token =>{
        console.log('Token!');
        console.log(token);
        stripe.charges.create({
          amount: req.body.paymentAmount * 100 ,
          currency: 'eur',
          source: token.id ,
          receipt_email: `${stripeMailRcpt}`
        }).then(charge => {
            Payment.findByIdAndUpdate(req.body.idPayment , {status: 'Completed', invoice:charge.receipt_url})
            .then((paymentProcesed)=>{
              res.redirect('/payments')
            });
          }
        )
      })
  }).catch(
    err => {console.log()}
  );
});

//reject payment
router.post('/payments/reject', (req, res, next) => {
  Payment.findByIdAndUpdate(req.body.idPayment , {status: 'Rejected'})
  .then((paymentProcesed)=>{
    res.redirect('/payments');
  })
});

module.exports = router;