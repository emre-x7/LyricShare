import React, { useState } from "react";
import Button from "../Common/Button";

interface CommentFormProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit, isLoading }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text.trim());
      setText("");
    }
  };

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
