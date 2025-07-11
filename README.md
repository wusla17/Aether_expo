# Aether - Personal Productivity App

Welcome to **Aether**, a React Native application designed to enhance your personal productivity through note-taking and task management. Built with Expo, Aether leverages modern tools and libraries to provide a seamless, cross-platform experience on Android, iOS, and web.

## ✨ Current Status & Features

Aether is currently in **active development**, with a strong focus on **stability** and a **consistent user experience**. Recent updates have significantly improved the app's foundation, making it more robust for future enhancements.

### Key Features:

-   **Robust Data Persistence**: Migrated from `AsyncStorage` to `expo-sqlite` for more **reliable** and **structured** data storage for notes and tasks.
-   **Enhanced UI with React Native Paper**: The user interface has been refactored to utilize `react-native-paper` components, providing a **consistent** and **modern Material Design** look and feel.
-   **Note-Taking**: Create, edit, and organize notes with a simple interface. Notes are accessible through a dedicated section, allowing for **quick capture of ideas** or information.
-   **Task Management**: Add and manage tasks with a todo list feature. Users can create new tasks and **track their completion status**.
-   **Tab Navigation**: Utilizes Expo Router for file-based routing with a tabbed interface, providing **easy access** to Home, Search, Todo, and Notifications sections, with a **custom tab bar** for improved aesthetics.

## 🎯 Why Aether? (For Developers & Users)

Aether is being developed to provide a **streamlined and efficient personal productivity tool** that prioritizes user experience and data integrity. In a world saturated with complex and often overwhelming productivity suites, Aether aims to offer a **clean, intuitive, and reliable alternative**.

**For Developers**: This project is developed by the team at **WUSLA**, a company based in Kerala, South India. It serves as a practical example of building a robust cross-platform application using modern React Native and Expo technologies. It showcases best practices in UI/UX design with `react-native-paper`, efficient data management with `expo-sqlite`, and scalable navigation with Expo Router. It's an ideal codebase for learning and contributing to a real-world application.

**For Users**: Aether is designed for individuals seeking a straightforward yet powerful solution to manage their daily notes and tasks. Whether you're a student, a professional, or anyone looking to organize their thoughts and to-dos without unnecessary clutter, Aether provides a focused environment to boost your productivity.

**What makes Aether different?**

Unlike many existing productivity apps that often become bloated with features, Aether focuses on **core functionality with a commitment to simplicity and performance**. We prioritize a **seamless and distraction-free experience**, ensuring that managing your notes and tasks is as effortless as possible. Our emphasis on a clean Material Design UI, combined with robust local data persistence, offers a **private and responsive environment** without the need for constant cloud synchronization (though this is a future goal). Aether is built to be a reliable daily companion, not another source of digital overwhelm.

## 🛠️ Technical Stack

-   **React Native & Expo**: Built with Expo SDK for **rapid development** and deployment across multiple platforms.
-   **TypeScript**: Ensures **type safety** and **better code maintainability**.
-   **Expo SQLite**: For **local database management**, providing a robust solution for data persistence.
-   **React Native Paper**: For **UI components**, adhering to Material Design guidelines.
-   **Expo Router**: For **navigation and routing**, utilizing file-based routing for a structured app layout.
-   **Reanimated**: For **smooth animations**, integrated via `react-native-reanimated`.

## 📂 Project Structure

-   **`app/`**: Contains the main application routes and screens, organized with Expo Router. Key directories include `(tabs)` for tab navigation and specific feature folders like `note` and `todo`.
-   **`components/`**: Reusable UI components such as `ThemedView`, `ParallaxScrollView`, and `Collapsible`, including the new `CustomTabBar`.
-   **`hooks/`**: Custom hooks for managing themes and color schemes.
-   **`constants/`**: Static data like colors and types used throughout the app.
-   **`assets/`**: Static resources including fonts and images.
-   **`utils/`**: Utility functions, including the new `database.ts` for `expo-sqlite` operations.

## 🚀 Future Goals

Aether aims to evolve into a full-fledged productivity suite with the following planned enhancements:

-   **Enhanced Note Features**: Support for rich text formatting, tagging, and categorization of notes.
-   **Advanced Task Management**: Recurring tasks, reminders, and integration with calendar apps.
-   **Sync & Backup**: Cloud synchronization to access data across devices, with options for backup and restore.
-   **Customization**: Themes and UI personalization options for users to tailor the app to their preferences.
-   **Collaboration**: Features to share notes and tasks with others for collaborative work.
-   **Performance Optimization**: Continued improvements in app speed and responsiveness, especially for large datasets.

## 🚧 Development Challenges & Solutions

-   **Database Migration**: Successfully migrated from `AsyncStorage` to `expo-sqlite` to ensure **data integrity** and **scalability**, resolving initial startup issues.
-   **UI Consistency**: Transitioned from NativeWind/Tailwind CSS to `react-native-paper` for a more **cohesive** and **maintainable UI**, addressing previous styling inconsistencies.
-   **Navigation**: Leveraging Expo Router for a **scalable navigation structure**, ensuring new features can be added seamlessly.

## 🤝 Contributing

We welcome contributions to Aether! If you're interested in helping shape this productivity tool, please fork the repository, make your changes, and submit a pull request. For major changes, open an issue first to discuss your ideas.

Thank you for exploring Aether. Let's build a tool that helps everyone stay organized and productive!
