import { useState } from "react";
import { PAGE_SIZE } from "../constants";
import { useDataQuery } from "../lib/fakeApollo";

const usePaginatedData = () => {
  const [index, setIndex] = useState<number>(0);
  const { data: dataList, loading } = useDataQuery();

  const maxPages =
    dataList === null ? 0 : Math.ceil(dataList.length / PAGE_SIZE);

  const pageDataList =
    dataList === null
      ? null
      : dataList.slice(index * PAGE_SIZE, index * PAGE_SIZE + PAGE_SIZE);

  const next = () => {
    if (index === maxPages - 1) return;
    setIndex(index + 1);
  };
  const previous = () => {
    if (index === 0) return;
    setIndex(index - 1);
  };
  const goToPage = (page: number) => {
    if (page >= 0 && page <= maxPages - 1) setIndex(page);
  };

  return {
    nav: { index, next, previous, goToPage, maxPages },
    data: { dataList: pageDataList, loading },
  };
};

export default usePaginatedData;
