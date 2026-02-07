import { ImageResponse } from 'next/og'

// 파비콘 설정
export const runtime = 'edge'
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// 파비콘 생성 함수
export default function Icon() {
  return new ImageResponse(
    (
      // 파란색 배경에 흰색 아이콘
      <div
        style={{
          fontSize: 20,
          background: '#2563eb', // blue-600 색상
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '8px', // 둥근 사각형
        }}
      >
        {/* 간단한 AI 노드 아이콘 */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: '20px', height: '20px' }}
        >
          <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
          <path d="M12 12v.01" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
