import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Ndotoni',
  description: 'Learn how Ndotoni collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-sm text-gray-600 mb-8">Last updated: February 14, 2026</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                Welcome to Ndotoni. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy explains how we collect, use, store, and share your information when you use 
                our rental property platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                When you use Ndotoni, we collect the following types of information:
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Information You Provide</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Name and email address (when you create an account)</li>
                <li>Phone number (optional, for contact purposes)</li>
                <li>Profile picture (if you sign in with Google or Facebook)</li>
                <li>Property information and photos (if you're a landlord)</li>
                <li>Messages and inquiries sent through our platform</li>
                <li>Booking and payment information</li>
                <li>Reviews and ratings</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Information Collected Automatically</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Device information (browser type, operating system)</li>
                <li>IP address and location data</li>
                <li>Usage data (pages visited, features used)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.3 Information from Third Parties</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Social media profile information (when you sign in with Google or Facebook)</li>
                <li>Payment information from payment processors (M-Pesa, etc.)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Provide and improve our rental platform services</li>
                <li>Create and manage your account</li>
                <li>Facilitate communication between tenants and landlords</li>
                <li>Process bookings and payments securely</li>
                <li>Send important notifications about your account and bookings</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Prevent fraud and ensure platform security</li>
                <li>Analyze usage patterns to improve user experience</li>
                <li>Comply with legal obligations</li>
                <li>Send marketing communications (with your consent)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. How We Store Your Information</h2>
              <p className="text-gray-700 mb-4">
                Your data is securely stored on Amazon Web Services (AWS) infrastructure with industry-standard 
                security measures:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Encryption at rest and in transit (TLS/SSL)</li>
                <li>Regular security audits and monitoring</li>
                <li>Access controls and multi-factor authentication</li>
                <li>Automated backup and disaster recovery systems</li>
                <li>Data centers located in secure facilities</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Sharing Your Information</h2>
              <p className="text-gray-700 mb-4">
                We do not sell your personal information. We may share your information with:
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 Other Users</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Landlords can see tenant inquiries and contact information</li>
                <li>Tenants can see landlord contact information for properties they inquire about</li>
                <li>Public profile information is visible to all users</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.2 Service Providers</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Cloud hosting services (Amazon Web Services)</li>
                <li>Payment processors (M-Pesa and other payment gateways)</li>
                <li>Email service providers</li>
                <li>Analytics services</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.3 Legal Requirements</h3>
              <p className="text-gray-700 mb-4">
                We may disclose your information when required by law, court order, or to protect our rights 
                and the safety of our users.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights and Choices</h2>
              <p className="text-gray-700 mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correct:</strong> Update or correct inaccurate information</li>
                <li><strong>Delete:</strong> Request deletion of your account and data</li>
                <li><strong>Export:</strong> Download your data in a portable format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Object:</strong> Object to certain data processing activities</li>
                <li><strong>Restrict:</strong> Request restriction of data processing</li>
              </ul>
              <p className="text-gray-700 mt-4">
                To exercise these rights, contact us at <a href="mailto:info@ndotoni.com" className="text-blue-600 hover:underline">info@ndotoni.com</a> 
                or visit your account settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookies and Tracking Technologies</h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Keep you signed in to your account</li>
                <li>Remember your preferences and settings</li>
                <li>Analyze site usage and performance</li>
                <li>Provide personalized content and recommendations</li>
                <li>Measure the effectiveness of our marketing campaigns</li>
              </ul>
              <p className="text-gray-700 mt-4">
                You can control cookies through your browser settings. Note that disabling cookies may affect 
                some features of our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Third-Party Services</h2>
              <p className="text-gray-700 mb-4">
                We integrate with third-party services for authentication and payments:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Google Sign-In:</strong> Governed by <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google's Privacy Policy</a></li>
                <li><strong>Facebook Login:</strong> Governed by <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Facebook's Privacy Policy</a></li>
                <li><strong>M-Pesa:</strong> Governed by Vodacom's privacy policies</li>
              </ul>
              <p className="text-gray-700 mt-4">
                When you use these services, their respective privacy policies also apply.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Data Retention</h2>
              <p className="text-gray-700 mb-4">
                We retain your data for as long as your account is active or as needed to provide services. 
                After account deletion:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Most personal data is deleted within 30 days</li>
                <li>Transaction records are retained for 7 years (legal requirement)</li>
                <li>Anonymized analytics data may be retained indefinitely</li>
                <li>Backup copies are deleted within 90 days</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Children's Privacy</h2>
              <p className="text-gray-700 mb-4">
                Ndotoni is not intended for users under 18 years of age. We do not knowingly collect 
                information from children. If you believe we have collected information from a child, 
                please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. International Data Transfers</h2>
              <p className="text-gray-700 mb-4">
                Your data may be transferred to and processed in countries other than Tanzania. We ensure 
                appropriate safeguards are in place to protect your data in accordance with this privacy policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational measures to protect your data. However, 
                no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Changes to This Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this privacy policy from time to time. We will notify you of significant changes 
                via email or a prominent notice on our website. Your continued use of Ndotoni after changes 
                constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have questions about this privacy policy or how we handle your data:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> <a href="mailto:info@ndotoni.com" className="text-blue-600 hover:underline">info@ndotoni.com</a></p>
                <p className="text-gray-700"><strong>Website:</strong> <a href="https://ndotoni.com/contact" className="text-blue-600 hover:underline">https://ndotoni.com/contact</a></p>
                <p className="text-gray-700"><strong>Address:</strong> Ndotoni Rental Agency, Tanzania</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
