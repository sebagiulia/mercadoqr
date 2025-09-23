// hooks/useModalAnimation.ts
import { useState } from "react";
import { Animated } from "react-native";

export function useModalAnimation() {
  const [visible, setVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const open = () => {
    setVisible(true);
    Animated.timing(animation, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const close = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  return { visible, open, close, scale };
}
