import { render, screen } from "@testing-library/react";
import Login from "./login";

describe("Login", () => {
  it("affiche le formulaire de connexion", () => {
    render(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
