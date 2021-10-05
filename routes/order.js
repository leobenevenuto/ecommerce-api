const router = require("express").Router();
const mongoose = require("mongoose");
const Order = require("../models/Order");
const User = require("../models/User");
const { verifyTokenAndAdmin, verifyTokenAndAuthorization, verifyToken} = require("./verifyToken");


router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body)

    try{
        const savedCart = await newOrder.save();
        res.status(200).json(savedCart)
    }catch(err){
        console.log(err)
        res.status(501).json(err);
    }
})


router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        const orderCart = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, { new: true })

        res.status(200).json(orderCart)
    }catch(err){
        res.status(500).json("Ocorreu erro ao atualizar")
    }
})


router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        const orderCart = await Order.findOneAndDelete(req.params.id)
        res.status(200).json(orderCart)
    }catch(err){
        res.status(500).json("Ocorreu erro ao deletar")
    }
})

router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try{
        const orders = await Cart.find({userId: req.params.userId})
        res.status(200).json(orders)
    }catch(err){
        res.status(500).json("Erro ao buscar produtos no carrinho deste usuário")
    }
})


router.get("/", verifyTokenAndAuthorization, async (req, res) => {
    try{
        const order = await Order.find();
        res.status(200).json(order)
    }catch(err){
        res.status(500).json(err);
    }
})

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() -1 ));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() -1 ));

    try{
        const income = await Order.aggregate([
            { $match: { createdAt: {$gte: previousMonth}}},
            {
                $project: {
                    month: {$month: "$createdAt"},
                    sales: "$amount"
                },
            },
            {
                $group: {
                    _id:"$month",
                    total: {$sum: "$sales"}
                }
            }
        ]);

        res.status(200).json(income)
    }catch(err){
        res.status(500).json(err)
    }
})



module.exports = router