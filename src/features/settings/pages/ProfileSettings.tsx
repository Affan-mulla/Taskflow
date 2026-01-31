import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/shared/store/store.user";
import { useState } from "react";
import AvatarImg from "@/components/Common/AvatarImage";
import { HugeiconsIcon } from "@hugeicons/react";
import { Pen } from "@hugeicons/core-free-icons";
import SettingRow from "../components/SettingRow";
import EmailChangeButton from "../components/EmailChangeButton";

const ProfileSettings = () => {
  const { user } = useUserStore();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saving profile:", formData);
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto w-full my-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">Profile</h2>
        <p className="text-sm text-muted-foreground">
          Manage your personal information
        </p>
      </div>

      <Card className="rounded-md">
        <CardContent className="divide-y divide-border space-y-2">
          <SettingRow
            title="Profile picture"
            description="This will be shown across the workspace"
          >
            <div className="relative group">
              <div className="size-10">
                <AvatarImg
                  src={formData.avatar}
                  fallbackText={formData.name.charAt(0)}
                />
              </div>

              <label
                htmlFor="avatar"
                className="absolute inset-0 grid place-items-center
              bg-black/40 opacity-0 group-hover:opacity-100 cursor-pointer transition"
              >
                <HugeiconsIcon icon={Pen} className="size-4 text-white" />
              </label>

              <input id="avatar" type="file" className="hidden" />
            </div>
          </SettingRow>

          {/* Email */}
          <SettingRow title="Email" description="Your login email address">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{formData.email}</span>
              <EmailChangeButton/>
            </div>
          </SettingRow>

          {/* Full name */}
          <SettingRow title="Full name">
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="max-w-xs"
            />
          </SettingRow>
        </CardContent>
        {/* Profile picture */}
      </Card>

      <div>
        <h2 className="text-xl font-semibold">Workspace Access</h2>
      </div>

      <Card className="rounded-md">
        <CardContent className="flex items-center justify-between gap-4">
          <CardTitle>
            Remove yourself from the workspace
          </CardTitle>
          <Button variant="destructive">Leave workspace</Button>
        </CardContent>
      </Card>

    </div>
  );
};

export default ProfileSettings;
