import React from "react";
import { Link } from "react-router-dom";

import { motion } from "framer-motion";

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

export function ListCard({
  title,
  icon,
  iconBg,
  count,
  link,
  index,
  firstLoad,
  className,
}: ListCardProps) {
  return (
    <Link
      to={link ? link : `/list/${title.toLowerCase().replace(/ /g, "-")}`}
      className={`${className ? className : ""}`}
    >
      <motion.div
        initial={firstLoad ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`flex size-full flex-col justify-between rounded-2xl bg-neutral-900 p-3 pb-2 active:bg-neutral-800/80 sm:hover:bg-neutral-800/80`}
      >
        <div className="mb-1.5 flex w-full items-center justify-between gap-4">
          <span
            className={`rounded-full p-2 text-xl ${iconBg ? iconBg : "bg-neutral-800"}`}
          >
            {icon}
          </span>
          {count !== null && (
            <span className="mr-1 truncate text-2xl font-semibold text-white">
              {count}
            </span>
          )}
        </div>
        <span className="text-sm font-medium text-neutral-500">{title}</span>
      </motion.div>
    </Link>
  );
}
