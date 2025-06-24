import React, { useState } from "react";

export default function RoleForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    role: "",
    clientAnswers: {
      taskType: "",
      usageFrequency: "",
      contactMethod: "",
    },
    taskerAnswers: {
      servicesOffered: "",
      experienceLevel: "",
      weeklyAvailability: "",
    },
  });

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const apiURL = import.meta.env.VITE_API_URL;

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleAnswerChange = (field, value) => {
    const key = formData.role === "client" ? "clientAnswers" : "taskerAnswers";
    setFormData({
      ...formData,
      [key]: {
        ...formData[key],
        [field]: value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    if (!formData.name || !formData.email || !formData.age || !formData.role) {
      setStatus({ type: "error", msg: "All fields are required." });
      setLoading(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      setStatus({ type: "error", msg: "Enter a valid email address." });
      setLoading(false);
      return;
    }

    if (formData.role === "client") {
      const { taskType, usageFrequency, contactMethod } = formData.clientAnswers;
      if (!taskType || !usageFrequency || !contactMethod) {
        setStatus({ type: "error", msg: "Please answer all client questions." });
        setLoading(false);
        return;
      }
    }

    if (formData.role === "tasker") {
      const { servicesOffered, experienceLevel, weeklyAvailability } =
        formData.taskerAnswers;
      if (!servicesOffered || !experienceLevel || !weeklyAvailability) {
        setStatus({ type: "error", msg: "Please answer all tasker questions." });
        setLoading(false);
        return;
      }
    }

    try {
      const res = await fetch(`${apiURL}/api/early-access`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setShowSuccessModal(true);
        setFormData({
          name: "",
          email: "",
          age: "",
          role: "",
          clientAnswers: {
            taskType: "",
            usageFrequency: "",
            contactMethod: "",
          },
          taskerAnswers: {
            servicesOffered: "",
            experienceLevel: "",
            weeklyAvailability: "",
          },
        });
      } else {
        setStatus({ type: "error", msg: data.error });
      }
    } catch (err) {
      setLoading(false);
      setStatus({ type: "error", msg: "Something went wrong. Please try again." });
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-lg space-y-5"
      >
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none"
        />
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email Address"
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none"
        />
        <input
          name="age"
          type="number"
          value={formData.age}
          onChange={handleChange}
          placeholder="Your Age"
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none"
        />

        <div className="flex flex-col sm:flex-row gap-4">
          {["client", "tasker"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setFormData({ ...formData, role: r })}
              className={`flex-1 p-3 rounded-md font-semibold border transition ${
                formData.role === r
                  ? "bg-[#215432] text-white"
                  : "border-[#215432] text-[#215432]"
              }`}
            >
              I’m a {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        {formData.role === "client" && (
          <div className="space-y-3">
            <select
              value={formData.clientAnswers.taskType}
              onChange={(e) => handleRoleAnswerChange("taskType", e.target.value)}
              className="w-full p-3 border rounded-md"
              required
            >
              <option value="">Select task type</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Moving">Moving</option>
              <option value="Delivery">Delivery</option>
              <option value="Repairs">Repairs</option>
              <option value="Other">Other</option>
            </select>

            <select
              value={formData.clientAnswers.usageFrequency}
              onChange={(e) => handleRoleAnswerChange("usageFrequency", e.target.value)}
              className="w-full p-3 border rounded-md"
              required
            >
              <option value="">Select usage frequency</option>
              <option value="One-time">One-time</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Not sure yet">Not sure yet</option>
            </select>

            <select
              value={formData.clientAnswers.contactMethod}
              onChange={(e) => handleRoleAnswerChange("contactMethod", e.target.value)}
              className="w-full p-3 border rounded-md"
              required
            >
              <option value="">Preferred contact method</option>
              <option value="Email">Email</option>
              <option value="Phone">Phone</option>
              <option value="WhatsApp">WhatsApp</option>
            </select>
          </div>
        )}

        {formData.role === "tasker" && (
          <div className="space-y-3">
            <select
              value={formData.taskerAnswers.servicesOffered}
              onChange={(e) =>
                handleRoleAnswerChange("servicesOffered", e.target.value)
              }
              className="w-full p-3 border rounded-md"
              required
            >
              <option value="">Select service offered</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Handyman">Handyman</option>
              <option value="Driver">Driver</option>
              <option value="Helper">Helper</option>
              <option value="Other">Other</option>
            </select>

            <select
              value={formData.taskerAnswers.experienceLevel}
              onChange={(e) =>
                handleRoleAnswerChange("experienceLevel", e.target.value)
              }
              className="w-full p-3 border rounded-md"
              required
            >
              <option value="">Experience level</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Some experience">Some experience</option>
            </select>

            <select
              value={formData.taskerAnswers.weeklyAvailability}
              onChange={(e) =>
                handleRoleAnswerChange("weeklyAvailability", e.target.value)
              }
              className="w-full p-3 border rounded-md"
              required
            >
              <option value="">Weekly availability</option>
              <option value="Less than 10">Less than 10</option>
              <option value="10–20">10–20</option>
              <option value="20–40">20–40</option>
              <option value="Full-time">Full-time</option>
            </select>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-[#213729] text-white p-3 rounded-md font-semibold hover:bg-[#1a2d21] transition"
        >
          Submit
        </button>

        {status && (
          <p
            className={`text-sm text-center ${
              status.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {status.msg}
          </p>
        )}
      </form>

      {/* Loading Popup */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-semibold">Submitting...</p>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center space-y-4 max-w-sm">
            <h2 className="text-2xl font-bold text-[#215432]">🎉 Thank You!</h2>
            <p className="text-gray-700">You've been added to the waitlist.</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="px-4 py-2 bg-[#213729] text-white rounded-md hover:bg-[#1a2d21]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
