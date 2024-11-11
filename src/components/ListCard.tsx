import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface ListCardProps {
  title: string;
  icon: React.ReactNode;
  iconBg?: string | undefined;
  count?: number | null;
  link?: string;
  index: number;
  firstLoad: boolean;
  className?: string;
}

export function ListCard({ title, icon, iconBg, count, link, index, firstLoad, className  }: ListCardProps) {
  return (
    <Link
      to={link ? link : `/list/${title.toLowerCase().replace(/ /g, "-")}`}
      className={`${className ? className : ""}`}
    >
      <motion.div
        initial={firstLoad ? {opacity: 0, y: 20} : {opacity: 1, y: 0} }
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`flex flex-col justify-between size-full bg-neutral-900 rounded-2xl p-3 pb-2`}
      >
        <div className="flex w-full justify-between items-center gap-4 mb-1.5">
          <span className={`text-xl rounded-full p-2 ${iconBg ? iconBg : 'bg-neutral-800' }`}>{icon}</span>
          {count !== null && (
            <span className="text-white text-2xl font-semibold truncate mr-1">{count}</span>
          )}
        </div>
        <span className="text-sm font-medium text-neutral-500">{title}</span>
      </motion.div>
    </Link>
  );
}