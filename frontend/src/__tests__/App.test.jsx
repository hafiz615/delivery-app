// src/__tests__/App.test.jsx
import { render, screen } from "@testing-library/react";
import { describe, test, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import App from "../App";

// Helper function
const renderWithRouter = (initialRoute = "/") => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );
};

describe("App routing", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("renders login page at /login", () => {
    renderWithRouter("/login");
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
  });

  test("redirects to login when accessing /delivery without token", () => {
    renderWithRouter("/delivery");
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
  });

  test("redirects to login when accessing /summary without token", () => {
    renderWithRouter("/summary");
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
  });
});
