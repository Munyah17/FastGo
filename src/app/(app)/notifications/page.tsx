import { ScreenHeader } from "@/components/ui";
import NotificationsView from "./NotificationsView";

export default function NotificationsPage() {
  return (
    <div>
      <ScreenHeader title="Notifications" back="/" />
      <NotificationsView />
    </div>
  );
}
