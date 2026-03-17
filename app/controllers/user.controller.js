import UserModel from "../models/User.model.js";
import TradeModel from "../models/Trade.model.js";
import CardModel from "../models/Card.model.js";

import { getRarityPrice } from "../utils/user.utils.js";

// GET /user/:id
export async function getUser(req, res) {
  try {
    // if there is a username parameter, use it. If not, then use the user logged in.
    let user;
    if (req.params.username === undefined) {
      if (!req.authContext?.isAuthenticated()) {
        return res.status(401).json({ status: "error", error: "Not logged in" });
      }
      const email = req.authContext.getAccount().username;
      user = await UserModel.findOne({ email: email });
    } else user = await UserModel.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ status: "error", error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ status: "error", error });
  }
}

// GET /user/:username - Get another user's profile by username
export async function getUserByUsername(req, res) {
  try {
    const user = await UserModel.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ status: "error", error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ status: "error", error });
  }
}

// POST /user/sell - sell a card (remove from inventory)
export async function sellCards(req, res) {
  try {
    if (!req.authContext?.isAuthenticated()) {
      return res.status(401).json({ status: "error", error: "Not logged in" });
    }
    const email = req.authContext.getAccount().username;
    const { cardIDs } = req.body;
    if(!typeof cardIDs === 'object' || cardIDs?.length === 0) return res.status(400).send({ error: "cardIDs missing" });

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ status: "error", error: "User not found" });

    for(const cardID in cardIDs) {
      const cardIndex = user.inventory.findIndex(i => i.cardID === Number(cardID));
      if (cardIndex === -1) return res.status(404).json({ status: "error", error: "Card not in inventory" });
      const sellCount = cardIDs[cardID];
      const invCount = user.inventory[cardIndex].quantity;

      if (invCount > sellCount) {
        user.inventory[cardIndex].quantity -= sellCount;
      } else if (invCount === sellCount) {
        user.inventory.splice(cardIndex, 1);
      } else return res.status(404).json({ status: "error", error: `Not enough quantity owned for card ${cardID}` });
      const cardData = await CardModel.findOne({ cardID: cardID });
      user.currency += getRarityPrice(cardData.rarity) * sellCount;
    }
    await user.save();
    res.json({ status: "success", inventory: user.inventory });
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: "error", error });
  }
}

// POST /user/favorites - Allows users to add cards to their favorites list.
export async function postFavorites(req, res) {
  const cardID = req.body.cardID;
  const favorited = req.body.favorited;

  try {
    if (!req.authContext?.isAuthenticated()) {
      return res.status(401).send({ status: "error", error: "not logged in" });
    }
    const account = req.authContext.getAccount();
    const user = await UserModel.findOneAndUpdate(
      { email: account.username },
      (favorited ? { $addToSet: { favorites: cardID } } : { $pull: { favorites: cardID } }),
    );
    if (!user) return res.status(404).send({ status: "error", error: "User not found" });

    res.send({ status: "success"});
  } catch (error) {
    console.error("Error connecting to DB:", error);
    res.status(500).send({ status: "error", error });
  }
}

// GET /user/friends - Get the logged in user's friends list and incoming requests
export async function getFriends(req, res) {
  try {
    if (!req.authContext?.isAuthenticated()) {
      return res.status(401).json({ status: "error", error: "Not logged in" });
    }
    const email = req.authContext.getAccount().username;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ status: "error", error: "User not found" });

    res.json({ status: "success", friends: user.friends, friendRequests: user.friendRequests });
  } catch (error) {
    res.status(500).json({ status: "error", error });
  }
}

