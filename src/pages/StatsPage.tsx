import { TopBar } from '../components/TopBar'
import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'

export function StatsPage() {
  const hasStats = false;

  return (
    <>
      <TopBar backLink />
      <motion.h1 
        initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className={`text-3xl font-bold capitalize px-4`}
      >
        Statistics
      </motion.h1>

      <motion.main 
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
        className={`px-4 pt-3 pb-24 text-neutral-600`}
      >
        {!hasStats && (
          <div className="h-[calc(50vh)] grid place-items-center">
            <div>
              <span className="text-6xl mb-2 flex justify-center text-center">
                <TrendingUp className="size-[1em]" strokeWidth={1} />
              </span>
              <p>
                No statistics available yet
              </p>
            </div>
          </div>
        )}
      </motion.main>
    </>
  );
}