"use client";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";
import FormTextarea from "@/components/forms/FormTextarea";
import { useCreateSurahMutation } from "@/redux/api/surahApi";
import { SurahSchema } from "@/schema/surahSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Book, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";

const CreateSurahPage: React.FC = () => {
  const [createSurah, { isLoading: isSubmitting }] = useCreateSurahMutation();

  const revelationOptions = [
    { label: "Meccan", value: "Meccan" },
    { label: "Medinan", value: "Medinan" },
  ];

  const onSubmit = async (data: any) => {
    try {
      const res = await createSurah(data).unwrap();
      if (res.success) {
        toast.success("Surah documented successfully!", {
          description: "Chapter record has been integrated into the central database.",
        });
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Data synchronization failed!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-12 font-poppins">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-xl shadow-indigo-100">
              <Book className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">Create Surah</h1>
              <p className="text-gray-500 font-medium mt-2 text-lg">Establish chapter structure & metadata</p>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-16 pointer-events-none opacity-5">
            <Book className="h-64 w-64 text-indigo-900" />
          </div>

          <div className="p-10 lg:p-16 relative">
            <FormContainer onSubmit={onSubmit} resolver={zodResolver(SurahSchema)} defaultValues={{ chapter: 1, totalAyah: 1, revelation: "Meccan" }}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <aside className="lg:col-span-4 space-y-10">
                  <div className="space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="h-1 w-12 bg-indigo-600 rounded-full"></div>
                      <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Chapter Taxonomy</h3>
                    </div>
                    <div className="space-y-6">
                      <FormInput name="chapter" label="Chapter Index Number *" type="number" placeholder="1-114" required />
                      <FormInput name="totalAyah" label="Verse Magnitude (Total) *" type="number" placeholder="7" required />
                      <FormSelect name="revelation" label="Revelation Period *" options={revelationOptions} placeholder="Select Class" required />
                    </div>
                  </div>
                  <div className="p-8 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-600 text-white p-2 rounded-lg shadow-sm">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-black text-gray-800 uppercase tracking-widest">Taxonomy Rules</span>
                    </div>
                    <ul className="space-y-3">
                      {["Sequential indexing", "Verified verse count", "Revelation context"].map((rule, i) => (
                        <li key={i} className="flex items-center gap-3 text-xs font-bold text-gray-600 uppercase tracking-tight">
                          <div className="h-1.5 w-1.5 rounded-full bg-indigo-300"></div>{rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>

                <main className="lg:col-span-8 space-y-10">
                  <div className="space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="h-1 w-12 bg-purple-500 rounded-full"></div>
                      <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Nomenclature</h3>
                    </div>
                    <div className="grid gap-8">
                      <FormInput name="arabic" label="Original Arabic Title *" placeholder="الفاتحة" className="text-right text-3xl font-bold h-20 px-8" required />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormInput name="english" label="Global Title (English) *" placeholder="Al-Fatihah" required />
                        <FormInput name="bangla" label="Regional Title (Bangla)" placeholder="আল-ফাতিহা" />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-1 w-12 bg-fuchsia-500 rounded-full"></div>
                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Historical Record</h3>
                      </div>
                      <FormTextarea name="history" label="Historical Context & Significance" rows={6} placeholder="Document the primary context and thematic history..." />
                    </div>
                  </div>
                  <div className="pt-12 border-t border-gray-100 flex justify-end">
                    <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-12 py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center gap-4 shadow-xl shadow-indigo-200 font-bold uppercase text-sm">
                      {isSubmitting ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div> : <Save className="h-5 w-5" />}
                      <span>Commit Chapter</span>
                    </button>
                  </div>
                </main>
              </div>
            </FormContainer>
          </div>
        </div>

        <footer className="text-center pb-12">
          <p className="text-xs font-black uppercase text-gray-400 tracking-widest">Almunji Global Archival System • Chapter Services</p>
        </footer>
      </div>
    </div>
  );
};

export default CreateSurahPage;
