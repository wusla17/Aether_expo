import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { BottomSheetModal, BottomSheetView, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface SelectionSheetProps {
  isVisible: boolean;
  title: string;
  options: string[];
  onSelect: (selectedOption: string) => void;
  onClose: () => void;
}

const Colors = {
  background: '#1C1C1E',
  primaryText: '#FFFFFF',
  secondaryText: '#8E8E93',
  separator: 'rgba(255, 255, 255, 0.1)',
  cardBorder: 'rgba(255, 255, 255, 0.2)',
};

const SelectionSheet: React.FC<SelectionSheetProps> = ({
  isVisible,
  title,
  options,
  onSelect,
  onClose,
}) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['25%', '50%', '75%'], []); // Adjust snap points as needed

  // Effect to manage modal visibility
  React.useEffect(() => {
    if (isVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isVisible]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

  const handleOptionPress = (option: string) => {
    onSelect(option);
    onClose();
  };

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1} // Start at a reasonable snap point
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        // Floating card style
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
        enablePanDownToClose={true}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text style={styles.title}>{title}</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionRow}
                onPress={() => handleOptionPress(option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: Colors.background,
    marginHorizontal: 10, // Floating effect
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden', // Ensure rounded corners
  },
  handleIndicator: {
    backgroundColor: Colors.secondaryText,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 20,
    textAlign: 'center',
  },
  optionRow: {
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  optionText: {
    fontSize: 18,
    color: Colors.primaryText,
  },
});

export default SelectionSheet;
