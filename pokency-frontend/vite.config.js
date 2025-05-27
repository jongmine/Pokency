import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target:
          "https://j1dysge505.execute-api.ap-northeast-2.amazonaws.com/Prod",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        // 위 줄이 포인트! /api 접두어를 Lambda Gateway가 인식할 수 있게 변환
      },
    },
  },
});
