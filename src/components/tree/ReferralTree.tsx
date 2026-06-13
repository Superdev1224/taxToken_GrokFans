"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { TreeNode } from "@/lib/supabase/types";
import { fetchTree } from "@/lib/referralApi";
import { truncateAddress } from "@/lib/utils";
import { GlassCard } from "@/components/ui/GlassCard";
import { Loader2 } from "lucide-react";

type Props = {
  wallet: string;
};

function layoutTree(
  node: TreeNode,
  x = 0,
  y = 0,
  xGap = 200,
  yGap = 100
): { nodes: Node[]; edges: Edge[]; width: number } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const nodeId = node.wallet;
  const isRoot = node.depth === 0;

  nodes.push({
    id: nodeId,
    position: { x, y },
    data: {
      label: (
        <div className="text-center">
          <p className="font-mono text-xs text-white">
            {truncateAddress(node.wallet, 6)}
          </p>
          {node.referralCode && (
            <p className="text-[10px] text-neon-cyan/60">{node.referralCode}</p>
          )}
        </div>
      ),
    },
    style: {
      background: isRoot ? "rgba(255,215,0,0.15)" : "rgba(0,255,255,0.08)",
      border: isRoot
        ? "1px solid rgba(255,215,0,0.5)"
        : "1px solid rgba(0,255,255,0.3)",
      borderRadius: "12px",
      padding: "10px 14px",
      color: "#fff",
      fontSize: "12px",
      minWidth: "120px",
      boxShadow: isRoot
        ? "0 0 15px rgba(255,215,0,0.2)"
        : "0 0 10px rgba(0,255,255,0.15)",
    },
  });

  const childCount = node.children.length;
  const totalWidth = Math.max(1, childCount) * xGap;
  const startX = x - totalWidth / 2 + xGap / 2;

  node.children.forEach((child, i) => {
    const childX = childCount === 1 ? x : startX + i * xGap;
    const childY = y + yGap;
    const childLayout = layoutTree(child, childX, childY, xGap, yGap);

    nodes.push(...childLayout.nodes);
    edges.push(...childLayout.edges);
    edges.push({
      id: `${nodeId}-${child.wallet}`,
      source: nodeId,
      target: child.wallet,
      animated: true,
      style: { stroke: "rgba(0,255,255,0.4)" },
    });
  });

  return { nodes, edges, width: totalWidth };
}

export function ReferralTree({ wallet }: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [loading, setLoading] = useState(true);
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [offline, setOffline] = useState(false);

  const countNodes = useCallback((node: TreeNode): number => {
    return node.children.reduce(
      (sum, child) => sum + 1 + countNodes(child),
      0
    );
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchTree(wallet);
        setOffline(!!data.offline);

        if (data.tree) {
          const layout = layoutTree(data.tree, 400, 0);
          setNodes(layout.nodes);
          setEdges(layout.edges);
          setTotalReferrals(countNodes(data.tree));
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [wallet, setNodes, setEdges, countNodes]);

  if (loading) {
    return (
      <GlassCard className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neon-cyan" />
      </GlassCard>
    );
  }

  if (offline) {
    return (
      <GlassCard className="flex h-64 flex-col items-center justify-center gap-3 text-center">
        <p className="text-neon-cyan">Supabase not configured</p>
        <p className="max-w-sm text-sm text-white/40">
          Connect Supabase to visualize your referral tree. Referral links still
          work in offline mode.
        </p>
      </GlassCard>
    );
  }

  if (totalReferrals === 0) {
    return (
      <GlassCard className="flex h-64 flex-col items-center justify-center gap-3 text-center">
        <p className="text-white/60">No referrals yet</p>
        <p className="max-w-sm text-sm text-white/40">
          Share your referral link to start building your network.
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-0 overflow-hidden">
      <div className="border-b border-neon-cyan/20 px-5 py-3">
        <p className="text-sm text-white/60">
          <span className="font-bold text-neon-cyan">{totalReferrals}</span>{" "}
          direct & indirect referrals
        </p>
      </div>
      <div className="h-[500px] w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="rgba(0,255,255,0.05)" gap={20} />
          <Controls className="!bg-brilliant-black !border-neon-cyan/30 !shadow-glow-cyan [&>button]:!bg-brilliant-black [&>button]:!border-neon-cyan/20 [&>button]:!text-neon-cyan" />
          <MiniMap
            nodeColor={() => "rgba(0,255,255,0.3)"}
            maskColor="rgba(0,0,0,0.8)"
            className="!bg-brilliant-black !border-neon-cyan/20"
          />
        </ReactFlow>
      </div>
    </GlassCard>
  );
}
