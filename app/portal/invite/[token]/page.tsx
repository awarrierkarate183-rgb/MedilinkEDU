import type { Metadata } from "next";
import { RedeemInviteForm } from "@/components/portal/RedeemInviteForm";

export const metadata: Metadata = {
  title: "Chapter invitation",
  robots: { index: false, follow: false },
};

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md rounded-[var(--radius)] bg-white p-8">
        <p className="kicker">Invitation</p>
        <h1 className="text-2xl font-semibold">Confirm your chapter and create an account</h1>
        <p className="mt-2 text-sm text-muted">
          This code is single-use and can expire or be revoked. It does not contain
          private student information.
        </p>
        <RedeemInviteForm token={token} />
      </div>
    </div>
  );
}
