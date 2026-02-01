import { Button } from "@/components/ui/button";
import {
  ArrowLeft02Icon, 
  FileNotFoundIcon, 
  Home01Icon, 
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useNavigate } from "react-router";

const NotFoundPage = () => {
  const router = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col w-full items-center justify-center overflow-hidden bg-background px-6">
      {/* Background Depth Effects */}
      <div className="absolute top-0 z-0 h-full w-full">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="z-10 flex flex-col items-center text-center">
        {/* Animated Icon Container */}
        <div className="relative mb-8 flex h-16 w-16 items-center justify-center rounded-xl bg-secondary/30 border border-white/5 shadow-2xl backdrop-blur-sm">
          <div className="absolute inset-0 rounded-xl border-t border-white/20 pointer-events-none" />
          <HugeiconsIcon 
            icon={FileNotFoundIcon} 
            className="size-8 text-primary drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
          />
        </div>

        {/* Text Content */}
        <h1 className="mb-2 text-6xl font-bold tracking-tighter text-foreground sm:text-7xl">
          404
        </h1>
        <h2 className="mb-4 text-xl font-semibold text-foreground/90 sm:text-2xl">
          Page not found
        </h2>
        <p className="mb-10 max-w-[400px] text-muted-foreground leading-relaxed">
          The page you're looking for doesn't exist or has been moved. 
          Please check the URL or head back home.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={() => router(-1)}
            variant="outline"
             >
            <HugeiconsIcon icon={ArrowLeft02Icon} className="size-5" />
            <span>Go Back</span>
          </Button>

          <Button
            onClick={() => router("/")}
             >
            <HugeiconsIcon icon={Home01Icon} className="size-5" />
            <span>Return Home</span>
          </Button>
        </div>
      </div>

      {/* Subtle Footer or Help Text */}
      <div className="absolute bottom-8 z-10 text-sm text-muted-foreground/60">
        Error Code: <span className="font-mono text-xs uppercase">0x404_NOT_FOUND</span>
      </div>
    </div>
  );
};

export default NotFoundPage;