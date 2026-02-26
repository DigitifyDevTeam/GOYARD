import { dirname } from "path";
import { fileURLToPath } from "url";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * ESLint flat config with security & reliability rules (SonarQube-style).
 * Run: npm run lint
 * SonarQube: add sonar-scanner or use SonarCloud; config in sonar-project.properties
 */
export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
        project: ["./tsconfig.json", "./tsconfig.node.json"],
        tsconfigRootDir: __dirname,
      },
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        fetch: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        FormData: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        Blob: "readonly",
        File: "readonly",
        AbortController: "readonly",
        ResizeObserver: "readonly",
        IntersectionObserver: "readonly",
        MutationObserver: "readonly",
        requestAnimationFrame: "readonly",
        cancelAnimationFrame: "readonly",
        HTMLElement: "readonly",
        Element: "readonly",
        Event: "readonly",
        CustomEvent: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        crypto: "readonly",
        btoa: "readonly",
        atob: "readonly",
        Image: "readonly",
        navigator: "readonly",
        location: "readonly",
        history: "readonly",
        performance: "readonly",
        queueMicrotask: "readonly",
        Promise: "readonly",
        Map: "readonly",
        Set: "readonly",
        WeakMap: "readonly",
        WeakSet: "readonly",
        Proxy: "readonly",
        Reflect: "readonly",
        Symbol: "readonly",
        BigInt: "readonly",
        Intl: "readonly",
        ArrayBuffer: "readonly",
        DataView: "readonly",
        Float32Array: "readonly",
        Int32Array: "readonly",
        Uint8Array: "readonly",
        TextEncoder: "readonly",
        TextDecoder: "readonly",
        structuredClone: "readonly",
        self: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...tseslint.configs.recommended.rules,

      // ——— Security (SonarQube-style) ———
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-script-url": "error",
      "no-octal-escape": "error",

      // ——— Reliability & type safety (SonarQube-style) ———
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unsafe-call": "warn",
      "@typescript-eslint/no-unsafe-member-access": "warn",
      "@typescript-eslint/no-unsafe-return": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/require-await": "warn",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-misused-promises": "warn",

      // ——— React (exhaustive-deps disabled: eslint-plugin-react-hooks@4 not compatible with ESLint 10) ———
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "off",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },
  {
    ignores: ["node_modules/**", "dist/**", "**/*.config.js", "**/*.config.ts", "coverage/**"],
  },
];
