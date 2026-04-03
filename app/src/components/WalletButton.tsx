import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

export function WalletButton() {
  const { setVisible } = useWalletModal();
  const { connected, disconnect, publicKey } = useWallet();

  if (connected && publicKey) {
    const short = `${publicKey.toBase58().slice(0, 4)}…${publicKey.toBase58().slice(-4)}`;
    return (
      <button
        id="btn-disconnect-wallet"
        className="btn-premium btn-outline"
        style={{ borderRadius: '99px' }}
        onClick={() => disconnect()}
        title={publicKey.toBase58()}
      >
        🟢 {short}
      </button>
    );
  }

  return (
    <button
      id="btn-connect-wallet"
      className="btn-premium btn-primary"
      style={{ borderRadius: '99px' }}
      onClick={() => setVisible(true)}
    >
      🔗 Connect Wallet
    </button>
  );
}
