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
    res.json({
      id: req.params.id,
      ide: req.user.id,
      role: req.user.role,
      personalNumber: req.user.personalNumber,
      name: req.user.name,
      givenname: req.user.givenName,
      surname: req.user.surname,
    });
  })
  .put((req: any, res: any) => {
    res.send(`Update User With ID ${req.params.id}`);
  })
  .delete((req: any, res: any) => {
    res.send(`Delete User With ID ${req.params.id}`);
  });

// Mock users
const users = [
  {
  "id": "cldx1a2b3c4d5e6f",
  "personalNumber": "198001011234",
  "name": "Jesper Testsson",
  "givenName": "Jesper",
  "surname": "Testsson",
  "createdAt": "2026-01-15T10:30:00.000Z",
  "updatedAt": "2026-03-22T14:15:00.000Z"
},
];
router.param(
  "id",
  (req: any, res: any, next: any, id: number, name: String) => {
    req.user = users[id];
    next();
  },
);

module.exports = router;
