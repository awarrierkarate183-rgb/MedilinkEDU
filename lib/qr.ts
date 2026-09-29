import QRCode from "qrcode";
import { siteUrl } from "@/lib/utils";

export async function chapterJoinQrDataUrl(joinCode: string) {
  const url = `${siteUrl()}/join/${encodeURIComponent(joinCode)}`;
  return QRCode.toDataURL(url, { margin: 1, width: 420, color: { dark: "#0B1F3A", light: "#FFFFFF" } });
}
