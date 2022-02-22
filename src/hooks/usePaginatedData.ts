import { useEffect, useState } from "react";
import { PAGE_SIZE } from "../constants";
import { Data, useDataQuery } from "../lib/fakeApollo";

export type Navigator = {
  index: number;
  maxPages: number;
  next: () => void;
  prev: () => void;
  goToPage: (page: number) => void;
};

const usePaginatedData = (): {
  nav: Navigator;
  data: { dataList: Data[] | null; loading: boolean };
} => {
  const [index, setIndex] = useState<number>(0);
  const { data: dataList, loading } = useDataQuery();

  const maxPages =
    dataList === null ? 0 : Math.ceil(dataList.length / PAGE_SIZE);

  useEffect(() => {
    if (index >= maxPages && maxPages !== 0) {
      setIndex(maxPages - 1);
    }
  }, [index, maxPages]);

  const pageDataList =
    dataList === null
      ? null
      : dataList.slice(index * PAGE_SIZE, index * PAGE_SIZE + PAGE_SIZE);

  const next = () => {
    if (index === maxPages - 1) return;
    setIndex(index + 1);
  };
  const prev = () => {
    if (index === 0) return;
    setIndex(index - 1);
  };
  const goToPage = (page: number) => {
    if (page >= 0 && page <= maxPages - 1) setIndex(page);
  };

  return {
    nav: { index, next, prev, goToPage, maxPages },
    data: { dataList: pageDataList, loading },
  };
};

export default usePaginatedData;
