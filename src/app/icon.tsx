import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontWeight: 'bold',
          letterSpacing: '-0.05em',
          color: 'white',
          background: 'linear-gradient(to bottom right, #262626, #0A0A0A)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        <span
          style={{
            fontSize: 12,
          }}
        >
          M1
        </span>
        <span style={{ fontSize: 30, marginLeft: -3 }}>↓</span>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse width and height.
      ...size,
    },
  );
}
