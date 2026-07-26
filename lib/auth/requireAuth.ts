import { cookies } from "next/headers";
import { prisma } from "../prisma";

export async function requireAuth(): Promise<{ id: number, name: string, email: string } | null>  {
    const cookieStore = await cookies();
    const session = cookieStore.get("session_user");
    
    if (!session) {
        return null;
    }

    const user = await prisma.user.findUnique({
        where: { email: session.value }, 
        select: { id: true, name: true, email: true }
    })
    
    return user;
}