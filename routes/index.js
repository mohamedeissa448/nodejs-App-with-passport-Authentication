const express=require('express');
const Router= express.Router();
Router.route('/')
.get((req,res,next)=>{
  res.render('welcome')
})

Router.route('/dashboard')
.get((req,res,next)=>{
  res.render('dashboard')
})
module.exports=Router;
