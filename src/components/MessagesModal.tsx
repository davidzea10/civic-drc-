import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Heart, Clock, Reply, X } from "lucide-react";

interface Message {
  id: number;
  author: string;
  avatar: string;
  avatarColor: string;
  content: string;
  date: string;
  likes: number;
  isLiked: boolean;
  replies?: Message[];
}

interface MessagesModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  proposalTitle: string;
  proposalId: number;
}

const generateAvatar = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const avatarColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-indigo-500",
  "bg-red-500",
];

const getAvatarColor = (name: string) => {
  const index = name.length % avatarColors.length;
  return avatarColors[index];
};

const initialMessages: Record<number, Message[]> = {
  1: [
    {
      id: 1,
      author: "Marie Kabongo",
      avatar: generateAvatar("Marie Kabongo"),
      avatarColor: getAvatarColor("Marie Kabongo"),
      content:
        "Cette proposition est excellente ! L'accès à l'eau potable est un droit fondamental. Je soutiens pleinement cette initiative pour Lubumbashi.",
      date: "Il y a 2h",
      likes: 12,
      isLiked: false,
      replies: [
        {
          id: 11,
          author: "Jean Mutombo",
          avatar: generateAvatar("Jean Mutombo"),
          avatarColor: getAvatarColor("Jean Mutombo"),
          content:
            "Tout à fait d'accord Marie ! Ma famille à Lubumbashi souffre de ce problème depuis des années.",
          date: "Il y a 1h",
          likes: 5,
          isLiked: false,
        },
      ],
    },
    {
      id: 2,
      author: "Patrick Tshimanga",
      avatar: generateAvatar("Patrick Tshimanga"),
      avatarColor: getAvatarColor("Patrick Tshimanga"),
      content:
        "Il faudrait aussi penser à la qualité de l'eau distribuée. Les analyses montrent souvent des contaminations.",
      date: "Il y a 5h",
      likes: 8,
      isLiked: false,
    },
    {
      id: 3,
      author: "Grâce Mwamba",
      avatar: generateAvatar("Grâce Mwamba"),
      avatarColor: getAvatarColor("Grâce Mwamba"),
      content:
        "En tant que médecin, je confirme que le manque d'eau potable est la cause principale des maladies hydriques dans notre province. 🏥",
      date: "Il y a 8h",
      likes: 23,
      isLiked: false,
    },
  ],
  2: [
    {
      id: 1,
      author: "David Lukaku",
      avatar: generateAvatar("David Lukaku"),
      avatarColor: getAvatarColor("David Lukaku"),
      content:
        "Les routes RN1 et RN4 sont dans un état catastrophique. J'ai perdu un véhicule à cause des nids-de-poule !",
      date: "Il y a 3h",
      likes: 34,
      isLiked: false,
    },
    {
      id: 2,
      author: "Esther Ngoy",
      avatar: generateAvatar("Esther Ngoy"),
      avatarColor: getAvatarColor("Esther Ngoy"),
      content:
        "Le transport des marchandises coûte 3 fois plus cher à cause de l'état des routes. Cela affecte toute l'économie.",
      date: "Il y a 6h",
      likes: 19,
      isLiked: false,
    },
  ],
  3: [
    {
      id: 1,
      author: "Amani Bisimwa",
      avatar: generateAvatar("Amani Bisimwa"),
      avatarColor: getAvatarColor("Amani Bisimwa"),
      content:
        "En tant qu'étudiant au Sud-Kivu, cette proposition me touche personnellement. Beaucoup de mes camarades ont dû abandonner leurs études.",
      date: "Il y a 4h",
      likes: 15,
      isLiked: false,
    },
  ],
  4: [
    {
      id: 1,
      author: "Cécile Kabuya",
      avatar: generateAvatar("Cécile Kabuya"),
      avatarColor: getAvatarColor("Cécile Kabuya"),
      content:
        "Les panneaux solaires sont la solution idéale pour nos villages. L'énergie solaire est abondante au Kasaï !",
      date: "Il y a 1h",
      likes: 28,
      isLiked: false,
    },
    {
      id: 2,
      author: "Fiston Kalala",
      avatar: generateAvatar("Fiston Kalala"),
      avatarColor: getAvatarColor("Fiston Kalala"),
      content:
        "Il faut aussi former des techniciens locaux pour la maintenance des installations solaires.",
      date: "Il y a 7h",
      likes: 11,
      isLiked: false,
    },
  ],
  5: [
    {
      id: 1,
      author: "Dr. Bahati Murhula",
      avatar: generateAvatar("Dr. Bahati Murhula"),
      avatarColor: getAvatarColor("Dr. Bahati Murhula"),
      content:
        "En tant que médecin à Goma, je peux témoigner de la saturation de l'hôpital. Nous avons besoin de ce centre de santé de toute urgence !",
      date: "Il y a 30min",
      likes: 45,
      isLiked: false,
    },
    {
      id: 2,
      author: "Solange Mapendo",
      avatar: generateAvatar("Solange Mapendo"),
      avatarColor: getAvatarColor("Solange Mapendo"),
      content:
        "Ma mère a dû attendre 3 jours pour être prise en charge à l'hôpital de Goma. C'est inacceptable ! 😢",
      date: "Il y a 2h",
      likes: 32,
      isLiked: false,
    },
    {
      id: 3,
      author: "Emmanuel Kambale",
      avatar: generateAvatar("Emmanuel Kambale"),
      avatarColor: getAvatarColor("Emmanuel Kambale"),
      content:
        "Bravo pour cette initiative ! Il faut aussi penser à la formation continue du personnel médical.",
      date: "Il y a 5h",
      likes: 18,
      isLiked: false,
    },
  ],
};

