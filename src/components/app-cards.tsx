import clsx, { type ClassValue } from "clsx";
import { type FC, type PropsWithChildren } from "react";

export const CommonCard: FC<
  PropsWithChildren & { classNames?: ClassValue }
> = ({ children, classNames }) => {
  return (
    <div
      className={clsx(
        "w-full rounded-lg bg-white px-8 py-6 shadow-sm sm:max-w-md",
        classNames
      )}
    >
      {children}
    </div>
  );
};
