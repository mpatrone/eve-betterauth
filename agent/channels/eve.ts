import { eveChannel } from "eve/channels/eve";
import { localDev, type AuthFn, vercelOidc } from "eve/channels/auth";
import { auth } from "../../apps/web/lib/auth.js";

const betterAuthSession: AuthFn<Request> = async (request) => {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) 
    {
      console.log("NULL SESSION!");
      return null;
    }
    console.log(session.user.email);
    console.log(session.user.name);

    const attributes: Record<string, string> = {
      email: session.user.email,
      name: session.user.name,
    };
    if (session.user.image) {
      attributes.picture = session.user.image;
    }

    return {
      attributes,
      authenticator: "better-auth:vercel",
      principalId: session.user.id,
      principalType: "user",
    };
  } catch (error) {
    console.error("Error in betterAuthSession:", error);
    return null;
  }
};

export default eveChannel({
  auth: [ betterAuthSession, vercelOidc(), localDev()],
});
