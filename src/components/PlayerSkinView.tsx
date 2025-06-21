"use client";

import React, { useState } from "react";
import ReactSkinview3d from "react-skinview3d";

interface PlayerSkinViewProps {
  uuid: string;
  username: string;
}

export default function PlayerSkinView({ uuid, username }: PlayerSkinViewProps) {
  const [backgroundImageIndex] = useState(() => Math.floor(Math.random() * 14) + 1);

  return (
    <div className="skin-viewer-container">
      <ReactSkinview3d skinUrl={`https://crafatar.com/skins/${uuid}`} height="430" width="200" />
      <style jsx global>{`
        .skin-viewer-container canvas {
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}
