Set Up Convex Auth
Creating a new project
To start a new project from scratch with Convex and Convex Auth, run

npm create convex@latest

and choose React (Vite) and then Convex Auth.

This guide assumes you already have a working Convex app from following the instructions above.

Install the NPM library
npm install @convex-dev/auth @auth/core@0.37.0

This also installs @auth/core, which you will use during provider configuration later.

Run the initialization command
npx @convex-dev/auth

This sets up your project for authenticating via the library.

Alternatively you can perform these steps manually: Manual Setup

Add authentication tables to your schema
Convex Auth assumes you have several tables set up with specific indexes.

You can add these tables to your schema via the authTables export:

convex/schema.ts
import { defineSchema } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
 
const schema = defineSchema({
  ...authTables,
  // Your other tables...
});
 
export default schema;

Set up the React provider
Convex Auth has support for both App Router and Pages Router without any server-side authentication (SSA).

There is experimental support for SSA on the Next.js server with App Router. SSA with the Pages Router is currently unsupported.

Server provider
Wrap your app in ConvexAuthNextjsServerProvider from @convex-dev/auth/nextjs/server:

app/layout.tsx
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}

Client provider
In your client provider file, replace ConvexProvider from convex/react

with ConvexAuthNextjsProvider from @convex-dev/auth/nextjs:

app/ConvexClientProvider.tsx
"use client";
 
import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";
 
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
 
export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexAuthNextjsProvider client={convex}>
      {children}
    </ConvexAuthNextjsProvider>
  );
}

Only the parts of your app that call Convex functions (queries, mutations, actions) need to be wrapped in ConvexClientProvider. If you want to use Convex from your whole app, you can also place the ConvexClientProvider in your app/layout.tsx:

app/layout.tsx
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { ConvexClientProvider } from "./ConvexClientProvider";
 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en">
        <body>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}

Middleware
Finally, add a middleware.ts file using convexAuthNextjsMiddleware:

middleware.ts
import { convexAuthNextjsMiddleware } from "@convex-dev/auth/nextjs/server";
 
export default convexAuthNextjsMiddleware();
 
export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

Note that the React examples in this documentation are all Client Components unless noted otherwise, so you might need to add "use client" to their source.

The initial setup is done. Next you'll configure passwords 

Passwords
Make sure you're done with setup before configuring authentication methods

This authentication method relies on the user to remember (or preferably store in a password manager software) a secret password.

Proper password-based authentication system requires at minimum a way for the user to reset their password (usually via email or text).

You might also want to require email verification (during initial sign up or afterwards) to prevent users from accidentally or maliciously using the wrong email.

Email + password setup
You can implement the email (or username) and password sign-in via the Password provider config.

Provider configuration
Add the provider config to the providers array in convex/auth.ts.

You can import the Password provider from @convex-dev/auth/providers/Password:

convex/auth.ts
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
 
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password],
});

Add sign-in form
Now you can trigger sign-up or sign-in from a form submission via the signIn function.

The first argument to the function is the provider ID, which unless customized is a lowercase version of the provider name, in this case password.

The Password provider included in @convex-dev/auth assumes that the sign-up and sign-in flows are separate - this can prevent some user confusion during errors - and indicated via the flow field.

src/SignIn.tsx
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
 
export function SignIn() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"signUp" | "signIn">("signIn");
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        void signIn("password", formData);
      }}
    >
      <input name="email" placeholder="Email" type="text" />
      <input name="password" placeholder="Password" type="password" />
      <input name="flow" type="hidden" value={step} />
      <button type="submit">{step === "signIn" ? "Sign in" : "Sign up"}</button>
      <button
        type="button"
        onClick={() => {
          setStep(step === "signIn" ? "signUp" : "signIn");
        }}
      >
        {step === "signIn" ? "Sign up instead" : "Sign in instead"}
      </button>
    </form>
  );
}

Check out the example repo for a more polished UI.

When you're done configuring your chosen authentication methods, learn how to use authentication in your frontend and backend in Authorization.

