import { act, renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useCounter } from "./useCounter";

describe("useCounter", () => {
  it.skip("should increment counter", async () => {
    const { result } = renderHook(() => useCounter());
    await act(() => {
      result.current.increment();
    });
    expect(result.current.count).toBe(1);
  });
});
