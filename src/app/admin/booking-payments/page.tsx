'use client';

import { FormEvent, useState } from 'react';
import { GraphQLClient } from '@/lib/graphql-client';
import { BanknotesIcon, CheckCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export const dynamic = 'force-dynamic';
const receiptFields = 'bookingId paymentId method transactionReference amount currency verifiedBy verifiedAt notes';
const reviewQuery = `query AdminGetBookingPayment($bookingId: ID!) { adminGetBookingPayment(bookingId: $bookingId) { booking { bookingId propertyId propertySnapshot { title } guestName checkInDate checkOutDate status paymentStatus pricing { total currency } } receipt { ${receiptFields} } } }`;
const confirmMutation = `mutation AdminConfirmBookingPayment($input: ConfirmManualBookingPaymentInput!) { adminConfirmBookingPayment(input: $input) { bookingId alreadyConfirmed receipt { ${receiptFields} } } }`;
interface Receipt { transactionReference: string; method: string; amount: number; currency: string; verifiedBy: string; verifiedAt: string; notes?: string }
interface Review { booking: { bookingId: string; propertyId: string; propertySnapshot?: {title: string}; guestName: string; checkInDate: string; checkOutDate: string; status: string; paymentStatus: string; pricing: {total: number; currency: string} }; receipt?: Receipt }
const inputStyle = 'mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100 dark:border-slate-600 dark:bg-slate-900 dark:text-white';

export default function BookingPaymentsPage() {
  const [bookingId,setBookingId] = useState('');
  const [review,setReview] = useState<Review|null>(null);
  const [method,setMethod] = useState('BANK_TRANSFER');
  const [reference,setReference] = useState('');
  const [amount,setAmount] = useState('');
  const [notes,setNotes] = useState('');
  const [verified,setVerified] = useState(false);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState('');
  const [success,setSuccess] = useState('');
  const load = async (id: string) => {
    const data = await GraphQLClient.executeAuthenticated<{adminGetBookingPayment:Review}>(reviewQuery,{bookingId:id});
    setReview(data.adminGetBookingPayment);
  };
  async function lookup(e: FormEvent) {
    e.preventDefault();setBusy(true);setError('');setSuccess('');setReview(null);setVerified(false);setAmount('');setReference('');setNotes('');
    try { await load(bookingId.trim()); } catch(e) {setError(e instanceof Error ? e.message : 'Unable to load booking.');} finally {setBusy(false);}
  }
  async function confirm(e: FormEvent) {
    e.preventDefault();if(!review || !verified || busy)return;
    setBusy(true);setError('');setSuccess('');
    try {
      const id=review.booking.bookingId;
      const data=await GraphQLClient.executeAuthenticated<{adminConfirmBookingPayment:{alreadyConfirmed:boolean;receipt:Receipt}}>(confirmMutation,{input:{bookingId:id,method,transactionReference:reference.trim(),amount:Number(amount),currency:review.booking.pricing.currency,notes:notes.trim() || null}});
      setReview({...review,booking:{...review.booking,paymentStatus:'CAPTURED'},receipt:data.adminConfirmBookingPayment.receipt});
      setSuccess(data.adminConfirmBookingPayment.alreadyConfirmed ? 'This transaction was already confirmed. No second payment was recorded.' : 'Payment confirmed and dates reserved. The usual guest receipt and host/admin notifications have been requested.');
      setVerified(false);
    } catch(e) {setError(e instanceof Error ? e.message : 'Confirmation did not finish. Reload the booking before retrying.');}
    finally {setBusy(false);}
  }
  const b=review?.booking;
  const eligible=b?.status==='CONFIRMED' && ['PENDING','FAILED'].includes(b.paymentStatus);
  const matches=!!b && Number.isFinite(Number(amount)) && Number(amount)>0 && Math.round(Number(amount)*100)===Math.round(b.pricing.total*100);
  return <div className="mx-auto max-w-5xl space-y-6 text-slate-900 dark:text-slate-100">
    <header><div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-700 dark:text-teal-300"><BanknotesIcon className="h-5 w-5"/>PAYMENT OPERATIONS</div><h1 className="text-3xl font-semibold tracking-tight">Confirm a received transfer</h1><p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">Match a bank or TIPS transaction to a booking, then record the money received.</p></header>
    <form onSubmit={lookup} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"><label className="text-sm font-semibold" htmlFor="booking-reference">Booking reference</label><div className="mt-2 flex flex-col gap-3 sm:flex-row"><input id="booking-reference" required value={bookingId} onChange={e=>setBookingId(e.target.value)} placeholder="Paste the booking ID from the payment reference" className={inputStyle+' !mt-0 flex-1'} /><button disabled={busy} className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white disabled:opacity-50 dark:bg-teal-700"><MagnifyingGlassIcon className="h-5 w-5"/>{busy?'Working…':'Find booking'}</button></div></form>
    {error&&<div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">{error}</div>}
    {success&&<div role="status" className="flex gap-3 rounded-xl border border-teal-200 bg-teal-50 p-4 text-teal-900"><CheckCircleIcon className="h-6 w-6 shrink-0"/>{success}</div>}
    {b&&<div className="grid gap-6 lg:grid-cols-2"><section className="self-start rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Booking {b.bookingId}</p><h2 className="mt-2 text-xl font-semibold">{b.propertySnapshot?.title || b.propertyId}</h2><p className="mt-1 text-slate-600 dark:text-slate-400">{b.guestName}</p><dl className="mt-6 space-y-4">{[['Stay',`${b.checkInDate} → ${b.checkOutDate}`],['Booking status',b.status],['Payment status',b.paymentStatus],['Full amount due',`${b.pricing.currency} ${b.pricing.total.toLocaleString()}`]].map(([label,value])=><div key={label} className="flex justify-between gap-4 border-b border-slate-100 pb-3 dark:border-slate-700"><dt className="text-sm text-slate-500">{label}</dt><dd className="text-right font-medium">{value}</dd></div>)}</dl><p className="mt-4 text-sm text-slate-500">Amounts must match the booking currency. Partial payments and currency conversion require separate review.</p></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">{review.receipt?<><h2 className="text-lg font-semibold">Recorded payment</h2><dl className="mt-5 space-y-3 text-sm">{[['Reference',review.receipt.transactionReference],['Method',review.receipt.method.replace(/_/g,' ')],['Received',`${review.receipt.currency} ${review.receipt.amount.toLocaleString()}`],['Verified at',new Date(review.receipt.verifiedAt).toLocaleString()],['Verified by',review.receipt.verifiedBy],['Notes',review.receipt.notes || '—']].map(([k,v])=><div key={k}><dt className="text-slate-500">{k}</dt><dd className="break-words font-medium">{v}</dd></div>)}</dl></>:eligible?<form onSubmit={confirm} className="space-y-5"><h2 className="text-lg font-semibold">Transfer details</h2><label className="block text-sm font-medium">Payment method<select className={inputStyle} value={method} onChange={e=>{setMethod(e.target.value);setVerified(false);}}><option value="BANK_TRANSFER">Bank transfer</option><option value="TIPS">TIPS / Lipa number</option></select></label><label className="block text-sm font-medium">Bank/TIPS transaction reference<input required minLength={3} maxLength={100} className={inputStyle} value={reference} onChange={e=>{setReference(e.target.value);setVerified(false);}} placeholder="Reference from the actual transaction record"/></label><label className="block text-sm font-medium">Amount received ({b.pricing.currency})<input required type="number" min="0.01" step="0.01" className={inputStyle} value={amount} onChange={e=>{setAmount(e.target.value);setVerified(false);}} placeholder="Enter the amount you verified"/></label>{amount&&!matches&&<p className="text-sm text-amber-700">The received amount must equal {b.pricing.currency} {b.pricing.total.toLocaleString()}.</p>}<label className="block text-sm font-medium">Notes (optional)<textarea maxLength={1000} className={inputStyle} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Sender name or internal reconciliation notes"/></label><label className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm dark:bg-slate-900"><input type="checkbox" className="mt-1" checked={verified} onChange={e=>setVerified(e.target.checked)}/><span>I checked the bank/TIPS records and verified this money was received. A screenshot alone is not confirmation.</span></label><button disabled={busy||!verified||!matches||reference.trim().length<3} className="w-full rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">{busy?'Confirming…':'Confirm received payment'}</button></form>:<p className="text-slate-600 dark:text-slate-400">This booking cannot receive a manual confirmation. It must be host-approved and unpaid. Cancelled, completed and already-paid bookings stay unchanged.</p>}</section></div>}
  </div>;
}
