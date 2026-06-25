import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 1. SERVIR ARQUIVOS ESTÁTICOS CORRETAMENTE (primeiro)
  // Certificando que a pasta "public" seja servida primeiro, permitindo acesso direto a /manifest.json e ícones.
  // Usamos index: false para evitar servir o index.html bruto em vez de passar para o Vite/SPA compilado.
  app.use(express.static(path.join(process.cwd(), "public"), { index: false }));

  // 2. ROTAS DE API (se existirem) - segundo
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // 3. FALLBACK SPA (último)
  if (process.env.NODE_ENV !== "production") {
    // Vite middleware para desenvolvimento
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Em produção, servir os arquivos compilados de dist
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

startServer();
