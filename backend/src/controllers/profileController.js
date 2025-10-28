import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

export const updateUserProfile = async (req, res) => {
    try {
        const { name, age, bio, gender, photoUrl} = req.body;

        const updatedProfile = await prisma.profile.update({
            where : { userId: req.user.id },
            data : { name, age, bio, gender, photoUrl},
        });

        res.json({ message: "Profile updated successfully", profile: updatedProfile });
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}