
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Shield, UserCheck, UserX, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein"),
  password: z.string().min(6, "Das Passwort muss mindestens 6 Zeichen lang sein"),
  role: z.enum(["user", "admin", "pharmacist"])
});

interface CreateUserDialogProps {
  onCreateUser: (values: z.infer<typeof formSchema>) => Promise<void>;
}

const CreateUserDialog: React.FC<CreateUserDialogProps> = ({ onCreateUser }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "user" as const
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsCreatingUser(true);
    try {
      await onCreateUser(values);
      setIsDialogOpen(false);
      form.reset();
    } finally {
      setIsCreatingUser(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <UserPlus className="mr-2 h-4 w-4" />
          Neuen Benutzer anlegen
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Neuen Benutzer anlegen</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-Mail-Adresse</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="benutzer@beispiel.de" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passwort</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rolle</FormLabel>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={field.value === 'user' ? "default" : "outline"}
                      onClick={() => form.setValue('role', 'user')}
                    >
                      <UserX className="mr-2 h-4 w-4" />
                      Benutzer
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === 'pharmacist' ? "default" : "outline"}
                      onClick={() => form.setValue('role', 'pharmacist')}
                    >
                      <UserCheck className="mr-2 h-4 w-4" />
                      Apotheker
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === 'admin' ? "default" : "outline"}
                      onClick={() => form.setValue('role', 'admin')}
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Admin
                    </Button>
                  </div>
                </FormItem>
              )}
            />
            <div className="text-sm text-yellow-600 flex items-start mt-2">
              <AlertCircle className="h-4 w-4 mr-2 mt-0.5" />
              <p>
                Achtung: Bitte merken Sie sich das Passwort. Es kann später nicht eingesehen werden.
              </p>
            </div>
            <DialogFooter className="mt-6">
              <Button 
                variant="outline" 
                type="button"
                onClick={() => setIsDialogOpen(false)}
              >
                Abbrechen
              </Button>
              <Button 
                type="submit"
                disabled={isCreatingUser}
              >
                {isCreatingUser ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Wird erstellt...
                  </>
                ) : (
                  <>Benutzer erstellen</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
