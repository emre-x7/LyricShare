import React, { useState } from "react";
import Button from "../Common/Button";

interface CommentFormProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
  styled?: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  isLoading,
  styled = false,
}) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text.trim());
      setText("");
    }
  };

  // Yeni tasarım için
  if (styled) {
    return (
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Düşüncelerinizi paylaşın..."
            rows={4}
            className="w-full bg-white/70 backdrop-blur-sm border-0 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none placeholder-gray-500"
            required
          />
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={isLoading || !text.trim()}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-full hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 font-medium shadow-lg"
            >
              {isLoading ? "Gönderiliyor..." : "Yorum Yap"}
            </button>
          </div>
        </div>
      </form>
    );
  }

  // Orijinal tasarım
  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Yorumunuzu yazın..."
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        required
      />
      <div className="flex justify-end mt-2">
        <Button
          type="submit"
          disabled={isLoading || !text.trim()}
          variant="primary"
        >
          {isLoading ? "Gönderiliyor..." : "Yorum Yap"}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
