import { useEffect, useState, useRef } from 'react'

export default function HeaderBar() {
  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)
  const hideTimeout = useRef(null)
  const HIDE_DELAY = 150 // ms

  useEffect(() => {
    function handleMouseMove(e) {
      if (e.clientY < 24) {
        clearTimeout(hideTimeout.current)
        setVisible(true)
      } else if (!hovering) {
        clearTimeout(hideTimeout.current)
        hideTimeout.current = setTimeout(() => setVisible(false), HIDE_DELAY)
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearTimeout(hideTimeout.current)
    }
  }, [hovering])

  function handleMouseEnter() {
    clearTimeout(hideTimeout.current)
    setHovering(true)
    setVisible(true)
  }
  function handleMouseLeave() {
    setHovering(false)
    hideTimeout.current = setTimeout(() => setVisible(false), HIDE_DELAY)
  }

  // Indicator tab logic
  function showBarFromIndicator() {
    clearTimeout(hideTimeout.current)
    setVisible(true)
  }

  return (
    <>
      {/* Indicator Tab */}
      <div
        onMouseEnter={showBarFromIndicator}
        onClick={showBarFromIndicator}
        style={{
          position: 'fixed', // Changed from absolute
          top: 0,
          left: '44%',
          transform: 'translateX(-50%)',
          width: 60,
          height: 16,
          background: '#3a5ca8',
          borderRadius: '0 0 12px 12px',
          boxShadow: '0 2px 8px 0 rgba(58,92,168,0.18)',
          zIndex: 101,
          opacity: visible ? 0 : 0.85,
          pointerEvents: visible ? 'none' : 'auto',
          transition: 'opacity 0.25s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        title="Show toolbar"
      >
        <div style={{ width: 24, height: 4, background: '#fff', borderRadius: 2, marginTop: 6 }} />
      </div>
      {/* Toolbar */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'absolute',
          top: visible ? '16px' : '-80px',
          left: '44%',
          transform: 'translateX(-50%)',
          width: '80vw',
          maxWidth: '900px',
          minWidth: '340px',
          height: '64px',
          zIndex: 100,
          background: '#e3f0fd',
          border: '3px solid #3a5ca8',
          borderRadius: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          fontFamily: '"Comic Sans MS", "Comic Sans", "Chalkboard SE", "monospace", sans-serif',
          boxShadow: '0 8px 32px 0 rgba(58,92,168,0.18), 0 4px 0 #3a5ca8',
          backdropFilter: 'blur(2px)',
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
          transition: 'top 0.35s cubic-bezier(.4,1.6,.4,1), opacity 0.25s',
        }}
      >
        {/* Left: Logo and Team Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: 40, height: 40, background: '#3a5ca8', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: 22, boxShadow: '2px 3px 0 #b3d1f7' }}>
            {/* Replace with your logo image if you have one */}
            <span>🌤️</span>
          </div>
          <span style={{ fontWeight: 'bold', fontSize: 22, color: '#3a5ca8', letterSpacing: 1 }}>TeamName</span>
        </div>
        {/* Center: 3 Buttons */}
        <div style={{ display: 'flex', gap: '18px' }}>
          <button style={buttonStyle}>Button 1</button>
          <button style={buttonStyle}>Button 2</button>
          <button style={buttonStyle}>Button 3</button>
        </div>
        {/* Right: Connect Wallet */}
        <div>
          <button style={{
            ...buttonStyle,
            background: '#ffe08a',
            color: '#22334d',
            border: '2px solid #3a5ca8',
            fontWeight: 'bold',
            padding: '10px 26px',
          }}>
            Connect Wallet
          </button>
        </div>
      </div>
    </>
  )
}

const buttonStyle = {
  background: '#f5faff',
  color: '#3a5ca8',
  border: '2px solid #3a5ca8',
  borderRadius: '10px',
  fontFamily: 'inherit',
  fontSize: '16px',
  fontWeight: 'bold',
  padding: '10px 22px',
  cursor: 'pointer',
  boxShadow: '2px 3px 0 #b3d1f7',
  transition: 'background 0.2s',
} 