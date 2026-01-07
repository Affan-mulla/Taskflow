import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Link } from "react-router"

type AuthFormProps = {
  mode: "login" | "register"
  onSubmit?: () => void
}

export const AuthForm = ({ mode, onSubmit }: AuthFormProps) => {
  const isLogin = mode === "login"

  return (
    <div className="w-full max-w-sm space-y-6 rounded-xl border bg-card p-6 shadow-sm">
      {/* Header */}
      <div className="space-y-1 text-center">
        <div>
          <img
            src="/Taskflow.svg"
            alt="TaskFlow Logo"
            className="m-auto h-12 w-12"
          />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {isLogin ? "Sign in to TaskFlow" : "Create your  account"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isLogin
            ? "Welcome back. Let's get work done."
            : "Get started in seconds."}
        </p>
      </div>

      {/* Google */}
      <Button variant="outline" className="w-full gap-2">
         <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15.64"
            height="16"
            viewBox="0 0 256 262"
          >
            <rect width="256" height="262" fill="none" />
            <path
              fill="#4285f4"
              d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
            />
            <path
              fill="#34a853"
              d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
            />
            <path
              fill="#fbbc05"
              d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
            />
            <path
              fill="#eb4335"
              d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
            />
          </svg>
        Continue with Google
      </Button>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">OR</span>
        <Separator className="flex-1" />
      </div>

      {/* Email form */}
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit?.()
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@company.com" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
          />
        </div>

        {/* Register-only field */}
        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input
              id="confirm"
              type="password"
              placeholder="••••••••"
            />
          </div>
        )}

        <Button className="w-full" type="submit">
          {isLogin ? "Sign in" : "Create account"}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground">
        {isLogin ? (
          <>
            Don’t have an account?{" "}
            <Link to="/register" className="underline cursor-pointer">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link to="/login" className="underline cursor-pointer">
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  )
}