Email reset setup
Email reset is essentially a completely separate sign-in flow with two steps:

The user requests a password reset link/code to be sent to their email address
The user either clicks on the link or fills out the code on the website, and also fills out a new password
This is very similar to the Magic Links and OTPs authentication methods, and the implementation will also be similar.

Note that password reset via a link will require you to implement some form of routing so that your app knows that it should be rendering the 2nd password reset step.

Provider configuration
The Password provider included in Convex Auth supports password reset flow via the reset option, which takes an Auth.js email provider config.

First, create a custom email provider.

This example sends an OTP and uses additional dependencies
convex/ResendOTPPasswordReset.ts
import Resend from "@auth/core/providers/resend";
import { Resend as ResendAPI } from "resend";
import { RandomReader, generateRandomString } from "@oslojs/crypto/random";
 
export const ResendOTPPasswordReset = Resend({
  id: "resend-otp",
  apiKey: process.env.AUTH_RESEND_KEY,
  async generateVerificationToken() {
    const random: RandomReader = {
      read(bytes) {
        crypto.getRandomValues(bytes);
      },
    };
 
    const alphabet = "0123456789";
    const length = 8;
    return generateRandomString(random, alphabet, length);
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    const resend = new ResendAPI(provider.apiKey);
    const { error } = await resend.emails.send({
      from: "My App <onboarding@resend.dev>",
      to: [email],
      subject: `Reset your password in My App`,
      text: "Your password reset code is " + token,
    });
 
    if (error) {
      throw new Error("Could not send");
    }
  },
});

Then use it in convex/auth.ts:

convex/auth.ts
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { ResendOTPPasswordReset } from "./ResendOTPPasswordReset";
 
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password({ reset: ResendOTPPasswordReset })],
});

Check out the example repo for a more polished email template.

Add password reset form
The Password provider included in @convex-dev/auth expects the password reset flow to be indicated via the flow field (just like the sign-up and sign-in flows were): "reset" for the initial step and "reset-verification" after the user provides the new password.

src/PasswordReset.tsx
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
 
export function PasswordReset() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"forgot" | { email: string }>("forgot");
  return step === "forgot" ? (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        void signIn("password", formData).then(() =>
          setStep({ email: formData.get("email") as string })
        );
      }}
    >
      <input name="email" placeholder="Email" type="text" />
      <input name="flow" type="hidden" value="reset" />
      <button type="submit">Send code</button>
    </form>
  ) : (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        void signIn("password", formData);
      }}
    >
      <input name="code" placeholder="Code" type="text" />
      <input name="newPassword" placeholder="New password" type="password" />
      <input name="email" value={step.email} type="hidden" />
      <input name="flow" value="reset-verification" type="hidden" />
      <button type="submit">Continue</button>
      <button type="button" onClick={() => setStep("forgot")}>
        Cancel
      </button>
    </form>
  );
}

Because this is a short code, we must also provide the email that matches the account used for the sign-in. The library automatically rate-limits failed attempts.

Check out the example repo for a more polished UI.

Email verification setup
Provider configuration
The Password provider included in Convex Auth supports a verification flow via the verify option, which takes an Auth.js email provider.

First, create a custom email provider.

This example sends an OTP and uses additional dependencies
convex/ResendOTP.ts
import Resend from "@auth/core/providers/resend";
import { Resend as ResendAPI } from "resend";
import { RandomReader, generateRandomString } from "@oslojs/crypto/random";
 
export const ResendOTP = Resend({
  id: "resend-otp",
  apiKey: process.env.AUTH_RESEND_KEY,
  async generateVerificationToken() {
    const random: RandomReader = {
      read(bytes) {
        crypto.getRandomValues(bytes);
      },
    };
 
    const alphabet = "0123456789";
    const length = 8;
    return generateRandomString(random, alphabet, length);
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    const resend = new ResendAPI(provider.apiKey);
    const { error } = await resend.emails.send({
      from: "My App <onboarding@resend.dev>",
      to: [email],
      subject: `Sign in to My App`,
      text: "Your code is " + token,
    });
 
    if (error) {
      throw new Error("Could not send");
    }
  },
});

