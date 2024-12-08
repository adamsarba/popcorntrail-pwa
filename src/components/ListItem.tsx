import React from "react";
import { Link } from "react-router-dom";

import { ChevronRight, ArrowUpRight } from "lucide-react";

interface ListItemProps {
  title: string;
  text?: string;
  icon?: React.ReactNode;
  iconBg?: string | undefined;
  count?: number | null;
  link?: string;
  listLink?: boolean;
  className?: string;
  onClick?: () => void;
}

export function ListItem({
  title,
  text,
  icon,
  iconBg,
  count,
  link,
  listLink,
  className,
  onClick,
}: ListItemProps) {
  const url =
    link ||
    (listLink ? `/list/${title.toLowerCase().replace(/ /g, "-")}` : undefined);

  function Item({ onClick }: { onClick?: () => void }) {
    return (
      <>
        <div
          className={`flex items-center justify-between text-sm active:bg-neutral-800/50 sm:hover:bg-neutral-800/50 ${icon ? "with-icon p-3" : "px-4 py-3"} ${!url ? "ui-list-item" : ""} ${className ? className : ""} ${onClick ? "cursor-pointer" : ""}`}
          onClick={onClick}
        >
          {icon ? (
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full p-2 text-xl ${iconBg ? iconBg : "bg-neutral-800"}`}
              >
                {icon}
              </span>
              <span className="line-clamp-2 pr-2">{title}</span>
            </div>
          ) : (
            <span className="line-clamp-2 pr-2">{title}</span>
          )}
          <div className="flex items-center gap-2">
            {text ? (
              text
            ) : count && count !== null && count > 0 ? (
              <span className="text-neutral-500">{count}</span>
            ) : (
              ""
            )}
            {url ? (
              <>
                {url?.includes("https://") ? (
                  <ArrowUpRight
                    className={`size-4 text-neutral-700 ${!icon ? "-mr-0.5" : ""}`}
                    strokeWidth={2.5}
                  />
                ) : (
                  <ChevronRight
                    className={`size-4 text-neutral-700 ${!icon ? "-mr-1" : ""}`}
                    strokeWidth={3}
                  />
                )}
              </>
            ) : null}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {!url ? (
        <Item onClick={onClick} />
      ) : url.startsWith("http") ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="ui-list-item"
        >
          <Item />
        </a>
      ) : (
        <Link to={url} className="ui-list-item">
          <Item />
        </Link>
      )}
    </>
  );
}
