import agents from "../../agents.json" with { type: "json" };

export default async (request) => {
  const ua = request.headers.get('user-agent');

  let isBot = false;
  agents.forEach(agent => {
    if (ua.toLowerCase().includes(agent.toLowerCase())) {
      isBot = true;
      return;
    }
  });

  if (isBot) {
    return new Response(null, { status: 401 });
  } else {
    return;
  }
};

export const config = {
  path: "*",
};
