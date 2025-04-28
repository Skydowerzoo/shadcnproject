import { render, screen } from "@testing-library/react";
import AdminPage from "./page";

describe("AdminPage", () => {
  it("affiche le dashboard admin", () => {
    render(<AdminPage />);
    expect(screen.getByText(/dashboard admin/i)).toBeInTheDocument();
    expect(screen.getByText(/statistiques/i)).toBeInTheDocument();
    expect(screen.getByText(/utilisateurs/i)).toBeInTheDocument();
    expect(screen.getByText(/activité/i)).toBeInTheDocument();
  });
});
