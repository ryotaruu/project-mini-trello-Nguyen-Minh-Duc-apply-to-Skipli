# Database Design for Mini Trello Application

## Overview
This document outlines the database schema design for the Mini Trello application using Firebase. The design includes collections for users, boards, cards, tasks, and related entities.

## Collections Structure

### 1. Users Collection
```javascript
{
  id: string,                    // Firebase Auth UID
  email: string,                 // User's email
  displayName: string,           // User's display name
  photoURL: string,              // Profile picture URL
  createdAt: timestamp,          // Account creation date
  lastLoginAt: timestamp,        // Last login timestamp
  githubId: string,              // GitHub OAuth ID (optional)
  githubToken: string            // GitHub access token (optional)
}
```

### 2. Boards Collection
```javascript
{
  id: string,                    // Board ID
  name: string,                  // Board name
  description: string,           // Board description
  ownerId: string,               // Reference to Users collection
  createdAt: timestamp,          // Creation date
  updatedAt: timestamp,          // Last update date
  members: [                     // Array of board members
    {
      userId: string,            // Reference to Users collection
      role: string,              // 'owner' | 'member'
      joinedAt: timestamp,       // When user joined the board
      status: string,            // 'pending' | 'accepted' | 'declined'
      invitedAt: timestamp,      // When user was invited
      invitedBy: string          // Reference to Users collection (who sent invite)
    }
  ],
  status: string                 // 'active' | 'archived'
}
```

### 3. Board Invitations Collection
```javascript
{
  id: string,                    // Invitation ID
  boardId: string,               // Reference to Boards collection
  inviterId: string,             // Reference to Users collection (who sent invite)
  inviteeEmail: string,          // Email of invited user
  status: string,                // 'pending' | 'accepted' | 'declined'
  createdAt: timestamp,          // When invitation was sent
  updatedAt: timestamp,          // Last status update
  expiresAt: timestamp           // Invitation expiration date
}
```

### 4. Cards Collection
```javascript
{
  id: string,                    // Card ID
  boardId: string,               // Reference to Boards collection
  name: string,                  // Card name
  description: string,           // Card description
  status: string,                // 'icebox' | 'backlog' | 'ongoing' | 'review' | 'done'
  position: number,              // Position in the board
  createdAt: timestamp,          // Creation date
  updatedAt: timestamp,          // Last update date
  createdBy: string,             // Reference to Users collection
  members: [                     // Array of card members
    {
      userId: string,            // Reference to Users collection
      joinedAt: timestamp        // When user joined the card
    }
  ],
  labels: [                      // Array of labels
    {
      id: string,
      name: string,
      color: string
    }
  ]
}
```

### 5. Tasks Collection
```javascript
{
  id: string,                    // Task ID
  cardId: string,                // Reference to Cards collection
  title: string,                 // Task title
  description: string,           // Task description
  status: string,                // Task status
  position: number,              // Position in the card
  createdAt: timestamp,          // Creation date
  updatedAt: timestamp,          // Last update date
  createdBy: string,             // Reference to Users collection
  assignedTo: [                  // Array of assigned users
    {
      userId: string,            // Reference to Users collection
      assignedAt: timestamp      // When task was assigned
    }
  ],
  dueDate: timestamp,            // Task due date
  priority: string,              // 'low' | 'medium' | 'high'
  attachments: [                 // Array of attachments
    {
      type: string,              // 'file' | 'link' | 'github'
      url: string,               // Attachment URL or reference
      name: string,              // Attachment name
      addedAt: timestamp         // When attachment was added
    }
  ]
}
```

### 6. GitHub Attachments Collection
```javascript
{
  id: string,                    // Attachment ID
  taskId: string,                // Reference to Tasks collection
  type: string,                  // 'pull_request' | 'commit' | 'issue'
  number: string,                // PR/Issue number or commit SHA
  repositoryId: string,          // GitHub repository ID
  title: string,                 // PR/Issue title or commit message
  url: string,                   // GitHub URL
  createdAt: timestamp,          // When attachment was added
  updatedAt: timestamp           // Last update date
}
```

## Indexes
The following indexes should be created for optimal query performance:

1. Boards Collection:
   - ownerId
   - members.userId

2. Cards Collection:
   - boardId
   - status
   - createdBy
   - members.userId

3. Tasks Collection:
   - cardId
   - assignedTo.userId
   - status
   - dueDate

4. Board Invitations Collection:
   - boardId
   - inviteeEmail
   - status

## Security Rules
Firebase Security Rules should be implemented to ensure:
1. Only authenticated users can read/write data
2. Users can only access boards they are members of
3. Only board owners can delete boards
4. Only task assignees can update task status
5. GitHub attachments are only accessible to board members

## Real-time Updates
Firebase Realtime Database or Firestore's real-time listeners should be used for:
1. Board member presence
2. Card status changes
3. Task updates
4. New comments/attachments
5. Member invitations and responses 