# Group 3 - Project Proposal
By: Diego Licea, Lance Santos, Josh Lee, Ryan Hoang

## Project Description

### Who is our target audience?

Our target audience are people who like to play trading card games who are interested in a new platform to do so virtually. We will be creating our own trading card site for people interested in playing these kinds of virtual trading games. We might also make this site UW themed, so potentially also UW students interested in a fun experience with cards/packed themed around the UW

### Why does our audience want to use our application?

The goal would be for the audience to use our site as a fun, low stress game that they can passively come back to. Users would be able to log in and receive a certain amount of virtual currency every day or so, which they can either save up or use to buy card packs. Hence, users can come back every day to see if new packs are available as well as how much currency they’ve earned to use to get more cards. If we choose to make the cards UW themed, this could also be a way for users to learn about things around UW in the form of trading cards. Since we want to add a trading feature, users could also use it to interact with friends and foster community over a shared interest

### Why do we as developers want to build this application?

We wanted to create a simple entertainment platform in the form of a TCG that catered to UW students.

We as devs want to build this site because of the popularity of similar TCG type games. We think that this is a format that many in our audience are familiar with, so making our own version with UW cards would be a fun, lightweight way to enhance the UW experience.

Imagine sitting in a lecture some day, and your friend nearby pulls a ultra rare Dubs II 2018 National Puppy Day Card. And then you buy the same pack and unfortunately you draw a common campus squirrel card. That’s the kind of thing that we are envisioning with this platform (at least for a fully-fledged version).

## Technical Description

### Architectural Diagram

<img width="691" height="721" alt="image1" src="https://github.com/user-attachments/assets/a73005fb-32cb-47bf-9bcd-2952dbea73b8" />

### Data Flow Diagram

<img width="1061" height="811" alt="image2" src="https://github.com/user-attachments/assets/f251967d-39a4-4248-8cda-79637be665d5" />

### User Stories

| Priority | User | Description | Technical Implementation |
| :---- | :---- | :---- | :---- |
| P0 | As a user | I want to login / sign into an account to save my cards and information | Using user authentication, users can sign up or login and is put into our Users database |
| P0 | As a user | I want to see the cards that I have in my account | A get endpoint will retrieve the cards an account has from the Users mongodb database. |
| P0 | As a user | I want to delete and favorite the cards I have in my account | A post endpoint will remove cards or add to the favorites list of an account in the Users mongodb database. |
| P0 | As a user | I want to open packs of cards | A get endpoint is used to retrieve a randomized pack of cards out of a set and is given to the user. |
| P1 | As a user | I want to request, edit or approve card trade requests to other users. | A post end point is used to send or edit trade requests in the trades mongodb database. A get endpoint is used to retrieve trade requests. |
| P3 | As a user | I want to add other users to my friends list | In the Users mongoDB, we will store their friends. |
| P4 | As a user | I want to be able to message my friends to communicate about trades | In the Users mongoDB, we will store realtime messages data. |

### Endpoints

GET /auth/signin \- Allows users to log into their account.
GET /auth/signout \- Allows users to log out of their account.
POST /auth/register \- Allows users to create a new account.


GET /user/:id \- Allows users to see their information; what cards they have, their trade requests and their favorites list.
POST /user/:id/cards \- Allows users to sell cards that they have.
POST /user/:id/favorites \- Allows users to add cards to their favorites list.
POST /user/trade \- Allows users to send or edit trade requests to another user.

GET /store/packs/ \- Allows users to see all the available packs.
GET /store/packs/:set \- Allows users see details on a specific pack.
POST /store/packs/:set \- Allows users to open a specific pack and add obtained cards to their user in the db, using their currency.

GET /cards/ \- Allows users to see cards; query filtered on set and/or cardID.

### Database Schema

* Users:
  * userID: number
  * username: String
  * email: String
  * createdAt: Date
  * Inventory:
    * cardID:number
    * Quantitynumber
  * Favories:
    * cardID:number
* Card
  * cardID: number
  * name: String
  * description: String
  * rarity: String
  * cardType: String
  * setID: number
  * setName: String
* Pack:
  * packID: ObjectId,
  * name: String
  * description: String
  * price: Number
  * setID: number
  * setName: String
* Trade
  * tradeID: number
  * senderUserId: number
  * receiverUserId: number
  * senderCards
  * receiverCards


