import prisma from "../../prisma/client.js";

export const sendLike = async (req, res) => {
    const fromId = req.user.id;
    const toId = parseInt(req.params.toUserId);

    try {
        // Prevent liking onself
        if (fromId === toId) {
            return res.status(400).json({ message: "You cannot like yourself." });
        }

        // Check if both users exist
        const [fromUser, toUser] = await Promise.all([
            prisma.user.findUnique({ where: { id: fromId }}),
            prisma.user.findUnique({ where: { id: toId }})
        ]);

        // Check if either user exits
        if (!toUser || !fromUser) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check if like already exists
        const existingLike = await prisma.like.findFirst({
            where: { fromId, toId},
        });


        if (existingLike) {
            return res.status(400).json({ message: "You have already liked this user." });
        }

        // Create new like
        const newLike = await prisma.like.create({
            data: { fromId, toId },
        });

        // Check for a match
        const matchLike = await prisma.like.findFirst({
            where: { fromId: toId, toId: fromId }
        });

        if (matchLike) {
            await prisma.match.create({
               data: {
                    users: { connect: [{ id: fromId }, { id: toId }] }
                },
            });
            return res.status(201).json({ message: "It's a match!", match: true, like: newLike });
        }
        res.status(201).json({ message: "Like sent successfully", like: newLike, match: false });
    } catch (error) {
        console.error("Error sending like:", error);
        res.status(500).json({ message: "Error sending like." });
    }
};

export const getLikesGiven = async (req, res) => {
    try {
        const likes = await prisma.like.findMany({
            where: { fromId: req.user.id },
            include: { to: { include: { profile: true } } },
        });
        res.json(likes);

    } catch (error) {
        console.error("Error fetching likes given:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const getLikesReceived = async (req, res) => {
    try {
        const likes = await prisma.like.findMany({
            where: { toId: req.user.id },
            include: { from: { include: { profile: true } } },
        });
        res.json(likes);

    } catch (error) {
        console.error("Error fetching likes received:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}