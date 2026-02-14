import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Ndotoni',
  description: 'Read the terms and conditions for using Ndotoni rental platform.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-sm text-gray-600 mb-8">Last updated: February 14, 2026</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using Ndotoni ("the Platform"), you accept and agree to be bound by these 
                Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our services.
              </p>
              <p className="text-gray-700 mb-4">
                These Terms constitute a legally binding agreement between you and Ndotoni Rental Agency 
                ("Ndotoni", "we", "us", or "our").
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-4">
                Ndotoni is an online platform that connects property owners (landlords) with people seeking 
                rental accommodations (tenants) in Tanzania. We provide:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Property listing and search functionality</li>
                <li>Messaging system for communication between users</li>
                <li>Booking and payment processing services</li>
                <li>User profiles, reviews, and ratings</li>
                <li>Property management tools for landlords</li>
                <li>Short-term and long-term rental options</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Ndotoni acts as an intermediary platform and is not a party to rental agreements between 
                landlords and tenants.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Eligibility and Account Registration</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Eligibility</h3>
              <p className="text-gray-700 mb-4">To use Ndotoni, you must:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Be at least 18 years old</li>
                <li>Have the legal capacity to enter into binding contracts</li>
                <li>Not be prohibited from using the service under applicable laws</li>
                <li>Provide accurate and complete registration information</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Account Security</h3>
              <p className="text-gray-700 mb-4">You are responsible for:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized access</li>
                <li>Ensuring your account information is accurate and up-to-date</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Responsibilities</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 For Landlords</h3>
              <p className="text-gray-700 mb-4">As a landlord, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Provide accurate and complete property information</li>
                <li>Upload genuine, recent photos of your property</li>
                <li>Respond to inquiries in a timely and professional manner</li>
                <li>Honor confirmed bookings and rental agreements</li>
                <li>Comply with all local rental laws and regulations</li>
                <li>Maintain your property in a safe and habitable condition</li>
                <li>Disclose any known defects or issues with the property</li>
                <li>Not discriminate against tenants based on protected characteristics</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 For Tenants</h3>
              <p className="text-gray-700 mb-4">As a tenant, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Provide accurate information in your inquiries and applications</li>
                <li>Respect the property and follow the landlord's rules</li>
                <li>Make rental payments on time</li>
                <li>Report any issues or damages promptly</li>
                <li>Use the property only for residential purposes (unless otherwise agreed)</li>
                <li>Not sublet the property without landlord's permission</li>
                <li>Leave the property in good condition at the end of tenancy</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Prohibited Activities</h2>
              <p className="text-gray-700 mb-4">You may not:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Post false, misleading, or fraudulent information</li>
                <li>Harass, abuse, threaten, or harm other users</li>
                <li>Use the platform for any illegal activities</li>
                <li>Attempt to circumvent payment systems or fees</li>
                <li>Scrape, copy, or download content without permission</li>
                <li>Impersonate others or create fake accounts</li>
                <li>Spam or send unsolicited messages</li>
                <li>Upload malicious code or viruses</li>
                <li>Interfere with the platform's operation or security</li>
                <li>Use automated systems (bots) without authorization</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Payments and Fees</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">6.1 Service Fees</h3>
              <p className="text-gray-700 mb-4">
                Ndotoni may charge fees for certain services, including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Booking fees for short-term rentals</li>
                <li>Premium listing features for landlords</li>
                <li>Transaction processing fees</li>
              </ul>
              <p className="text-gray-700 mb-4">
                All fees will be clearly disclosed before you complete a transaction.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">6.2 Payment Processing</h3>
              <p className="text-gray-700 mb-4">
                Payments are processed securely through third-party providers (M-Pesa, etc.). You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Provide accurate payment information</li>
                <li>Pay all amounts when due</li>
                <li>Comply with the payment provider's terms</li>
                <li>Be responsible for any payment processing fees</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cancellations and Refunds</h2>
              <p className="text-gray-700 mb-4">
                Cancellation and refund policies are set by individual landlords for their properties. 
                Please review the specific policy for each property before booking.
              </p>
              <p className="text-gray-700 mb-4">
                Ndotoni is not responsible for refunds but may assist in dispute resolution between 
                landlords and tenants.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Content and Intellectual Property</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">8.1 Ndotoni's Content</h3>
              <p className="text-gray-700 mb-4">
                All content on Ndotoni (logos, text, graphics, software, design) is owned by Ndotoni or 
                its licensors and protected by intellectual property laws. You may not use our intellectual 
                property without written permission.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">8.2 User Content</h3>
              <p className="text-gray-700 mb-4">
                You retain ownership of content you post (property listings, photos, reviews). By posting 
                content, you grant Ndotoni a non-exclusive, worldwide, royalty-free license to use, display, 
                and distribute your content on the platform.
              </p>
              <p className="text-gray-700 mb-4">
                You represent that you have the right to post your content and that it doesn't violate 
                any third-party rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Reviews and Ratings</h2>
              <p className="text-gray-700 mb-4">
                Users may leave reviews and ratings. Reviews must be:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Based on genuine experiences</li>
                <li>Honest and factual</li>
                <li>Respectful and not defamatory</li>
                <li>Free from conflicts of interest</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Ndotoni reserves the right to remove reviews that violate these guidelines.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Disclaimer of Warranties</h2>
              <p className="text-gray-700 mb-4">
                Ndotoni is provided "as is" and "as available" without warranties of any kind, either 
                express or implied. We do not guarantee:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Accuracy or completeness of property listings</li>
                <li>Availability of properties</li>
                <li>Quality or condition of accommodations</li>
                <li>Behavior or reliability of other users</li>
                <li>Uninterrupted or error-free service</li>
                <li>Security of data transmission</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                To the maximum extent permitted by law, Ndotoni shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages, including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Loss of profits, revenue, or data</li>
                <li>Property damage or personal injury</li>
                <li>Disputes between landlords and tenants</li>
                <li>Unauthorized access to your account</li>
                <li>Errors or omissions in content</li>
                <li>Service interruptions or delays</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Our total liability shall not exceed the amount you paid to Ndotoni in the 12 months 
                preceding the claim.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Indemnification</h2>
              <p className="text-gray-700 mb-4">
                You agree to indemnify and hold harmless Ndotoni, its officers, directors, employees, and 
                agents from any claims, damages, losses, or expenses arising from:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Your use of the platform</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Your content or property listings</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Termination</h2>
              <p className="text-gray-700 mb-4">
                We may suspend or terminate your account at any time if you:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Violate these Terms</li>
                <li>Engage in fraudulent or illegal activities</li>
                <li>Harm other users or the platform</li>
                <li>Fail to pay fees when due</li>
              </ul>
              <p className="text-gray-700 mb-4">
                You may also delete your account at any time through account settings. Upon termination:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Your access to the platform will be revoked</li>
                <li>Your listings will be removed</li>
                <li>Outstanding obligations remain in effect</li>
                <li>Certain provisions of these Terms survive termination</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Dispute Resolution</h2>
              <p className="text-gray-700 mb-4">
                If you have a dispute with another user, you agree to resolve it directly with that user. 
                Ndotoni may provide assistance but is not obligated to do so.
              </p>
              <p className="text-gray-700 mb-4">
                For disputes with Ndotoni, you agree to first attempt informal resolution by contacting 
                us at info@ndotoni.com.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Governing Law and Jurisdiction</h2>
              <p className="text-gray-700 mb-4">
                These Terms are governed by the laws of the United Republic of Tanzania. Any disputes 
                shall be resolved in the courts of Tanzania.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">16. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We may update these Terms from time to time. We will notify you of significant changes 
                via email or a prominent notice on the platform. Your continued use of Ndotoni after 
                changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">17. Severability</h2>
              <p className="text-gray-700 mb-4">
                If any provision of these Terms is found to be invalid or unenforceable, the remaining 
                provisions shall continue in full force and effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">18. Entire Agreement</h2>
              <p className="text-gray-700 mb-4">
                These Terms, together with our Privacy Policy, constitute the entire agreement between 
                you and Ndotoni regarding the use of our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">19. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have questions about these Terms:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> <a href="mailto:info@ndotoni.com" className="text-blue-600 hover:underline">info@ndotoni.com</a></p>
                <p className="text-gray-700"><strong>Website:</strong> <a href="https://ndotoni.com/contact" className="text-blue-600 hover:underline">https://ndotoni.com/contact</a></p>
                <p className="text-gray-700"><strong>Address:</strong> Ndotoni Rental Agency, Tanzania</p>
              </div>
            </section>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-8">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> By using Ndotoni, you acknowledge that you have read, understood, 
                and agree to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
