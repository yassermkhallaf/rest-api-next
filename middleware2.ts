// import { NextResponse } from "next/server";
// import { authMiddleware } from "./middlewares/api/authMiddleware";
// import { loginMiddleware } from "./middlewares/api/loginMiddleware";
// export const config = {
//     matcher: "/api/:path*"
// }

// export default function middleware(request: Request) {

//     if (request.url.includes("/api/blogs")) {
//         const logResult = loginMiddleware(request);

//     }
//     const authResult = authMiddleware(request);

//     if (!authResult.isValid) {
//         return new NextResponse(JSON.stringify({ message: "Unuthorized" }), { status: 401 })
//     }
//     return NextResponse.next();
// }