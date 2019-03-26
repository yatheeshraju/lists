const express = require('express')
const router = express.Router();

// bring in models 

let list_item = require('../models/listitem');
let User = require('../models/user');

// edit item route 
router.get('/item/edit/:id',ensureAuthenticated,function (req,res) {
    list_item.findById(req.params.id,function (err,item) {
        if(item.author!= req.user._id){
            req.flash('danger','Not authenticated');
            res.redirect('/');
        }
         res.render('edit_item',{
             item:item
         });
        });
});

// get item route 
router.get('/item/:id',function (req,res) {
    list_item.findById(req.params.id,function (err,item) {
        if(err){
            console.log(err);
        }else{
        User.findById(item.author,function (err,user) {
            res.render('item',{
                item:item,
                author:user.name
            });
        });
       
        }
   });
    
});

// add route
router.get('/add',ensureAuthenticated,function (req,res) {
    
    res.render('add_list');
});

router.post('/add',ensureAuthenticated,function (req,res) {

    req.checkBody('title','Title is required').notEmpty();
   // req.checkBody('author','Author is required').notEmpty();
    req.checkBody('body','Body is required').notEmpty();

    let errors=req.validationErrors();
    if(errors){
        res.render('add_list',{
         errors:errors   
        });
    }else{
        let item=new list_item();
        item.title=req.body.title;
        item.author=req.user._id;
        item.body=req.body.body;
     
        item.save(function (err) {
            if(err){
                console.log(err);
                return;
            }else{
             req.flash('success','Listing Added !');
             res.redirect('/');
            }
        });
    }

});

// edit item
router.post('/edit/:id',ensureAuthenticated,function (req,res) {
    let item={};
    item.title=req.body.title;
    item.author=req.body.author;
    item.body=req.body.body;

    let query = {_id:req.params.id};
    console.log(query);
    list_item.update(query,item,function (err) {
        if(err){
            console.log(err);
            return;
        }else{
         req.flash('success','Listing Edited !');
         res.redirect('/');
        }
    });
 });

 router.delete('/item/:id',ensureAuthenticated,function (req,res) {
   
    if(!req.user._id){
        res.status(500).send();
    }
    item.findById(req.params._id,function (err,item) {
        if(item.author!=req.user._id){
            res.status(500).send();
        }else{
            let query = {_id:req.params.id};
            list_item.deleteOne(query,function (err) {
                if(err){
                    console.log(err);
                }
                res.send('Success');
            });
        }
    });
  

 });

 function ensureAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else {
        req.flash('danger','Please login');
        res.redirect('/users/login');
    }
 }
 module.exports = router;