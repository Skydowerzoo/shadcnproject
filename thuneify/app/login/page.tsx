import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    <div className="grid grid-cols-3 gap-4 ...">
      <div>01</div>
      <div className="place-self-auto ...">
        02
        <LoginForm />
      </div>
      <div>03</div>
      <div>04</div>
      <div>05</div>
      <div>06</div>
    </div>
  );
}
