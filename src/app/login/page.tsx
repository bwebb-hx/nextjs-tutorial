"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/app/page.module.css';
import { loginToHexabase } from '@/hexabase/hexabase';
import Cookies from 'js-cookie';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    // Replace with your backend authentication logic
    const loginResult = await loginToHexabase(email, password);

    if (loginResult.success) {
      // Set authentication cookie (simple example, adjust to your needs)
      if (!loginResult.token) {
        console.error("internal server error: failed to get access token from client");
        return;
      }
      Cookies.set("tokenHxb", loginResult.token)
      router.push('/');
    } else {
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.todoApp}>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <div>
            <input
              type="email"
              className={styles.inputField}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              className={styles.inputField}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.addButton}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
