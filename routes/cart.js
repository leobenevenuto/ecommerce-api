const router = require("express").Router();
const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const User = require("../models/User");
const { verifyTokenAndAdmin, verifyTokenAndAuthorization, verifyToken} = require("./verifyToken");


router.post("/", verifyToken, async (req, res) => {
    const newCart = new Cart(req.body)

    try{
        const savedCart = await newCart.save();
        res.status(200).json(savedCart)
    }catch(err){
        res.status(500).json(err);
    }
})


router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try{
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, { new: true })

        res.status(200).json(updatedCart)
    }catch(err){
        res.status(500).json("Ocorreu erro ao atualizar")
    }
})


router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try{
        const deletedCart = await Cart.findOneAndDelete(req.params.id)
        res.status(200).json(deletedCart)
    }catch(err){
        res.status(500).json("Ocorreu erro ao deletar")
    }
})

router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try{
        const cart = await Cart.findOne({userId: req.params.userId})
        res.status(200).json(cart)
    }catch(err){
        res.status(500).json("Erro ao buscar produtos no carrinho deste usuário")
    }
})


router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try{
        const carts = await Cart.find();
        res.status(200).json(carts)
    }catch(err){
        res.status(500).json(err);
    }
})



module.exports = router