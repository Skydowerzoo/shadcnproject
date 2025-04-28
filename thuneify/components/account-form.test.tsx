import { render, screen } from "@testing-library/react";
import AccountForm from "./account-form";

describe("AccountForm", () => {
  it("affiche le formulaire de compte", () => {
    render(<AccountForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
