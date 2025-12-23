'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRDisplayProps {
  url: string;
  size?: number;
}

export function QRDisplay({ url, size = 256 }: QRDisplayProps) {
  return (
    <div className="bg-white p-4 border-4 border-black shadow-[8px_8px_0px_#000]">
      <QRCodeSVG
        value={url}
        size={size}
        bgColor="#FFFFFF"
        fgColor="#000000"
        level="H"
        includeMargin={false}
      />
    </div>
  );
}

