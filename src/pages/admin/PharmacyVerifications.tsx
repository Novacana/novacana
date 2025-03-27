
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { addUserRole } from "@/utils/authUtils";
import { CheckCircle, XCircle, Eye, UserCheck, Clock, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PharmacyVerification {
  id: string;
  user_id: string;
  verification_status: string;
  license_id: string;
  business_documents: string[];
  contact_details: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
    contactPerson?: string;
    email?: string;
  };
  submitted_at: string;
  reviewed_at: string | null;
  reviewer_id: string | null;
  rejection_reason: string | null;
  user_email: string | null;
}

const PharmacyVerifications = () => {
  const { toast } = useToast();
  const [verifications, setVerifications] = useState<PharmacyVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVerification, setSelectedVerification] = useState<PharmacyVerification | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Verifikationen laden
  const loadVerifications = async () => {
    try {
      setLoading(true);
      
      // Verifikationen mit Benutzer-E-Mails abrufen
      const { data, error } = await supabase
        .from('pharmacy_verification')
        .select(`
          *,
          user_email:auth.users(email)
        `)
        .order('submitted_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Daten formatieren
      const formattedData = data.map((item: any) => ({
        ...item,
        user_email: item.user_email?.[0]?.email || null
      }));
      
      setVerifications(formattedData);
    } catch (error: any) {
      console.error("Fehler beim Laden der Verifikationen:", error.message);
      toast({
        title: "Fehler",
        description: "Die Verifikationen konnten nicht geladen werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVerifications();
  }, []);

  // Verifikation genehmigen
  const approveVerification = async (id: string, userId: string) => {
    try {
      // Status aktualisieren
      const { error: updateError } = await supabase
        .from('pharmacy_verification')
        .update({
          verification_status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewer_id: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', id);
      
      if (updateError) throw updateError;
      
      // Dem Benutzer die Apotheker-Rolle zuweisen
      const roleAdded = await addUserRole(userId, 'pharmacist');
      
      if (!roleAdded) {
        throw new Error("Die Rolle konnte nicht zugewiesen werden.");
      }
      
      toast({
        title: "Verifikation genehmigt",
        description: "Die Apotheke wurde erfolgreich verifiziert.",
      });
      
      loadVerifications();
    } catch (error: any) {
      console.error("Fehler beim Genehmigen der Verifikation:", error.message);
      toast({
        title: "Fehler",
        description: "Die Verifikation konnte nicht genehmigt werden.",
        variant: "destructive"
      });
    }
  };

  // Verifikation ablehnen
  const rejectVerification = async (id: string) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Ablehnungsgrund erforderlich",
        description: "Bitte geben Sie einen Grund für die Ablehnung an.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Status aktualisieren
      const { error } = await supabase
        .from('pharmacy_verification')
        .update({
          verification_status: 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewer_id: (await supabase.auth.getUser()).data.user?.id,
          rejection_reason: rejectionReason
        })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Verifikation abgelehnt",
        description: "Die Verifikation wurde abgelehnt.",
      });
      
      setRejectionReason("");
      setSelectedVerification(null);
      loadVerifications();
    } catch (error: any) {
      console.error("Fehler beim Ablehnen der Verifikation:", error.message);
      toast({
        title: "Fehler",
        description: "Die Verifikation konnte nicht abgelehnt werden.",
        variant: "destructive"
      });
    }
  };

  // Status-Badge generieren
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Ausstehend</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Genehmigt</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Abgelehnt</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  return (
    <AdminLayout title="Apothekenverifizierung">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Verifizierungsanfragen</CardTitle>
          <Button variant="outline" size="sm" onClick={loadVerifications}>
            Aktualisieren
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              {verifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Keine Verifizierungsanfragen vorhanden</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Apotheke</TableHead>
                        <TableHead>Betriebserlaubnis</TableHead>
                        <TableHead>Kontakt</TableHead>
                        <TableHead>Datum</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aktionen</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {verifications.map((verification) => (
                        <TableRow key={verification.id}>
                          <TableCell>
                            <div className="font-medium">{verification.contact_details.name}</div>
                            <div className="text-sm text-gray-500">{verification.user_email}</div>
                          </TableCell>
                          <TableCell>{verification.license_id}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {verification.contact_details.address}, {verification.contact_details.postalCode} {verification.contact_details.city}
                            </div>
                            <div className="text-sm">{verification.contact_details.phone}</div>
                          </TableCell>
                          <TableCell>
                            {new Date(verification.submitted_at).toLocaleDateString('de-DE')}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(verification.verification_status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4 mr-1" />
                                    Details
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Verifizierungsdetails</DialogTitle>
                                    <DialogDescription>
                                      Überprüfen Sie die Apothekeninformationen und Dokumente
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  <div className="mt-4 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h3 className="font-medium text-sm mb-1">Apotheke</h3>
                                        <p>{verification.contact_details.name}</p>
                                      </div>
                                      <div>
                                        <h3 className="font-medium text-sm mb-1">Betriebserlaubnis</h3>
                                        <p>{verification.license_id}</p>
                                      </div>
                                      <div>
                                        <h3 className="font-medium text-sm mb-1">Anschrift</h3>
                                        <p>{verification.contact_details.address}, {verification.contact_details.postalCode} {verification.contact_details.city}</p>
                                      </div>
                                      <div>
                                        <h3 className="font-medium text-sm mb-1">Telefon</h3>
                                        <p>{verification.contact_details.phone}</p>
                                      </div>
                                      
                                      {verification.contact_details.contactPerson && (
                                        <div>
                                          <h3 className="font-medium text-sm mb-1">Ansprechpartner</h3>
                                          <p>{verification.contact_details.contactPerson}</p>
                                        </div>
                                      )}
                                      
                                      {verification.contact_details.email && (
                                        <div>
                                          <h3 className="font-medium text-sm mb-1">E-Mail</h3>
                                          <p>{verification.contact_details.email}</p>
                                        </div>
                                      )}
                                    </div>
                                    
                                    <div>
                                      <h3 className="font-medium text-sm mb-2">Hochgeladene Dokumente</h3>
                                      <div className="grid grid-cols-1 gap-2">
                                        {verification.business_documents.map((doc, index) => (
                                          <a
                                            key={index}
                                            href={doc}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center p-2 border rounded hover:bg-gray-50"
                                          >
                                            <Eye className="h-4 w-4 mr-2 text-gray-500" />
                                            Dokument {index + 1} anzeigen
                                          </a>
                                        ))}
                                      </div>
                                    </div>
                                    
                                    {verification.verification_status === 'pending' && (
                                      <div className="flex justify-end space-x-2 pt-4">
                                        <Dialog>
                                          <DialogTrigger asChild>
                                            <Button variant="outline" className="text-red-500 hover:text-red-600">
                                              <XCircle className="h-4 w-4 mr-1" />
                                              Ablehnen
                                            </Button>
                                          </DialogTrigger>
                                          <DialogContent>
                                            <DialogHeader>
                                              <DialogTitle>Verifikation ablehnen</DialogTitle>
                                              <DialogDescription>
                                                Bitte geben Sie einen Grund für die Ablehnung an.
                                              </DialogDescription>
                                            </DialogHeader>
                                            <div className="mt-4">
                                              <textarea
                                                className="w-full p-2 border rounded"
                                                rows={4}
                                                placeholder="Ablehnungsgrund..."
                                                value={rejectionReason}
                                                onChange={(e) => setRejectionReason(e.target.value)}
                                              />
                                            </div>
                                            <div className="flex justify-end mt-4">
                                              <Button
                                                variant="destructive"
                                                onClick={() => rejectVerification(verification.id)}
                                              >
                                                Ablehnen bestätigen
                                              </Button>
                                            </div>
                                          </DialogContent>
                                        </Dialog>
                                        
                                        <Button 
                                          variant="default" 
                                          onClick={() => approveVerification(verification.id, verification.user_id)}
                                        >
                                          <CheckCircle className="h-4 w-4 mr-1" />
                                          Genehmigen
                                        </Button>
                                      </div>
                                    )}
                                    
                                    {verification.verification_status === 'rejected' && verification.rejection_reason && (
                                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                                        <h3 className="font-medium text-sm text-red-800 mb-1 flex items-center">
                                          <AlertCircle className="h-4 w-4 mr-1" />
                                          Ablehnungsgrund
                                        </h3>
                                        <p className="text-sm text-red-700">{verification.rejection_reason}</p>
                                      </div>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>
                              
                              {verification.verification_status === 'pending' && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => approveVerification(verification.id, verification.user_id)}
                                    className="text-green-600 hover:text-green-700"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Genehmigen
                                  </Button>
                                  
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => {
                                      setSelectedVerification(verification);
                                      setRejectionReason("");
                                    }}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Ablehnen
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Dialog für Ablehnungsgründe */}
      {selectedVerification && (
        <Dialog open={!!selectedVerification} onOpenChange={(open) => !open && setSelectedVerification(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Verifikation ablehnen</DialogTitle>
              <DialogDescription>
                Bitte geben Sie einen Grund für die Ablehnung an.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <textarea
                className="w-full p-2 border rounded"
                rows={4}
                placeholder="Ablehnungsgrund..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <Button
                variant="outline"
                onClick={() => setSelectedVerification(null)}
              >
                Abbrechen
              </Button>
              <Button
                variant="destructive"
                onClick={() => rejectVerification(selectedVerification.id)}
              >
                Ablehnen bestätigen
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
};

export default PharmacyVerifications;
