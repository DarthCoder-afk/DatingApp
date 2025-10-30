import prisma from "../../prisma/client.js";

export const getMessages = async (req, res) => {
  const { matchId } = req.params;
  const userId = req.user.id;

  try {
    const match = await prisma.match.findUnique({
      where: { id: parseInt(matchId) },
      include: { users: true },
    });

    if (!match || !match.users.some((u) => u.id === userId)) {
      return res.status(403).json({ message: "You are not part of this chat." });
    }

    const messages = await prisma.message.findMany({
      where: { matchId: parseInt(matchId) },
      include: { sender: { select: { id: true, profile: true } } },
      orderBy: { createdAt: "asc" },
    });

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Failed to fetch messages." });
  }
};

export const sendMessage = async (req, res) => {
  const { matchId } = req.params;
  const { content } = req.body;
  const senderId = req.user.id;

  try {
    const match = await prisma.match.findUnique({
      where: { id: parseInt(matchId) },
      include: { users: true },
    });

    if (!match || !match.users.some((u) => u.id === senderId)) {
      return res.status(403).json({ message: "You are not part of this match." });
    }

    const message = await prisma.message.create({
      data: { content, senderId, matchId: parseInt(matchId) },
      include: { sender: { select: { id: true, profile: true } } },
    });

    res.status(201).json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Failed to send message." });
  }
};

export const getUserConversations = async (req, res) => {
   
    const userId = req.user.id;
    console.log("Fetching convo for: ", userId);


  try {
   
    const matches = await prisma.match.findMany({
      where: {
        users: {
          some: { id: userId },
        },
      },
      include: {
        users: {
          include: { profile: true },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1, // get last message only
          include: {
            sender: {
              select: { id: true, profile: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = matches.map((match) => {
      const otherUser = match.users.find((u) => u.id !== userId);
      return {
        matchId: match.id,
        user: otherUser,
        lastMessage: match.messages[0] || null,
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching user conversations:", error);
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
};
