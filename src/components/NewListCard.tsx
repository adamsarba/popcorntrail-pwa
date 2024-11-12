import { motion } from "framer-motion";

interface NewListCardProps {
  onCancel: () => void;
}

export function NewListCard({ onCancel }: NewListCardProps) {
  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.5, type: "spring" }}
      className="fixed bottom-0 top-[50vh] z-50 h-screen w-full rounded-t-2xl bg-black/75 p-4 backdrop-blur-sm"
    >
      <div className="mb-6 mt-2 flex items-center justify-center">
        <h1 className="text-xl font-semibold text-neutral-100">Add New List</h1>
        <button onClick={onCancel} className="absolute left-8 text-accent">
          Cancel
        </button>
        <button className="absolute right-8 text-accent opacity-50" disabled>
          Done
        </button>
      </div>
      <div className="rounded-2xl bg-neutral-900 p-4">
        <input
          type="text"
          placeholder="List Name"
          className="w-full bg-transparent text-white placeholder-neutral-500 outline-none"
          // autoFocus
        />
      </div>
    </motion.div>
  );
}
