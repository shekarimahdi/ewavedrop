// wagmiConfig.ts
import { cookieStorage, createStorage } from "wagmi";
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { bsc } from '@reown/appkit/networks';

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) {
  throw new Error('❌ NEXT_PUBLIC_PROJECT_ID تعریف نشده. لطفاً آن را در فایل .env قرار دهید.');
}

// انتخاب شبکه‌ها بر اساس محیط
const networks = [bsc];

// راه‌اندازی wagmi با adapter
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

// کانفیگ اصلی wagmi
export const config = wagmiAdapter.wagmiConfig;
