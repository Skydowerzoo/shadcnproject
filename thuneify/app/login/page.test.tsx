import { render, screen } from "@testing-library/react";
import LoginPage from "./page";

describe("LoginPage", () => {
  it("affiche le formulaire de connexion", () => {
    render(<LoginPage />);
    expect(screen.getByText(/connexion/i)).toBeInTheDocument();
  });
});
