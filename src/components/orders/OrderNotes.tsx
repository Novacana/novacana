
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface OrderNotesProps {
  notes: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const OrderNotes: React.FC<OrderNotesProps> = ({ notes, onChange }) => {
  return (
    <div className="glass-card p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Order Notes
      </h3>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={notes}
          onChange={onChange}
          placeholder="Special delivery instructions or other notes"
          rows={3}
        />
      </div>
    </div>
  );
};

export default OrderNotes;
