# VAPT Insights hub multi-zone

The hub app is a separate Vercel project that is publicly served by the
main VAPT Insights project under `/hub/*`.

## Hub project

This project uses the `/hub-static` asset prefix in `next.config.ts`.
Deploy it as its own Vercel project. No rewrite is needed in this project.

Run it locally on port 3001:

```bash
npm run dev -- --port 3001
```

## Main VAPT Insights project

Set `HUB_ORIGIN` on the **main VAPT Insights project**:

| Environment | Value |
| --- | --- |
| Development | `http://localhost:3001` |
| Preview | the compliance project preview URL |
| Production | the compliance project production URL |

Then add these rewrites to the main app's `next.config.ts`:

```ts
async rewrites() {
  const hubOrigin = process.env.HUB_ORIGIN;

  if (!hubOrigin) return [];

  return [
    {
      source: "/hub",
      destination: `${hubOrigin}/hub`,
    },
    {
      source: "/hub/:path+",
      destination: `${hubOrigin}/hub/:path+`,
    },
    {
      source: "/hub-static/:path+",
      destination: `${hubOrigin}/hub-static/:path+`,
    },
  ];
},
```

The main app must own the rewrites because it owns `vaptinsights.com`. The
asset rewrite is required so the DPDP app's CSS and JavaScript load from the
same public domain without colliding with the main app's `/_next` assets.
