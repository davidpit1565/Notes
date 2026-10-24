import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

class AppErrorBoundary extends React.Component<React.PropsWithChildren, { hasError: boolean }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error('Dailume could not render:', error)
  }

  render() {
    if (this.state.hasError) {
      return <main style={{minHeight:'100vh',display:'grid',placeItems:'center',padding:24,background:'#f5f6fb',color:'#171a2b',fontFamily:'-apple-system,BlinkMacSystemFont,system-ui,sans-serif'}}>
        <section role="alert" style={{maxWidth:420,textAlign:'center',background:'#fff',border:'1px solid #e9eaf2',borderRadius:24,padding:28,boxShadow:'0 12px 40px rgba(0,0,0,.07)'}}>
          <div style={{fontSize:12,letterSpacing:1.2,color:'#6257e8',fontWeight:700}}>DAILUME</div>
          <h1 style={{fontSize:26,letterSpacing:-.7,margin:'12px 0 8px'}}>Let's get you back on track.</h1>
          <p style={{fontSize:15,lineHeight:1.55,color:'#777c91',margin:'0 0 20px'}}>The planner hit a problem while opening. Your saved items have not been intentionally deleted. Try reloading the page.</p>
          <button onClick={() => window.location.reload()} style={{background:'#6257e8',color:'#fff',border:0,borderRadius:999,padding:'13px 20px',fontSize:15,fontWeight:600}}>Reload Dailume</button>
        </section>
      </main>
    }
    return this.props.children
  }
}

const rootElement = document.getElementById('root')!
const root = createRoot(rootElement)
root.render(<React.StrictMode><AppErrorBoundary><App /></AppErrorBoundary></React.StrictMode>)
window.setTimeout(() => { rootElement.dataset.appReady = 'true' }, 0)
