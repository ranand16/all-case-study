Allica bank case study

## Steps to start project locally:

- `npm i`
- `npm start`

## Frontend Architecture Overview

The frontend will is built using React with TypeScript. The application will consist of three main views: Star wars Character List, Star wars Character Details, My Favorite Characters and Not found page.

## Key Components

### Character List View

- Fetch characters from SWAPI API
- Implement pagination
- Provide search functionality
- Render character cards with name, gender, and home planet

### Character Details View

- Fetch detailed character data from SWAPI API
- Display character information (name, hair color, eye color, gender, home planet)
- List films and starships associated with the character
- Allow adding/removing characters from favorites list

### Favorites View

- Store favorites in localStorage
- Display list of favorited characters
- Allow removing characters from favorites

### Technologies and Libraries

- React: For building the UI components
- TypeScript: For type safety
- React Router: For navigation between views
- React-query: For making HTTP requests to SWAPI API
- Chakra UI: For web components
- Jest and React testing library: For unit testing

### Responsive Design

- Used Chakra UI for components and their responsivness

### State management

- Used zustand for now

### Accessibility:

- aria-live for Dynamic Updates:
  Notify screen readers when the list changes or when homeworld data is loading.

- Descriptive Labels and Roles:
  Add aria-label and aria-labelledby attributes to interactive elements and headings.

- Keyboard Navigation:
  Ensure buttons and links are properly accessible by aria-label

- Semantic HTML:
  Appropriate HTML elements like <main> - for the main content and <section> - for grouping.

- Error Messaging:
  role="alert" - for error messages.

- Semantic Grouping:
  The<section> with aria-labelledby to group under headings.

- Announcements for Empty States:
  aria-live="polite" - empty states for films and starships to notify users dynamically.

## Language support

- Added strings to a json file so that it can be salvaged by language plugins later.

### Performance Optimization

- I used lazy loading for components.
- I used react hooks like useMemo and useCallback for memoization
- Optimize API calls in favorite component for multiple characters with same home world.

## Improvments that can be made

- Data hydration of home world can be done later on homepage
- Data fetching can be stopped on any page when I am monkey hoppnig over pages

## Features that can be added

- Add frontend/server based user authentication.
- After authentication is implemented we can plan to shift data store from zustand to redux.
- Right now we persist favourites data in localStorage, we can shift it to server.
- Added `colorScheme` in each page to apply color schemes like blue red, yellow...
