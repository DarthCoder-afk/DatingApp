import prisma from '../prisma/client.js';

export const getUserProfile = async (req, res) =>{
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id},
            include: {profile: true},
        });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json(user.profile);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal server error." });   
    }
};