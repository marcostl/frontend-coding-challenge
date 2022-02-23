import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";
import { useMemo } from "react";
import { Navigator } from "../hooks/usePaginatedData";

const getNavigatorItems = (
  index: number,
  maxPages: number
): (number | "LEFT_DOTS" | "RIGHT_DOTS")[] => {
  if (maxPages === 1) return [0];

  const pages: (number | "LEFT_DOTS" | "RIGHT_DOTS")[] = [];

  if (index - 1 >= 0) pages.push(index - 1);
  pages.push(index);
  if (index + 1 < maxPages) pages.push(index + 1);

  if (pages[0] > 0) {
    pages.unshift("LEFT_DOTS");
  }
  if (pages[pages.length - 1] < maxPages - 1) {
    pages.push("RIGHT_DOTS");
  }

  return pages;
};

const PageNavigator = ({ navigator }: { navigator: Navigator }) => {
  const { index, maxPages, next, prev, goToPage } = navigator;
  const navigatorItems = useMemo(
    () => getNavigatorItems(index, maxPages),
    [index, maxPages]
  );

  if (maxPages === 1) return null;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex items-stretch justify-center space-x-2">
        <button
          disabled={index === 0}
          onClick={() => prev()}
          className="p-1 rounded hover:bg-gray-200 disabled:cursor-not-allowed disabled:bg-white"
        >
          <ChevronLeftIcon
            className={`w-4 h-4 ${index === 0 ? "text-gray-300" : ""}`}
          />
        </button>
        {navigatorItems.map((item) => {
          if (item === "LEFT_DOTS" || item === "RIGHT_DOTS") {
            return <span key={item}>...</span>;
          }

          return (
            <button
              key={item}
              onClick={() => goToPage(item)}
              className={`py-1 px-2 rounded ${
                item === index ? "bg-gray-300" : "hover:bg-gray-200"
              }`}
            >
              {item + 1}
            </button>
          );
        })}

        <button
          disabled={index === maxPages - 1}
          onClick={() => next()}
          className="p-1 rounded hover:bg-gray-200 disabled:cursor-not-allowed disabled:bg-white"
        >
          <ChevronRightIcon
            className={`w-4 h-4 ${
              index === maxPages - 1 ? "text-gray-300" : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
};
export default PageNavigator;
