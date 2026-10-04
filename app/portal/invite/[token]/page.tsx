import type { Metadata } from "next";
import { RedeemInviteForm } from "@/components/portal/RedeemInviteForm";
import { getInvitationPreview } from "@/lib/platform/operations";

export const metadata: Metadata = {
  title: "Create your student account",
  robots: { index: false, follow: false },
};

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const preview = await getInvitationPreview(token);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md rounded-[var(--radius)] bg-white p-8">
        <p className="kicker">Student invitation</p>
        <h1 className="text-2xl font-semibold">Create your student account</h1>
        {"error" in preview ? (
          <p className="mt-4 text-sm text-muted">{preview.error}</p>
        ) : (
          <>
            <p className="mt-2 text-sm text-muted">
              Choose a password for the student portal. This login will not open
              the advisor portal.
            </p>
            <RedeemInviteForm
              token={token}
              email={preview.email || ""}
              firstName={preview.firstName}
              lastName={preview.lastName}
            />
          </>
        )}
      </div>
    </div>
  );
}
