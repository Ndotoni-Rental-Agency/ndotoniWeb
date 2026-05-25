/**
 * WhatsApp action ID → human-readable label map.
 * Mirrors the ACTION constants in the backend WhatsAppActions.ts.
 */
const ACTION_LABELS: Record<string, string> = {
  action_search: '🔍 Search',
  action_cheap: '💰 Cheapest',
  action_list: '📝 List Property',
  action_list_another: '📝 List Another',
  action_manage: '⚙️ My Listings',
  action_more: '📋 More Options',
  action_home: '🏠 Home',
  action_help: '❓ Help',
  action_cancel: '❌ Cancel',
  action_continue: '▶️ Continue',
  action_cs: '📞 Customer Service',
  action_associate: '🔗 Link Account',
  action_subscription: '💳 Subscription',
  action_change_lang: '🌐 Change Language',
  action_switch_lang_yes: '✅ Switch Language',
  action_switch_lang_no: '❌ Keep Language',
  action_skip: '⏭️ Skip',
  action_refine_budget: '💰 Budget',
  action_refine_bedrooms: '🛏️ Bedrooms',
  action_refine_location: '📍 Location',
  lang_sw: '🇹🇿 Kiswahili',
  lang_en: '🇬🇧 English',
  search_again: '🔍 Search Again',
  media_done: '✅ Done',
  amenity_done: '✅ Done',
  confirm_remove_all: '🗑️ Remove All',
  feedback_yes: '👍 Yes',
  feedback_no: '👎 No',
  feedback_contact: '📞 Contact',
};

/**
 * Resolve a WhatsApp button reply ID to a human-readable label.
 * Handles both static action IDs and dynamic prefixed IDs (view_, delete_, budget_, etc.)
 */
export function resolveButtonLabel(replyId: string): string {
  if (ACTION_LABELS[replyId]) return ACTION_LABELS[replyId];
  if (replyId.startsWith('view_')) return '👁️ View property';
  if (replyId.startsWith('delete_')) return '🗑️ Delete property';
  if (replyId.startsWith('edit_full_')) return '✏️ Edit property';
  if (replyId.startsWith('budget_')) return `💰 Budget: ${replyId.replace('budget_', '').replace('_', '–')}`;
  if (replyId.startsWith('bedrooms_')) return `🛏️ ${replyId.replace('bedrooms_', '')} bedrooms`;
  if (replyId.startsWith('district_')) return `📍 ${replyId.replace('district_', '')}`;
  if (replyId.startsWith('type_')) return `🏠 ${replyId.replace('type_', '')}`;
  if (replyId.startsWith('prop_')) return `🏠 Property ${replyId.replace('prop_', '').slice(0, 8)}…`;
  return replyId.replace(/_/g, ' ');
}
