import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="June 2026"
      intro="The Masked Astrologer respects your privacy. This policy explains what information we collect when you generate a Kundli, match horoscopes, book a consultation, or shop with us, and how we use and protect it."
      sections={[
        { heading: "Information We Collect", body: [
          "Birth details (name, date, time and place of birth) you submit to generate a Janm Kundli, Rashifal, or Gun Milan match.",
          "Account details (name, email, phone) when you sign up, and order/booking details when you transact.",
          "Standard technical data such as device, browser and usage analytics.",
        ]},
        { heading: "How We Use Your Information", body: [
          "To generate your astrological reports, fulfil orders and bookings, and provide customer support.",
          "To send service updates and, with your consent, occasional offers. You can opt out anytime.",
        ]},
        { heading: "Data Storage & Security", body: [
          "Your data is stored securely with our infrastructure provider (Supabase / Postgres) using industry-standard access controls and Row Level Security so you only see your own data.",
          "Payment information is handled directly by our payment gateway (Razorpay); we do not store card details.",
        ]},
        { heading: "Sharing", body: [
          "We do not sell your personal data. We share it only with service providers (payment, hosting, communications) strictly to operate the service, and where required by law.",
        ]},
        { heading: "Your Rights", body: [
          "You may access, correct, or request deletion of your data at any time by emailing support@maskedastrologer.com.",
        ]},
        { heading: "Cookies", body: [
          "We use essential cookies for login sessions and preferences (currency, language). Analytics cookies are used to improve the experience.",
        ]},
      ]}
    />
  );
}
