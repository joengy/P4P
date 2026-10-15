import { useRouter } from 'expo-router';
import { useSaved } from '@/data/queries';
import type { CtaKey } from '@/data/mock';

// What each activity call-to-action does. Testers found these buttons inert
// (P7: "Join did nothing"), so every CTA now leads somewhere real:
// committing goes to Plan, asking opens a chat, starting goes to Move.
export function useCta() {
  const router = useRouter();
  const { toggleSaved } = useSaved();

  return (cta: CtaKey, item: { id: string; groupChatId?: string }) => {
    switch (cta) {
      case 'rsvp':
      case 'join':
      case 'addPlan':
        // navigate (not push) so a sheet closes back onto the tab.
        router.navigate('/(tabs)/plan');
        break;
      case 'askFirst':
        // The activity's own group chat when the user is in it, else their guide.
        router.push(`/messages/${item.groupChatId ?? 'c1'}`);
        break;
      case 'start':
      case 'startVR':
        router.navigate('/(tabs)/move');
        break;
      case 'saveRoute':
        toggleSaved(item.id);
        break;
    }
  };
}
