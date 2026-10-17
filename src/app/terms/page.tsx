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
          <p className="text-sm text-gray-600 mb-2">Last updated: October 17, 2026</p>
          <p className="text-sm font-semibold text-gray-800 mb-8">
            Please read these Terms carefully. They include limitations on Ndotoni's liability, an
            assumption-of-risk provision for interactions with other users, and a waiver of class or
            representative claims.
          </p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using Ndotoni ("the Platform"), you accept and agree to be bound by these
                Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our services.
              </p>
              <p className="text-gray-700 mb-4">
                These Terms constitute a legally binding agreement between you and Ndotoni Technologies Limited
                ("Ndotoni", "we", "us", or "our"), a private limited company registered in Tanzania.
              </p>
              <p className="text-gray-700 mb-4">
                Ndotoni Technologies Limited operates two platforms. These Terms govern your use of{' '}
                <strong>ndotoni.com</strong>, our long-term rental platform for landlords and tenants. Our
                short-term stays platform, <strong>ndotonistays.com</strong>, is governed by its own{' '}
                <a href="https://www.ndotonistays.com/terms" className="text-blue-600 hover:underline">Terms of Service</a>.
                If you use both platforms, the terms for each apply to your use of that platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-4">
                Ndotoni.com is an online platform that connects property owners (landlords) with people seeking
                long-term rental accommodations (tenants) in Tanzania. We provide:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Property listing and search functionality</li>
                <li>Messaging system for communication between users</li>
                <li>Booking and payment processing services</li>
                <li>User profiles, reviews, and ratings</li>
                <li>Property management tools for landlords</li>
                <li>A referral program for connecting new landlords to the platform</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Ndotoni acts as an intermediary platform and is not a party to rental agreements between
                landlords and tenants. Short-term stays (nightly bookings, party venues, and similar) are
                handled separately by ndotonistays.com. We may add, change, or remove features of the
                Platform at any time, with or without notice, and without liability to you.
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
                <li>If registering on behalf of a company or another person, have the legal authority to bind that party to these Terms</li>
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
                <li>Comply with all applicable Tanzanian laws and regulations relating to rental property, including any tenancy, health, safety, building, and tax obligations that apply to you</li>
                <li>Maintain your property in a safe and habitable condition</li>
                <li>Disclose any known defects or issues with the property</li>
                <li>Not discriminate against tenants based on protected characteristics</li>
                <li>Hold, or obtain, any license, permit, or registration required by Tanzanian law to rent out your property</li>
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
                <li>Misrepresent your identity or your legal authority to list, rent, or manage a property</li>
                <li>Harass, abuse, threaten, or harm other users</li>
                <li>Use the platform for any illegal activities</li>
                <li>Attempt to circumvent payment systems or fees, including arranging payment off-platform to avoid a fee</li>
                <li>Scrape, copy, or download content without permission</li>
                <li>Impersonate others or create fake accounts</li>
                <li>Spam or send unsolicited messages</li>
                <li>Upload malicious code or viruses</li>
                <li>Interfere with the platform's operation or security</li>
                <li>Use automated systems (bots) without authorization</li>
                <li>Submit fraudulent referrals, reviews, or claims for any reward or payout</li>
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
                <li>A service fee charged to tenants when a booking or application is completed</li>
                <li>A listing fee charged to landlords for listings beyond the free tier, or for priority placement and other premium features (see Section 26)</li>
                <li>Transaction processing fees</li>
              </ul>
              <p className="text-gray-700 mb-4">
                All fees will be clearly disclosed before you complete a transaction and are quoted in
                Tanzanian Shillings (TZS) unless stated otherwise. Except where required by law or expressly
                stated in these Terms, service fees are non-refundable once the service they relate to has
                been provided (for example, once a booking or application has been submitted).
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">6.2 Payment Processing</h3>
              <p className="text-gray-700 mb-4">
                Payments are processed securely through third-party providers (M-Pesa and other payment
                gateways). Ndotoni is not a bank or licensed payment institution; we rely on these
                third-party providers to process, hold, or transmit funds, and we are not responsible for
                their errors, delays, outages, or fraud. You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Provide accurate payment information</li>
                <li>Pay all amounts when due</li>
                <li>Comply with the payment provider's terms</li>
                <li>Be responsible for any payment processing fees, currency conversion charges, or chargebacks arising from your transactions</li>
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
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Relationship Between Users; Assumption of Risk</h2>
              <p className="text-gray-700 mb-4">
                Ndotoni is a venue that helps independent landlords and tenants find and communicate with
                each other. Landlords and tenants are independent of Ndotoni and of one another. Nothing
                in these Terms creates an employment, agency, joint venture, or partnership relationship
                between Ndotoni and any user, or between any two users. Ndotoni does not control, and is
                not responsible for, the conduct of any landlord, tenant, or other user, whether on or off
                the platform.
              </p>
              <p className="text-gray-700 mb-4">
                You are solely responsible for your interactions with other users, including property
                viewings, key handovers, deposits, deliveries, or any other in-person or off-platform
                meeting arranged through Ndotoni. We encourage common-sense precautions (meeting in daylight,
                bringing a companion, verifying details independently) but do not supervise or guarantee the
                safety of any such interaction. To the fullest extent permitted by law, you assume all risk
                arising from your use of the platform and your interactions with other users.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Identity Verification</h2>
              <p className="text-gray-700 mb-4">
                We may ask some users for identity information (such as a National ID/NIDA number) to help
                verify who they are. We do not independently verify the authenticity of any identity
                document, and we do not guarantee that any user is who they claim to be, or that any user
                is trustworthy, creditworthy, or free of a criminal history. You are responsible for
                exercising your own judgment when deciding whether to transact with another user.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Content and Intellectual Property</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">10.1 Ndotoni's Content</h3>
              <p className="text-gray-700 mb-4">
                All content on Ndotoni (logos, text, graphics, software, design) is owned by Ndotoni or
                its licensors and protected by intellectual property laws. You may not use our intellectual
                property without written permission.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">10.2 User Content</h3>
              <p className="text-gray-700 mb-4">
                You retain ownership of content you post (property listings, photos, reviews). By posting
                content, you grant Ndotoni a non-exclusive, worldwide, royalty-free license to use, display,
                and distribute your content on the platform.
              </p>
              <p className="text-gray-700 mb-4">
                You represent that you have the right to post your content and that it doesn't violate
                any third-party rights.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">10.3 Copyright Complaints</h3>
              <p className="text-gray-700 mb-4">
                If you believe content on Ndotoni infringes your copyright, email info@ndotoni.com with:
                (a) a description of the copyrighted work; (b) the location of the allegedly infringing
                content on the platform; (c) your contact details; and (d) a statement, made in good faith,
                that you are the rights holder or authorized to act on their behalf. We may remove or
                disable content that we determine, in our discretion, infringes another party's rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Reviews and Ratings</h2>
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
                Ndotoni reserves the right to remove reviews that violate these guidelines. Reviews reflect
                the opinion of the author, not of Ndotoni, and we do not verify or endorse their content.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Disclaimer of Warranties</h2>
              <p className="text-gray-700 mb-4">
                Ndotoni is provided "as is" and "as available" without warranties of any kind, either
                express or implied, including any implied warranty of merchantability or fitness for a
                particular purpose. We do not guarantee:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Accuracy or completeness of property listings</li>
                <li>Availability of properties</li>
                <li>Quality or condition of accommodations</li>
                <li>The identity, behavior, or reliability of other users</li>
                <li>Any particular financial, tax, or legal outcome from using the platform</li>
                <li>Uninterrupted or error-free service</li>
                <li>Security of data transmission</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Nothing on Ndotoni (including our blog, guides, or support messages) constitutes legal,
                tax, financial, or real-estate advice. You should seek independent professional advice
                before making a rental, financial, or legal decision.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                To the maximum extent permitted by law, Ndotoni shall not be liable for any indirect,
                incidental, special, consequential, or punitive damages, including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Loss of profits, revenue, or data</li>
                <li>Property damage or personal injury, including any occurring during a property viewing, key handover, or tenancy</li>
                <li>Disputes between landlords and tenants</li>
                <li>Unauthorized access to your account</li>
                <li>Errors or omissions in content</li>
                <li>Failures, delays, or errors of any third-party payment provider</li>
                <li>Service interruptions or delays, including those caused by events described in Section 17 (Force Majeure)</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Subject to rights and liabilities that cannot lawfully be excluded, our total liability shall not exceed the amount you paid to Ndotoni in the 12 months
                preceding the claim.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Indemnification</h2>
              <p className="text-gray-700 mb-4">
                You agree to indemnify and hold harmless Ndotoni, its officers, directors, employees, and
                agents from any claims, damages, losses, or expenses arising from:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Your use of the platform</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Your content, property listings, or referral submissions</li>
                <li>Your interactions with other users, on or off the platform</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Tax Responsibility</h2>
              <p className="text-gray-700 mb-4">
                You are solely responsible for determining, reporting, and paying any taxes that may apply
                to income or payments you receive through Ndotoni, including rental income and referral
                rewards. Ndotoni does not provide tax advice and does not withhold, collect, or remit taxes
                on your behalf, except where required by Tanzanian law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">16. Communications</h2>
              <p className="text-gray-700 mb-4">
                By creating an account, you consent to receive transactional communications from Ndotoni
                related to your account, listings, bookings, and referrals via email, SMS, WhatsApp, or
                push notification. You may opt out of marketing communications at any time; you cannot opt
                out of essential account and transaction-related messages while your account is active.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">17. Force Majeure</h2>
              <p className="text-gray-700 mb-4">
                Ndotoni is not liable for any failure or delay in performing its obligations under these
                Terms where the failure or delay results from causes beyond our reasonable control,
                including natural disasters, fire, flood, epidemic or pandemic, war, civil unrest,
                government action or regulation, labor disputes, or outages of power, internet,
                telecommunications, or third-party payment networks.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">18. Termination</h2>
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
              <p className="text-gray-700 mt-4">
                We may also modify, suspend, or discontinue any part of the platform (including specific
                features, the Referral Program, or premium listing features) at any time, with or without
                notice, and without liability to you.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">19. Dispute Resolution</h2>
              <p className="text-gray-700 mb-4">
                If you have a dispute with another user, you agree to resolve it directly with that user.
                Ndotoni may provide assistance but is not obligated to do so.
              </p>
              <p className="text-gray-700 mb-4">
                For disputes with Ndotoni, you agree to first attempt informal resolution by contacting
                us at info@ndotoni.com.
              </p>
              <p className="text-gray-700 mb-4">
                To the fullest extent permitted by law, any claim against Ndotoni must be brought in your
                individual capacity, and not as a plaintiff or class member in any purported class,
                collective, or representative proceeding.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">20. Governing Law and Jurisdiction</h2>
              <p className="text-gray-700 mb-4">
                These Terms are governed by the laws of the United Republic of Tanzania. Any disputes
                shall be resolved in the courts of Tanzania.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">21. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We may update these Terms from time to time. We will notify you of significant changes
                via email or a prominent notice on the platform. Your continued use of Ndotoni after
                changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">22. Severability</h2>
              <p className="text-gray-700 mb-4">
                If any provision of these Terms is found to be invalid or unenforceable, the remaining
                provisions shall continue in full force and effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">23. Entire Agreement</h2>
              <p className="text-gray-700 mb-4">
                These Terms, together with our Privacy Policy, constitute the entire agreement between
                you and Ndotoni regarding the use of our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">24. Business Information</h2>
              <p className="text-gray-700 mb-4">
                Ndotoni is operated by a legally registered company in Tanzania, operating with full compliance
                to local regulations and business standards. Ndotoni Technologies Limited operates both
                ndotoni.com (long-term rentals) and ndotonistays.com (short-term stays).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Legal Business Name</h3>
                  <p className="text-lg font-semibold text-gray-900">NDOTONI TECHNOLOGIES LIMITED</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Company Type</h3>
                  <p className="text-lg font-semibold text-gray-900">Private Limited Company</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Principal Place of Business</h3>
                <p className="text-gray-700">
                  Wazo Hill, Kunduchi Ward<br />
                  Kinondoni District, Dar es Salaam<br />
                  P.O. Box 14125<br />
                  Tanzania
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Director</h3>
                <p className="text-lg font-semibold text-gray-900">Adam Nzinza</p>
              </div>
            </section>

            <section id="referral-programme" className="mb-8 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">25. Referral Program Terms</h2>
              <p className="text-gray-700 mb-4">Introduce new hosts and guests. Earn up to TZS 30,000 for new hosts and up to TZS 50,000 for booking referrals. These terms explain how personal-Link referral rewards work across Ndotoni and Ndotoni Stays.</p>
              <ol className="list-decimal pl-6 space-y-4 text-gray-700 mb-4">
                <li><strong>Who can participate.</strong> You must be at least 18, have a valid Ndotoni account or use your WhatsApp number with our bot, and provide accurate identity and payment details. To qualify for referral rewards, follow the Ndotoni Instagram page (@ndotoni_rentals) and download the Ndotoni app from the App Store or Google Play. Eligibility is reviewed before payout; a link click alone does not establish that these requirements have been met. The referred host must be a genuine new owner or authorized manager who has not previously listed on Ndotoni or Ndotoni Stays. Creating another account does not make an existing host new.</li>
                <li><strong>Share freely; six rewarded hosts.</strong> You may share your personal Link with as many people as you wish. Cash rewards apply only to your first six eligible new hosts approved by Ndotoni under this programme, in approval order, with a maximum total of TZS 30,000. Further referrals may join the platform but do not earn cash rewards. This is one combined limit across the website, app, WhatsApp, Ndotoni, and Ndotoni Stays; it does not reset through additional accounts or units.</li>
                <li><strong>One host, one reward.</strong> A host can generate only one referral reward, even if they list multiple rooms, apartments, properties, or units, or use multiple accounts or channels. Duplicate submissions, repeat owners, and attempts to split the same host into several identities do not qualify.</li>
                <li><strong>Amounts are confirmed after review.</strong> Up to TZS 5,000 is the maximum reward per approved host, not a fixed or guaranteed payment. The approved amount may be lower and is determined by Ndotoni after reviewing eligibility, listing suitability, and programme requirements. Signup, a draft, publication, or verification alone does not guarantee a reward. Ndotoni will confirm the approved amount before payment. Referrers must not promise others guaranteed payments, bookings, or income.</li>
                <li><strong>Booking rewards.</strong> You may also earn when a guest books a stay on Ndotoni Stays through your Link or a stay you shared. The first referrer recorded for a guest is credited for that guest’s eligible bookings for 12 months from that first referral. A booking reward can become due only after the guest’s checkout date, once the booking has been paid and has not been cancelled, refunded, or marked as a no-show. Up to TZS 10,000 per booking is the maximum, not a fixed or guaranteed payment; Ndotoni confirms the amount after review. A maximum of five eligible bookings can earn cash rewards per referrer, in approval order, for a maximum booking-reward total of TZS 50,000. Repeat bookings by the same guest each use one of these five places. Referring 100 bookings still earns rewards for at most five bookings. This combined programme limit applies across Ndotoni, Ndotoni Stays, the app and WhatsApp, and does not reset through additional accounts. Bookings you make yourself, bookings at a place you host or manage, and bookings arranged mainly to obtain a reward do not qualify.</li>
                <li><strong>Attribution and eligibility.</strong> The first valid referral accepted and recorded for the host is used. The host must use your Link or referral code before their first listing, and at least one genuine listing must be verified and published. Opening a Link alone is not approval. Browser restrictions, switching devices, and installing the app can interrupt tracking; reopen the Link or enter the referral code to continue. If attribution is missing or disputed, contact us with supporting evidence. We review records and evidence reasonably; attribution cannot be retrospectively added to an existing host simply to claim a reward.</li>
                <li><strong>Verification and payment.</strong> We may request reasonable evidence of identity, authority to list, ownership, and accurate contact or payout information. Rewards remain pending until review and express approval. Approved payments are sent to a verified mobile money account; you must ensure its details are correct. There is no promise of instant payment or a fixed processing time. We will process approved rewards within a reasonable period after required checks are complete, subject to lawful holds and payment-provider delays. Any legally required withholding will be explained.</li>
                <li><strong>Fair use and consent.</strong> Self-referrals, fabricated hosts, duplicate accounts, false documents, impersonation, unauthorized sharing of personal data, unsolicited bulk messaging, and manipulation of tracking or reward limits are prohibited. Obtain permission before sharing another person’s details. Do not present yourself as an employee or agent of Ndotoni, bind us to promises, charge people on our behalf, or misrepresent these terms.</li>
                <li><strong>Suspension, rejection, and recovery.</strong> Where reasonably necessary to investigate suspected abuse, conflicting ownership, incomplete verification, or payment errors, we may pause review or payment and request evidence. We may reject ineligible referrals, suspend programme access, correct mistakes, or seek lawful recovery of payments obtained through fraud, duplication, or material error. We will explain the relevant reason where lawful and appropriate and allow you to raise a dispute. These rights do not permit us to arbitrarily cancel a valid approved reward.</li>
                <li><strong>Programme changes.</strong> We may change, pause, or end this programme by publishing updated terms or notifying participants as appropriate. Changes ordinarily apply prospectively and do not reduce rewards already expressly approved, except for fraud, duplication, material error, or a legal requirement. A referral not yet approved is not a guarantee of payment. Separate promotions and earlier written reward or profit-share agreements remain governed by their own agreed terms; this programme does not automatically include rental profit sharing.</li>
                <li><strong>Independent participation.</strong> Participation does not create employment, agency, partnership, or an entitlement to salary or guaranteed income. You are responsible for your own lawful referral activity and applicable taxes. To the extent permitted by law, you are responsible for losses directly caused by your fraud, unlawful disclosure, or material breach, rather than losses caused by Ndotoni’s own fault.</li>
                <li><strong>Questions, disputes, and legal rights.</strong> For an attribution, eligibility, or payment question, contact info@ndotoni.com with the referral code and relevant information. We will review your complaint in good faith. These programme terms operate with the general Terms of Service, but do not exclude mandatory consumer rights, lawful access to regulators or courts, liability that cannot lawfully be excluded, or payment of valid approved rewards. Ndotoni’s review discretion must be exercised reasonably and in accordance with applicable law.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">26. Landlord Property Management Service</h2>
              <p className="text-gray-700 mb-4">
                By registering your property with Ndotoni, you agree to the following:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Ndotoni will photograph, list, and market your property to potential tenants</li>
                <li>A limited number of listings are free. Beyond that, Ndotoni charges a listing fee under one of our subscription plans (per-listing, 5-month, or 15-month) for additional listings, priority placement, or analytics features. Ndotoni also earns revenue by charging tenants a service fee</li>
                <li>Current plan pricing is shown in your landlord dashboard before you purchase a plan, and may change with notice</li>
                <li>You authorize Ndotoni staff to visit your property for photography and inspections at mutually agreed times</li>
                <li>You confirm that you are the legal owner or authorized agent of the property being listed, and that you have the legal right to rent it out</li>
                <li>You agree to provide accurate information about the property including availability, pricing, and condition</li>
                <li>Ndotoni does not guarantee occupancy, tenant placement, or any particular rental income within any specific timeframe or at all</li>
                <li>You are solely responsible for complying with Tanzanian tenancy, tax, and property law, and for the terms of the lease agreement you enter into with a tenant</li>
                <li>You may request removal of your property listing at any time by contacting us, and Ndotoni may remove, edit, or reject any listing at its discretion</li>
                <li>Rental agreements are between the landlord and tenant directly. Ndotoni is not a party to the lease</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">27. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have questions about these Terms:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> <a href="mailto:info@ndotoni.com" className="text-blue-600 hover:underline">info@ndotoni.com</a></p>
                <p className="text-gray-700"><strong>Phone/WhatsApp:</strong> <a href="tel:+255790720329" className="text-blue-600 hover:underline">+255 790 720 329</a></p>
                <p className="text-gray-700"><strong>Website:</strong> <a href="https://ndotoni.com/contact" className="text-blue-600 hover:underline">https://ndotoni.com/contact</a></p>
                <p className="text-gray-700 mt-2">
                  <strong>Address:</strong><br />
                  NDOTONI TECHNOLOGIES LIMITED<br />
                  Wazo Hill, Kunduchi Ward<br />
                  Kinondoni District, Dar es Salaam<br />
                  P.O. Box 14125<br />
                  Tanzania
                </p>
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
