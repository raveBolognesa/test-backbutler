const express = require("express");
const Chat = require("../models/Chat");
const User = require("../models/User");
const router = express.Router();

const http = require("http");
let app = require("../app");
let server = http.createServer(app);
const io = require("socket.io").listen(server);

/* GET home page */
router.get("/", (req, res, next) => {
  res.json({ done: "got endpoint sock" });
});

/////

io.on("connection", socket => {
  console.log("user conected");
  socket.on("userConnect", user => {
    console.log(`${user} connected`);
    socket.broadcast.emit("newUser", user);
  });

  socket.on("messageSent", message => {
    console.log(message);
    socket.broadcast.emit("newMessage", message);
  });
});

router.post("/newRoomDani", (req, res) => {
  Chat
    .find({product: "5cdb51ff3c2c590017ef1416", speaker: "Rafa", owner: "Pep5"})
    .then(chatData => {
      if (chatData.length > 0) {
        res.json(chatData)
      } else {

      }
      
    })
})

router.post("/newRoom", (req, res) => {
  let { message, speaker, product, title,imgChat } = req.body;
  if (!title) {
    title = product;
  }
  let owner = req.user.username;
  Chat.create({ owner, message, speaker, product, title,imgChat })
    .then(chatData => {
      io.of(chatData._id).on("connection", socket => {
        console.log("user conected");
        socket.on("userConnect", user => {
          console.log(`${user} connected`);
          socket.broadcast.emit("newUser", user);
        });

        socket.on("messageSent", message => {
          console.log(message);
          socket.broadcast.emit("newMessage", message);
        });
      });
      User.update(
        { username: owner },
        { $push: { chats: chatData._id } }
      ).then(updated => {
        return User.update(
          { username: speaker },
          { $push: { chats: chatData._id } }
        )
      })
      .then(updated => {
        res.json({ chatcreated: true, chatData});
      });
    })
    .catch(err => {
      res.json({ message: err });
    });
});

router.get("/allchats",(req,res,next)=>{
  Chat.find({})
      .then(products => {
        res.json(products);
      })
      .catch(err => {
        res.json({message:'./error', err})
      })
});

router.get('/:id/oneChat', (req, res, next) => {
  Chat.findOne({_id : req.params.id})
    .then(product => {
      res.json(product)
    })
    .catch(err => {
      res.json({message:'./error', err})
    })
});

router.put("/chat/title/:id", (req, res, next) => {
  Chat.findByIdAndUpdate(req.params.id, { title: req.body.newTitle }, {new: true})
    .then(updated => {
      res.json(updated);
    })
    .catch(err => {
      res.json({ message: "./error", err });
    });
});


router.post("/chat/:id/addmesage", (req, res, next) => {
  Chat.findByIdAndUpdate(req.params.id, { $push: { message: req.body.newmesage }}, {new: true})
    .then(updated => {
      res.json(updated);
    })
    .catch(err => {
      res.json({ message: "./error", err });
    });
});

router.get("/todosmischats",(req,res,next)=>{
  Chat.find({$or:[{owner: req.user.username},{speaker:req.user.username}]})
      .then(products => {
        res.json(products);
      })
      .catch(err => {
        res.json({message:'./error'})
      })
});

module.exports = router;
