
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface AddressFormProps {
  type: "shipping" | "billing";
  formData: {
    shippingName?: string;
    shippingStreet?: string;
    shippingCity?: string;
    shippingPostalCode?: string;
    shippingCountry?: string;
    billingName?: string;
    billingStreet?: string;
    billingCity?: string;
    billingPostalCode?: string;
    billingCountry?: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string) => (value: string) => void;
  copyShippingToBilling?: () => void;
}

const AddressForm: React.FC<AddressFormProps> = ({
  type,
  formData,
  onChange,
  onSelectChange,
  copyShippingToBilling,
}) => {
  const prefix = type;
  const isShipping = type === "shipping";
  const title = isShipping ? "Shipping Information" : "Billing Information";

  return (
    <div className="glass-card p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        {!isShipping && copyShippingToBilling && (
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={copyShippingToBilling}
            className="text-sm"
          >
            Same as shipping
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`${prefix}Name`}>Name *</Label>
          <Input
            id={`${prefix}Name`}
            name={`${prefix}Name`}
            value={formData[`${prefix}Name` as keyof typeof formData] || ''}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`${prefix}Street`}>Street Address *</Label>
          <Input
            id={`${prefix}Street`}
            name={`${prefix}Street`}
            value={formData[`${prefix}Street` as keyof typeof formData] || ''}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`${prefix}City`}>City *</Label>
            <Input
              id={`${prefix}City`}
              name={`${prefix}City`}
              value={formData[`${prefix}City` as keyof typeof formData] || ''}
              onChange={onChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`${prefix}PostalCode`}>Postal Code *</Label>
            <Input
              id={`${prefix}PostalCode`}
              name={`${prefix}PostalCode`}
              value={formData[`${prefix}PostalCode` as keyof typeof formData] || ''}
              onChange={onChange}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`${prefix}Country`}>Country *</Label>
          <Select
            value={formData[`${prefix}Country` as keyof typeof formData] || ''}
            onValueChange={onSelectChange(`${prefix}Country`)}
          >
            <SelectTrigger id={`${prefix}Country`}>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Germany">Germany</SelectItem>
              <SelectItem value="Austria">Austria</SelectItem>
              <SelectItem value="Switzerland">Switzerland</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {!isShipping && (
          <div className="space-y-2 pt-4">
            <Label htmlFor="paymentMethod">Payment Method *</Label>
            <Select
              value={formData.paymentMethod || ''}
              onValueChange={onSelectChange("paymentMethod")}
            >
              <SelectTrigger id="paymentMethod">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="invoice">Invoice</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="credit_card">Credit Card</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressForm;
