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
import { Spinner } from "@/components/ui/spinner";
import { useCreateWorkspace } from "@/features/workspace/hooks/useCreateWorkspace";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useIsUrlUnique } from "@/features/workspace/hooks/useIsUrlUnique";
import {
  workspaceSchema,
  type workspaceSchemaType,
} from "@/features/workspace/validation/createWorkspace";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddSquareIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const CreateWorkspace = () => {
  const { loading, createWorkspaceHandler } = useCreateWorkspace();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<workspaceSchemaType>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      workspaceName: "",
      workspaceUrl: "",
    },
  });

  const workspaceUrl = watch("workspaceUrl");
  const { debounce } = useDebounce(workspaceUrl || "");
  const { loading: urlLoading, isUrlUnique, unique } = useIsUrlUnique();

  useEffect(() => {
    // Workspace URL unique check
    if (debounce) {
      isUrlUnique(debounce);
    }
  }, [debounce]);
  
  const onSubmit = async (data: workspaceSchemaType) => {
    // Prevent submission if URL is not unique
    if (unique === false) {
      toast.error("This workspace URL is not available. Please choose another.");
      return;
    }

    try {
      const formatedData = {
        workspaceName: data.workspaceName,
        workspaceUrl: data.workspaceUrl,
      };

      const res = await createWorkspaceHandler(formatedData);

      if (res?.error) {
        toast.error(res.error);
      }

      if (res?.success) {
        toast.success("Workspace created successfully!");
        navigate(`/${data.workspaceUrl}`, { replace: true });
      }
    } catch (error) {
      toast.error("Workspace creation failed. Please try again.");
      console.error("Error creating workspace: ", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-accent/10 via-accent/5 to-background px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Create your workspace
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            A workspace is where your team plans, tracks, and ships work
            together.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Workspace Name */}
            <div className="space-y-1.5">
              <Label htmlFor="workspace-name">Workspace name</Label>
              <Input
                {...register("workspaceName", { required: true })}
                id="workspace-name"
                placeholder="e.g. Taskflow Team"
                autoFocus
              />
              {errors.workspaceName && (
                <p className="text-red-600 text-xs" role="alert">
                  {errors.workspaceName.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                This will be visible to your team members.
              </p>
            </div>

            {/* Workspace URL */}
            <div className="space-y-1.5">
              <Label htmlFor="workspace-url">Workspace URL</Label>
              <div className="flex">
                <span className="flex items-center rounded-l-lg border border-r-0 bg-muted px-3 text-sm text-muted-foreground">
                  taskflow.com/
                </span>
                <Input
                  {...register("workspaceUrl")}
                  id="workspace-url"
                  placeholder="your-workspace"
                  className="rounded-l-none"
                />
              </div>
              {errors.workspaceUrl && (
                <p className="text-red-600 text-xs" role="alert">
                  {errors?.workspaceUrl?.message}
                </p>
              )}
              {
                urlLoading && <p className="text-xs text-muted-foreground">Checking availability...</p>
              }
              {!errors.workspaceUrl && workspaceUrl && !urlLoading && (
                <>
                  {unique === false && (
                    <p className="text-xs text-red-600">
                      This workspace URL is not available.
                    </p>
                  )}
                  {unique === true && (
                    <p className="text-xs text-green-600">
                      ✓ This workspace URL is available.
                    </p>
                  )}
                </>
              )}
              <p className="text-xs text-muted-foreground">
                You can change this later in settings.
              </p>
            </div>

            <Button 
              className="w-full mt-4" 
              size="lg" 
              type="submit"
              disabled={loading || (unique === false && workspaceUrl !== "")}
            >
              {loading ? (
                <>
                  <Spinner /> Creating workspace ...
                </>
              ) : (
                <>
                  <HugeiconsIcon
                    icon={AddSquareIcon}
                    className="size-4.5"
                    strokeWidth={2}
                  />
                  Create workspace
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateWorkspace;
