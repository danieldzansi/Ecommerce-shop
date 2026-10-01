import express from "express";
import adminAuth from "../middleware/adminauth.js";
import giftCardController from "../controllers/giftcardcontroller.js";

const router = express.Router();
router.post("/validate", giftCardController.validateGiftCard);
router.get("/admin/batches", adminAuth, giftCardController.listBatches);
router.post("/admin/batches", adminAuth, giftCardController.generateBatch);
router.post("/admin/batches/:id/activate", adminAuth, giftCardController.activateBatch);
export default router;