const MessagesModal = ({
  isOpen,
  setIsOpen,
  proposalTitle,
  proposalId,
}: MessagesModalProps) => {
  const [messages, setMessages] = useState<Message[]>(
    initialMessages[proposalId] || []
  );
  const [newMessage, setNewMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg: Message = {
      id: Date.now(),
      author: "Vous",
      avatar: "VO",
      avatarColor: "bg-primary",
      content: newMessage,
      date: "À l'instant",
      likes: 0,
      isLiked: false,
    };

    if (replyingTo !== null) {
      setMessages(
        messages.map((m) =>
          m.id === replyingTo
            ? { ...m, replies: [...(m.replies || []), msg] }
            : m
        )
      );
      setReplyingTo(null);
    } else {
      setMessages([msg, ...messages]);
    }
    setNewMessage("");
  };

  const handleLikeMessage = (messageId: number, isReply = false, parentId?: number) => {
    if (isReply && parentId) {
      setMessages(
        messages.map((m) =>
          m.id === parentId
            ? {
                ...m,
                replies: m.replies?.map((r) =>
                  r.id === messageId
                    ? {
                        ...r,
                        likes: r.isLiked ? r.likes - 1 : r.likes + 1,
                        isLiked: !r.isLiked,
                      }
                    : r
                ),
              }
            : m
        )
      );
    } else {
      setMessages(
        messages.map((m) =>
          m.id === messageId
            ? {
                ...m,
                likes: m.isLiked ? m.likes - 1 : m.likes + 1,
                isLiked: !m.isLiked,
              }
            : m
        )
      );
    }
  };

  const renderMessage = (msg: Message, isReply = false, parentId?: number) => (
    <div
      key={msg.id}
      className={`group animate-fade-in ${
        isReply ? "ml-12 mt-3" : ""
      }`}
    >
      <div
        className={`rounded-2xl border border-border p-4 transition-all hover:border-primary/10 ${
          isReply ? "bg-secondary/30" : "bg-card"
        }`}
      >
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm ${msg.avatarColor}`}
          >
            {msg.avatar}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm text-foreground">
                {msg.author}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Clock className="h-3 w-3" /> {msg.date}
              </span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">
              {msg.content}
            </p>

            {/* Actions */}
            <div className="mt-3 flex items-center gap-4">
              <button
                onClick={() => handleLikeMessage(msg.id, isReply, parentId)}
                className={`flex items-center gap-1.5 text-xs transition-all ${
                  msg.isLiked
                    ? "text-pink-500 font-semibold"
                    : "text-muted-foreground hover:text-pink-500"
                }`}
              >
                <Heart
                  className={`h-3.5 w-3.5 transition-all ${
                    msg.isLiked ? "fill-pink-500 animate-like-pop" : ""
                  }`}
                />
                {msg.likes}
              </button>
              {!isReply && (
                <button
                  onClick={() =>
                    setReplyingTo(replyingTo === msg.id ? null : msg.id)
                  }
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <Reply className="h-3.5 w-3.5" /> Répondre
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Replies */}
      {msg.replies?.map((reply) => renderMessage(reply, true, msg.id))}

      {/* Reply input */}
      {replyingTo === msg.id && (
        <div className="ml-12 mt-2">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              placeholder={`Répondre à ${msg.author}...`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="rounded-xl text-sm"
              autoFocus
            />
            <button
              type="submit"
              className="rounded-xl bg-primary px-3 py-2 text-primary-foreground transition-all hover:opacity-90"
            >
              <Send className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setReplyingTo(null)}
              className="rounded-xl border border-border px-3 py-2 text-muted-foreground transition-all hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-2xl flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-civic-blue-light">
              <MessageSquare className="h-5 w-5 text-civic-blue" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="font-display text-lg font-bold text-foreground truncate">
                💬 Messages & Commentaires
              </DialogTitle>
              <DialogDescription className="truncate text-xs">
                {proposalTitle}
              </DialogDescription>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            <span>
              {messages.length} message{messages.length > 1 ? "s" : ""}
            </span>
          </div>
        </DialogHeader>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1 min-h-0">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                Aucun message pour le moment
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Soyez le premier à commenter !
              </p>
            </div>
          ) : (
            messages.map((msg) => renderMessage(msg))
          )}
        </div>

        {/* New Message Input */}
        <div className="flex-shrink-0 border-t border-border pt-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              VO
            </div>
            <Input
              placeholder="Écrire un message..."
              value={replyingTo === null ? newMessage : ""}
              onChange={(e) => {
                if (replyingTo === null) setNewMessage(e.target.value);
              }}
              onFocus={() => setReplyingTo(null)}
              className="rounded-xl text-sm"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || replyingTo !== null}
              className="rounded-xl bg-primary px-4 py-2 text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline text-sm font-medium">Envoyer</span>
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessagesModal;
