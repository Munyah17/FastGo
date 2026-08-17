import { ScreenHeader } from "@/components/ui";
import { Phone } from "@/components/Icons";
import ChatView from "./ChatView";

export default function ChatPage() {
  return (
    <div>
      <ScreenHeader
        title="Blessing M."
        back="/messages"
        right={
          <button
            aria-label="Call"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-good-soft text-good"
          >
            <Phone size={17} />
          </button>
        }
      />
      <ChatView />
    </div>
  );
}
