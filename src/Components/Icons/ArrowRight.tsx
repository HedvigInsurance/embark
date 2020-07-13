import * as React from 'react'

export const ArrowRight = () => (
  <svg width="21" height="21" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter
        x="-8.3%"
        y="-11.9%"
        width="116.6%"
        height="123.9%"
        filterUnits="objectBoundingBox"
        id="a"
      >
        <feOffset dy="8" in="SourceAlpha" result="shadowOffsetOuter1" />
        <feGaussianBlur
          stdDeviation="6.5"
          in="shadowOffsetOuter1"
          result="shadowBlurOuter1"
        />
        <feColorMatrix
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.174579327 0"
          in="shadowBlurOuter1"
          result="shadowMatrixOuter1"
        />
        <feMerge>
          <feMergeNode in="shadowMatrixOuter1" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <g
      filter="url(#a)"
      transform="translate(-433 -80)"
      fillRule="nonzero"
      stroke="#121212"
      strokeWidth="1.2"
      fill="none"
      strokeLinejoin="round"
    >
      <path d="M445 99.876l.633.624L454 92.25 445.633 84l-.633.624 7.735 7.626z" />
    </g>
  </svg>
)
