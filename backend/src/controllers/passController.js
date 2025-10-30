import prisma from "../../prisma/client.js";

export const sendPass = async (req, res) => {
  const fromId = req.user.id;
  const toId = parseInt(req.params.toUserId);

  try {
    if (fromId === toId) {
      return res.status(400).json({ message: "You cannot pass yourself." });
    }

    // Check if the user exists
    const toUser = await prisma.user.findUnique({ where: { id: toId } });
    if (!toUser) return res.status(404).json({ message: "User not found." });

    // Check if pass already exists
    const existingPass = await prisma.pass.findFirst({
      where: { fromId, toId },
    });

    if (existingPass) {
      return res.status(400).json({ message: "You already passed this user." });
    }

    // Create pass record
    const newPass = await prisma.pass.create({
      data: { fromId, toId },
    });

    res.status(201).json({ message: "User passed successfully", pass: newPass });
  } catch (error) {
    console.error("Error sending pass:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
