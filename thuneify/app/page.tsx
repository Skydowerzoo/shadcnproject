
import { LoginForm } from "@/components/login-form"

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bienvenu sur l'application Thuneify</h1>
      <p className="mb-4">Vous retrouverez ici tout ce que vous pouvez faire via cette application</p>
      <LoginForm />
    </div>
    
    
  );
}
