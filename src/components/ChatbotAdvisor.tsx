import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Trash2, Sparkles } from "lucide-react";

import {
  getBotResponse,
  getGreetingMessage,
  type ChatMessage,
} from "@/lib/chatbotResponses";

import { useLang } from "@/context/LangContext";
import { I18N } from "@/lib/i18n";

function renderMarkdown(text: string) {
  let html = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  html = html.replace(/\n/g, "<br/>");
  html = html.replace(/• (.*?)(<br\/>|$)/g, '<li class="ml-3">$1</li>');
  return html;
}

const QUICK_PROMPTS_KEY = [
  "quickPrompt1",
  "quickPrompt2",
  "quickPrompt3",
  "quickPrompt4",
] as const;

export default function ChatbotAdvisor() {
  const { lang } = useLang();
  const t = I18N[lang];

  const [messages, setMessages] = useState<ChatMessage[]>([
    getGreetingMessage(),
  ]);

  const [input, setInput] = useState("");

  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /*
  SEND MESSAGE
  */

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();

    if (!msg) return;

    setInput("");

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: msg,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);

    setIsTyping(true);

    try {
      const botText = await getBotResponse(msg);

      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "bot",
        text: botText,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "bot",
        text: "⚠ AI service unavailable. Please try again later.",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMsg]);
    }

    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      sendMessage();
    }
  };

  return (
    <div className="space-y-4">
      {/* HEADER */}

      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="hero-gradient rounded-3xl p-6 text-white"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
            <Sparkles size={20} />
          </div>

          <div>
            <h2 className="font-display font-black text-xl">
              {t.chatbotTitle}
            </h2>

            <p className="text-white/70 text-xs">{t.chatbotDesc}</p>
          </div>
        </div>
      </motion.div>

      {/* CHAT WINDOW */}

      <div
        className="glass-card rounded-2xl overflow-hidden flex flex-col"
        style={{ height: "420px" }}
      >
        {/* MESSAGES */}

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex gap-2.5 ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* AVATAR */}

                <div
                  className={`w-7 h-7 rounded-xl shrink-0 flex items-center justify-center mt-0.5 ${
                    msg.role === "bot"
                      ? "bg-primary/15 text-primary"
                      : "bg-accent/20 text-accent-foreground"
                  }`}
                >
                  {msg.role === "bot" ? <Bot size={14} /> : <User size={14} />}
                </div>

                {/* MESSAGE BUBBLE */}

                <div
                  className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-muted/60 text-foreground border border-border/50 rounded-tl-sm"
                  }`}
                >
                  {msg.role === "bot" ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: renderMarkdown(msg.text),
                      }}
                      className="[&_strong]:font-bold [&_li]:list-none [&_li]:flex [&_li]:items-start [&_li]:gap-1 [&_li]:before:content-['•'] [&_li]:before:text-primary"
                    />
                  ) : (
                    msg.text
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* TYPING INDICATOR */}

          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-2.5"
              >
                <div className="w-7 h-7 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                  <Bot size={14} className="text-primary" />
                </div>

                <div className="bg-muted/60 border border-border/50 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay,
                      }}
                      className="w-1.5 h-1.5 rounded-full bg-primary/60"
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}

        <div className="border-t border-border/50 p-3 bg-background/50 backdrop-blur-sm">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.chatPlaceholder}
              className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/50 focus:bg-background transition-all placeholder:text-muted-foreground text-foreground"
            />

            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isTyping}
              className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity shrink-0"
            >
              <Send size={15} />
            </button>

            <button
              onClick={() => setMessages([getGreetingMessage()])}
              className="w-10 h-10 rounded-xl bg-muted text-muted-foreground flex items-center justify-center hover:text-destructive transition-colors shrink-0"
              title="Clear chat"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* QUICK PROMPTS */}

      <div>
        <p className="text-xs text-muted-foreground font-medium mb-2 px-1">
          {t.quickQuestions}
        </p>

        <div className="flex flex-wrap gap-2">
          {QUICK_PROMPTS_KEY.map((key) => (
            <button
              key={key}
              onClick={() => sendMessage(t[key])}
              disabled={isTyping}
              className="text-xs px-3 py-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors disabled:opacity-50"
            >
              {t[key]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
