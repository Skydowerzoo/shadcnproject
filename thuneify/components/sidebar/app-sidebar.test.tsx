import { render, screen } from "@testing-library/react";
import { AppSidebar } from "./app-sidebar";
import { AuthContext } from "@/context/auth-context";

describe("AppSidebar", () => {
  it("affiche les liens principaux", () => {
    render(
      <AuthContext.Provider value={{ user: { firstname: "Test", email: "test@test.com", role: "user" }, isAuthenticated: true, login: jest.fn(), logout: jest.fn(), isLoading: false }}>
        <AppSidebar />
      </AuthContext.Provider>
    );
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Expenses/i)).toBeInTheDocument();
    expect(screen.getByText(/Grocery/i)).toBeInTheDocument();
  });
  it("affiche le bouton Admin si l'utilisateur est admin", () => {
    render(
      <AuthContext.Provider value={{ user: { firstname: "Admin", email: "admin@test.com", role: "admin" }, isAuthenticated: true, login: jest.fn(), logout: jest.fn(), isLoading: false }}>
        <AppSidebar />
      </AuthContext.Provider>
    );
    expect(screen.getByText(/Admin/i)).toBeInTheDocument();
  });
});
