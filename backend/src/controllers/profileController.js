import prisma from "../../prisma/client.js";
import { uploadToCloudinary } from "../config/cloudinary.js";

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
    const { name, age, bio, gender } = req.body;
    
    let photoUrl;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "datingApp_profiles");
      photoUrl = result;
    }

    // Update profile
    const updatedProfile = await prisma.profile.update({
      where: { userId: req.user.id },
      data: {
        name,
        age: age ? parseInt(age) : undefined,
        bio,
        gender,
        ...(photoUrl && { photoUrl }), // only update photo if uploaded
      },
    });

    res.json({ message: "Profile updated successfully", profile: updatedProfile });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getAllProfiles = async (req, res) => {
   try {
    const userId = req.user.id;

    // Get IDs of users the current user already liked
    const likedUsers = await prisma.like.findMany({
      where: { fromId: userId },
      select: { toId: true },
    });

    // Get IDs of users the current user already passed
    const passedUsers = await prisma.pass.findMany({
      where: { fromId: userId },
      select: { toId: true },
    });

    // Get IDs of users already matched
    const matchedUsers = await prisma.match.findMany({
      where: {
        users: {
          some: { id: userId },
        },
      },
     select: {
        users: {
          select: { id: true },
        },
      },
    });

    // Extract all matched user IDs
    const matchedIds = matchedUsers.flatMap((match) =>
      match.users.map((u) => u.id)
    );

    // Create exclusion list
    const excludeIds = Array.from(
      new Set([
        userId,
        ...likedUsers.map((l) => l.toId),
        ...passedUsers.map((p) => p.toId),
        ...matchedIds,
      ])
    );

    // Fetch remaining profiles
   const profiles = await prisma.profile.findMany({
      where: {
        userId: { notIn: excludeIds },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: { id: "asc" }, // optional, consistent ordering
    });

    res.json(profiles);
  } catch (error) {
    console.error("Error fetching browse profiles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};