Check out the example repo for a more polished email template.

Then use it in convex/auth.ts:

convex/auth.ts
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { ResendOTP } from "./ResendOTP";
 
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password({ verify: ResendOTP })],
});

Add verification form
By configuring the verify option the Password provider automatically checks whether the user has verified their email during the sign-in flow.

If the user previously verified their email, they will be immediately signed-in.

The async signIn function returns a boolean indicating whether the sign-in was immediately successful. In the example below we don't check it, as we assume that the whole SignIn component will be unmounted when the user is signed-in.

src/SignIn.tsx
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
 
export function SignIn() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"signIn" | "signUp" | { email: string }>(
    "signIn"
  );
  return step === "signIn" || step === "signUp" ? (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        void signIn("password", formData).then(() =>
          setStep({ email: formData.get("email") as string })
        );
      }}
    >
      <input name="email" placeholder="Email" type="text" />
      <input name="password" placeholder="Password" type="password" />
      <input name="flow" value={step} type="hidden" />
      <button type="submit">{step === "signIn" ? "Sign in" : "Sign up"}</button>
      <button
        type="button"
        onClick={() => {
          setStep(step === "signIn" ? "signUp" : "signIn");
        }}
      >
        {step === "signIn" ? "Sign up instead" : "Sign in instead"}
      </button>
    </form>
  ) : (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        void signIn("password", formData);
      }}
    >
      <input name="code" placeholder="Code" type="text" />
      <input name="flow" type="hidden" value="email-verification" />
      <input name="email" value={step.email} type="hidden" />
      <button type="submit">Continue</button>
      <button type="button" onClick={() => setStep("signIn")}>
        Cancel
      </button>
    </form>
  );
}

Check out the example repo for a more polished UI.

Customize sign-up form validation
You'll want to improve the input validation for your sign-up form. Some suggestions:

Use Zod to validate basics like email format and password length, and share the logic between client and backend
Use haveibeenpwned to check whether the email the user wants to use has been previously leaked
Use zxcvbn-ts to require a minimum password strength
Remember to use ConvexError to pass error information from your backend to your frontend.

Email address validation
Use the profile option to Password to invoke email validation logic.

This example uses Zod to validate the email format:

CustomEmail.ts
import { ConvexError } from "convex/values";
import { Password } from "@convex-dev/auth/providers/Password";
import { z } from "zod";
 
const ParamsSchema = z.object({
  email: z.string().email(),
});
 
export default Password({
  profile(params) {
    const { error, data } = ParamsSchema.safeParse(params);
    if (error) {
      throw new ConvexError(error.format());
    }
    return { email: data.email };
  },
});

Password validation
Use the validatePasswordRequirements option to Password to invoke password validation logic.

If you don't supply custom validation, the default behavior simply requires that a password is 8 or more characters. If you do supply custom validation, the default validation is not used.

This example requires a certain password length and contents:

CustomPassword.ts
import { ConvexError } from "convex/values";
import { Password } from "@convex-dev/auth/providers/Password";
 
export default Password({
  validatePasswordRequirements: (password: string) => {
    if (
      password.length < 8 ||
      !/\d/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[A-Z]/.test(password)
    ) {
      throw new ConvexError("Invalid password.");
    }
  },
});

Customize user information
Your sign-up form can include additional fields, and you can write these to your users documents.

To do this, you need to:

Customize the schema to define the additional fields
Return the additional fields from the profile method
This examples sets an additional role field received from the frontend:

CustomProfile.ts
import { Password } from "@convex-dev/auth/providers/Password";
import { DataModel } from "./_generated/dataModel";
 
export default Password<DataModel>({
  profile(params, ctx) {
    return {
      email: params.email as string,
      name: params.name as string,
      role: params.role as string,
    };
  },
});

Replace the built-in Password provider with the one we've defined above.

Parametrizing Password with your DataModel gives you strict type checking for the return value of profile.

