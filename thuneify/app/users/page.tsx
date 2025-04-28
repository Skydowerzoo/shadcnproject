import { useAuthRedirect } from "@/hooks/use-auth-redirect";

export default function UsersPage() {
  useAuthRedirect();

  return (
    <div>
      <h1>Users Page</h1>
      <p>Welcome to the users page.</p>
    </div>
  );
}
