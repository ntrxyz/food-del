// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js";
// import Stripe from "stripe";

// const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);


// //placing user order from frontend
// const placeOrder=async(req,res)=>{

//     const frontend_url = "http://localhost:5173"
    
//     try {
//         const newOrder= new orderModel({
//             userId:req.body.userId,
//             items:req.body.items,
//             amount:req.body.amount,
//             address:req.body.address
//         })
//         await newOrder.save();
//         await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});

//         const line_items =req.body.items.map((item)=>({
//           price_data:{
//             currency:"usd",
//             product_data:{
//                 name:item.name
//             },
//             unit_amount:item.price*100
//           },
//           quantity:item.quantity
//         }))

//         line_items.push({
//             price_data:{
//                 currency:"usd",
//                 product_data:{
//                     name:"Delivery Charges"
//                 },
//                 unit_amount:2*100 
//             },
//             quantity:1
//         })

//         const session =await stripe.checkout.sessions.create({
//             line_items:line_items,
//             mode:'payment',
//             success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
//             cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`

//         })

//         res.json({success:true,session_url:session.url})
//     } catch (error) {
//         console.log(error);
//         res.json({success:false,message:"Error"})
        
//     }
// }


// export {placeOrder}

import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
  const frontend_url = process.env.FRONTEND_URL || "http://localhost:5174";

  try {
    // Validate required fields
    const { userId, items, amount, address } = req.body;
    if (!userId || !items || !amount || !address) {
      return res.status(400).json({ success: false, message: "Invalid request data" });
    }

    // Create a new order in the database
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
    });

    await newOrder.save();

    // Clear user's cart after placing the order
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // Prepare line items for Stripe
    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100, // Convert price to cents
      },
      quantity: item.quantity,
    }));

    // Add delivery charges to the line items
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100, // $2 delivery fee
      },
      quantity: 1,
    });

    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // Specify allowed payment methods
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    // Send session URL to the client
    res.status(200).json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Error placing order:", error.message);

    // Send error response to the client
    res.status(500).json({ success: false, message: "An error occurred while placing the order" });
  }
};

const verifyOrder = async(req,res)=>{
   const {orderId, success}=req.body;
   try {
    if (success==="true") {
      await orderModel.findByIdAndUpdate(orderId,{payment:true});
      res.json({success:true,message:"Paid"});
    }
    else{
      await orderModel.findByIdAndDelete(orderId);
      res.json({success:false,message:"Not Paid"});
    }
   } catch (error) {
     console.log(error);
     res.json({success:false,message:"Error"})
     
   }
}

//user orders for frontend
const userOrders = async(req,res)=>{
 try {
    const orders=await orderModel.find({userId:req.body.userId})
    res.json({success:true,data:orders})
 } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
    
 }
}

// Listing orders for admin panel
const listOrders=async(req,res)=>{
  try {
    const orders=await orderModel.find({});
    res.json({success:true,data:orders})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
  }
}

//api for updating order status
const updateStatus=async(req,res)=>{
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
    res.json({success:true,message:"Status Updated"})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
  }
}

export { placeOrder,verifyOrder,userOrders,listOrders,updateStatus };
