# Chat Summaries Feature

This feature allows users to store and manage daily chat summaries as JSON files with a beautiful UI and animations.

## Features

### 🎨 Modern UI with Animations
- **Framer Motion** animations for smooth transitions
- **Responsive design** that works on all devices
- **Beautiful gradient backgrounds** and modern styling
- **Interactive elements** with hover effects and micro-animations

### 📝 Chat Summary Management
- **Create new summaries** with a modal dialog
- **Edit existing summaries** with real-time updates
- **Delete summaries** with confirmation
- **Search and filter** summaries by content and tags
- **Export summaries** as JSON files for backup

### 💾 Data Persistence
- **Dual storage**: Both localStorage and API persistence
- **Automatic backup**: Data is saved locally even if API fails
- **JSON file storage**: Summaries are stored as individual JSON files
- **API endpoints**: RESTful API for server-side storage

### 🤖 Smart Integration
- **ChatRoom integration**: Automatic summary generation from chat messages
- **Topic extraction**: Automatically detects and tags relevant topics
- **Message counting**: Tracks conversation statistics
- **Participant tracking**: Records who was involved in conversations

## File Structure

```
packages/nextjs/
├── app/
│   ├── chat-summaries/
│   │   ├── page.tsx          # Main chat summaries page
│   │   └── layout.tsx        # Layout for chat summaries
│   └── api/
│       └── chat-summaries/
│           └── route.ts       # API endpoints for CRUD operations
├── components/
│   ├── ChatSummaryGenerator.tsx  # Component for generating summaries
│   └── ChatRoom.tsx             # Updated with summary integration
├── hooks/
│   └── useChatSummaries.ts      # Custom hook for summary management
└── data/
    └── chat-summaries/          # JSON files storage directory
```

## Usage

### Accessing the Chat Summaries Page
1. Navigate to `/chat-summaries` in your browser
2. Or click the "Chat Summaries" button in the header navigation

### Creating a Summary
1. Click the "New Summary" button
2. Fill in the summary details:
   - **Summary**: Main content of the chat summary
   - **Message Count**: Number of messages in the conversation
   - **Date**: Date of the conversation
   - **Participants**: Comma-separated list of participants
   - **Tags**: Comma-separated list of relevant tags

### Automatic Summary Generation
1. Use the chat room on the main page
2. After 3+ messages, a "Generate Summary" button appears
3. Click to automatically create a summary with:
   - Extracted topics from the conversation
   - Message count and participant information
   - Automatic tagging based on content

### Managing Summaries
- **Search**: Use the search bar to find specific summaries
- **Filter**: Use the tag filter to show summaries by category
- **Edit**: Click on any summary to edit its details
- **Export**: Click the download button to export as JSON
- **Delete**: Click the trash button to remove summaries

## API Endpoints

### GET /api/chat-summaries
Returns all chat summaries as JSON array.

### POST /api/chat-summaries
Creates a new chat summary.
**Body**: ChatSummary object

### DELETE /api/chat-summaries?id={id}
Deletes a chat summary by ID.

## Data Structure

```typescript
interface ChatSummary {
  id: string;           // Unique identifier
  date: string;         // Date in YYYY-MM-DD format
  summary: string;      // Main summary content
  messageCount: number; // Number of messages
  participants: string[]; // Array of participant names
  tags: string[];       // Array of relevant tags
  createdAt: string;    // ISO timestamp
}
```

## Dependencies

- **framer-motion**: For animations and transitions
- **@heroicons/react**: For beautiful icons
- **Next.js**: For the web framework and API routes
- **TypeScript**: For type safety

## Installation

The required dependencies are already included in the project. If you need to install them manually:

```bash
cd packages/nextjs
yarn add framer-motion
```

## Development

### Adding New Features
1. Update the `ChatSummary` interface in `useChatSummaries.ts`
2. Modify the UI components in `page.tsx`
3. Update the API endpoints in `route.ts` if needed
4. Test with the chat room integration

### Customizing Animations
The animations use Framer Motion. You can customize them by modifying the `motion` components in the UI files.

### Styling
The UI uses Tailwind CSS classes. You can customize the appearance by modifying the className attributes.

## Troubleshooting

### Data Not Loading
- Check if the API endpoint is accessible
- Verify localStorage is available in the browser
- Check the browser console for errors

### Animations Not Working
- Ensure framer-motion is properly installed
- Check for any JavaScript errors in the console
- Verify the component is properly wrapped in motion components

### Export Not Working
- Check if the browser supports Blob and URL.createObjectURL
- Verify the summary object is properly structured
- Check for any JavaScript errors in the console 