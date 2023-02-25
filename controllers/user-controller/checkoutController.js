const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../../models/Order");
const Slot = require("../../models/TimeSlot")

let instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SCRETE,
});

const checkout = async (req, res) => {
  try {
    const { amount, slot, game, id,username,date } = req.body;
    const options = {
      amount: Number(amount) * 100,
      currency: "INR",
      receipt: "order_rcptid_11",
    };
    const d = new Date(date)
    const dateString = d.toLocaleDateString()
  
    const order = await instance.orders.create(options);
   
    const payment = new Order({
      turfId:id,
      username,
      game,
      amount,
      date:dateString,
      slot
    })
    const booking = await payment.save()
    res.status(200).send({ order,booking });
  } catch (error) {
   
    res.status(500).send(error);
  }
};

const paymentVerification = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
      const {id,turfId} = req.params;
    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SCRETE)
      .update(body.toString())
      .digest("hex");
    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      await Order.findOneAndUpdate({_id:id},{$set:{payement:true}})
      const order = await Order.findOne({_id:id})
      const date = order.date
      const game = order.game
      const slot = order.slot
      const slotUpdate = await Slot.updateOne({TurfId:turfId ,game,date,slots:{$elemMatch:{slot}}},{$set:{"slots.$.booked":true}})
      return res.status(200).redirect(`${process.env.FRONTEND_DOMIN}/orderSuccess`)
    } else {
      res.status(400).send({ error: "something went wrong..." });
    }
  } catch (error) {}
};

const getOrders = async(req,res)=>{
  try {
    let page = parseInt(req.query.page) || 1;
     
     page --;
     const limitNum = 6;
    const order = await Order.find({}).populate("turfId").sort({createdAt:-1}).skip(page*limitNum).limit(limitNum)
    res.status(200).send(order)
  } catch (error) {
    
    return res.status(401).send(error);

  }
}

module.exports = {
  checkout,
  paymentVerification,
  getOrders
};
