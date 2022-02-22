import { renderHook } from "@testing-library/react-hooks";
import React from "react";
import { act } from "react-dom/test-utils";
import { PAGE_SIZE } from "../constants";
import { Data, FakeAPIProvider } from "../lib/fakeApollo";
import usePaginatedData from "./usePaginatedData";

const generateNData = (n: number) => {
  return new Array(n).fill(true).map((_, index) => {
    return { title: `title${index}` };
  });
};

describe("usePaginatedData", () => {
  const renderUsePaginatedData = (initialState: any[]) => {
    const wrapper = ({ children }: { children: React.ReactElement }) => {
      return (
        <FakeAPIProvider initialState={initialState as Data[]}>
          {children}
        </FakeAPIProvider>
      );
    };
    return renderHook(() => usePaginatedData(), { wrapper });
  };
  it("returns the navigation and the data", async () => {
    const { result, waitForNextUpdate } = renderUsePaginatedData(
      generateNData(7)
    );

    await waitForNextUpdate({ timeout: 2000 });

    expect(result.current.nav.index).toBe(0);
    expect(result.current.nav.maxPages).toBe(2);
    expect(result.current.data.loading).toBe(false);
    expect(result.current.data.dataList).toHaveLength(PAGE_SIZE);
  });

  it("returns the data paginated", async () => {
    const initialState = generateNData(10);

    const { result, waitForNextUpdate } = renderUsePaginatedData(initialState);
    await waitForNextUpdate({ timeout: 2000 });

    expect(result.current.data.loading).toBe(false);
    expect(result.current.data.dataList).toHaveLength(PAGE_SIZE);
    expect(result.current.data.dataList?.[0]).toStrictEqual(initialState[0]);

    act(() => result.current.nav.next());

    expect(result.current.data.dataList?.[0]).toStrictEqual(
      initialState[PAGE_SIZE]
    );
  });

  it("respects the maximum number of pages and a minimum value of 0", async () => {
    const initialState = generateNData(18);

    const { result, waitForNextUpdate } = renderUsePaginatedData(initialState);
    await waitForNextUpdate({ timeout: 2000 });

    expect(result.current.nav.index).toBe(0);
    expect(result.current.nav.maxPages).toBe(4);

    act(() => result.current.nav.prev());
    expect(result.current.nav.index).toBe(0);

    act(() => result.current.nav.next());
    expect(result.current.nav.index).toBe(1);

    act(() => result.current.nav.prev());
    expect(result.current.nav.index).toBe(0);

    act(() => result.current.nav.goToPage(100));
    expect(result.current.nav.index).toBe(0);

    act(() => result.current.nav.goToPage(3));
    expect(result.current.nav.index).toBe(3);

    act(() => result.current.nav.next());
    expect(result.current.nav.index).toBe(3);
  });
});
