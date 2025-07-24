import React, { createContext, useContext, useState, ReactNode } from 'react';

// 1. Define the EventData interface
export interface EventData {
  id?: string;
  title: string;
  startTime: Date;
  endTime: Date;
  participants: string;
  conferencing: string;
  location: string;
  calendar: string;
  reminders: string;
  description: string;
}

// 2. Define the EventModalContextType interface
export interface EventModalContextType {
  isVisible: boolean;
  eventData: EventData | null;
  openModal: (event: EventData) => void;
  closeModal: () => void;
}

// 3. Create the EventModalContext
export const EventModalContext = createContext<EventModalContextType | undefined>(undefined);

// 4. Create the EventModalProvider component
export const EventModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [eventData, setEventData] = useState<EventData | null>(null);

  const openModal = (event: EventData) => {
    setEventData(event);
    setIsVisible(true);
  };

  const closeModal = () => {
    setIsVisible(false);
    setEventData(null);
  };

  const contextValue = {
    isVisible,
    eventData,
    openModal,
    closeModal,
  };

  return (
    <EventModalContext.Provider value={contextValue}>
      {children}
    </EventModalContext.Provider>
  );
};

// 5. Create a custom hook to consume the context
export const useEventModal = () => {
  const context = useContext(EventModalContext);
  if (context === undefined) {
    throw new Error('useEventModal must be used within an EventModalProvider');
  }
  return context;
};
