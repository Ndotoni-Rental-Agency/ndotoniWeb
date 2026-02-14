import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Data Deletion Request | Ndotoni',
  description: 'Learn how to request deletion of your personal data from Ndotoni.',
};

export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Data Deletion Request</h1>
          <p className="text-lg text-gray-600 mb-8">
            We respect your right to control your personal data. This page explains how to request 
            deletion of your information from Ndotoni.
          </p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How to Request Data Deletion</h2>
              <p className="text-gray-700 mb-6">
                If you wish to delete your Ndotoni account and associated data, you have two convenient options:
              </p>
            </section>

            <section className="mb-8">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Option 1: Delete Through Your Account (Recommended)
                </h3>
                <p className="text-gray-700 mb-4">
                  The fastest way to delete your account is through your account settings:
                </p>
                <ol className="list-decimal pl-6 space-y-3 text-gray-700">
                  <li>Sign in to your Ndotoni account at <a href="https://ndotoni.com" className="text-blue-600 hover:underline">https://ndotoni.com</a></li>
                  <li>Click on your profile icon and go to <strong>Account Settings</strong></li>
                  <li>Scroll to the bottom of the page</li>
                  <li>Click the <strong>"Delete Account"</strong> button</li>
                  <li>Confirm your decision in the popup dialog</li>
                  <li>Your account will be deleted immediately</li>
                </ol>
                <div className="mt-4">
                  <Link 
                    href="/account/settings" 
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Go to Account Settings
                  </Link>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <div className="bg-gray-50 border-l-4 border-gray-400 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Option 2: Email Request
                </h3>
                <p className="text-gray-700 mb-4">
                  If you cannot access your account, send an email to:
                </p>
                <div className="bg-white p-4 rounded-lg mb-4">
                  <p className="text-gray-700"><strong>Email:</strong> <a href="mailto:info@ndotoni.com" className="text-blue-600 hover:underline">info@ndotoni.com</a></p>
                  <p className="text-gray-700"><strong>Subject:</strong> Data Deletion Request</p>
                </div>
                <p className="text-gray-700 mb-4">
                  Please include in your email:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Your registered email address</li>
                  <li>Your full name (as registered on Ndotoni)</li>
                  <li>Reason for deletion (optional)</li>
                  <li>Any additional information to help us verify your identity</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  We will process your request within <strong>30 days</strong> and send you a confirmation email.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What Gets Deleted</h2>
              <p className="text-gray-700 mb-4">
                When you delete your account, we permanently remove the following information:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Personal Information</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    <li>Name and email address</li>
                    <li>Phone number</li>
                    <li>Profile picture</li>
                    <li>Account credentials</li>
                  </ul>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Property Data</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    <li>Property listings</li>
                    <li>Property photos and videos</li>
                    <li>Property descriptions</li>
                    <li>Availability calendars</li>
                  </ul>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Communication</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    <li>Messages and inquiries</li>
                    <li>Chat history</li>
                    <li>Email preferences</li>
                    <li>Notification settings</li>
                  </ul>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Activity Data</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    <li>Booking history</li>
                    <li>Saved favorites</li>
                    <li>Reviews and ratings</li>
                    <li>Search history</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What We Retain</h2>
              <p className="text-gray-700 mb-4">
                For legal, security, and business purposes, we may retain certain information:
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
                <ul className="space-y-3 text-gray-700">
                  <li>
                    <strong>Transaction Records:</strong> Financial transaction records are retained for 
                    7 years as required by Tanzanian law and tax regulations.
                  </li>
                  <li>
                    <strong>Anonymized Analytics:</strong> Aggregated, anonymized data with no personal 
                    identifiers may be retained indefinitely for statistical analysis.
                  </li>
                  <li>
                    <strong>Backup Copies:</strong> Data in backup systems is automatically deleted within 
                    90 days of account deletion.
                  </li>
                  <li>
                    <strong>Legal Holds:</strong> If your data is subject to a legal hold or investigation, 
                    we may retain it until the matter is resolved.
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Facebook Login Users</h2>
              <p className="text-gray-700 mb-4">
                If you signed up using Facebook Login, deleting your Ndotoni account will:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Remove all your data from Ndotoni's systems</li>
                <li>Revoke Ndotoni's access to your Facebook account</li>
                <li>Not affect your Facebook account itself</li>
              </ul>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-3">
                  <strong>To also remove Ndotoni from your Facebook apps:</strong>
                </p>
                <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                  <li>Go to Facebook <strong>Settings & Privacy</strong> → <strong>Settings</strong></li>
                  <li>Click <strong>Apps and Websites</strong></li>
                  <li>Find "Ndotoni" in the list</li>
                  <li>Click <strong>Remove</strong></li>
                </ol>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Google Login Users</h2>
              <p className="text-gray-700 mb-4">
                If you signed up using Google Sign-In, deleting your Ndotoni account will:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Remove all your data from Ndotoni's systems</li>
                <li>Revoke Ndotoni's access to your Google account</li>
                <li>Not affect your Google account itself</li>
              </ul>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-3">
                  <strong>To also remove Ndotoni from your Google account:</strong>
                </p>
                <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                  <li>Go to your <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Account Permissions</a></li>
                  <li>Find "Ndotoni" in the list of third-party apps</li>
                  <li>Click <strong>Remove Access</strong></li>
                </ol>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Processing Timeline</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-32 font-semibold text-gray-900">Immediate:</div>
                  <div className="text-gray-700">Account deletion through settings (Option 1)</div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-32 font-semibold text-gray-900">Within 30 days:</div>
                  <div className="text-gray-700">Email requests (Option 2) and complete data removal from active systems</div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-32 font-semibold text-gray-900">Within 90 days:</div>
                  <div className="text-gray-700">Complete removal from backup systems</div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-32 font-semibold text-gray-900">7 years:</div>
                  <div className="text-gray-700">Transaction records (legal requirement)</div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Before You Delete</h2>
              <div className="bg-orange-50 border-l-4 border-orange-500 p-6">
                <p className="text-gray-700 mb-4">
                  <strong>Please note:</strong> Account deletion is permanent and cannot be undone. 
                  Before deleting your account, consider:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Downloading any important data or documents</li>
                  <li>Completing any pending bookings or transactions</li>
                  <li>Resolving any outstanding disputes</li>
                  <li>Canceling any active property listings</li>
                  <li>Informing tenants or landlords you're communicating with</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Alternative: Deactivate Instead</h2>
              <p className="text-gray-700 mb-4">
                If you're not ready for permanent deletion, you can temporarily deactivate your account:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Your profile and listings will be hidden</li>
                <li>You won't receive notifications</li>
                <li>Your data remains secure</li>
                <li>You can reactivate anytime by signing in</li>
              </ul>
              <p className="text-gray-700 mt-4">
                To deactivate, go to Account Settings and select "Deactivate Account" instead of "Delete Account".
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Business Information</h2>
              <p className="text-gray-700 mb-4">
                Ndotoni is a legally registered business in Tanzania, operating with full compliance 
                to local regulations and business standards.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Legal Business Name</h3>
                  <p className="text-lg font-semibold text-gray-900">NDOTONI ONLINE TRADERS</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Registration Number</h3>
                  <p className="text-lg font-semibold text-gray-900">631961</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Principal Place of Business</h3>
                <p className="text-gray-700">
                  Near Navanga Ward Office, Nangaru Ward<br />
                  Lindi District, Lindi Region<br />
                  P.O. Box 328, Postal Code 65207<br />
                  Tanzania
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Proprietor</h3>
                <p className="text-lg font-semibold text-gray-900">Kelvin Lameck Makoye</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Questions or Concerns?</h2>
              <p className="text-gray-700 mb-4">
                If you have questions about data deletion or need assistance:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <strong>Email:</strong> <a href="mailto:info@ndotoni.com" className="text-blue-600 hover:underline">info@ndotoni.com</a>
                  </p>
                  <p className="text-gray-700">
                    <strong>Phone:</strong> <a href="tel:+255782267121" className="text-blue-600 hover:underline">+255 782 267 121</a>
                  </p>
                  <p className="text-gray-700">
                    <strong>Contact Form:</strong> <a href="https://ndotoni.com/contact" className="text-blue-600 hover:underline">https://ndotoni.com/contact</a>
                  </p>
                  <p className="text-gray-700">
                    <strong>Privacy Policy:</strong> <Link href="/privacy" className="text-blue-600 hover:underline">https://ndotoni.com/privacy</Link>
                  </p>
                  <p className="text-gray-700">
                    <strong>Terms of Service:</strong> <Link href="/terms" className="text-blue-600 hover:underline">https://ndotoni.com/terms</Link>
                  </p>
                  <p className="text-gray-700 mt-3">
                    <strong>Address:</strong><br />
                    NDOTONI ONLINE TRADERS<br />
                    Near Navanga Ward Office, Nangaru Ward<br />
                    Lindi District, Lindi Region<br />
                    P.O. Box 328, Postal Code 65207<br />
                    Tanzania
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights Under GDPR</h2>
              <p className="text-gray-700 mb-4">
                If you're in the European Union, you have additional rights under GDPR:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Right to Access:</strong> Request a copy of your data</li>
                <li><strong>Right to Rectification:</strong> Correct inaccurate data</li>
                <li><strong>Right to Erasure:</strong> Request deletion (this page)</li>
                <li><strong>Right to Portability:</strong> Export your data</li>
                <li><strong>Right to Object:</strong> Object to certain processing</li>
                <li><strong>Right to Restrict:</strong> Limit how we use your data</li>
              </ul>
              <p className="text-gray-700 mt-4">
                To exercise these rights, contact us at <a href="mailto:info@ndotoni.com" className="text-blue-600 hover:underline">info@ndotoni.com</a>
              </p>
            </section>

            <div className="bg-green-50 border-l-4 border-green-500 p-6 mt-8">
              <p className="text-gray-700">
                <strong>We're here to help!</strong> If you have any questions or concerns about deleting 
                your data, please don't hesitate to reach out. We're committed to respecting your privacy 
                and making the process as smooth as possible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
