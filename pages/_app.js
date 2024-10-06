// pages/_app.js
import { SessionProvider } from "next-auth/react";
import '../styles/globals.css';  // Adjust path if needed

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