// POST /user/friends/request - Send a friend request
export async function sendFriendRequest(req, res) {
  try {
    if (!req.authContext?.isAuthenticated()) {
      return res.status(401).json({ status: "error", error: "Not logged in" });
    }
    const { username } = req.body;
    const email = req.authContext.getAccount().username;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ status: "error", error: "User not found" });

    // can't add yourself
    if (user.username === username) {
      return res.status(400).json({ status: "error", error: "Cannot send a friend request to yourself" });
    }

    // make sure the target user exists
    const target = await UserModel.findOne({ username });
    if (!target) return res.status(404).json({ status: "error", error: "User not found" });

    // can't send a request if already friends
    if (user.friends.includes(username)) {
      return res.status(400).json({ status: "error", error: "Already friends" });
    }

    // can't send a duplicate request
    if (target.friendRequests.includes(user.username)) {
      return res.status(400).json({ status: "error", error: "Friend request already sent" });
    }

    target.friendRequests.push(user.username);
    await target.save();

    res.json({ status: "success", message: `Friend request sent to ${username}` });
  } catch (error) {
    res.status(500).json({ status: "error", error });
  }
}

// PATCH /user/friends/request - Accept or reject a friend request
export async function updateFriendRequest(req, res) {
  try {
    if (!req.authContext?.isAuthenticated()) {
      return res.status(401).json({ status: "error", error: "Not logged in" });
    }
    const { username, action } = req.body; // action: "accepted" or "rejected"
    const email = req.authContext.getAccount().username;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ status: "error", error: "User not found" });

    // make sure the request actually exists
    if (!user.friendRequests.includes(username)) {
      return res.status(404).json({ status: "error", error: "Friend request not found" });
    }

    // remove the request regardless of accept or reject
    user.friendRequests = user.friendRequests.filter(r => r !== username);

    if (action === "accepted") {
      const requester = await UserModel.findOne({ username });
      if (!requester) return res.status(404).json({ status: "error", error: "User not found" });

      user.friends.push(username);
      requester.friends.push(user.username);
      await requester.save();
    }

    await user.save();

    res.json({
      status: "success",
      message: action === "accepted" ? `You are now friends with ${username}` : `Friend request from ${username} rejected`,
      friends: user.friends,
      friendRequests: user.friendRequests,
    });
  } catch (error) {
    res.status(500).json({ status: "error", error });
  }
}

// DELETE /user/friends - Remove a friend
export async function removeFriend(req, res) {
  try {
    if (!req.authContext?.isAuthenticated()) {
      return res.status(401).json({ status: "error", error: "Not logged in" });
    }
    const { username } = req.body;
    const email = req.authContext.getAccount().username;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ status: "error", error: "User not found" });

    if (!user.friends.includes(username)) {
      return res.status(404).json({ status: "error", error: "Friend not found" });
    }

    const friend = await UserModel.findOne({ username });

    user.friends = user.friends.filter(f => f !== username);
    if (friend) {
      friend.friends = friend.friends.filter(f => f !== user.username);
      await friend.save();
    }

    await user.save();
    res.json({ status: "success", friends: user.friends });
  } catch (error) {
    res.status(500).json({ status: "error", error });
  }
}

// GET /user/trades - View all incoming and outgoing trades
export async function getTrades(req, res) {
  try {
    if (!req.authContext?.isAuthenticated()) {
      return res.status(401).json({ status: "error", error: "Not logged in" });
    }
    const email = req.authContext.getAccount().username;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ status: "error", error: "User not found" });

    const trades = await TradeModel.find({
      $or: [
        { senderUsername: user.username },
        { receiverUsername: user.username }
      ]
    });

    const incoming = trades.filter(t => t.receiverUsername === user.username);
    const outgoing = trades.filter(t => t.senderUsername === user.username);

    res.json({ status: "success", incoming, outgoing });
  } catch (error) {
    res.status(500).json({ status: "error", error });
  }
}

// POST /user/trade - send a trade request
export async function postTrades(req, res) {
  try {
    if (!req.authContext?.isAuthenticated()) {
      return res.status(401).json({ status: "error", error: "Not logged in" });
    }
    const { receiverUsername, senderCards, receiverCards } = req.body;
    const email = req.authContext.getAccount().username;
    const sender = await UserModel.findOne({ email });
    if (!sender) return res.status(404).json({ status: "error", error: "Sender not found" });

    const trade = new TradeModel({
      senderUsername: sender.username,
      receiverUsername,
      senderCards,
      receiverCards,
      status: "pending",
    });

    await trade.save();
    res.json({ status: "success", trade });
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: "error", error });
  }
}

