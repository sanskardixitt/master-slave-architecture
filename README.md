# MongoDB Replica Set & Consistency Models in Node.js

This project is a hands-on demonstration of a **master-slave database architecture** using a **MongoDB Replica Set** and a **Node.js/Express backend**.  
It provides a clear, practical example of how to implement and test two fundamental data consistency models: **Strong Consistency** and **Eventual Consistency**.

The application exposes a simple REST API to write and read data, allowing you to observe the behavior of each consistency strategy.

---



## 🧩 Core Concepts

### MongoDB Replica Set
- **Primary (Master):** Handles all write operations.  
- **Secondaries (Slaves):** Replicate data from the primary and serve read operations.  
- **Automatic Failover:** If the primary goes down, a secondary is automatically elected as the new primary.  

### Consistency Models
- **Strong Consistency**  
  - Reads always return the most recently written data.  
  - Reads and writes both happen on the primary.  
  - Example use cases: **banking transactions, user account info, inventory counts**.  

- **Eventual Consistency**  
  - Reads might return stale data during replication lag but will eventually reflect the latest updates.  
  - Reads can be served by secondaries, reducing load on the primary.  
  - Example use cases: **views, likes, social media counters, activity logs**.  

---

## ⚙️ Prerequisites
- [Node.js](https://nodejs.org/)  
- [MongoDB Community Server](https://www.mongodb.com/try/download/community)  
- [MongoDB Shell (mongosh)](https://www.mongodb.com/try/download/shell)  
- API testing tool: [Postman](https://www.postman.com/) or similar  

---

## 🛠️ Setup & Installation

### 1. Set Up MongoDB Directories
**Windows (Command Prompt):**
```sh
mkdir mongodb
mkdir mongodb\node1
mkdir mongodb\node2
mkdir mongodb\node3
```

**macOS/Linux:**
```sh
mkdir -p mongodb/node1 mongodb/node2 mongodb/node3
```

### 2. Start MongoDB Instances
Run each in a separate terminal:  
```sh
mongod --port 27017 --dbpath ./mongodb/node1 --replSet myReplicaSet
mongod --port 27018 --dbpath ./mongodb/node2 --replSet myReplicaSet
mongod --port 27019 --dbpath ./mongodb/node3 --replSet myReplicaSet
```

### 3. Initiate the Replica Set
Connect to MongoDB:
```sh
mongosh --port 27017
```
Inside the shell:
```js
config = {
    "_id": "myReplicaSet",
    "members": [
        { "_id": 0, "host": "localhost:27017" },
        { "_id": 1, "host": "localhost:27018" },
        { "_id": 2, "host": "localhost:27019" }
    ]
}
rs.initiate(config)
```

### 4. Install Application Dependencies
```sh
npm install
```

---

## 🚀 Running the Application
Start the Node.js server:
```sh
node index.js
```
Server runs at:  
👉 **http://localhost:3000**

---

## 📡 API Endpoints

### Strong Consistency Endpoints
- **POST /strong** → Create or update a user profile.  
- **GET /strong/:key** → Retrieve the most up-to-date user profile.  

✅ Always reads/writes from the **primary node**.  

### Eventual Consistency Endpoints
- **POST /eventual** → Update product likes/views.  
- **GET /eventual/:key** → Read product metrics.  

✅ Reads may come from **secondary nodes** → may show slightly stale data.  

---

## 🔄 High Availability & Failover
1. Identify which terminal is running the **PRIMARY** node.  
2. Stop it (`Ctrl + C`).  
3. Wait 10–15 seconds → a secondary will be promoted to **new primary**.  
4. Retry API requests → they will still succeed.  

This demonstrates **automatic failover & high availability**.  

---

## ⚠️ Common Errors & Fixes

### MongoDB Read Preference Error
**Error:** `secondaryPreferred is not defined`  
**Fix:** Use the correct MongoDB driver read preference string:  
```js
readPreference: "secondaryPreferred"
```

### MongoDB Unclean Shutdown Error
**Error:** `mongod.exe - Unclean shutdown detected / Initial process killed`  
**Fix:** Delete the `mongod.lock` file in the affected node’s data directory:  
```sh
rm ./mongodb/nodeX/mongod.lock
```
Restart the node.

---

## 👥 Contributors
- **sanskardixit** – Developer   

---


