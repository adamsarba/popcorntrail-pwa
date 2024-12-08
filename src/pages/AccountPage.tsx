import { TopBar } from "../components/TopBar";
import { ListContainer } from "../components/ListContainer";
import { ListItem } from "../components/ListItem";

import { getUserData } from "../services/userService";

import { motion } from "framer-motion";

export function AccountPage() {
  const user = getUserData();

  // Clear localStorage
  const handleClearStorage = () => {
    if (
      window.confirm(
        "Are you sure you want to clear your Local Storage? This action will remove all your data from the app and cannot be undone."
      )
    ) {
      localStorage.clear();
      window.location.reload();
      console.log("Local storage cleared");
    }
  };

  return (
    <>
      <TopBar backLink={"/settings"} title={"Settings"} />

      <motion.main
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="flex flex-col gap-6 px-3 pb-24 pt-4 text-neutral-100"
      >
        {/* <motion.h1
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="-mb-1 text-3xl font-bold capitalize"
        >
          Your Profile
        </motion.h1> */}

        {user && (
          <section>
            <ListContainer>
              <ListItem
                title={"Username"}
                text={user.username}
                link={"/settings/account"}
                className="text-neutral-100/25"
              />
              <ListItem
                title={"Password"}
                text={"N/A"}
                link={"/settings/account"}
                className="text-neutral-100/25"
              />
            </ListContainer>
            {user && (
              <p className="mt-2 text-pretty px-4 text-sm leading-4 text-neutral-100/25">
                You are currently using your browser's local storage to store
                data.
              </p>
            )}
          </section>
        )}

        {user && (
          <section>
            <ListContainer>
              <ListItem
                title={"Clear Local Storage"}
                link={undefined}
                onClick={handleClearStorage}
                className={"!justify-center text-orange [&>*]:pr-0"}
              />
            </ListContainer>
          </section>
        )}
        <section>
          <ListContainer>
            <ListItem
              title={!user ? "Sign in" : "Logout"}
              link={!user ? "/" : undefined}
              className={`!justify-center [&>*]:pr-0 [&>:has(svg)]:hidden ${!user ? "text-blue" : "text-red opacity-25"}`}
            />
          </ListContainer>
        </section>
      </motion.main>
    </>
  );
}
