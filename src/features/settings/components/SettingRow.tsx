import { Label } from "@/components/ui/label";

const SettingRow = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex items-center justify-between gap-6 py-2">
      <div className="space-y-1">
        <Label className="text-sm font-medium">{title}</Label>
        {description && (
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      <div className="flex items-center justify-end min-w-[180px]">
        {children}
      </div>
    </div>
  );
};

export default SettingRow;