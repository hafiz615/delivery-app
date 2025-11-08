import "@testing-library/jest-dom";

// Mock localStorage
const localStorageMock = {
  getItem: (key) => {
    return localStorageMock[key] || null;
  },
  setItem: (key, value) => {
    localStorageMock[key] = value;
  },
  removeItem: (key) => {
    delete localStorageMock[key];
  },
  clear: () => {
    Object.keys(localStorageMock).forEach((key) => {
      if (
        key !== "getItem" &&
        key !== "setItem" &&
        key !== "removeItem" &&
        key !== "clear"
      ) {
        delete localStorageMock[key];
      }
    });
  },
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});
