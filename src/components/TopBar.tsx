import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { usePWA } from '../context/PWAContext'
import { CircleEllipsis, ChevronLeft, Pencil, Cog } from 'lucide-react'

interface TopBarProps {
  backLink?: boolean
  title?: string
  onBackClick?: () => void
  children?: React.ReactNode
  searchBar?: boolean
  scrolled?: boolean
  isSearchActive?: boolean
}

export function TopBar({ backLink, title, onBackClick, children, searchBar, scrolled, isSearchActive }: TopBarProps) {
  const isPWA = usePWA();
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);

  const toggleContextMenu = () => {
    setIsContextMenuVisible(!isContextMenuVisible);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (navRef.current && !navRef.current.contains(event.target as Node)) {
      setIsContextMenuVisible(false);
    }
  };

  const handleScroll = () => {
    setIsContextMenuVisible(false);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <header 
        className={`sticky z-50 top-0 w-full px-4 py-3 space-y-3 ${scrolled && "scrolled"} ${searchBar && "gap-3"} backdrop-blur-xl bg-black/50 overflow-x-hidden relative`}
        style={isPWA ? { paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)" } : undefined}
      >
        <div className={`flex justify-between items-end gap-4 ${isSearchActive ? "opacity-0 -mt-8" : ""} transition-all duration-300 ${isContextMenuVisible && !backLink ? "w-fit ml-auto" : ""} ${isContextMenuVisible ? "cursor-pointer" : ""}`}>
          {backLink && (
            <div>
              <Link
                to={onBackClick ? (title === 'Settings' ? '/' : '') : '/'}
                onClick={onBackClick}
                className="flex items-center gap-1 text-accent -ml-3"
              >
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <ChevronLeft className="size-6" strokeWidth={2.5} />
                </motion.div>
                <motion.h1 initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  {window.location.pathname === '/settings' && title !== "Settings" ? "Settings" : "PopcornTrail"}
                </motion.h1>
              </Link>
            </div>
          )}
          {window.location.pathname !== '/settings' && ( 
            <button 
              onClick={toggleContextMenu}
              className={`more-button ml-auto p-2 -m-2 text-accent transition-all duration-300 ${isContextMenuVisible || isSearchActive ? "pointer-events-none opacity-25" : ""}`} 
            >
              <CircleEllipsis className="size-6" />
            </button>
          )}
        </div>
        {searchBar && children}
      </header>
      <AnimatePresence>
        {isContextMenuVisible && (
          <motion.nav
            ref={navRef}
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}
            className="fixed right-2.5 flex gap-2 rounded-xl z-50 backdrop-blur-xl bg-neutral-800/75 origin-top-right"
            style={{ boxShadow: "0 1rem 1.5rem rgba(0, 0, 0, 0.25)", top: "calc(env(safe-area-inset-top) + 3rem)" }}
          >
            <ul className="w-[80vw] max-w-[16rem] py-0.5 text-sm child:px-4 child:py-2 [&>:not(:last-child)]:border-b child:border-neutral-700 child:flex child:justify-between child:items-center child:gap-2 child:text-left child:cursor-pointer">
              <li className="!cursor-default">
                <span className="opacity-25">
                  Edit
                  {window.location.pathname.includes('/list') && " list"}
                </span>
                <Pencil className="size-[1em] opacity-25" strokeWidth={1.5} />
              </li>
              <Link to="/settings">
                Settings <Cog className="size-[1em]" strokeWidth={1.5} />
              </Link>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}