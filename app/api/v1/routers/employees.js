const express = require("express");
const router = express.Router();

const {
  create,
  destroy,
  detail,
  get,
  update,
} = require("../controllers/employees");

router.get("/get", get);
router.get("/detail/:id", detail);
router.post("/create", create);
router.put("/update/:id", update);
router.delete("/destroy/:id", destroy);

module.exports = router;
