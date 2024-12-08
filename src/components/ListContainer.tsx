import { motion } from "framer-motion";

export function ListContainer({
  children,
  accordion,
  className,
}: {
  className?: string;
  accordion?: boolean;
  children: React.ReactNode;
}) {
  const classNames = `flex flex-col overflow-hidden rounded-2xl bg-neutral-900 ${className ? className : ""}`;
  return (
    <>
      {accordion ? (
        <motion.div
          initial="collapsed"
          animate="open"
          exit="collapsed"
          variants={{
            open: { height: "auto" },
            collapsed: { height: 0 },
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          // transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          className={classNames}
        >
          {children}
        </motion.div>
      ) : (
        <div className={classNames}>{children}</div>
      )}
    </>
  );
}
