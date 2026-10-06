import forms from "@/data/forms.json";
import { CONTACT_EMAIL } from "@/lib/constants";
import { formOrMailto } from "@/lib/utils";

export { CONTACT_EMAIL };

export function actionHref(
  key: keyof typeof forms,
  subject: string,
) {
  return formOrMailto(forms[key], subject, CONTACT_EMAIL);
}

export function photoEmailHref() {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Chapter photos")}`;
}
