# Dynamic Hierarchical Agents & Mixture-of-Agents (MoA) Architecture

## Overview
AbacusAI Bot provides a dynamic, recursive hierarchical sub-agent framework and Mixture-of-Agents (MoA) consensus fusion engine (`packages/agent/src/hierarchical-agents.ts`).

## Key Features

### 1. Dynamic Recursive Sub-Agent Spawning
Parent agents (e.g. Orchestrator / Engineering Lead) can dynamically spawn child role sub-agents based on task complexity:
- Orchestrator Lead
  - Development Manager
    - Frontend Developer
    - Backend Developer
  - Quality Assurance / Code Reviewer

Sub-agents execute assigned sub-tasks independently and compile status reports back up the parent hierarchy.

### 2. Mixture-of-Agents (MoA) Fusion Engine
When dealing with complex reasoning or creative tasks, the MoA fusion engine (`MixtureOfAgentsFusion.fuseResponses`) aggregates and synthesizes candidate responses across multiple specialized model roles to compute an optimal unified output.

### 3. Shared Codebase Memory & Watchdog
- `SharedMemoryStore`: Persistent memory tracking project TODOs, key architectural decisions, user preferences, and last-left session state.
- `SessionWatchdog`: Monitors active session health and heartbeats.
- Context Compaction: Automatically summarizes historical turns to prevent context window overflow.
