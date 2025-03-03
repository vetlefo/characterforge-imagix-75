# Remaining Microtasks for Lovable

This document outlines the remaining work to be done, broken down into smaller, focused tasks for Lovable.

## Uncommitted Files and Changes

### Intent Translator Service
- `src/services/intentTranslator.ts` - Implement the Intent Translator service
- `src/pages/IntentTranslatorDemo.tsx` - Create a demo page for the Intent Translator

### Testing Infrastructure
- `vitest.config.ts` - Set up Vitest configuration
- `src/test/` - Implement testing utilities and test files

### Core Files Updates
- Update `src/components/creative/CommandParser/CommandParser.tsx` to integrate with intent classification
- Update `src/components/creative/CommandParser/types.ts` with new intent-related types
- Update `src/components/creative/CreativeContext.tsx` to work with the graph database
- Update `src/components/creative/types.ts` with new graph-related types

### Package Updates
- Update `package.json` and `package-lock.json` with new dependencies

## Microtask Breakdown

### Microtask 1: Intent Translator Service
**Description**: Create an intent translation service that converts natural language to structured intents.

**Files to Create/Modify**:
- `src/services/intentTranslator.ts` - Implement translation strategies
- `src/pages/IntentTranslatorDemo.tsx` - Create interactive demo page

**Requirements**:
- Implement multiple translation strategies (pattern matching, context analysis)
- Add confidence scoring for translated intents
- Create an interactive demo that showcases the translation process
- Connect with the graph database for context-aware translation

### Microtask 2: Testing Infrastructure
**Description**: Set up a comprehensive testing framework for the project.

**Files to Create/Modify**:
- `vitest.config.ts` - Configure Vitest
- `src/test/setup.ts` - Set up testing environment
- `src/test/test-utils.tsx` - Create testing utilities
- Implementation of unit and integration tests

**Requirements**:
- Configure Vitest with React Testing Library
- Create helper functions for common testing tasks
- Implement unit tests for key services and components
- Create integration tests for the command processing pipeline

### Microtask 3: Update CommandParser Integration
**Description**: Update the CommandParser to integrate with the new intent classification system.

**Files to Create/Modify**:
- `src/components/creative/CommandParser/CommandParser.tsx`
- `src/components/creative/CommandParser/commandParserUtils.ts`
- `src/components/creative/CommandParser/index.ts`
- `src/components/creative/CommandParser/types.ts`

**Requirements**:
- Update the CommandParser to use intent classification
- Add support for confidence scoring
- Implement parameter extraction from commands
- Update types to support new features

### Microtask 4: Update CreativeContext with Graph DB
**Description**: Enhance the CreativeContext to use the graph database for managing relationships.

**Files to Create/Modify**:
- `src/components/creative/CreativeContext.tsx`
- `src/components/creative/types.ts`

**Requirements**:
- Integrate the graph database service
- Add methods for managing relationships between creative elements
- Implement conversationHistory tracking
- Update types to support new graph-related features

### Microtask 5: Add Application Routes and Navigation
**Description**: Update the application routing to include the new pages and components.

**Files to Create/Modify**:
- `src/App.tsx`
- `src/components/Sidebar.tsx`

**Requirements**:
- Add routes for new demo pages (GraphIntegrationDemo, IntentTranslatorDemo, etc.)
- Update the sidebar navigation to include new pages
- Ensure proper navigation between pages

## How to Assign Microtasks

For each microtask, follow these steps:

1. Create a branch for the specific task: `git checkout -b feature/microtask-name`
2. Provide Lovable with a clear description of the task
3. Specify which files to modify and what changes to make
4. Include any relevant information from documentation
5. Set clear acceptance criteria for the task

Example prompt for Microtask 1:
```
Implement Microtask 1: Intent Translator Service.

Create a service that translates natural language inputs into structured creative intents:

1. Create src/services/intentTranslator.ts with:
   - Multiple translation strategies (pattern matching, context analysis)
   - Confidence scoring for each translation
   - Integration with the graph database for context-aware translation

2. Create src/pages/IntentTranslatorDemo.tsx that:
   - Allows entering text inputs
   - Shows the translated intent with confidence score
   - Displays alternative interpretations
   - Demonstrates how context affects translation

Refer to IMPLEMENTATION_TRACKING.md for detailed requirements and expectations.
```