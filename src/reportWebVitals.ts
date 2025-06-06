const reportWebVitals = () => {
  import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
    onCLS(console.log)
    onFCP(console.log)
    onLCP(console.log)
    onTTFB(console.log)
    onINP(console.log)
  })
}

export default reportWebVitals
