"use client";

import React, { useState } from "react";
import ReactSkinview3d, { ViewerReadyCallbackOptions } from "react-skinview3d";
import * as sv from "skinview3d";

interface PlayerSkinViewProps {
  uuid: string;
  username: string;
}

export default function PlayerSkinView({ uuid, username }: PlayerSkinViewProps) {
  const onReady: ({ viewer, canvasRef }: ViewerReadyCallbackOptions) => void = ({ viewer, canvasRef }) => {
    // viewer.setSkinUrl(`https://crafatar.com/skins/${uuid}`);
    // viewer.setCapeUrl(`https://crafatar.com/capes/${uuid}`);
    const a = new sv.IdleAnimation();
    a.addAnimation((player, progress, currentId) => {
      player.rotation.y = progress; // Rotate the player around the Y-axis

      player.rotation.x = Math.sin(progress * Math.PI * 0.3) * 0.2; // Add a slight bobbing effect
    });
    viewer.animation = a;
  };
  return (
    <div className="skin-viewer-container">
      <ReactSkinview3d skinUrl={`https://crafatar.com/skins/${uuid}`} height="430" width="200" onReady={onReady} />
      <style jsx global>{`
        .skin-viewer-container canvas {
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}
