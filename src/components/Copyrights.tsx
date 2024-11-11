import { Popcorn } from 'lucide-react'
// import { usePWA } from '../context/PWAContext'

export function Copyrights() {
  // const isPWA = usePWA();
  
  return (
    <footer className="text-center text-xs text-neutral-600 space-y-1 !my-4">
      <Popcorn className="size-[1em] mx-auto text-3xl  mb-2 text-neutral-600" strokeWidth={1.5} />
      <p className="flex items-center justify-center gap-1">
        {/* {window.location.pathname === '/' && ( <Popcorn className="size-[1.15em]" /> )} */}
        PopcornTrail 0.0.3
      </p>
      <p>
        Copyrights &copy; 2024 <a href="https://github.com/adamsarba" target="_blank">Adam Sarba</a>
      </p>
      <p className={`!mt-4`}>
        Powered by
        <a href="https://www.themoviedb.org/" target="_blank">
          <img className="h-[1em] mx-auto mt-1.5 filter grayscale brightness-50" src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg" />
        </a>
      </p>

      {/* {process.env.NODE_ENV === 'development' && window.location.pathname === '/settings' && (
        <div className="text-xs text-left text-neutral-700 !mt-20 mb-[3.5rem]" style={{ fontFamily: "Courier" }}>
          <div className="border-t border-neutral-900 py-4">
            Develop:
            <ul>
              <li>
                isPWA: {isPWA ? "true" : "false"}
              </li>
            </ul>
          </div>
        </div>
      )} */}
    </footer>
  )
}