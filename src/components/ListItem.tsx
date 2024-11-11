import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface ListItemProps {
  title: string;
  icon?: React.ReactNode;
  iconBg?: string | undefined;
  count?: number | null;
  link?: string;
  listLink?: boolean;
  className?: string;
  onClick?: () => void;
}

export function ListItem({ title, icon, iconBg, count, link, listLink, className, onClick }: ListItemProps) {
  const url = link || (listLink ? `/list/${title.toLowerCase().replace(/ /g, "-")}` : undefined);

  function Item({ onClick }: { onClick?: () => void }) {
    return (
      <>
        <div className={`flex items-center justify-between text-sm ${icon ? "with-icon p-3" : "px-4 py-3"} ${!url ? "ui-list-item" : ""} ${className ? className : ""} ${onClick ? "cursor-pointer" : ""}`} onClick={onClick}>
          {icon ? (
            <div className="flex items-center gap-3">
              <span className={`text-xl rounded-full p-2 ${iconBg ? iconBg : 'bg-neutral-800'}`}>
                {icon}
              </span>
              <span className="line-clamp-2 pr-2">{title}</span>
            </div>
          ) : (
            <span className="line-clamp-2 pr-2">{title}</span>
          )}
          <div className="flex items-center gap-2">
            {count && count !== null && count > 0 ? <span className="text-neutral-500">{count}</span> : ""}
            <ChevronRight className={`size-4 text-neutral-700 ${!icon ? "-mr-1" : ""}`} strokeWidth={3} />
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {!url ? (
        <Item onClick={onClick} />
      ) : url.startsWith("http") ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="ui-list-item">
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