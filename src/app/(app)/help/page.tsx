import Link from "next/link";
import { ScreenHeader, Card, ListRow, Divider } from "@/components/ui";
import {
  Headset,
  Question,
  Chat,
  Phone,
  User,
  Dollar,
  Car,
  Wallet,
  Shield,
} from "@/components/Icons";
import { user, helpTopics } from "@/lib/data";

const topicIcons = {
  user: User,
  dollar: Dollar,
  car: Car,
  wallet: Wallet,
  shield: Shield,
};

const channels = [
  { label: "FAQs", icon: Question, bg: "bg-brand-soft text-brand", href: "/help/faqs" },
  { label: "Chat with us", icon: Chat, bg: "bg-good-soft text-good", href: "/messages/chat" },
  { label: "Call Support", icon: Phone, bg: "bg-brand-soft text-brand", href: "tel:+263242000000" },
];

export default function HelpPage() {
  return (
    <div>
      <ScreenHeader title="Help & Support" back="/profile" />

      <div className="px-4 pb-6">
        <Card className="flex items-center gap-3 border-brand/15 bg-brand-soft px-4 py-4">
          <span className="flex-1">
            <span className="block text-[16px] font-bold">
              Hi {user.firstName},
            </span>
            <span className="block text-[13px] text-sub">
              How can we help you today?
            </span>
          </span>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand">
            <Headset size={22} />
          </span>
        </Card>

        <Card className="mt-3.5 flex justify-around px-2 py-4">
          {channels.map(({ label, icon: Icon, bg, href }) => (
            <Link
              key={label}
              href={href}
              className="flex w-24 flex-col items-center gap-1.5 text-[12px] font-medium text-ink"
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full ${bg}`}
              >
                <Icon size={18} />
              </span>
              {label}
            </Link>
          ))}
        </Card>

        <div className="mb-2 mt-5 text-[15px] font-semibold">
          Popular Topics
        </div>
        <Card>
          {helpTopics.map((topic, i) => {
            const Icon = topicIcons[topic.icon as keyof typeof topicIcons];
            return (
              <div key={topic.title}>
                {i > 0 && <Divider />}
                <ListRow
                  href="/help/faqs"
                  icon={<Icon size={17} />}
                  iconBg="bg-page text-sub"
                  title={topic.title}
                />
              </div>
            );
          })}
        </Card>

        <Card className="mt-3.5 px-4 py-4">
          <div className="text-[15px] font-bold">Still need help?</div>
          <p className="mt-1 text-[13px] text-sub">
            Our support team is available 24/7 to assist you.
          </p>
          <Link
            href="/messages/chat"
            className="mt-3.5 block w-full rounded-xl bg-brand py-3 text-center text-[14.5px] font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Start Live Chat
          </Link>
        </Card>
      </div>
    </div>
  );
}
