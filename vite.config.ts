import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    base: "/Labb1---Typescript/",
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
            }
        }
    }
});