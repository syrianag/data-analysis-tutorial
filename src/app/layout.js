import '../styles/globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'Agentic Data Quality Analysis Platform',
  description: 'Starter app — upload files and analyze data quality'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container" style={{ maxWidth: 980, margin: '0 auto' }}>
            <div className="site-title">Data Quality Analysis</div>
            <nav className="site-nav">
              <Link href="/">Home</Link>
              <Link href="/milestone1">Data Upload</Link>
              <Link href="/milestone2">Data Preview</Link>
              <Link href="/milestone3">Data Analysis</Link>
              <Link href="/milestone4">Results</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
