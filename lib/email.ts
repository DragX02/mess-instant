import { Resend } from "resend";

let resend: Resend | undefined;

function getResend() {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

function hasResendKey() {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendVerificationEmail(to: string, url: string) {
  if (!hasResendKey()) {
    console.log(`[dev] Email de vérification pour ${to} : ${url}`);
    return;
  }

  await getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Vérifiez votre adresse email",
    html: `<p>Bienvenue sur Helix ! Cliquez sur le lien ci-dessous pour vérifier votre adresse email :</p><p><a href="${url}">${url}</a></p>`,
  });
}

export async function sendResetPasswordEmail(to: string, url: string) {
  if (!hasResendKey()) {
    console.log(`[dev] Email de réinitialisation pour ${to} : ${url}`);
    return;
  }

  await getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Réinitialisez votre mot de passe",
    html: `<p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous :</p><p><a href="${url}">${url}</a></p><p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>`,
  });
}
