import { useState } from "react";
import { TopBar } from "../components/TopBar";
import { ListContainer } from "../components/ListContainer";
import { ListItem } from "../components/ListItem";
import { Import } from "../components/Import";
import { Copyrights } from "../components/Copyrights";
import { motion } from "framer-motion";

type SettingItem = {
  title: string;
  link?: string;
};

const settings: Record<string, SettingItem[]> = {
  // prettier-ignore
  "General": [
    { title: "Country" },
    { title: "Display" },
    { title: "Notifications" },
  ],
  // prettier-ignore
  "Storage": [
    { title: "Image Cache" },
    { title: "Import" },
    { title: "Backup" }
  ],
  "": [
    { title: "About" },
    {
      title: "Contact",
      link: "https://github.com/adamsarba",
    },
  ],
};

export function SettingsPage() {
  const [selectedSetting, setSelectedSetting] = useState("Settings");
  const [subContent, setSubContent] = useState<JSX.Element | null>(null);

  const handleSettingClick = (title: string) => {
    setSelectedSetting(title);
    setSubContent(<></>);
  };

  const handleBackClick = () => {
    setSelectedSetting("Settings");
    setSubContent(null);
  };

  return (
    <>
      <TopBar backLink title={selectedSetting} onBackClick={handleBackClick} />
      <div className="flex items-center justify-between px-4 text-3xl font-bold capitalize">
        <motion.h1
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {selectedSetting}
        </motion.h1>
        {!subContent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative size-[1em] overflow-hidden rounded-full bg-gray-100 dark:bg-neutral-900"
          >
            <svg
              className="absolute -bottom-[22.5%] left-[-10%] size-[120%] text-neutral-700"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* prettier-ignore */}
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </motion.div>
        )}
      </div>

      <motion.main
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col gap-6 p-4 text-neutral-100"
      >
        {!subContent ? (
          <>
            {Object.keys(settings).map((key) => (
              <section key={key}>
                {key !== "" && <h2 className="settings-heading">{key}</h2>}
                <ListContainer className="!p-0">
                  {settings[key as keyof typeof settings].map((item) => (
                    <ListItem
                      key={item.title}
                      title={item.title}
                      onClick={() => handleSettingClick(item.title)}
                      link={item.link ? item.link : undefined}
                    />
                  ))}
                </ListContainer>
              </section>
            ))}

            <Copyrights />
          </>
        ) : (
          <>
            {selectedSetting === "Import" ? (
              <Import />
            ) : (
              <div className="pt-[25vh] text-center text-sm text-neutral-600">
                Available soon
              </div>
            )}
          </>
        )}
      </motion.main>
    </>
  );
}
