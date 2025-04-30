# 📬 Using Postman to Test Socket.IO Chat API

## ✅ Step 1: Connect to the Server

In Postman, create a new **Socket.IO request** and connect to:

```
http://localhost:3000
```

This is required for **Socket.IO protocol** — not raw WebSocket.

---

## ✅ Step 2: Test Features via Socket.IO Events

---

### 🟩 1. Send a New Message

- **Event name:** `message`
- **Message body:**
```json
{
  "sender": "PostmanUser",
  "message": "Hello from Postman!",
  "replyTo": null
}
```

> Set `"replyTo"` to `null` or omit it if not replying.

---

### 🟦 2. Reply to an Existing Message

- **Event name:** `message`
- **Message body:**
```json
{
  "sender": "PostmanUser",
  "message": "This is a reply",
  "replyTo": "MESSAGE_ID_HERE"
}
```

🔍 Get `MESSAGE_ID_HERE` from:
- Previous `messageHistory` response
- Prisma Studio (`npx prisma studio`)

---

### 🟨 3. React to a Message (Emoji Reaction)

- **Event name:** `react`
- **Message body:**
```json
{
  "messageId": "MESSAGE_ID_HERE",
  "emoji": "👍",
  "userId": "PostmanUser"
}
```

📝 This updates the reactions JSON field in your database.

---

### 🟪 4. Load Message History

- **Event name:** `loadHistory`
- **Message body:**  
```json
null
```

Postman will trigger a server response with all stored messages.

---

## 👂 Step 3: Listen to Server Events (Events Tab)

In Postman, go to the **"Events" tab** and listen for:

| Event Name        | Description                        |
|-------------------|------------------------------------|
| `message`         | New messages from other clients    |
| `reactionUpdate`  | Updated message with new reactions |
| `messageHistory`  | Full message list on connect       |
