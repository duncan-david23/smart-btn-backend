import { supabase } from "../supabaseClient.js";
import { createClient } from '@supabase/supabase-js';

// POST /api/messages
export const createMessage =async (req, res) => {
    const { publicKey, data } = req.body;
  try {

    // Validate required fields
    if (!publicKey || !data || !data.name || !data.email || !data.message) {
      return res.status(400).json({ error: "Missing fields" });
    }

    
    const { error } = await supabase.from("messages").insert([
      {
        public_key: publicKey,
        sender_name: data.name,
        sender_email: data.email,
        sender_message: data.message,
        subject: data.subject
      },
    ]);

    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to save message" });
    }

    return res.status(201).json({ message: "Message saved successfully" });

  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};




// GET /api/messages/:publicKey
export const getMessages = async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Missing token',
    });
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
    global: {
      headers: { Authorization: `Bearer ${token}` },
    },
  });

  try {
    // 🧠 Authenticated user context
    const { data: authUser, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
        error: authError?.message,
      });
    }

    const publicKey = authUser.user.id; // ✅ This is the user's public key

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("public_key", publicKey)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Error fetching messages',
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};


// controller to update message READ status

export const markMessageAsRead = async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const { messageId } = req.body; // 📨 ID of the message to mark as read

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Missing token',
    });
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
    global: {
      headers: { Authorization: `Bearer ${token}` },
    },
  });

  try {
    const { data: authUser, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
        error: authError?.message,
      });
    }

    const publicKey = authUser.user.id;

    // ✅ Update the read status to true
    const { data, error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', messageId)
      .eq('public_key', publicKey) // 🔒 Ensure user owns the message
      .select();

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update read status',
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Message marked as read',
      data,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};





