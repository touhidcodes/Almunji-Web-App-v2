"use client";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import FormTextarea from "@/components/forms/FormTextarea";
import { useCreateDuaMutation } from "@/redux/api/duaApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { DuaSchema } from "@/schema/duaSchema";
import { ArrowLeft, Book, Save, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const CreateDuaPage: React.FC = () => {
  const [createDua, { isLoading: isSubmitting }] = useCreateDuaMutation();

  const onSubmit = async (data: any) => {
    try {
      const res = await createDua(data).unwrap();
      if (res.success) {
        toast.success("Dua documented successfully!", {
          description: "Supplication has been added to the database.",
        });
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Data synchronization failed!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-12 font-poppins">
      <div className="max-w-6xl mx-auto space-y-12">
        <nav className="flex items-center justify-between pb-6 border-b border-gray-200">
          <Link href="/dashboard/admin/manage/dua" className="group flex items-center gap-2 text-gray-500 hover:text-teal-600 font-semibold uppercase text-xs tracking-widest transition-all">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Duas</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-widest">
            <Sparkles className="h-3 w-3 text-teal-400" />
            New Supplication
          </div>
        </nav>

        <header className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="bg-teal-600 p-4 rounded-2xl shadow-xl shadow-teal-100">
              <Book className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">Create Dua</h1>
              <p className="text-gray-500 font-medium mt-2 text-lg">Record supplication with all translations</p>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-16 pointer-events-none opacity-5">
            <Book className="h-64 w-64 text-teal-900" />
          </div>

          <div className="p-10 lg:p-16 relative">
            <FormContainer onSubmit={onSubmit} resolver={zodResolver(DuaSchema)} defaultValues={{ bangla: "" }}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <aside className="lg:col-span-4 space-y-10">
                  <div className="space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="h-1 w-12 bg-teal-600 rounded-full"></div>
                      <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Metadata</h3>
                    </div>
                    <div className="space-y-6">
                      <FormInput name="name" label="Dua Name *" placeholder="Dua name" required />
                      <FormInput name="reference" label="Reference" placeholder="Book/reference" />
                    </div>
                  </div>
                  <div className="p-8 bg-teal-50/50 rounded-2xl border border-teal-100/50 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-teal-600 text-white p-2 rounded-lg shadow-sm">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-black text-gray-800 uppercase tracking-widest">Guidelines</span>
                    </div>
                    <ul className="space-y-3">
                      {["Clear name", "Arabic text required", "All translations"].map((rule, i) => (
                        <li key={i} className="flex items-center gap-3 text-xs font-bold text-gray-600 uppercase tracking-tight">
                          <div className="h-1.5 w-1.5 rounded-full bg-teal-300"></div>{rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>

                <main className="lg:col-span-8 space-y-10">
                  <div className="space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="h-1 w-12 bg-teal-600 rounded-full"></div>
                      <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Arabic Text</h3>
                    </div>
                    <FormTextarea name="arabic" label="Arabic Text *" rows={5} placeholder="Enter Arabic text..." className="h-32" required />
                    <div className="flex items-center gap-3">
                      <div className="h-1 w-12 bg-teal-600 rounded-full"></div>
                      <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Translations</h3>
                    </div>
                    <FormTextarea name="transliteration" label="Transliteration" rows={3} placeholder="Transliteration..." />
                    <FormTextarea name="bangla" label="Bangla Translation *" rows={4} placeholder="Bangla translation..." required />
                    <FormTextarea name="english" label="English Translation" rows={4} placeholder="English translation..." />
                  </div>
                  <div className="pt-12 border-t border-gray-100 flex justify-end">
                    <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-12 py-6 bg-teal-600 hover:bg-teal-700 text-white rounded-xl flex items-center justify-center gap-4 shadow-xl shadow-teal-200 font-bold uppercase text-sm">
                      {isSubmitting ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div> : <Save className="h-5 w-5" />}
                      <span>Commit Dua</span>
                    </button>
                  </div>
                </main>
              </div>
            </FormContainer>
          </div>
        </div>

        <footer className="text-center pb-12">
          <p className="text-xs font-black uppercase text-gray-400 tracking-widest">Almunji Global Archival System • Supplication Services</p>
        </footer>
      </div>
    </div>
  );
};

export default CreateDuaPage;
