import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Refund Policy" };

export default function RefundPage() {
  return (
    <LegalPage
      title="Refund & Cancellation Policy"
      updated="June 2026"
      intro="We want you to be satisfied. This policy explains refunds and cancellations for consultations, digital reports, courses, and store products."
      sections={[
        { heading: "Consultations", body: [
          "Cancel or reschedule a consultation up to 24 hours before your slot for a full refund or free reschedule. No-shows and last-minute cancellations are non-refundable.",
        ]},
        { heading: "Digital Reports (Kundli PDF, Horoscope, Compatibility)", body: [
          "Digital reports are generated instantly and are non-refundable once delivered. If a report fails to generate or is duplicated, contact us for a full refund or re-issue.",
        ]},
        { heading: "Courses", body: [
          "Course access can be refunded within 7 days of purchase provided no more than 20% of the content has been consumed.",
        ]},
        { heading: "Store Products", body: [
          "Physical products (gemstones, yantras, pooja items) can be returned within 7 days of delivery if unused and in original condition. Energised/consecrated items are non-returnable unless damaged in transit.",
        ]},
        { heading: "How to Request a Refund", body: [
          "Email support@maskedastrologer.com with your order or booking number. Approved refunds are processed to the original payment method within 5–7 business days.",
        ]},
      ]}
    />
  );
}