Completely customize the sign-in process
You can control entirely the sign-in process on the backend by using the ConvexCredentials provider config. See the source of Password for an example.

The server entrypoint exports a number of functions you can use, and you can also define and call your own mutations.

Server-side authentication in Next.js
You can set up your Next.js App Router app to have access to the authentication state on the server.

Setup
Make sure your React providers and middleware are correctly set up first.

Require authentication for certain routes
By default, all routes can be accessed without authenticating. You can configure which routes require authentication in your middleware.ts:

middleware.ts
import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
 
const isSignInPage = createRouteMatcher(["/signin"]);
const isProtectedRoute = createRouteMatcher(["/product(.*)"]);
 
export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  if (isSignInPage(request) && (await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, "/product");
  }
  if (isProtectedRoute(request) && !(await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, "/signin");
  }
});
 
export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

In general, you'll likely want to redirect when an unauthenticated user tries to access a route that requires authentication.

To do this, you can pass a function to convexAuthNextjsMiddleware. This function can also be used to compose other middleware behaviors.

This function has as arguments the NextRequest, the NextFetchEvent, and the ConvexAuthNextjsContext. convexAuth.isAuthenticated() and convexAuth.getToken() function similarly to isAuthenticatedNextjs and convexAuthNextjsToken, but should be used in middleware to ensure they reflect any updates to the request context from convexAuthNextjsMiddleware.

Convex Auth provides an API and helper functions for implementing your middleware:

createRouteMatcher is a helper function that uses the same syntax as the middleware config. You call it with a list of glob patterns, and it returns a function that given the NextRequest returns whether the route matches.

nextjsMiddlewareRedirect is a simple shortcut for triggering redirects:

export function nextjsMiddlewareRedirect(
  request: NextRequest,
  pathname: string,
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.redirect(url);
}

You can inline this code if you need more control over the target URL.

Configure cookie expiration
You can configure the expiration of the authentication cookie by passing a cookieConfig option to convexAuthNextjsMiddleware.

middleware.ts
export default convexAuthNextjsMiddleware(
  (request, { convexAuth }) => {
    // ...
  },
  { cookieConfig: { maxAge: 60 * 60 * 24 * 30 } },
); // 30 days

If you don't set this option, the cookie will be considered a "session cookie" and be deleted when the browser session ends, which depends from browser to browser.

Preloading and loading data
To preload or load data on your Next.js server from your Convex backend, you can use preloadQuery and fetchQuery and the convexAuthNextjsToken function from @convex-dev/auth/nextjs/server:

app/TasksWrapper.tsx
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Tasks } from "./Tasks";
 
export async function TasksWrapper() {
  const preloadedTasks = await preloadQuery(
    api.tasks.list,
    { list: "default" },
    { token: await convexAuthNextjsToken() },
  );
  return <Tasks preloadedTasks={preloadedTasks} />;
}

Calling authenticated mutations and actions
You can call Convex mutations and actions from Next.js Server Actions and POST or PUT Route Handlers.

app/example/page.tsx
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { api } from "@/convex/_generated/api";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { revalidatePath } from "next/cache";
 
export default async function PureServerPage() {
  const tasks = await fetchQuery(api.tasks.list, { list: "default" });
  async function createTask(formData: FormData) {
    "use server";
 
    await fetchMutation(
      api.tasks.create,
      {
        text: formData.get("text") as string,
      },
      { token: await convexAuthNextjsToken() },
    );
    revalidatePath("/example");
  }
  // render tasks and task creation form
  return <form action={createTask}>...</form>;
}

Security notice: ConvexAuthNextjsServerProvider uses cookies to store authentication state. Therefore to prevent CSRF attacks you must not perform any side-effects from the Next.js server on GET requests. This means that only Convex queries are safe to call from Server Components and GET Route Handlers.

Essentially, a malicious site might cause your user's browser to make an authenticated GET request without the user's permission, but it won't be able to read the response. Outside of GET requests, Convex Auth makes authentication state available only to same-origin requests.

Convex Auth is not special here, and the same security considerations apply to most other authentication solutions.

Authorization

