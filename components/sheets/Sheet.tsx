import React, { useCallback, useEffect, useRef } from 'react';
import { View } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView, BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { colors, radii } from '@/constants/theme';

// Shared bottom-sheet shell — mirrors the prototype's shared overlay pattern
// (rgba scrim, translateY slide-up, rounded top corners, drag handle,
// max-height with internal scroll) used by every detail/overlay sheet.
export function Sheet({
  onClose,
  children,
  snapPoints = ['85%'],
}: {
  onClose: () => void;
  children: React.ReactNode;
  snapPoints?: (string | number)[];
}) {
  const ref = useRef<BottomSheet>(null);

  useEffect(() => {
    ref.current?.expand();
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={-0.95} disappearsOnIndex={-1} opacity={0.42} pressBehavior="close" />
    ),
    []
  );

  return (
    <View style={{ position: 'absolute', inset: 0 }} pointerEvents="box-none">
      <BottomSheet
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        onClose={onClose}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.surface, borderTopLeftRadius: radii.card + 4, borderTopRightRadius: radii.card + 4 }}
        handleIndicatorStyle={{ backgroundColor: colors.faint, width: 40 }}
      >
        <BottomSheetScrollView contentContainerStyle={{ paddingBottom: 34 }}>{children}</BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
}
