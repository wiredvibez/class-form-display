# Live Session Data Storage

## Overview

This application stores its live session data using **Firebase Firestore**, a cloud-hosted NoSQL database that provides real-time synchronization capabilities.

## Technology Stack

- **Database**: Google Firebase Firestore
- **SDK**: Firebase JavaScript SDK v12.7.0
- **Connection**: Cloud-based (project: `university-projects-d331c`)

## Data Structure

The application uses a hierarchical collection structure in Firestore:

```
sessions/
  ├── {sessionId}/                    # Document for each session
  │   ├── status: string              # 'waiting' | 'active' | 'completed'
  │   ├── createdAt: Timestamp
  │   ├── startedAt: Timestamp | null
  │   ├── endedAt: Timestamp | null
  │   ├── timerDuration: number       # in seconds (default: 300)
  │   ├── maleCount: number
  │   ├── femaleCount: number
  │   │
  │   ├── participants/               # Subcollection
  │   │   └── {participantId}/        # Document for each participant
  │   │       ├── sessionId: string
  │   │       ├── joinedAt: Timestamp
  │   │       ├── assignedGender: 'male' | 'female'
  │   │       ├── hasSubmitted: boolean
  │   │       └── submittedAt: Timestamp | null
  │   │
  │   └── responses/                  # Subcollection
  │       └── {responseId}/           # Document for each evaluation response
  │           ├── participantId: string
  │           ├── sessionId: string
  │           ├── candidateGender: 'male' | 'female'
  │           ├── submittedAt: Timestamp
  │           ├── salary: number | null
  │           ├── promotionPotential: number | null (1-5)
  │           ├── authority: number | null (1-5)
  │           ├── managementFit: number | null (1-5)
  │           ├── leadership: number | null (1-5)
  │           ├── commitment: number | null (1-5)
  │           └── overallEvaluation: number | null (1-5)
```

## Key Features

### 1. Real-time Synchronization

The application uses Firestore's real-time listeners (`onSnapshot`) to automatically update the UI when data changes:

- **Session updates**: Monitors session status changes (waiting → active → completed)
- **Participant tracking**: Real-time count of joined and submitted participants
- **Response collection**: Live aggregation of evaluation responses

### 2. Session Lifecycle

Each session goes through three distinct states:

1. **Waiting** (`'waiting'`)
   - Initial state when session is created
   - Participants can join but cannot submit evaluations
   - Presenter sees participant count

2. **Active** (`'active'`)
   - Session timer starts
   - Participants can view profiles and submit evaluations
   - Real-time submission tracking

3. **Completed** (`'completed'`)
   - Timer expires or manually ended
   - No new submissions accepted (auto-submit if data exists)
   - Results can be calculated and displayed

### 3. Data Operations

#### Session Operations
- `createSession()`: Creates new session document with generated ID
- `getSession(sessionId)`: Retrieves session data
- `startSession(sessionId)`: Updates status to 'active'
- `endSession(sessionId)`: Updates status to 'completed'
- `subscribeToSession(sessionId, callback)`: Real-time listener

#### Participant Operations
- `joinSession(sessionId)`: Creates participant document, assigns gender
- `getParticipant(sessionId, participantId)`: Retrieves participant data
- `subscribeToParticipants(sessionId, callback)`: Real-time listener for all participants
- `subscribeToParticipantCount(sessionId, callback)`: Real-time count tracking

#### Response Operations
- `submitResponse(sessionId, participantId, ...)`: Stores evaluation data
- `getResponses(sessionId)`: Retrieves all responses for a session
- `subscribeToResponses(sessionId, callback)`: Real-time listener for responses

## Local State Management

In addition to Firestore, the application uses browser-side storage for session persistence:

### localStorage
- **Key**: `presenter_session`
- **Purpose**: Persists presenter's current session ID across page refreshes
- **Cleared**: When creating a new session

### URL Parameters
- **Format**: `/presenter?session={sessionId}`
- **Purpose**: Shareable session links
- **Priority**: URL params override localStorage

## Data Flow Examples

### Presenter Creating a Session
```
1. User clicks "Create New Session"
2. generateSessionId() creates random 6-char code
3. Session document created in Firestore with status='waiting'
4. SessionID stored in localStorage and URL
5. Real-time listener established
6. QR code displayed with join URL
```

### Participant Joining
```
1. Participant scans QR code → /form/{sessionId}
2. joinSession() checks session exists
3. Determines gender assignment based on counts
4. Participant document created in subcollection
5. Session maleCount or femaleCount incremented
6. Real-time listeners update presenter's participant count
```

### Submitting an Evaluation
```
1. Participant fills out form (tracked in local React state)
2. On submit: response document created in responses subcollection
3. Participant document updated: hasSubmitted=true
4. Real-time listeners update:
   - Presenter sees submission count increase
   - Results recalculated if already viewing results
```

## Configuration

Firebase connection configured in `/src/lib/firebase.ts`:
- Project ID: `university-projects-d331c`
- Authentication: Public API key (client-side only)
- Security: Should be configured via Firestore Security Rules

## Benefits of This Approach

1. **Real-time Updates**: All connected clients see changes instantly
2. **Scalability**: Cloud-hosted, handles multiple concurrent sessions
3. **Offline Support**: Firestore SDK includes offline persistence
4. **No Backend Code**: Serverless architecture reduces complexity
5. **Hierarchical Data**: Subcollections keep related data organized

## Potential Considerations

- **Security**: Ensure Firestore Security Rules are properly configured
- **Costs**: Firebase pricing based on reads/writes/storage
- **Data Retention**: Consider cleanup of old sessions
- **Privacy**: Session data persists in cloud unless explicitly deleted
