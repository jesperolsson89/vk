const express = require("express");
const router = express.Router();

router.get("/", (req: any, res: any) => {
  res.send("User List");
});

router.get("/new", (req: any, res: any) => {
  res.send("New user form");
});

router.post("/", (req: any, res: any) => {
  res.send("Create User");
});

router
  .route("/:id")
  .get((req: any, res: any) => {
    res.json({ id: req.params.id, name: req.user.name });
  })
  .put((req: any, res: any) => {
    res.send(`Update User With ID ${req.params.id}`);
  })
  .delete((req: any, res: any) => {
    res.send(`Delete User With ID ${req.params.id}`);
  });

  const users = [{ name: "Jeppis"}, { name: "Mongius"}, { name: "Kevin"}]
router.param("id", (req: any, res: any, next: any, id: number, name: String) => {
    req.user = users[id]
    next();
    
})

module.exports = router;
