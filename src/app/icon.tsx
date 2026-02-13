import { ImageResponse } from 'next/og'

// Image metadata - Google recommends at least 48x48
export const size = {
  width: 48,
  height: 48,
}
export const contentType = 'image/png'

// Icon generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#059669',
        }}
      >
        <div
          style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: 'white',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          N
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
