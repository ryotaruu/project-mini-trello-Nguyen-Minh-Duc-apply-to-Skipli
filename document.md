

Coding Challenge #5

🚫 Important Notice About AI Tools
Do not use ChatGPT or any AI tools to complete this challenge.
If we detect AI-generated code, your submission will be rejected immediately.
 You're allowed to search documentation or forums like StackOverflow — but you must complete this challenge entirely on your own.
Introduction
Create an application that includes front-end, a back-end, and database (Firebase). Use the code editor of your choice.

Before you begin, make sure to sign up for free accounts on these services:
firebase (https://firebase.google.com) (for database), github (https://github.com) to get APIs access docs.

Please email engineering@skiplinow.com if you have any questions and provide as much details as possible.

Note: we don’t condone cheating of any kind. You are welcome to look things up on Google but you can’t have anyone else do this coding challenge for you. Our system detects if you copy and paste code. It also runs your code against our database of solutions to check for similarities. 

Front-end
Project: Real-Time Board Management Tool ( Mini Trello App )

Overview:

Develop a real-time card management tool that allows teams to collaborate on cards, track tasks, and monitor progress in real-time. The application should support multiple users, card creation, task assignment, drag-and-drop task management feature and dynamic updates across all connected users.

Idea: Create a responsive web application using React.js with real-time updates using WebSocket technology.

Card Setup:
Initialize a new React.js card using Create React App or another preferred method. (You are also welcome to set up the app using Next.js or Vite instead of Create-React-App.)
Set up card dependencies, including libraries for routing, state management, and real-time updates (e.g., WebSocket library).
Authentication:
Connect authentication components to backend API endpoints (/auth/signup, /auth/signin).

Dashboard Design:
Design a dashboard layout using a responsive grid system (e.g., CSS Grid, Bootstrap grid).
Create navigation components for accessing different sections of the application (e.g., cards, profile).
Implement dynamic rendering of user-specific content based on authentication status.

card Management:
Design and implement a card listing interface displaying all cards associated with the authenticated user.
Add options for creating new cards and displaying card details.
Integrate CRUD functionality for cards (GET, POST, PUT, DELETE) with backend API endpoints (/cards, /cards/:id).

Task Management:
Develop task management components within each card, including task lists and task detail views.
Implement functionality for creating, updating, and deleting tasks.
Integrate real-time updates for task lists using WebSocket technology to reflect changes made by other users.
Add features for task assignment, priority setting, deadline tracking, and status updates.
Use a library like React DnD (Drag and Drop for React) to handle drag-and-drop interactions.
Configure draggable and droppable areas within the card interface.
Enable users to drag tasks from one location to another, such as between task lists or within a card board ( You can create some default status card boards like icebox, backlog, on going, waiting for review, done).


List Users
Create a list users component for viewing and editing to manage account settings.
Connect profile components to backend API endpoints for updating user information (/users/:id).

Styling and UI Enhancements:
Apply consistent styling using CSS frameworks (e.g., Bootstrap, Material UI) or CSS preprocessors (e.g., Sass, Less).
Implement responsive design principles to ensure the application is usable across different devices and screen sizes.
Enhance user experience with animations, transitions, and interactive elements.

Backend:

GitHub Integration:
Enables users to sign in with GitHub OAuth, offering additional authentication options.
Provides API endpoints for initiating GitHub sign-in process and exchanging authorization codes for access tokens.

Sure, let's update the backend API routes for card and task management, as well as authentication:

Board Management API Endpoints:

1.  Create a New Board: 

   - Endpoint: `/boards`
   - Method: POST
   - Description: Creates a new board.
   - Authorization: User JWT token
   - Request Body:
      
     {
       "name": "Board Name",
       "description": "Board Description"
     }
      
   - Response:
     - Success (201 Created):
        
       {
         "id": "new_board_id",
         "name": "Board Name",
         "description": "Board Description"
       }
        

2.  Retrieve All Boards: 

   - Endpoint: `/boards`
   - Method: GET
   - Description: Retrieves all boards associated with the authenticated user.
   - Authorization: User JWT token
   - Response:
     - Success (200 OK):
        
       [
         {
           "id": "board_id_1",
           "name": "Board Name 1",
           "description": "Board Description 1"
         },
         {
           "id": "board_id_2",
           "name": "Board Name 2",
           "description": "Board Description 2"
         },
         ...
       ]
        

3.  Retrieve Board Details: 

   - Endpoint: `/boards/:id`
   - Method: GET
   - Description: Retrieves d etails of a specific board.
   - Authorization: User JWT token
   - Response:
     - Success (200 OK):
        
       {
         "id": "board_id",
         "name": "Board Name",
         "description": "Board Description"
       }
        

4.  Update Board Details: 

   - Endpoint: `/boards/:id`
   - Method: PUT
   - Description: Updates details of a specific board.
   - Authorization: User JWT token
   - Request Body:
      
     {
       "name": "New Board Name",
       "description": "New Board Description"
     }
      
   - Response:
     - Success (200 OK):
        
       {
         "id": "board_id",
         "name": "New Board Name",
         "description": "New Board Description"
       }
        

5.  Delete Board: 

   - Endpoint: `/boards/:id`
   - Method: DELETE
   - Description: Deletes a specific board.
   - Authorization: User JWT token
   - Response:
     - Success (204 No Content): No content in response body. Board successfully deleted.


I. Card Management API Endpoints:

1.   Retrieve All cards:
   -   Endpoint:   `/boards/:boardId/cards`
   -   Method:   GET
   -   Description:   Retrieves all cards associated with the authenticated user.
   -   Authorization:   User JWT token
   -   Response:  
     - Success (200 OK):
         
       [
         {
           "id": "card_id",
           "name": "card Name",
           "description": "card Description"
         },
         {
           "id": "card_id",
           "name": "card Name",
           "description": "card Description"
         }
       ]
       

2.   Create a New card:  ( Any cards about games, software, marketing… )
   -   Endpoint:   `/boards/:boardId/cards`
   -   Method:   POST
   -   Description:   Creates a new card.
   -   Authorization:   User JWT token
   -   Request Body:  
       
     {
       "name": "card Name",
       "description": "card Description",
        “createdAt: “”,
     }
     
   -   Response:  
     - Success (201 Created):
         
       {
         "id": "new_card_id",
         "name": "card Name",
         "description": "card Description"
       }
       

3.   Retrieve card Details:  
   -   Endpoint:   `/boards/:boardId/cards/:id`
   -   Method:   GET
   -   Description:   Retrieves details of a specific card.
   -   Authorization:   User JWT token
   -   Response:  
     - Success (200 OK):
         
       {
         "id": "card_id",
         "name": "card Name",
         "description": "card Description"
       }
       

4. Retrieve cards by User:

- Endpoint: `/boards/:boardId/cards/user/:user_id`
- Method: GET
- Description: Retrieves cards associated with a specific user.
- Authorization: User JWT token
- Response:  Success (200 OK):
    [
      {
        "id": "card_id_1",
        "name": "card Name 1",
        "description": "card Description 1"
        “ tasks_count: “4”,
       “list_member: [“member_id”, …],
        “createdAt: “”,
      },
      {
        "id": "card_id_2",
        "name": "card Name 2",
        "description": "card Description 2",
        “tasks_count”: “2”,
        “list_member: [“member_id”, …]
       “createdAt: “”,
      },
      ...
    ]
   
 

4.   Update card Details:  
   -   Endpoint:   `/boards/:boardId/cards/:id`
   -   Method:   PUT
   -   Description:   Updates details of a specific card.
   -   Authorization:   User JWT token
   -   Request Body:  
       
     {
       "name": "Updated card Name",
       "description": "Updated card Description"
       “params”: ”extra fields needed”
     }
     
   -   Response:  
     - Success (200 OK):
         
       {
         "id": "card_id",
         "name": "Updated card Name",
         "description": "Updated card Description"
       }
       
4. Invite people to a board:

 -   Endpoint:   `/boards/:boardId/invite`
 -   Method:   POST
 - Description: Invite members to a board. The status will have 3 status pending, accepted, declined, you can use socket io or sending email to notify member received invitation. 
   -   Authorization:   User JWT token
   -   Request Body:  
       
     {
       “invite_id: “id of invitation”
       “board_owner_id”: “Id of card owner”
       “member _id”: “Id of member”,
       “email_member”:  “Email of member” (optional)
       “status”: “pending”
     }
     
   -   Response:  
     - Success (200 OK):
       {
         {success: true}
       }

Endpoint: /boards/:boardId/cards/:id/invite/accept
Method: POST
Description: Accept a card invitation.
Authorization: User JWT token
Request Body:

{
 "invite_id": "id of invitation",
 "card_id": "Id of card",
 "member_id": "Id of accepting member",
 "status": "accepted" or “declined
}

5.   Delete a card:  
   -   Endpoint:   `/boards/:boardId/cards/:id`
   -   Method:   DELETE
   -   Description:   Deletes a specific card.
   -   Authorization:   User JWT token
   -   Response:  
     - Success (204 No Content)

Task Management API Endpoints:  

1.   Retrieve All Tasks of a card:  
   -   Endpoint:   `/boards/:boardId/cards/:id/tasks`
   -   Method:   GET
   -   Description:   Retrieves all tasks associated with a specific card.
   -   Authorization:   User JWT token
   -   Response:  
     - Success (200 OK):
       [
         {
           "id": "task_id",
           "cardId": "card_id",
           "title": "Task Title",
           "description": "Task Description",
           "status": "Task Status"
         },
         {
           "id": "task_id",
           "cardId": "card_id",
           "title": "Task Title",
           "description": "Task Description",
           "status": "Task Status"
         }
       ]
       

2.   Create a New Task within a card:  
   -   Endpoint:   `/boards/:boardId/cards/:id/tasks`
   -   Method:   POST
   -   Description:   Creates a new task within a card.
   -   Authorization:   User JWT token
   -   Request Body:  
       
     {
       "title": "Task Title",
       "description": "Task Description",
       "status": "Task Status"
     }
     
   -   Response:  
     - Success (201 Created):
         
       {
         "id": "new_task_id",
         "cardId": "card_id",
         “ownerId”: “id of user”
         "title": "Task Title",
         "description": "Task Description",
         "status": "Task Status"
       }
       

3.   Retrieve Task Details within a card:  
   -   Endpoint:   `/boards/:boardId/cards/:id/tasks/:taskId`
   -   Method:   GET
   -   Description:   Retrieves details of a specific task within a card.
   -   Authorization:   User JWT token
   -   Response:  
     - Success (200 OK):
         
       {
         "id": "task_id",
         "cardId": "card_id",
         "title": "Task Title",
         "description": "Task Description",
         "status": "Task Status"
       }
       

4.   Update Task Details within a card:  
   -   Endpoint:   `/boards/:boardId/cards/:id/tasks/:taskId`
   -   Method:   PUT
   -   Description:   Updates details of a specific task within a card.
   -   Authorization:   User JWT token
   -   Request Body:  
       
     {
       “id”: “task_id”
       “card_owner_id”: “card_owner_id”,
       “card_id”:”current_card_id”,
     }
     
   -   Response:  
     - Success (200 OK):
         
       {
         "id": "task_id",
         "cardId": “card_id",
       }
       

5.   Delete a Task within a card:  
   -   Endpoint:   `/boards/:boardId/cards/:id/tasks/:taskId`
   -   Method:   DELETE
   -   Description:   Deletes a specific task within a card.
   -   Authorization:  User JWT token
   -   Response:  Success (204 No Content)

6. Assign Member to a Task:
   - Endpoint: `/boards/:boardId/cards/:id/tasks/:taskId/assign`
   - Method: POST
   - Description: Assign a member to a specific task within a card.
   - Authorization: User JWT token
   - Request Body:
     
     {
       "memberId": "member_id"
     }
     
   - Response:
     - Success (201 Created):
       
       {
         "taskId": "task_id",
         "memberId": "member_id"
       }
       

7. Retrieve Assigned Members of a Task:
   - Endpoint: `/boards/:boardId/cards/:id/tasks/:taskId/assign`
   - Method: GET
   - Description: Retrieve all members assigned to a specific task within a card.
   - Authorization: User JWT token
   - Response: Success (200 OK):
       [
         {
           "taskId": "task_id",
           "memberId": "member_id"
         },
         {
           "taskId": "task_id",
           "memberId": "member_id"
         }
       ]
       

8. Remove Member Assignment from a Task:
   - Endpoint: `/boards/:boardId/cards/:id/tasks/:taskId/assign/:memberId`
   - Method: DELETE
   - Description: Remove a member assignment from a specific task within a card.
   - Authorization: User JWT token
   - Response:
     - Success (204 No Content)



9. Display All GitHub Information for a Repository:
- Endpoint: `/repositories/:repositoryId/github-info`
- Method: GET
- Description: Retrieve all GitHub information (branches, pull requests, issues, commits) related to a specific repository.
- Authorization: User JWT token
- Response:
  - Success (200 OK):
    {
      "repositoryId": "repository_id",
      "branches": [
        {
          "name": "branch_name",
          "lastCommitSha": "last_commit_sha"
        },
        {
          "name": "branch_name",
          "lastCommitSha": "last_commit_sha"
        }
      ],
      "pulls": [
        {
          "title": "pull_request_title",
          "pullNumber": "pull_request_number"
        },
        {
          "title": "pull_request_title",
          "pullNumber": "pull_request_number"
        }
      ],
      "issues": [
        {
          "title": "issue_title",
          "issueNumber": "issue_number"
        },
        {
          "title": "issue_title",
          "issueNumber": "issue_number"
        }
      ],
      "commits": [
        {
          "sha": "commit_sha",
          "message": "commit_message"
        },
        {
          "sha": "commit_sha",
          "message": "commit_message"
        }
      ]
    }
10. Attach GitHub Pull Request, Commit, or Issue to a Task:
- Endpoint: `/boards/:boardId/cards/:cardId/tasks/:taskId/github-attach`
- Method: POST
- Description: Attach a GitHub pull request, commit, or issue to a specific task within a card.
- Authorization: User JWT token
- Request Body:
  {
    "type": "pull_request",
    "number": "pull_request_number"
  }
  
  Possible values for `"type"`: `"pull_request"`, `"commit"`, `"issue"`
- Response: Success (201 Created):  
    {
      "taskId": "task_id",
      "attachmentId": "attachment_id",
      "type": "pull_request",
      "number": "pull_request_number"
    }
    

 11.Retrieve Attached GitHub Attachments of a Task:
- Endpoint: `/boards/:boardId/cards/:cardId/tasks/:taskId/github-attachments`
- Method: GET
- Description: Retrieve all GitHub attachments (pull requests, commits, issues) attached to a specific task within a card.
- Authorization: User JWT token
- Response:
  - Success (200 OK):
    
    [
      {
        "attachmentId": "attachment_id",
        "type": "pull_request",
        "number": "pull_request_number"
      },
      {
        "attachmentId": "attachment_id",
        "type": "commit",
        "sha": "commit_sha"
      },
      {
        "attachmentId": "attachment_id",
        "type": "issue",
        "number": "issue_number"
      }
    ]
    

12. Remove GitHub Attachment from a Task:
-Endpoint: `/boards/:boardId/cards/:cardId/tasks/:taskId/github-attachments/:attachmentId`
- Method: DELETE
- Description: Remove a GitHub attachment (pull request, commit, issue) attached to a specific task within a card.
- Authorization: User JWT token
- Response: Success (204 No Content)

With this endpoint, when a user clicks on a repository, your system can fetch all relevant information (branches, pull requests, issues, commits) from GitHub and display it accordingly. This provides a comprehensive overview of the repository's activity and status, helping users stay informed about its development.

To implement authentication without using passwords and instead sending a code to the user's email for verification, you can modify the authentication API endpoints as follows:

Authentication API Endpoints:

1. User Signup:
   - Endpoint: `/auth/signup`
   - Method: POST
   - Description: Creates a new user account.
   - Request Body:
     
     {
       "email": "user@example.com",
       “verificationCode”: “code_compare_to_code_from_email”
     }
     
   - Response:
     - Success (201 Created):
       {
         "id": "user_id",
         "email": "user@example.com"
       }
       
2. User Sign In (with Email Verification):
   - Endpoint: `/auth/signin`
   - Method: POST
   - Description: Authenticates existing users by sending a verification code to the user's email and comparing it to code in db .
   - Request Body:
     
     {
       "email": "user@example.com",
       "verificationCode": "code_received_via_email"
     }
     
   - Response:
     - Success (200 OK):
       
       {
         "accessToken": "jwt_access_token"
       }
     
     - Error (401 Unauthorized):
   
       {
         "error": "Invalid email or verification code"
       }
       

For the signup process, the user provides their email address, and then you can send a verification code to that email for account creation.

For the signin process, the user provides their email and the verification code received via email which is matched with verification code in DB. Upon successful verification, the user is issued a JWT access token for authentication.

You can use nodemailer in your backend to send emails containing the verification codes. Once the user enters the correct code, you can authenticate them and issue an access token.

       

References
Github docs: https://docs.github.com/en/rest/quickstart?apiVersion=2022-11-28
Get Github token here: https://github.com/settings/apps
Trello: https://trello.com/
Review demo template: https://www.figma.com/file/KIB4yLY4Q2YIIl3VgNFll8/Coding-Challenge-5?type=design&t=2wdZ8Xwmklb9uWtX-6
Submission

Please send a public link to the Github repo to these two emails after you publish your code:
engineering@skiplinow.com
hongnguyen.skipli.engineering@gmail.com

You must include these items in the repo :
README file explaining how the project is structured and how to run it.
Screenshots of your application




