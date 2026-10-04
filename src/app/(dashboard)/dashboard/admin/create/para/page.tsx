"use client";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import FormTextarea from "@/components/forms/FormTextarea";

import {
  useCreateParaMutation,
  useGetAllParasQuery,
} from "@/redux/api/paraApi";

import { zodResolver } from "@hookform/resolvers/zod";
import { ParaSchema } from "@/schema/paraSchema";

import { ArrowLeft, Book, Save, Sparkles, CheckCircle2 } from "lucide-react";

import Link from "next/link";
import { toast } from "sonner";
import { z } from "zod";

type TCreatePara = z.infer<typeof ParaSchema>;

type TApiError = {
  data?: {
    message?: string;
  };
};

const CreateParaPage: React.FC = () => {
  const { data: parasData, isLoading: isLoadingParas } = useGetAllParasQuery(
    {},
  );

  const [createPara, { isLoading: isSubmitting }] = useCreateParaMutation();

  const paras = parasData?.data || [];

  // Existing Para numbers
  const existingParaNumbers = new Set(paras.map((para) => Number(para.number)));

  // All valid Para numbers: 1-30
  const allParaNumbers = Array.from({ length: 30 }, (_, index) => index + 1);

  // Only missing Para numbers
  const missingParaNumbers = allParaNumbers.filter(
    (number) => !existingParaNumbers.has(number),
  );

  const allParasCreated = missingParaNumbers.length === 0;

  const defaultNumber = missingParaNumbers[0] || 1;

  const onSubmit = async (data: TCreatePara) => {
    const number = Number(data.number);

    // Frontend validation
    if (number < 1 || number > 30) {
      toast.error("Invalid Para number", {
        description: "Para number must be between 1 and 30.",
      });

      return;
    }

    // Prevent duplicate Para
    if (existingParaNumbers.has(number)) {
      toast.error("Para already exists", {
        description: `Para ${number} has already been created.`,
      });

      return;
    }

    try {
      const res = await createPara({
        ...data,
        number,
      }).unwrap();

      if (res.success) {
        toast.success("Para documented successfully!", {
          description: "Section has been integrated into the central database.",
        });
      }
    } catch (error: unknown) {
      const apiError = error as TApiError;

      toast.error(apiError.data?.message || "Data synchronization failed!");
    }
  };

  // Loading state
  if (isLoadingParas) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />

          <p className="text-sm font-semibold uppercase tracking-widest text-gray-400">
            Loading Paras...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-poppins lg:p-12">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Navigation */}
        <nav className="flex items-center justify-between border-b border-gray-200 pb-6">
          <Link
            href="/dashboard/admin/manage/para"
            className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500 transition-all hover:text-teal-600"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />

            <span>Back to Paras</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            <Sparkles className="h-3 w-3 text-teal-400" />

            <span>{allParasCreated ? "Complete" : "New Section"}</span>
          </div>
        </nav>

        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-teal-600 p-4 shadow-xl shadow-teal-100">
              <Book className="h-8 w-8 text-white" />
            </div>

            <div>
              <h1 className="text-4xl font-black tracking-tight text-gray-900 lg:text-5xl">
                Create Para
              </h1>

              <p className="mt-2 text-lg font-medium text-gray-500">
                Define Quranic section structure
              </p>
            </div>
          </div>
        </header>

        {/* Para Progress */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-900">Para Progress</h2>

              <p className="mt-1 text-sm text-gray-500">
                {paras.length} of 30 Paras have been created.
              </p>
            </div>

            <div className="rounded-full bg-teal-50 px-4 py-2 text-sm font-bold text-teal-700">
              {paras.length}/30
            </div>
          </div>

          <div className="grid grid-cols-6 gap-2 sm:grid-cols-10 md:grid-cols-15">
            {allParaNumbers.map((number) => {
              const exists = existingParaNumbers.has(number);

              return (
                <div
                  key={number}
                  className={`flex h-9 items-center justify-center rounded-lg text-xs font-bold ${
                    exists
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {number}
                </div>
              );
            })}
          </div>
        </div>

        {/* All Paras Created */}
        {allParasCreated ? (
          <div className="rounded-3xl border border-green-100 bg-white p-12 text-center shadow-xl shadow-gray-200/50">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>

            <h2 className="text-2xl font-black text-gray-900">
              All 30 Paras Are Created
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-gray-500">
              The Quranic Para structure is complete. No additional Para can be
              created because all numbers from 1 to 30 already exist.
            </p>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl shadow-gray-200/50">
            <div className="pointer-events-none absolute right-0 top-0 p-16 opacity-5">
              <Book className="h-64 w-64 text-teal-900" />
            </div>

            <div className="relative p-10 lg:p-16">
              <FormContainer
                onSubmit={onSubmit}
                resolver={zodResolver(ParaSchema)}
                defaultValues={{
                  number: defaultNumber,
                }}
              >
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                  {/* Sidebar */}
                  <aside className="space-y-10 lg:col-span-4">
                    <div className="space-y-8">
                      <div className="flex items-center gap-3">
                        <div className="h-1 w-12 rounded-full bg-teal-600" />

                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">
                          Section Metadata
                        </h3>
                      </div>

                      <div className="space-y-6">
                        {/* Para Number */}
                        <div>
                          <label
                            htmlFor="para-number"
                            className="mb-2 block text-sm font-semibold text-gray-700"
                          >
                            Para Number *
                          </label>

                          <select
                            id="para-number"
                            {...{
                              name: "number",
                            }}
                            defaultValue={defaultNumber}
                            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                          >
                            {missingParaNumbers.map((number) => (
                              <option key={number} value={number}>
                                Para {number}
                              </option>
                            ))}
                          </select>

                          <p className="mt-2 text-xs text-gray-400">
                            Only missing Para numbers are available.
                          </p>
                        </div>

                        <FormInput
                          name="arabic"
                          label="Arabic Name *"
                          placeholder="Para 1"
                          required
                        />

                        <FormInput
                          name="english"
                          label="English Name"
                          placeholder="First Para"
                        />

                        <FormInput
                          name="bangla"
                          label="Bangla Name"
                          placeholder="পারা ১"
                        />
                      </div>
                    </div>

                    {/* Guidelines */}
                    <div className="space-y-4 rounded-2xl border border-teal-100/50 bg-teal-50/50 p-8">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-teal-600 p-2 text-white shadow-sm">
                          <Sparkles className="h-5 w-5" />
                        </div>

                        <span className="text-sm font-black uppercase tracking-widest text-gray-800">
                          Guidelines
                        </span>
                      </div>

                      <ul className="space-y-3">
                        {[
                          "Only numbers 1-30",
                          "Only missing Paras",
                          "Sequential numbering",
                          "Correct Arabic name",
                          "Valid ayah references",
                        ].map((rule) => (
                          <li
                            key={rule}
                            className="flex items-center gap-3 text-xs font-bold uppercase tracking-tight text-gray-600"
                          >
                            <div className="h-1.5 w-1.5 rounded-full bg-teal-300" />

                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </aside>

                  {/* Main */}
                  <main className="space-y-10 lg:col-span-8">
                    <div className="space-y-8">
                      <div className="flex items-center gap-3">
                        <div className="h-1 w-12 rounded-full bg-purple-500" />

                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">
                          Section Boundaries
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormInput
                          name="startAyahRef"
                          label="Start Ayah Reference *"
                          placeholder="e.g., 1:1"
                          required
                        />

                        <FormInput
                          name="endAyahRef"
                          label="End Ayah Reference *"
                          placeholder="e.g., 2:5"
                          required
                        />
                      </div>

                      <FormTextarea
                        name="history"
                        label="Historical Context"
                        rows={4}
                        placeholder="Add any historical notes..."
                      />
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end border-t border-gray-100 pt-12">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex w-full items-center justify-center gap-4 rounded-xl bg-teal-600 px-12 py-6 text-sm font-bold uppercase text-white shadow-xl shadow-teal-200 transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                      >
                        {isSubmitting ? (
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                          <Save className="h-5 w-5" />
                        )}

                        <span>
                          {isSubmitting ? "Creating..." : "Commit Section"}
                        </span>
                      </button>
                    </div>
                  </main>
                </div>
              </FormContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateParaPage;
