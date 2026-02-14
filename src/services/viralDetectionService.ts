/**
 * ============================================================================
 * VIRAL DETECTION SERVICE
 * ============================================================================
 * MIGRATION: No migration needed.
 * This is pure client-side logic — it clusters new tokens by name similarity
 * to detect "viral" trends. No API calls, no backend dependency.
 * ============================================================================
 */
import { Token } from '@/data/mockTokens';
import { onNewToken, getTokens } from '@/services/pumpPortalService';

const VIRAL_THRESHOLD = 3;
const CLUSTER_WINDOW_MS = 60 * 60 * 1000; // 60 minutes

export interface ViralCluster {
  name: string;
  displayName: string;
  tokens: Token[];
  firstSeen: number;
  lastSeen: number;
  count: number;
  topToken: Token;
  ogToken: Token;
}

type ClusterListener = (clusters: ViralCluster[]) => void;

// --- Helpers ---

function normalizeName(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[\u{1F000}-\u{1FFFF}]/gu, '') // emojis
    .replace(/[^a-z\s]/g, '')                // special chars & digits
    .trim();
}

function extractPrimaryWord(normalized: string): string {
  return normalized.split(/\s+/)[0] || normalized;
}

// --- Singleton State ---

interface TokenEntry {
  token: Token;
  normalizedName: string;
  timestamp: number;
}

const allEntries: TokenEntry[] = [];
const clusterMap = new Map<string, ViralCluster>();
const listeners = new Set<ClusterListener>();

function rebuildCluster(name: string) {
  const now = Date.now();
  const entries = allEntries.filter(
    (e) => e.normalizedName === name && now - e.timestamp < CLUSTER_WINDOW_MS
  );
  if (entries.length < VIRAL_THRESHOLD) {
    if (clusterMap.has(name)) {
      clusterMap.delete(name);
      notifyListeners();
    }
    return;
  }

  const tokens = entries.map((e) => e.token);
  const sorted = [...tokens].sort((a, b) => b.mcap - a.mcap);

  clusterMap.set(name, {
    name,
    displayName: entries[0].token.ticker || entries[0].token.name,
    tokens,
    firstSeen: entries[entries.length - 1].timestamp,
    lastSeen: entries[0].timestamp,
    count: tokens.length,
    topToken: sorted[0],
    ogToken: tokens[tokens.length - 1], // earliest
  });

  notifyListeners();
}

function handleNewToken(token: Token) {
  const normalized = normalizeName(token.name);
  if (!normalized) return;

  const entry: TokenEntry = { token, normalizedName: normalized, timestamp: Date.now() };
  allEntries.push(entry);

  // Check exact match first
  rebuildCluster(normalized);

  // Secondary: if first word matches an existing cluster with threshold met
  const primary = extractPrimaryWord(normalized);
  if (primary !== normalized) {
    for (const [clusterName] of clusterMap) {
      if (extractPrimaryWord(clusterName) === primary && clusterName !== normalized) {
        // Add this token to the primary cluster too
        const existing = allEntries.find(
          (e) => e.token.id === token.id && e.normalizedName === clusterName
        );
        if (!existing) {
          allEntries.push({ token, normalizedName: clusterName, timestamp: Date.now() });
          rebuildCluster(clusterName);
        }
        break;
      }
    }
  }
}

function notifyListeners() {
  const snapshot = getViralClusters();
  listeners.forEach((fn) => fn(snapshot));
}

// --- Public API ---

export function getViralClusters(): ViralCluster[] {
  return Array.from(clusterMap.values()).sort((a, b) => b.count - a.count);
}

export function getClusterTokens(name: string): Token[] {
  const cluster = clusterMap.get(name);
  if (!cluster) return [];
  return [...cluster.tokens].sort((a, b) => b.mcap - a.mcap);
}

export function subscribeViralClusters(listener: ClusterListener): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

let initialized = false;

export function initViralDetection() {
  if (initialized) return;
  initialized = true;

  // Process existing tokens
  const existing = getTokens();
  existing.forEach(handleNewToken);

  // Listen for new ones
  onNewToken(handleNewToken);
}
