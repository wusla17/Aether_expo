# Aether - Personal Productivity App

Welcome to **Aether**, a React Native application designed to enhance your personal productivity through note-taking and task management. Built with Expo, Aether leverages modern tools and libraries to provide a seamless, cross-platform experience on Android, iOS, and web.

## Overview

Aether is currently in active development, with a focus on stability and a consistent user experience. The recent updates have significantly improved the app's foundation, making it more robust for future enhancements.

### Current Status & Features

- **Robust Data Persistence**: Migrated from `AsyncStorage` to `expo-sqlite` for more reliable and structured data storage for notes and tasks.
- **Enhanced UI with React Native Paper**: The user interface has been refactored to utilize `react-native-paper` components, providing a consistent and modern Material Design look and feel.
- **Note-Taking**: Create, edit, and organize notes with a simple interface. Notes are accessible through a dedicated section, allowing for quick capture of ideas or information.
- **Task Management**: Add and manage tasks with a todo list feature. Users can create new tasks and track their completion status.
- **Tab Navigation**: Utilizes Expo Router for file-based routing with a tabbed interface, providing easy access to Home, Search, Todo, and Notifications sections, with a custom tab bar for improved aesthetics.

### Technical Stack

- **React Native & Expo**: Built with Expo SDK for rapid development and deployment across multiple platforms.
- **TypeScript**: Ensures type safety and better code maintainability.
- **Expo SQLite**: For local database management, providing a robust solution for data persistence.
- **React Native Paper**: For UI components, adhering to Material Design guidelines.
- **Expo Router**: For navigation and routing, utilizing file-based routing for a structured app layout.
- **Reanimated**: For smooth animations, integrated via `react-native-reanimated`.

### Project Structure

- **app/**: Contains the main application routes and screens, organized with Expo Router. Key directories include `(tabs)` for tab navigation and specific feature folders like `note` and `todo`.
- **components/**: Reusable UI components such as `ThemedView`, `ParallaxScrollView`, and `Collapsible`, including the new `CustomTabBar`.
- **hooks/**: Custom hooks for managing themes and color schemes.
- **constants/**: Static data like colors and types used throughout the app.
- **assets/**: Static resources including fonts and images.
- **utils/**: Utility functions, including the new `database.ts` for `expo-sqlite` operations.

## Get Started

To run Aether locally and contribute to its development, follow these steps:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Development Server**:
   ```bash
   npx expo start
   ```
   Options to open the app in a development build, Android emulator, iOS simulator, or Expo Go will be available in the terminal output.

3. **Explore the App**:
   Navigate through the tabs to access Home, Search, Todo, and Notifications features. Test note creation and task management functionalities.

## Future Goals

Aether aims to evolve into a full-fledged productivity suite with the following planned enhancements:

- **Enhanced Note Features**: Support for rich text formatting, tagging, and categorization of notes.
- **Advanced Task Management**: Recurring tasks, reminders, and integration with calendar apps.
- **Sync & Backup**: Cloud synchronization to access data across devices, with options for backup and restore.
- **Customization**: Themes and UI personalization options for users to tailor the app to their preferences.
- **Collaboration**: Features to share notes and tasks with others for collaborative work.
- **Performance Optimization**: Continued improvements in app speed and responsiveness, especially for large datasets.

## Development Challenges & Solutions

- **Database Migration**: Successfully migrated from `AsyncStorage` to `expo-sqlite` to ensure data integrity and scalability, resolving initial startup issues.
- **UI Consistency**: Transitioned from NativeWind/Tailwind CSS to `react-native-paper` for a more cohesive and maintainable UI, addressing previous styling inconsistencies.
- **Navigation**: Leveraging Expo Router for a scalable navigation structure, ensuring new features can be added seamlessly.

## Contributing

We welcome contributions to Aether! If you're interested in helping shape this productivity tool, please fork the repository, make your changes, and submit a pull request. For major changes, open an issue first to discuss your ideas.

## Learn More

For additional resources on Expo and React Native development:
- [Expo Documentation](https://docs.expo.dev/)
- [Learn Expo Tutorial](https://docs.expo.dev/tutorial/introduction/)

## Community

Join the Expo community for support and discussions:
- [Expo on GitHub](https://github.com/expo/expo)
- [Discord Community](https://chat.expo.dev)

Thank you for exploring Aether. Let's build a tool that helps everyone stay organized and productive!