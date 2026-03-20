"use client";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import { useCreateParaMutation } from "@/redux/api/paraApi";
import { ParaSchema } from "@/schema/paraSchema";
import { TCreateParaPayload } from "@/types/para";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookMarked, HelpCircle, Save, Sparkles } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const CreateParaPage: React.FC = () => {
  const [createPara, { isLoading: isSubmitting }] = useCreateParaMutation();

  const onSubmit = async (data: TCreateParaPayload) => {
    try {
      const res = await createPara(data).unwrap();
      if (res.success) {
        toast.success("Para segment established!", {
          description:
            "Structural unit has been verified and stored in the ledger.",
        });
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Operation failed!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 lg:p-12 font-poppins">
      <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="bg-cyan-600 p-2.5 rounded-2xl shadow-xl shadow-cyan-100 flex items-center justify-center">
                <BookMarked className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                Create Para
              </h1>
            </div>
            <p className="text-gray-500 font-medium max-w-md text-sm leading-relaxed uppercase tracking-[0.1em]">
              Defining structural segments (Juz)
            </p>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm italic text-gray-400 text-xs font-bold uppercase">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            Registry integrity enforced
          </div>
        </header>

        {/* Main Interface */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-12 pointer-events-none opacity-5">
            <BookMarked className="h-64 w-64 text-cyan-900" />
          </div>

          <div className="p-10 lg:p-16 relative">
            <FormContainer
              onSubmit={onSubmit}
              resolver={zodResolver(ParaSchema)}
              defaultValues={{
                number: 1,
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Structural Indexing */}
                <aside className="lg:col-span-4 space-y-10 group">
                  <div className="space-y-8">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-1 w-8 bg-cyan-600 rounded-full"></div>
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                        Segment Index
                      </h3>
                    </div>

                    <div className="space-y-6">
                      <FormInput
                        name="number"
                        label="Para Order (1-30) *"
                        type="number"
                        placeholder="1"
                        required
                      />

                      <div className="grid grid-cols-1 gap-6 pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-1 w-4 bg-teal-500 rounded-full"></div>
                          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                            Boundary Coordinates
                          </h3>
                        </div>
                        <FormInput
                          name="startAyahRef"
                          label="Start Reference (S:A) *"
                          placeholder="2:1"
                          required
                        />
                        <FormInput
                          name="endAyahRef"
                          label="End Reference (S:A) *"
                          placeholder="2:141"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Segment Protocol */}
                  <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100/50 space-y-4">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-cyan-600" />
                      <span className="text-xs font-black text-gray-800 uppercase tracking-widest leading-none">
                        Archival Protocol
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {[
                        "Sequential segmenting",
                        "Chapter:Verse resolution",
                        "Range parity",
                      ].map((rule, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-tight"
                        >
                          <div className="h-1 w-1 rounded-full bg-cyan-200"></div>
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>

                {/* Nomenclature & Classification */}
                <main className="lg:col-span-8 space-y-10">
                  <div className="space-y-8">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-1 w-8 bg-teal-400 rounded-full"></div>
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                        Nomenclature
                      </h3>
                    </div>

                    <div className="grid gap-8">
                      <FormInput
                        name="arabic"
                        label="Sacred Arabic Designation *"
                        placeholder="الم"
                        className="text-right text-3xl font-arabic h-24 px-8 border-cyan-50 focus:border-cyan-500 focus:bg-cyan-50/20"
                        required
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormInput
                          name="english"
                          label="Global Identification (English)"
                          placeholder="Alif Lam Meem"
                        />
                        <FormInput
                          name="bangla"
                          label="Regional Identification (Bangla)"
                          placeholder="আলিফ লাম মীম"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Operational Commit */}
                  <div className="pt-12 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-end gap-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-12 py-5 bg-gray-900 hover:bg-black text-white rounded-[1.5rem] flex items-center justify-center gap-4 transition-all shadow-2xl shadow-gray-400/30 hover:shadow-black/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 font-black tracking-widest uppercase text-xs"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          <span>Synchronizing...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5" />
                          <span>Commit Segment</span>
                        </>
                      )}
                    </button>
                  </div>
                </main>
              </div>
            </FormContainer>
          </div>
        </div>

        {/* Footer Audit Message */}
        <footer className="text-center pb-12">
          <p className="text-[10px] font-black uppercase text-gray-300 tracking-[0.4em]">
            Almunji Global Archival System • Segmental Units Service
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CreateParaPage;
