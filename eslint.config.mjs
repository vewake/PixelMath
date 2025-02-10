import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/ban-ts-comment": "off", // Disables @ts-expect-error/@ts-ignore checks
      "@typescript-eslint/no-explicit-any": "off", // Disables warnings for 'any' type
      "@typescript-eslint/no-unused-vars": "off", // Disables unused variable warnings
      "react-hooks/exhaustive-deps": "off", // Disables missing dependency warnings in useEffect
    },
  },
];

export default eslintConfig;
