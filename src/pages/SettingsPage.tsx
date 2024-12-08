import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";

import { TopBar } from "../components/TopBar";
import { ListContainer } from "../components/ListContainer";
import { ListItem } from "../components/ListItem";
import { Copyrights } from "../components/Copyrights";

import { motion } from "framer-motion";
import { Clapperboard } from "lucide-react";
import { checkForUpdates } from "../utils/updateApp";
import { usePWA } from "../context/PWAContext";

type SettingItem = {
  title: string;
  text?: string;
  link?: string;
  disabled?: boolean;
};

const settings: Record<string, SettingItem[]> = {
  // prettier-ignore
  "General": [
    { title: "Language", link: "/settings/language", text: "English", disabled: true },
    { title: "Country", link: "/settings/country", text: "Poland", disabled: true },
    { title: "Display", link: "/settings/display", disabled: true },
    { title: "Notifications", link: "/settings/notifications", disabled: true },
  ],
  // prettier-ignore
  "Storage": [
    { title: "Import", link: "/settings/import" },
    { title: "Backup", link: "/settings/backup", disabled: true },
    { title: "Cache", link: "/settings/cache", disabled: true },
  ],
  "": [
    { title: "About", link: "/settings/about" },
    {
      title: "Privacy Policy",
      link: "/settings/privacy-policy",
      disabled: true,
    },
    { title: "Terms of Use", link: "/settings/terms-of-use", disabled: true },
    {
      title: "Collaborate",
      link: "https://github.com/adamsarba", // external: true,
      // externalLink: "https://github.com/adamsarba",
    },
  ],
};

export function SettingsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { settingName } = useParams();
  const [selectedSetting, setSelectedSetting] = useState("Settings");

  const isPWA = usePWA();
  const [isUpdating, setIsUpdating] = useState(false);

  // console.log(selectedSetting);

  useEffect(() => {
    if (settingName) {
      const formattedSetting = settingName.replace(/-/g, " ");
      setSelectedSetting(formattedSetting);
    } else {
      setSelectedSetting("Settings");
    }
  }, [settingName]);

  const handleSettingClick = (title: string) => {
    setSelectedSetting(title);
    navigate(`/settings/${title.replace(/\s+/g, "-").toLowerCase()}`);
  };

  // Updates the app if it's a PWA or in development mode
  const handleCheckForUpdates = async () => {
    if (!isPWA && process.env.NODE_ENV !== "development") return;
    try {
      await checkForUpdates();
    } catch (error) {
      console.error("Failed to check for updates:", error);
      setIsUpdating(false);
    }
  };

  return (
    <>
      <TopBar
        backLink={location.pathname !== "/settings" ? "/settings" : "/"} // TODO
        title={location.pathname !== "/settings" ? "Settings" : ""}
      />

      <motion.main
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="flex flex-col gap-6 px-3 pb-24 text-neutral-100"
      >
        {/* Header */}
        <div className="-mb-2 flex items-center justify-between text-3xl font-bold capitalize">
          <motion.h1
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {selectedSetting === "Settings" ? (
              <span className="normal-case">Hello there</span>
            ) : (
              selectedSetting
            )}
          </motion.h1>
          {/* Profile Picture */}
          {selectedSetting === "Settings" && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Link
                to="./account"
                className="relative z-10 inline-block size-[1em] overflow-hidden rounded-full bg-neutral-800 p-1 transition-opacity duration-150 sm:hover:opacity-50"
              >
                {/* prettier-ignore */}
                <svg 
                viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
                className="absolute -bottom-[22.5%] left-[-10%] size-[120%] z-40 text-neutral-100" fill="currentColor"
              ><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
              </Link>
            </motion.span>
          )}
        </div>

        {/* Settings */}
        {selectedSetting === "Settings" ? (
          <>
            {Object.keys(settings).map((key) => (
              <section key={key}>
                {key !== "" && <h2 className="settings-heading mb-3">{key}</h2>}
                <ListContainer className="!p-0">
                  {settings[key as keyof typeof settings].map((item) => (
                    <ListItem
                      key={item.title}
                      title={item.title}
                      text={item.text}
                      onClick={() => handleSettingClick(item.title)}
                      link={item.link ? item.link : undefined}
                      className={item.disabled ? "text-neutral-100/25" : ""}
                    />
                  ))}
                </ListContainer>
              </section>
            ))}

            {(process.env.NODE_ENV === "development" || isPWA) && (
              <section>
                <ListContainer>
                  <ListItem
                    title={
                      isUpdating
                        ? "Checking for updates..."
                        : "Check for updates"
                    }
                    link={undefined}
                    onClick={handleCheckForUpdates}
                    className={`text-blue ${isUpdating ? "pointer-events-none opacity-50" : ""}`}
                  />
                </ListContainer>
              </section>
            )}

            <Copyrights />
          </>
        ) : selectedSetting === "about" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="-mt-2 space-y-2 text-neutral-500"
          >
            <p>More information will appear here soon.</p>

            <p>
              <a
                target="_blank"
                href="https://icons8.com/icon/Kh9KJFNHDnTA/popcorn"
              >
                Popcorn
              </a>{" "}
              icon by{" "}
              <a
                target="_blank"
                href="https://icons8.com"
                className="text-blue"
              >
                Icons8
              </a>
              .
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="-mt-4 grid h-[calc(50vh)] place-items-center px-3 text-center text-sm text-neutral-500"
          >
            <div>
              <div className="text-6xl">
                <Clapperboard
                  className="mx-auto mb-2 size-[1em]"
                  strokeWidth={1}
                />
              </div>
              Available soon
            </div>
          </motion.div>
        )}
      </motion.main>
    </>
  );
}
