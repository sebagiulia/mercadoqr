// OverlayQR.tsx
import React from "react";
import { View, Dimensions } from "react-native";
import Svg, { Rect, Defs, Mask } from "react-native-svg";

interface OverlayProps {
    boxSize: number;
  }
  
  const OverlayQR: React.FC<OverlayProps> = ({ boxSize }) => {
    const { width, height } = Dimensions.get("window");
    const boxX = (width - boxSize) / 2;
    const boxY = width / 2; // centrado en contenedor cuadrado
  

  return (
    <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
      <Svg height="100%" width="100%">
        <Defs>
          <Mask id="mask" x="0" y="0" width="100%" height="100%">
            {/* Todo visible */}
            <Rect width="100%" height="100%" fill="white" />
            {/* Agujero del visor */}
            <Rect
              x={boxX}
              y={boxY}
              width={boxSize}
              height={boxSize}
              rx={20} // Esquinas redondeadas
              fill="black"
            />
          </Mask>
        </Defs>

        {/* Sombra con la máscara */}
        <Rect
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.6)"
          mask="url(#mask)"
        />
      </Svg>
    </View>
  );
};

export default OverlayQR;
