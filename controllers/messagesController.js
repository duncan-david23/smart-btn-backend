import { createClient } from '@supabase/supabase-js';

// Admin client (service role key) — bypasses RLS
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Authenticated user client — scoped to token
export const getUserScopedClient = (token) =>
  createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });


  export const createMessage = async (req, res) => {
  const { publicKey, data } = req.body;

  if (!publicKey || !data?.name || !data?.email || !data?.message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const { error } = await supabaseAdmin.from("messages").insert([
      {
        public_key: publicKey,
        sender_name: data.name,
        sender_email: data.email,
        sender_message: data.message,
        subject: data.subject || null,
        read: false,
      },
    ]);

    if (error) {
      console.error("Insert error:", error);
      return res.status(403).json({ error: "Insert blocked by RLS or invalid key" });
    }

    return res.status(201).json({ message: "Message saved successfully" });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};




export const getMessages = async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ success: false, message: "Missing token" });
  }

  const supabaseUser = getUserScopedClient(token);

  try {
    const { data: authUser, error: authError } = await supabaseUser.auth.getUser();

    if (authError || !authUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
        error: authError?.message,
      });
    }

    const publicKey = authUser.user.id;

    const { data, error } = await supabaseUser
      .from("messages")
      .select("*")
      .eq("public_key", publicKey)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching messages",
        error: error.message,
      });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};



export const markMessageAsRead = async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const { messageId } = req.body;

  if (!token) {
    return res.status(401).json({ success: false, message: "Missing token" });
  }

  const supabaseUser = getUserScopedClient(token);

  try {
    const { data: authUser, error: authError } = await supabaseUser.auth.getUser();

    if (authError || !authUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
        error: authError?.message,
      });
    }

    const publicKey = authUser.user.id;

    const { data, error } = await supabaseAdmin
      .from("messages")
      .update({ read: true })
      .eq("id", messageId)
      .eq("public_key", publicKey)
      .select();

    if (error || !data || data.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Update failed or unauthorized",
        error: error?.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message marked as read",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};



