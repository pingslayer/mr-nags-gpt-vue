# Mr. Nags AI Chat - API Documentation 📚

This document provides a verbose description of the API endpoints for the Mr. Nags AI Chat application. This backend is built with **Laravel 13** and the official **Laravel AI SDK**.

---

## 🔐 Authentication APIs

All authenticated requests must include the `Authorization: Bearer <token>` header and `Accept: application/json`.

### 1. User Registration
`POST /api/register`

Creates a new user account and returns an access token.

- **Request Body**:
  - `name` (required|string): The user's full name.
  - `email` (required|string|email): Unique email address.
  - `password` (required|string|min:8): Account password.
  - `password_confirmation` (required|string): Must match the password.

- **Success Response (201 Created)**:
  ```json
  {
    "user": { "id": 1, "name": "John Doe", "email": "john@example.com", ... },
    "token": "1|AbCdeFgHiJk..."
  }
  ```

### 2. User Login
`POST /api/login`

Authenticates a user and returns a Sanctum access token.

- **Request Body**:
  - `email` (required|string|email): Registered email.
  - `password` (required|string): Account password.

- **Success Response (200 OK)**:
  ```json
  {
    "user": { ... },
    "token": "2|XyZ123..."
  }
  ```

### 3. User Logout
`POST /api/logout` (Authenticated)

Revokes the current access token.

- **Success Response (200 OK)**:
  ```json
  { "message": "Logged out successfully" }
  ```

---

## 🤖 AI Chat APIs

### 4. Send Message / Continue Chat
`POST /api/chat` (Authenticated)

This is the primary endpoint for interacting with the **NagsAgent**. It supports both new conversations and ongoing threads with memory.

- **Request Body**:
  - `message` (required|string|max:1000): The text prompt for Mr. Nags.
  - `conversation_id` (optional|string|exists:agent_conversations,id): The UUID of an existing conversation. If omitted, a new conversation is started.
  - `chaos_level` (optional|integer|0-100): Influence the randomness/wittiness of the response.

- **Verbose Description**:
  The backend uses the official Laravel AI SDK `Agent` pattern. When a message is sent, the system automatically:
  1. Retrieves the `conversation_id` (if provided) and loads the last 10-20 messages for context.
  2. Performs a **Similarity Search (RAG)** over the entire history to recall relevant facts.
  3. Applies the "Mr. Nags" personality instructions and safety defenses.
  4. Persists the new turn into the `agent_conversation_messages` table.

- **Success Response (200 OK)**:
  ```json
  {
    "conversation_id": "550e8400-e29b-41d4-a716-446655440000",
    "message": "Arrey, why you are asking so many questions? I am busy eating dosa, tell me quickly what you want!",
    "role": "assistant",
    "status": "success"
  }
  ```

---

## 📁 Conversation Management APIs

### 5. List Conversations
`GET /api/conversations` (Authenticated)

Returns a list of all chat threads for the authenticated user, ordered by the most recent activity.

- **Success Response (200 OK)**:
  ```json
  {
    "data": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "user_id": 1,
        "title": "Discussion about Dosa...",
        "updated_at": "2026-04-06T12:00:00Z"
      }
    ]
  }
  ```

### 6. View Conversation History
`GET /api/conversations/{id}` (Authenticated)

Retrieves a specific conversation including its full chronological message history.

- **Success Response (200 OK)**:
  ```json
  {
    "data": {
      "id": "...",
      "title": "...",
      "messages": [
        { "id": "...", "role": "user", "content": "Hello!" },
        { "id": "...", "role": "assistant", "content": "What do you want?" }
      ]
    }
  }
  ```

### 7. Delete Conversation
`DELETE /api/conversations/{id}` (Authenticated)

Deletes the conversation and all associated messages from the database.

- **Success Response (200 OK)**:
  ```json
  { "message": "Conversation deleted successfully" }
  ```

---

## 🔍 Implementation Details
- **Memory**: Provided by the `RemembersConversations` trait.
- **RAG**: Powered by `pgvector` on the `embedding` column of the `agent_conversation_messages` table.
- **Security**: Sanctum token authentication is required for all stateful AI operations.
