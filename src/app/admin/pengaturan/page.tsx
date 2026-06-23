"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Loader2, Phone } from "lucide-react";

const WHATSAPP_NUMBER_KEY = "whatsapp_number";

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await api.get("/settings");
      return res.data.data;
    },
  });

  useEffect(() => {
    if (settings) {
      const waSetting = settings.find((s: any) => s.key === WHATSAPP_NUMBER_KEY);
      if (waSetting) {
        setWhatsappNumber(waSetting.value);
      }
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async (value: string) => {
      await api.post("/settings", {
        key: WHATSAPP_NUMBER_KEY,
        value,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    },
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatsappNumber) return;
    setIsSaving(true);
    try {
      await updateMutation.mutateAsync(whatsappNumber);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading">
            Pengaturan
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola pengaturan aplikasi seperti nomor WhatsApp untuk pembayaran
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border shadow-sm p-6 max-w-xl">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="whatsappNumber">Nomor WhatsApp Pembayaran</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="whatsappNumber"
                type="tel"
                placeholder="6282211129043"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="pl-10"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Masukkan nomor WhatsApp dengan format kode negara (contoh: 6282211129043)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Simpan Pengaturan
            </Button>
            {isSuccess && (
              <span className="text-sm text-green-600 font-medium">
                Pengaturan berhasil disimpan!
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}