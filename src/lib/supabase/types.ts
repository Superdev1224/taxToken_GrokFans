export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          wallet_address: string;
          referral_code: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          wallet_address: string;
          referral_code: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      referrals: {
        Row: {
          id: string;
          child_wallet: string;
          parent_wallet: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          child_wallet: string;
          parent_wallet: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["referrals"]["Insert"]>;
      };
      rewards: {
        Row: {
          id: string;
          wallet_address: string;
          tier: "builder" | "leader" | "holder";
          amount_token: number;
          source_tx: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          wallet_address: string;
          tier: "builder" | "leader" | "holder";
          amount_token?: number;
          source_tx?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["rewards"]["Insert"]>;
      };
    };
  };
};

export type User = Database["public"]["Tables"]["users"]["Row"];
export type Referral = Database["public"]["Tables"]["referrals"]["Row"];
export type Reward = Database["public"]["Tables"]["rewards"]["Row"];

export type TreeNode = {
  wallet: string;
  referralCode?: string;
  children: TreeNode[];
  depth: number;
};
