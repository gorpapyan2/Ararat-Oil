# Ararat OIL Component Library Structure

## Overview

This document outlines the new component library structure for Ararat OIL, designed to eliminate duplication and improve maintainability.

## Directory Structure

```
src/
├── components/         # Presentational components only
│   ├── ui/             # Base UI components
│   │   ├── primitives/ # Basic building blocks (Button, Input, etc.)
│   │   ├── composed/   # Compositions of primitives (Card, Dialog, etc.)
│   │   └── specialized/ # Domain-specific UI components
│   ├── forms/          # Form components
│   │   ├── fields/     # Reusable form fields
│   │   ├── sections/   # Reusable form sections
│   │   └── templates/  # Form templates for different entities
│   └── layout/         # Layout components
├── hooks/              # Custom hooks
│   ├── form/           # Form-related hooks
│   ├── data/           # Data fetching hooks
│   └── ui/             # UI-related hooks
├── services/           # Business logic
│   ├── api/            # API services
│   ├── state/          # State management
│   └── domain/         # Domain-specific business logic
├── lib/                # Shared utilities
├── types/              # Type definitions
└── features/           # Feature-specific code
    └── [feature]/
        ├── components/ # Feature-specific components
        ├── hooks/      # Feature-specific hooks
        └── services/   # Feature-specific services

```

## Color Palette

The Ararat OIL design system uses an olive-lime color palette:

- Black: #000000
- Dark Olive: #3E432E
- Medium Olive: #616F39
- Lime: #A7D129

## Migration Strategy

1. All duplicated components will be consolidated into this structure
2. Components will maintain backward compatibility during migration
3. Deprecated components will be removed after all references are updated
