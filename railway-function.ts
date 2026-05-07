declare const Bun: {
  env: Record<string, string | undefined>;
  serve(options: {
    port: number;
    fetch(req: Request): Response | Promise<Response>;
  }): unknown;
};

const jsonHeaders = {
  "content-type": "application/json",
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,POST,OPTIONS",
  "access-control-allow-headers": "content-type,authorization",
};

type ProxyOperation =
  | "fly.graphql"
  | "fly.app.create"
  | "fly.app.delete"
  | "fly.machine.create";

type ProxyRequest = {
  operation: ProxyOperation;
  token?: string;
  body?: unknown;
  appName?: string;
};

type UpstreamRequest = {
  url: string;
  method: "GET" | "POST" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: jsonHeaders,
  });
}

async function readJson<T>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    throw new Error("Invalid JSON request body");
  }
}

function bearer(token: string | undefined) {
  if (!token) {
    throw new Error("Missing token");
  }

  return `Bearer ${token}`;
}

function safeName(name: string | undefined, label: string) {
  if (!name || !/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(name)) {
    throw new Error(`Invalid ${label}`);
  }

  return name;
}

function upstreamFor(input: ProxyRequest): UpstreamRequest {
  switch (input.operation) {
    case "fly.graphql":
      return {
        url: "https://api.fly.io/graphql",
        method: "POST",
        headers: {
          authorization: bearer(input.token),
          "content-type": "application/json",
        },
        body: input.body,
      };
    case "fly.app.create":
      return {
        url: "https://api.machines.dev/v1/apps",
        method: "POST",
        headers: {
          authorization: bearer(input.token),
          "content-type": "application/json",
        },
        body: input.body,
      };
    case "fly.app.delete":
      return {
        url: `https://api.machines.dev/v1/apps/${safeName(input.appName, "app name")}`,
        method: "DELETE",
        headers: {
          authorization: bearer(input.token),
          "content-type": "application/json",
        },
      };
    case "fly.machine.create":
      return {
        url: `https://api.machines.dev/v1/apps/${safeName(input.appName, "app name")}/machines`,
        method: "POST",
        headers: {
          authorization: bearer(input.token),
          "content-type": "application/json",
        },
        body: input.body,
      };
  }
}

async function proxy(req: Request) {
  const upstream = upstreamFor(await readJson<ProxyRequest>(req));
  const response = await fetch(upstream.url, {
    method: upstream.method,
    headers: upstream.headers,
    body:
      upstream.method === "GET" || upstream.body === undefined
        ? undefined
        : JSON.stringify(upstream.body),
  });
  const text = await response.text();

  return json({
    ok: response.ok,
    status: response.status,
    body: text ? JSON.parse(text) : null,
  });
}

Bun.serve({
  port: Number(Bun.env.PORT || 3000),
  async fetch(req) {
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: jsonHeaders });
    }

    const path = new URL(req.url).pathname.replace(/\/$/, "");

    if (req.method === "GET" && (path === "" || path === "/")) {
      return json({
        ok: true,
        mode: "flyio-proxy",
        message:
          "This function proxies only allowlisted Fly.io operations for the browser deploy UI.",
      });
    }

    if (req.method === "POST" && path === "/proxy") {
      try {
        return await proxy(req);
      } catch (error) {
        return json(
          { error: error instanceof Error ? error.message : String(error) },
          400,
        );
      }
    }

    return json({ error: "Not found" }, 404);
  },
});
