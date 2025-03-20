import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
}

export class EmailService {
  static async sendEmail(options: EmailOptions): Promise<void> {
    // メール送信の実装
    console.log('Sending email:', options);
  }
}

export const sendEmail = EmailService.sendEmail;

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'メールアドレスの確認',
    html: `
      <p>以下のリンクをクリックしてメールアドレスを確認してください：</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
    `
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'パスワードリセット',
    html: `
      <p>以下のリンクからパスワードをリセットしてください：</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>このリンクは1時間後に無効になります。</p>
    `
  });
};
