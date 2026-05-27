"use client";
import { Toaster } from "react-hot-toast";
import Chatbot from "@/app/components/ui/Chatbot";

export default function ClientLayoutWrapper({ children }) {
  return (
    <>
      <Toaster position="top-right" />
      {children}
      <Chatbot />
    </>
  );
}