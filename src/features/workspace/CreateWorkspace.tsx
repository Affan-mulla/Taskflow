import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddSquareIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const CreateWorkspace = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-accent/10 via-accent/5 to-background px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Create your workspace
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            A workspace is where your team plans, tracks, and ships work together.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-5">
            {/* Workspace Name */}
            <div className="space-y-1.5">
              <Label htmlFor="workspace-name">Workspace name</Label>
              <Input
                id="workspace-name"
                placeholder="e.g. Taskflow Team"
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                This will be visible to your team members.
              </p>
            </div>

            {/* Workspace URL */}
            <div className="space-y-1.5">
              <Label htmlFor="workspace-url">Workspace URL</Label>
              <div className="flex">
                <span className="flex items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground">
                  taskflow.com/
                </span>
                <Input
                  id="workspace-url"
                  placeholder="your-workspace"
                  className="rounded-l-none"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                You can change this later in settings.
              </p>
            </div>

            <Button className="w-full mt-4" size="lg">
              <HugeiconsIcon icon={AddSquareIcon} className="size-4.5" strokeWidth={2} />
              Create workspace
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateWorkspace;