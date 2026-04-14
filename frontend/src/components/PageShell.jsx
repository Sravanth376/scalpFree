import BottomNav from './BottomNav.jsx'

/**
 * Wraps every page with the bottom nav and consistent padding.
 */
export default function PageShell({ children, hideNav = false }) {
  return (
    <div className="flex flex-col min-h-dvh">
      <main className={`flex-1 ${hideNav ? '' : 'pb-28'}`}>
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  )
}
