
import { useState, useEffect } from "react";
import { Invoice } from "@/types/invoice";
import { useToast } from "@/hooks/use-toast";

// Mock-Daten für Rechnungen
const mockInvoices: Invoice[] = [
  {
    id: "inv-2023-05-01",
    invoiceNumber: "INV-2023-0001",
    orderId: "ORD-25-03-18-0001",
    customerId: "cust-001",
    customerName: "MediPharm Berlin",
    customerAddress: {
      street: "Hauptstraße 123",
      city: "Berlin",
      postalCode: "10115",
      country: "Deutschland"
    },
    items: [
      {
        id: "item-001",
        productId: "prod-001",
        name: "Bedrocan Blüten",
        quantity: 5,
        price: 190.00,
        total: 950.00
      },
      {
        id: "item-002",
        productId: "prod-002",
        name: "Pedanios Extract",
        quantity: 2,
        price: 165.00,
        total: 330.00
      }
    ],
    subtotal: 1280.00,
    tax: 243.20,
    total: 1523.20,
    status: "sent",
    dueDate: new Date("2023-05-15"),
    issueDate: new Date("2023-05-01")
  },
  {
    id: "inv-2023-04-15",
    invoiceNumber: "INV-2023-0002",
    orderId: "ORD-25-03-17-0004",
    customerId: "cust-002",
    customerName: "GreenLeaf Apotheke",
    customerAddress: {
      street: "Gartenweg 45",
      city: "München",
      postalCode: "80331",
      country: "Deutschland"
    },
    items: [
      {
        id: "item-003",
        productId: "prod-003",
        name: "Aurora CBD Öl",
        quantity: 10,
        price: 65.50,
        total: 655.00
      },
      {
        id: "item-004",
        productId: "prod-004",
        name: "Tilray THC10:CBD10",
        quantity: 3,
        price: 101.83,
        total: 305.50
      }
    ],
    subtotal: 960.50,
    tax: 182.50,
    total: 1143.00,
    status: "paid",
    dueDate: new Date("2023-04-29"),
    issueDate: new Date("2023-04-15"),
    paidDate: new Date("2023-04-20")
  },
  {
    id: "inv-2023-04-03",
    invoiceNumber: "INV-2023-0003",
    orderId: "ORD-25-03-15-0002",
    customerId: "cust-003",
    customerName: "CannaMed Hamburg",
    customerAddress: {
      street: "Hafenstraße 87",
      city: "Hamburg",
      postalCode: "20457",
      country: "Deutschland"
    },
    items: [
      {
        id: "item-005",
        productId: "prod-005",
        name: "Dronabinol Tropfen",
        quantity: 15,
        price: 132.50,
        total: 1987.50
      },
      {
        id: "item-006",
        productId: "prod-006",
        name: "Cannamedic Full Spectrum",
        quantity: 1,
        price: 158.25,
        total: 158.25
      }
    ],
    subtotal: 2145.75,
    tax: 407.69,
    total: 2553.44,
    status: "overdue",
    dueDate: new Date("2023-04-17"),
    issueDate: new Date("2023-04-03")
  },
  {
    id: "inv-2023-03-20",
    invoiceNumber: "INV-2023-0004",
    orderId: "ord-004",
    customerId: "cust-004",
    customerName: "PharmaNatura Köln",
    customerAddress: {
      street: "Rheinufer 21",
      city: "Köln",
      postalCode: "50668",
      country: "Deutschland"
    },
    items: [
      {
        id: "item-007",
        productId: "prod-007",
        name: "Medical Cannabis Starter Kit",
        quantity: 2,
        price: 520.00,
        total: 1040.00
      }
    ],
    subtotal: 1040.00,
    tax: 197.60,
    total: 1237.60,
    status: "draft",
    dueDate: new Date("2023-04-03"),
    issueDate: new Date("2023-03-20")
  }
];

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simuliere API-Aufruf
    const fetchInvoices = async () => {
      try {
        // Hier würden wir normalerweise von der API fetchen
        // const response = await fetch('/api/invoices');
        // const data = await response.json();
        
        // Simuliere Netzwerklatenz
        setTimeout(() => {
          setInvoices(mockInvoices);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Fehler beim Laden der Rechnungen:", error);
        toast({
          title: "Fehler",
          description: "Die Rechnungen konnten nicht geladen werden.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [toast]);

  const updateInvoiceStatus = async (invoiceId: string, status: Invoice['status']) => {
    try {
      // Hier würden wir normalerweise die API aufrufen
      // await fetch(`/api/invoices/${invoiceId}`, {
      //   method: 'PATCH',
      //   body: JSON.stringify({ status }),
      // });

      // Optimistic update
      setInvoices(prev => 
        prev.map(invoice => 
          invoice.id === invoiceId ? { ...invoice, status } : invoice
        )
      );

      toast({
        title: "Status aktualisiert",
        description: `Rechnungsstatus wurde auf "${status}" aktualisiert.`,
      });
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Status:", error);
      toast({
        title: "Fehler",
        description: "Der Status konnte nicht aktualisiert werden.",
        variant: "destructive",
      });
    }
  };

  const markAsPaid = async (invoiceId: string) => {
    try {
      const paidDate = new Date();
      
      // Hier würden wir normalerweise die API aufrufen
      // await fetch(`/api/invoices/${invoiceId}/pay`, {
      //   method: 'POST',
      //   body: JSON.stringify({ paidDate }),
      // });

      // Optimistic update
      setInvoices(prev => 
        prev.map(invoice => 
          invoice.id === invoiceId ? { ...invoice, status: 'paid', paidDate } : invoice
        )
      );

      toast({
        title: "Zahlung erfasst",
        description: "Die Rechnung wurde als bezahlt markiert.",
      });
    } catch (error) {
      console.error("Fehler beim Markieren als bezahlt:", error);
      toast({
        title: "Fehler",
        description: "Die Zahlung konnte nicht erfasst werden.",
        variant: "destructive",
      });
    }
  };

  const sendInvoice = async (invoiceId: string) => {
    try {
      // Hier würden wir normalerweise die API aufrufen
      // await fetch(`/api/invoices/${invoiceId}/send`, {
      //   method: 'POST',
      // });

      // Optimistic update
      setInvoices(prev => 
        prev.map(invoice => 
          invoice.id === invoiceId ? { ...invoice, status: 'sent' } : invoice
        )
      );

      toast({
        title: "Rechnung versendet",
        description: "Die Rechnung wurde erfolgreich versendet.",
      });
    } catch (error) {
      console.error("Fehler beim Versenden der Rechnung:", error);
      toast({
        title: "Fehler",
        description: "Die Rechnung konnte nicht versendet werden.",
        variant: "destructive",
      });
    }
  };

  return {
    invoices,
    loading,
    updateInvoiceStatus,
    markAsPaid,
    sendInvoice
  };
};
