import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setVerificationStatus('error');
        return;
      }

      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });

        if (response.ok) {
          setVerificationStatus('success');
        } else {
          setVerificationStatus('error');
        }
      } catch (error) {
        console.error('Verification failed:', error);
        setVerificationStatus('error');
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div>
      {verificationStatus === 'pending' && <p>メールアドレスを確認中...</p>}
      {verificationStatus === 'success' && <p>メールアドレスが確認されました！</p>}
      {verificationStatus === 'error' && <p>確認に失敗しました。リンクが無効か期限切れの可能性があります。</p>}
    </div>
  );
};
