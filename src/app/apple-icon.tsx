import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

// Apple icon generation (larger, more detailed)
export default function AppleIcon() {
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
          borderRadius: '36px',
        }}
      >
        <div
          style={{
            fontSize: '110px',
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
