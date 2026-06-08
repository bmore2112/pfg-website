import http from 'node:http';
import handler from 'serve-handler';

const PORT = process.env.PORT || 5173;

const server = http.createServer((req, res) =>
  handler(req, res, {
    public: 'public',
    cleanUrls: true,
    // Dev: never cache, so edits always show on a normal refresh.
    headers: [
      { source: '**', headers: [{ key: 'Cache-Control', value: 'no-store, must-revalidate' }] }
    ]
  })
);

server.listen(PORT, () => {
  console.log(`\n  🌴 Premiumfangirls running at  http://localhost:${PORT}\n`);
});
