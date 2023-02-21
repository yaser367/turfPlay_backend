const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../../models/Order");

let instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SCRETE,
});

const checkout = async (req, res) => {
  try {
    const { amount, slot, game, id,username,date } = req.body;
    console.log(username)
    const options = {
      amount: Number(amount) * 100,
      currency: "INR",
      receipt: "order_rcptid_11",
    };
  
    const order = await instance.orders.create(options);
   
    const payment = new Order({
      turfId:id,
      username,
      game,
      amount,
      date,
      slot
    })
    const ord = await payment.save()
    res.status(200).send({ order,ord });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const paymentVerification = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SCRETE)
      .update(body.toString())
      .digest("hex");
    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      const order = new Order({
        razorpay_order_id,
      });
      await order.save();
      return res.status(200).redirect(`${process.env.FRONTEND_DOMIN}/orderSuccess`)
    } else {
      res.status(400).send({ error: "something went wrong..." });
    }
  } catch (error) {}
};

module.exports = {
  checkout,
  paymentVerification,
};
