# Question Suggestions Feature

## Overview
This feature allows users to suggest new questions for the aviation training platform. Users can submit questions with multiple choice answers and explanations, which are then reviewed by administrators before being added to the question database.

## User Flow

### For Regular Users
1. **Access**: Users can access the question suggestion feature from the Dashboard → "Sugerencias" tab
2. **Submit**: Users fill out a form with:
   - Aircraft type (A320 Family or Boeing 737)
   - Category (specific to aircraft type)
   - Difficulty level (Básico, Intermedio, Avanzado)
   - Question text
   - 4 multiple choice options
   - Correct answer selection
   - Detailed explanation
3. **Track**: Users can view their submitted suggestions and their review status
4. **Status Updates**: Users see if their suggestions are pending, approved, rejected, or need review

### For Administrators
1. **Access**: Admins see question suggestions in the Admin Panel
2. **Review**: Admins can review suggestions with full details including:
   - User information
   - Complete question with all options
   - Suggested correct answer and explanation
3. **Actions**: Admins can:
   - Update status (pending, approved, rejected, needs review)
   - Add admin notes/feedback
   - Approve and automatically create the question in the database
4. **Statistics**: Dashboard shows counts of suggestions by status

## Database Schema

### New Table: `questionSuggestions`
```typescript
questionSuggestions: defineTable({
  userId: v.id("users"),
  question: v.string(),
  options: v.array(v.string()),
  correctAnswer: v.number(),
  explanation: v.string(),
  aircraftType: v.string(),
  category: v.string(),
  difficulty: v.string(),
  status: v.string(), // "pending", "approved", "rejected", "needs_review"
  adminNotes: v.optional(v.string()),
  reviewedBy: v.optional(v.id("users")),
  reviewedAt: v.optional(v.number()),
  createdAt: v.number(),
  updatedAt: v.number(),
})
```

## API Functions

### User Functions
- `submitQuestionSuggestion`: Submit a new question suggestion
- `getUserQuestionSuggestions`: Get user's own suggestions

### Admin Functions
- `getAllQuestionSuggestions`: Get all suggestions with filtering
- `updateQuestionSuggestionStatus`: Update suggestion status
- `approveAndCreateQuestion`: Approve suggestion and create actual question
- `getSuggestionStats`: Get statistics for admin dashboard

## Components

### User Components
- `QuestionSuggestionForm`: Form for submitting new suggestions
- `UserQuestionSuggestions`: Display user's suggestions with status

### Admin Components
- `QuestionSuggestionsAdmin`: Complete admin interface for managing suggestions

## Features

### Validation
- All fields are required
- Exactly 4 options must be provided
- Correct answer must be between 0-3
- Question and explanation cannot be empty

### Status Management
- **Pending**: Newly submitted, awaiting review
- **Approved**: Accepted and added to question database
- **Rejected**: Not suitable for inclusion
- **Needs Review**: Requires additional review or modifications

### Admin Tools
- Filter suggestions by status
- Bulk review capabilities
- One-click approve and create
- Admin notes for feedback
- User information display

## Security
- Only authenticated users can submit suggestions
- Only admins can review and manage suggestions
- User ID validation on all operations
- Admin permission checks on all admin functions

## Integration
- Seamlessly integrated into existing Dashboard tabs
- Admin panel section for suggestion management
- Uses existing UI components and styling
- Follows established patterns for Convex integration

## Future Enhancements
- Email notifications for status changes
- Bulk operations for admins
- Question suggestion templates
- Community voting on suggestions
- Integration with question analytics