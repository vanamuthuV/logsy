import React, { createContext, useContext, useEffect, useState } from "react";
import { Logs } from "@/types/type";
import { fetchLogs } from "@/utils/loader";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { setLogs } from "@/store/logSlice";
import { triggerRefresh } from "@/store/logSlice";

export const LogStorageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isLive: Boolean = useAppSelector((state) => state?.logs?.mode);
  const refresh: Boolean = useAppSelector((state) => state?.logs?.refresh);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLive) {
      (async () => {
        console.log("Fetching fresh logs from DB...");
        const freshLogs = await fetchLogs();
        dispatch(setLogs(freshLogs));
        dispatch(triggerRefresh(false));
      })();
    }
  }, [isLive, refresh]);

  return <>{children}</>;
};
