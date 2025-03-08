import { auth, authorization, roles } from "../../Middleware/auth.js";
import { validation } from "../../Middleware/validation.js";
import * as validators from "./order.validation.js"
import * as orderController from "./Controller/order.controller.js"
import { Router } from "express";
const router = Router();
// Global Middleware For All Routess
router.use(auth)
// Create Order
router.post("/", authorization(roles.User), validation(validators.createOrder), orderController.createOrder)
// Cancel Order
router.patch("/:orderId", authorization(roles.User), validation(validators.cancelOrder), orderController.cancelOrder)
// Update Order
router.put("/:orderId", authorization(roles.Admin), validation(validators.updateOrder), orderController.updateOrder)
// Get Order Invoice
router.get("/invoice/:orderId", authorization(roles.User), validation(validators.getOrderInvoice), orderController.getOrderInvoice);
export default router;