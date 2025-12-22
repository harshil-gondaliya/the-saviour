import Head from 'next/head';
import { useEffect } from 'react';
import Layout from '../components/layout/Layout';
import '../style/global.css';

function MyApp({ Component, pageProps }) {

  useEffect(() => {
    // Ensure MetaMask is available
    if (typeof window !== 'undefined' && window.ethereum) {
      // Detect account change
      window.ethereum.on('accountsChanged', (accounts) => {
        console.log('🔄 Account switched to:', accounts[0]);
        window.location.reload(); // reload to update connected wallet
      });

      // Detect network (chain) change
      window.ethereum.on('chainChanged', () => {
        console.log('🔁 Network changed');
        window.location.reload();
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>The Saviour - Crowdfunding DApp</title>
        <meta name="description" content="Decentralized crowdfunding platform" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
