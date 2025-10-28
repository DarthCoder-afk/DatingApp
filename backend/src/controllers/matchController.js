import prisma from "../../prisma/client.js";

export const getUserMatches = async (req, res) => {

    const userId = req.user.id;
    
    try {

        // Find matches involving the user
        const matches = await prisma.match.findMany({
            where: {
                users: {
                    some: { id: userId }
                },
            },
            include: {
                users: {
                    where: { id: { not: userId } }, //exclude requesting user
                    include: { profile: true }
                },
            },
            orderBy: { createdAt: 'desc' }
        });

        // Format matches for response
        const formattedMatches = matches.map((match) => ({
            matchId: match.id,
            users: match.users.map((u) => ({
                id: u.id,
                email: u.email,
                profile: u.profile,
            })),
            createdAt: match.createdAt,
        }));
        
        res.json(formattedMatches);
        
    } catch (error) {
        console.error("Error fetching matches:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}