import React from "react";
import RoleForm from "../components/RoleForm";
import logo from "../assets/logo.png";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <img
        src={logo}
        alt="Task App Logo"
        className="w-40 h-40 mb-8"
      />
      <h1 className="text-3xl sm:text-4xl font-bold text-[#213729] mb-2 text-center">
        Welcome to Task
      </h1>
      <p className="text-[#215432] text-center mb-6 max-w-xl">
        We’re getting ready to launch something amazing. Join our early access
        list to be one of the first to try Task when it goes live!
      </p>
      <RoleForm />
    </div>
  );
}
