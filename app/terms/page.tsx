import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="June 2026"
      intro="By using The Masked Astrologer, you agree to these terms. Please read them carefully before generating reports, booking consultations, or purchasing products."
      sections={[
        { heading: "Nature of Service", body: [
          "Astrology is provided for guidance, self-reflection and entertainment. Our readings, horoscopes and compatibility results are not a substitute for professional medical, legal, or financial advice.",
        ]},
        { heading: "Accounts", body: [
          "You are responsible for keeping your login credentials secure and for activity under your account. You must provide accurate birth and contact details for accurate readings.",
        ]},
        { heading: "Bookings & Consultations", body: [
          "Consultation slots are confirmed subject to availability. Please join your chat, call, or video session at the scheduled time; missed sessions may be rescheduled at our discretion.",
        ]},
        { heading: "Payments", body: [
          "Prices are listed in INR and may be shown in other currencies for convenience; payments are processed in INR via Razorpay. Taxes apply as per Indian law.",
        ]},
        { heading: "Intellectual Property", body: [
          "All content, designs, reports and artwork are owned by The Masked Astrologer and may not be reproduced without permission.",
        ]},
        { heading: "Limitation of Liability", body: [
          "We are not liable for decisions you make based on any reading. The service is provided 'as is' without warranties of accuracy of predictions.",
        ]},
      ]}
    />
  );
}
