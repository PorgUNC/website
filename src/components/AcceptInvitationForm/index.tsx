'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {acceptInvite} from './actions';

type AcceptInviteParams = {
  email: string;
  token: string;
};

export default function AcceptInviteForm({ email, token }: AcceptInviteParams) {
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('');
  const router = useRouter();

  function validatePassword(pw: string): string | null {
    if (pw.length < 8) return 'Password must be at least 8 characters long';
    if (!/[a-z]/.test(pw)) return 'Password must include a lowercase letter';
    if (!/[A-Z]/.test(pw)) return 'Password must include an uppercase letter';
    if (!/[0-9]/.test(pw)) return 'Password must include a number';
    return null;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');

    const pwError = validatePassword(password);
    if (pwError) {
      setStatus(pwError);
      return;
    }

    if (password !== confirmPassword) {
      setStatus('Passwords do not match');
      return;
    }

    const result = await acceptInvite({ token, fullName, password });

    if (result.error) {
      setStatus(result.error);
    } else {
      setStatus('success');
      router.push('/admin');
    }
  }

  return (
    <div className="flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 rounded-lg bg-[var(--card)] p-8 shadow-md"
      >
        <h1 className="text-2xl font-bold text-[var(--card-foreground)] text-center">
          Accept Invitation
        </h1>
        <p className="text-center text-[var(--muted-foreground)]">
          Creating account for <span className="font-medium">{email}</span>
        </p>

        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--card-foreground)]">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required
            className="w-full rounded-md border px-3 py-2 border-[var(--input)] bg-[var(--input)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring focus:ring-[var(--primary)]"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--card-foreground)]">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full rounded-md border px-3 py-2 border-[var(--input)] bg-[var(--input)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring focus:ring-[var(--primary)]"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--card-foreground)]">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            className="w-full rounded-md border px-3 py-2 border-[var(--input)] bg-[var(--input)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring focus:ring-[var(--primary)]"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2 font-semibold hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        >
          Create Account
        </button>

        {status && (
          <p
            className={`mt-2 text-center text-sm ${
              status === 'loading'
                ? 'text-[var(--muted-foreground)]'
                : status === 'success'
                  ? 'text-[var(--success)]'
                  : 'text-[var(--error)]'
            }`}
          >
            {status === 'loading'
              ? 'Submitting…'
              : status === 'success'
                ? 'Account created! Redirecting…'
                : status}
          </p>
        )}
      </form>
    </div>
  );
}
