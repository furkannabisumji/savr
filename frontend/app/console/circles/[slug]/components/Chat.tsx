import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { supabase } from "@/lib/supabaseClient";
import { CornerDownLeft, Mic, Paperclip } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import WalletAvatar from "./WalletAvatar";

export function Chat() {
  const { slug } = useParams();
  const { address } = useAccount();
  const [messages, setMessages] = useState<
    {
      id: number;
      author: string;
      created_at: number;
      group_id: number;
      message: string;
    }[]
  >([]);
  const [message, setMessage] = useState<string>("");

  async function insertMessage() {
    const author = address;
    const group_id = slug;
    if (!message || !slug || !author) return;

    try {
      const { data, error } = await supabase.from("chats").insert([
        {
          author,
          message,
          group_id,
        },
      ]);

      if (error) {
        console.error("Error inserting message:", error);
        throw new Error(error.message);
      }

      console.log("Message inserted successfully:", data);
      setMessage("");
      return data;
    } catch (error) {
      console.error("Error in insertMessage:", error);
      throw error;
    }
  }

  useEffect(() => {
    // Fetch initial messages for the specific group_id
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .eq("group_id", slug) // Filter by group_id
        .order("created_at", { ascending: true }); // Adjust ordering as needed

      if (error) {
        console.error("Error fetching messages:", error);
      } else {
        setMessages(data);
      }
    };
    fetchMessages();
    // Subscribe to real-time updates
    const channel = supabase
      .channel("chats")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chats",
          filter: `group_id=eq.${slug}`, // Filter by group_id
        },
        (payload) => {
          setMessages((prevMessages: any[]) => [...prevMessages, payload.new]);
        },
      )
      .subscribe();

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [slug]);

  console.log(messages);
  return (
    <div className="h-full ">
      <div className="h-[80%]">
        <ChatMessageList>
          {messages.map((message, idx) => (
            <ChatBubble
              variant={`${message.author == address ? "sent" : "received"}`}
              key={idx}
            >
              <WalletAvatar walletAddress={message.author} />
              <ChatBubbleMessage variant="sent">
                {message.message}
              </ChatBubbleMessage>
            </ChatBubble>
          ))}

          {/* <ChatBubble variant="received">
            <ChatBubbleAvatar fallback="AI" />
            <ChatBubbleMessage isLoading />
          </ChatBubble> */}
        </ChatMessageList>
      </div>
      <div className="h-[20%]">
        <form className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1">
          <ChatInput
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            placeholder="Type your message here..."
            className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center p-3 pt-0">
            <Button variant="ghost" size="icon">
              <Paperclip className="size-4" />
              <span className="sr-only">Attach file</span>
            </Button>

            <Button variant="ghost" size="icon">
              <Mic className="size-4" />
              <span className="sr-only">Use Microphone</span>
            </Button>

            <Button
              onClick={insertMessage}
              size="sm"
              type="button"
              className="ml-auto gap-1.5"
            >
              Send Message
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
