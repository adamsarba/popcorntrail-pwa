import { motion } from 'framer-motion';

interface NewListCardProps {
  onCancel: () => void;
}

export function NewListCard({ onCancel }: NewListCardProps) {
  return (
    <motion.div 
      initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: 0.5, type: "spring" }}
      className="fixed top-[50vh] bottom-0 z-50 w-full h-screen rounded-t-2xl p-4 bg-black/75 backdrop-blur-sm"
    >
      <div className="flex items-center justify-center mt-2 mb-6">
        <h1 className="text-xl font-semibold text-neutral-100">Add New List</h1>
        <button onClick={onCancel} className="absolute left-8 text-accent">Cancel</button>
        <button className="absolute right-8 text-accent opacity-50" disabled>Done</button>
      </div>
      <div className="bg-neutral-900 rounded-2xl p-4">
        <input
          type="text"
          placeholder="List Name"
          className="w-full bg-transparent outline-none text-white placeholder-neutral-500"
          // autoFocus
        />
      </div>
    </motion.div>
  );
}