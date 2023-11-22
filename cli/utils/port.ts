import { createServer } from "node:net";

export const checkPort = (port: number) =>
  new Promise<boolean>((resolve) => {
    const server = createServer();
    server.listen(port, () => {
      const address = server.address();
      const port = typeof address === "string" ? null : address?.port;
      server.close(() => (port ? resolve(true) : resolve(false)));
    });
    server.on("error", () => resolve(false));
  });

export const usePort = async (start = 3000, end = 65536) => {
  for (let port = start; port < end; port++) {
    if (await checkPort(port)) return port;
  }
  return Promise.reject(new Error("没有可用的端口"));
};
