const { Router } = require("express");
const crudController = require("./crudController");
const router = new Router();
router.post("/skipTraceUsers/add", crudController.addSkipTraceUsers);
router.get("/skipTraceUsers/get", crudController.getSkipTraceUsers);
router.get("/skipTraceUser/get/:uid", crudController.getSkipTraceUserOnly);
router.put("/skipTraceUser/update/:uid", crudController.updateSkipTraceUser);
router.delete("/skipTraceUser/delete/:uid", crudController.deleteSkipUser);

//requirement 1
router.get(
  "/skipTraceUsersByStripeId/get/:stripe_customer_id",
  crudController.gettingUserByStripeCustomerId
);
module.exports = router;
