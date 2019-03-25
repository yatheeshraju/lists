const express = require('express')
const router = express.Router();

// bring in models 

let list_item = require('../models/listitem');

// edit item route 
router.get('/item/edit/:id',function (req,res) {
    list_item.findById(req.params.id,function (err,item) {
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
         res.render('item',{
             item:item
         });
        }
   });
    
});

// add route
router.get('/add',function (req,res) {
    
    res.render('add_list');
});

router.post('/add',function (req,res) {

    req.checkBody('title','Title is required').notEmpty();
    req.checkBody('author','Author is required').notEmpty();
    req.checkBody('body','Body is required').notEmpty();

    let errors=req.validationErrors();
    if(errors){
        res.render('add_list',{
         errors:errors   
        });
    }else{
        let item=new list_item();
        item.title=req.body.title;
        item.author=req.body.author;
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
router.post('/edit/:id',function (req,res) {
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

 router.delete('/item/:id',function (req,res) {
    let query = {_id:req.params.id};
    list_item.deleteOne(query,function (err) {
        if(err){
            console.log(err);
        }
        res.send('Success');
    })

 });

 module.exports = router;