// PATCH /user/trade/:tradeID - Accept, reject, or cancel a trade
export async function updateTrade(req, res) {
  try {
    if (!req.authContext?.isAuthenticated()) {
      return res.status(401).json({ status: "error", error: "Not logged in" });
    }
    const { status } = req.body; // "accepted", "rejected", or "cancelled"
    const email = req.authContext.getAccount().username;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ status: "error", error: "User not found" });

    const trade = await TradeModel.findById(req.params.tradeID);
    if (!trade) return res.status(404).json({ status: "error", error: "Trade not found" });

    // only the receiver can accept or reject
    if ((status === "accepted" || status === "rejected") && trade.receiverUsername !== user.username) {
      return res.status(403).json({ status: "error", error: "Only the receiver can accept or reject a trade" });
    }

    // only the sender can cancel
    if (status === "cancelled" && trade.senderUsername !== user.username) {
      return res.status(403).json({ status: "error", error: "Only the sender can cancel a trade" });
    }

    // can only update pending trades
    if (trade.status !== "pending") {
      return res.status(400).json({ status: "error", error: "Trade is no longer pending" });
    }

    // if accepted, swap the cards between inventories
    if (status === "accepted") {
      const sender = await UserModel.findOne({ username: trade.senderUsername });
      const receiver = await UserModel.findOne({ username: trade.receiverUsername });

      // remove sender's cards from sender, add to receiver
      for (const cardID of trade.senderCards) {
        const senderCardIndex = sender.inventory.findIndex(i => i.cardID === cardID);
        if (senderCardIndex === -1) return res.status(400).json({ status: "error", error: "Sender no longer has the offered cards" });
        const card = sender.inventory[senderCardIndex];

        if (card.quantity > 1) {
          sender.inventory[senderCardIndex].quantity -= 1;
        } else {
          sender.inventory.splice(senderCardIndex, 1);
        }

        const receiverHasCard = receiver.inventory.findIndex(i => i.cardID === cardID);
        if (receiverHasCard !== -1) {
          receiver.inventory[receiverHasCard].quantity += 1;
        } else {
          receiver.inventory.push({ cardID: card.cardID, name: card.name, rarity: card.rarity, quantity: 1 });
        }
      }

      // remove receiver's cards from receiver, add to sender
      for (const cardID of trade.receiverCards) {
        const receiverCardIndex = receiver.inventory.findIndex(i => i.cardID === cardID);
        if (receiverCardIndex === -1) return res.status(400).json({ status: "error", error: "Receiver no longer has the requested cards" });
        const card = receiver.inventory[receiverCardIndex];

        if (card.quantity > 1) {
          receiver.inventory[receiverCardIndex].quantity -= 1;
        } else {
          receiver.inventory.splice(receiverCardIndex, 1);
        }

        const senderHasCard = sender.inventory.findIndex(i => i.cardID === cardID);
        if (senderHasCard !== -1) {
          sender.inventory[senderHasCard].quantity += 1;
        } else {
          sender.inventory.push({ cardID: card.cardID, name: card.name, rarity: card.rarity, quantity: 1 });
        }
      }

      await sender.save();
      await receiver.save();
    }

    trade.status = status;
    await trade.save();
    res.json({ status: "success", trade });
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: "error", error });
  }
}

// DELETE /user/trade - delete a trade request
export async function deleteTrade(req, res) {
  try {
    if (!req.authContext?.isAuthenticated()) {
      return res.status(401).json({ status: "error", error: "Not logged in" });
    }
    const username = req.authContext.getAccount().username.split("@")[0];
    const trade = await TradeModel.findOneAndDelete({
                                _id: req.params.tradeID,
                                $or: [ { receiverUsername: username }, { senderUsername: username } ]
                              });
    if (!trade) return res.status(404).json({ status: "error", error: "Trade not found" });
    res.json({ status: "success", trade });
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: "error", error });
  }
}
