import PropertyMediaManager from '@/components/media/PropertyMediaManager';
import { FormData } from '@/hooks/useCreatePropertyForm';

interface MediaStepProps {
  formData: FormData;
  onUpdate: (data: Partial<FormData>) => void;
}

export function MediaStep({ formData, onUpdate }: MediaStepProps) {
  return (
    <div className="space-y-6">
      <PropertyMediaManager
        media={formData.media || {
          images: [],
          videos: [],
          floorPlan: '',
          virtualTour: ''
        }}
        onMediaChange={(media) => {
          onUpdate({ media });
        }}
      />
    </div>
  );
}