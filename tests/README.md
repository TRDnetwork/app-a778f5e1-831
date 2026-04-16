# KanbanFlow Test Suite

This directory contains the test suite for the KanbanFlow project management tool. The tests are written using Vitest and cover both frontend functionality and Supabase API integration.

## Test Files

### `app.test.js`
Unit tests for the frontend application logic. This file tests:

- **Authentication flow**: Sign up, sign in, and session management
- **Task management**: Filtering tasks by priority and status
- **Statistics calculation**: Completion rates, overdue tasks, and dashboard metrics
- **UI rendering**: Task card generation and XSS prevention
- **State management**: Filter application and data transformations

### `api.test.js`
Integration tests for Supabase API calls. This file tests:

- **Authentication API**: Credential validation and session handling
- **Task operations**: CRUD operations for tasks with proper error handling
- **Project operations**: Fetching user projects
- **Realtime updates**: Handling of Supabase realtime events
- **Error handling**: Network errors and authentication failures

## Running Tests

### Prerequisites
- Node.js 16 or higher
- npm or yarn

### Installation
```bash
npm install
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Configuration
The tests use the following configuration:

- **Test runner**: Vitest
- **DOM environment**: jsdom (for browser API simulation)
- **Mocking**: Supabase client is mocked to avoid actual API calls
- **Assertions**: Vitest's expect API

## Test Structure

Each test file follows this pattern:

```javascript
describe('Feature', () => {
  beforeEach(() => {
    // Setup before each test
  });

  it('should do something', () => {
    // Test assertion
  });
});
```

## Mocking Strategy

### Supabase Client
The Supabase client is mocked to:
- Prevent actual API calls during testing
- Control test scenarios (success, error, empty data)
- Verify that API methods are called with correct parameters

### DOM Environment
jsdom provides a simulated browser environment for:
- DOM manipulation testing
- Event handling
- UI rendering verification

## Writing New Tests

When adding new features to KanbanFlow, follow these guidelines:

1. **Test the happy path**: Successful operations with expected data
2. **Test error cases**: Network failures, validation errors, edge cases
3. **Test user interactions**: Click events, form submissions, drag-and-drop
4. **Test state changes**: UI updates in response to data changes
5. **Test security**: XSS prevention, input validation, authentication

## Coverage Goals

The test suite aims to cover:
- 80%+ of core application logic
- All authentication flows
- All task management operations
- All filter and search functionality
- Critical error handling paths

## Continuous Integration

These tests are designed to run in CI/CD pipelines. The test suite:
- Runs quickly (under 30 seconds)
- Has no external dependencies
- Produces clear pass/fail results
- Generates coverage reports

## Notes

- Tests are isolated and don't depend on each other
- All async operations use proper async/await patterns
- Mock data reflects the actual Supabase schema structure
- Error messages are tested for user-friendliness
- Security aspects (XSS, input validation) are explicitly tested