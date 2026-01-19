import axios from "axios";
import React from "react";
import { BASE_URL } from "../utils/constants";
import { useState } from "react";
import { useSelector } from "react-redux";

const Premium = () => {
  const user = useSelector((store) => store.user);
  const [showMessage, setShowMessage] = useState("");
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Get started with basic features",
      features: [
        { text: "10 connection requests per day", included: true },
        { text: "Basic profile", included: true },
        { text: "Limited chat history (7 days)", included: true },
        { text: "Unlimited chat with mentors", included: false },
        { text: "Blue verification tick", included: false },
        { text: "Voice/Video calls", included: false },
      ],
      cta: "Current Plan",
      highlighted: false,
    },
    {
      name: "Premium",
      price: "₹499",
      period: "per month",
      description: "Unlock advanced mentorship features",
      features: [
        { text: "Unlimited chat with mentors", included: true },
        { text: "100 connection requests per day", included: true },
        { text: "Blue verification tick", included: true },
        { text: "Save chats up to 3 months", included: true },
        { text: "Priority support", included: true },
        { text: "Voice/Video calls with mentors", included: false },
      ],
      cta: "Upgrade to Premium",
      highlighted: true,
    },
    {
      name: "Premium+",
      price: "₹699",
      period: "per month",
      description: "The ultimate mentorship experience",
      features: [
        { text: "Everything in Premium", included: true },
        { text: "Unlimited connection requests", included: true },
        { text: "Forever chat history saved", included: true },
        { text: "Voice/Video calls with mentors", included: true },
        { text: "Exclusive mentor access", included: true },
        { text: "Advanced analytics", included: true },
      ],
      cta: "Upgrade to Premium+",
      highlighted: false,
    },
  ];

  const isPlanDisabled = (planName) => {
    if (planName === "Free") {
      return true;
    }
    if (user?.membershipType === planName) {
      return true;
    }
    if (user?.membershipType === "Premium+" && planName === "Premium") {
      return true;
    }
    return false;
  };

  const getButtonText = (plan) => {
    if (plan.name === "Free") {
      return plan.cta;
    }
    if (user?.membershipType === plan.name) {
      return "Current Plan";
    }
    if (user?.membershipType === "Premium+" && plan.name === "Premium") {
      return "Current Plan (Premium+)";
    }
    return plan.cta;
  };

  const handleBuyClick = async (type) => {
    // Check if user already has this plan or a higher plan
    if (user?.membershipType === type) {
      setShowMessage(`You already have the ${type} plan!`);
      setTimeout(() => setShowMessage(""), 3000);
      return;
    }

    if (user?.membershipType === "Premium+" && type === "Premium") {
      setShowMessage(
        "You already have Premium+ which includes all Premium features!"
      );
      setTimeout(() => setShowMessage(""), 3000);
      return;
    }

    try {
      const order = await axios.post(
        `${BASE_URL}payment/create`,
        { membershipType: type },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { amount, keyId, currency, notes, orderId } = order.data;
      // Redirect to payment gateway
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "Mentor Match ",
        description: `${type} Membership Purchase to connect with mentors`,
        order_id: orderId,
        notes: notes,
        prefill: {
          name: `${notes.firstName} ${notes.lastName}`,
          email: notes.email,
        },
        theme: { color: "#14B8A6" },
        handler: function (response) {
          console.log("Payment successful!", response);
          setShowMessage(
            "Payment successful! Your membership will be updated shortly."
          );
          setTimeout(() => setShowMessage(""), 5000);
          // TODO: Call backend to verify payment and update membership
        },
        modal: {
          ondismiss: function () {
            console.log("Payment cancelled by user");
          },
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment initiation failed", err);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Show message alert */}
        {showMessage && (
          <div className="alert alert-info mb-6 max-w-2xl mx-auto shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{showMessage}</span>
          </div>
        )}

        {/* Show current membership status */}
        {user?.membershipType && user.membershipType !== "Free" && (
          <div className="alert alert-success mb-6 max-w-2xl mx-auto shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>You currently have {user.membershipType} membership! 🎉</span>
          </div>
        )}

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Unlock your full potential with Mentor Match. Select the plan that
            fits your mentorship journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`mm-card bg-black p-8 relative ${
                plan.highlighted
                  ? "ring-2 ring-purple-900 shadow-2xl scale-105"
                  : ""
              }`}>
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-900 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-3">
                  <span className="text-4xl font-bold text-purple-900">
                    {plan.price}
                  </span>
                  <span className="text-base-content/60 ml-2">
                    {plan.period}
                  </span>
                </div>
                <p className="text-sm text-base-content/70">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-start gap-3">
                    {feature.included ? (
                      <svg
                        className="w-5 h-5 text-purple-900 mt-0.5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-base-content/30 mt-0.5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                    <span
                      className={
                        feature.included
                          ? "text-base-content"
                          : "text-base-content/40 line-through"
                      }>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleBuyClick(plan.name)}
                className={`btn w-full ${
                  isPlanDisabled(plan.name)
                    ? "btn-disabled"
                    : plan.highlighted
                    ? "btn-primary"
                    : "btn-outline"
                }`}
                disabled={isPlanDisabled(plan.name)}>
                {getButtonText(plan)}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-base-content/60">
            All plans include access to our mentor network and basic matching
            features.
          </p>
          <p className="text-sm text-base-content/60 mt-2">
            Need a custom plan?{" "}
            <a
              href="#"
              className="text-purple-900 hover:underline">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Premium;
