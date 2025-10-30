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
};

/**
 * Unmatch a user — deletes the match and related messages
 */
export const unmatchUser = async (req, res) => {
  try {
    const matchId = parseInt(req.params.matchId);

    // Check if match exists
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: { users: true },
    });

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    // Delete the match
    await prisma.match.delete({
      where: { id: matchId },
    });

    // ✅ Respond with success JSON (important!)
    return res.status(200).json({ message: "Unmatched successfully" });
  } catch (error) {
    console.error("Error unmatching:", error);
    return res.status(500).json({ message: "Failed to unmatch" });
  }
};




/**
 * Get likes overview — outgoing, incoming, and mutual likes
 */
export const getLikesOverview = async (req, res) => {
  try {
    const userId = req.user.id;

    const [likesGiven, likesReceived] = await Promise.all([
      prisma.like.findMany({
        where: { fromId: userId },
        include: { to: { include: { profile: true } } },
      }),
      prisma.like.findMany({
        where: { toId: userId },
        include: { from: { include: { profile: true } } },
      }),
    ]);

    // Find mutual likes
    const mutualLikes = likesGiven.filter((given) =>
      likesReceived.some((received) => received.fromId === given.toId)
    );

    res.json({
      likesGiven,
      likesReceived,
      mutualLikes,
    });
  } catch (error) {
    console.error("Error fetching likes overview:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};