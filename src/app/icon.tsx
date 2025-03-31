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
          fontSize: 24,
          background: 'linear-gradient(to bottom right, #262626, #0A0A0A)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'translateY(-1px)',
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              marginRight: -1,
            }}
          >
            M1
          </div>
          <div
            style={{
              fontSize: 16,
              marginLeft: 1,
              fontWeight: 'bold',
            }}
          >
            ↓
          </div>
        </div>
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
